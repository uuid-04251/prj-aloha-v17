import Product, { IProduct } from '../../lib/db/models/product.model';
import { createError, createProductError, createValidationError, ErrorCode } from '../../lib/errors';
import { isValidObjectId } from '../../lib/helpers/validation';
import { isValidSKU, sanitizeProductInput } from './products.helpers';
import { ICreateProductData, IUpdateProductData, IProductFilters } from './products.types';
import { storageService } from '../../lib/storage/supabase.service';
import { logger } from '../../util/logger';

export class ProductService {
    /**
     * Create a new product
     * @throws {TRPCError} BAD_REQUEST if SKU already exists or invalid input
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async createProduct(data: ICreateProductData): Promise<IProduct> {
        // Sanitize input data
        const sanitizedData = sanitizeProductInput(data);

        // Validate input
        if (!sanitizedData.name || sanitizedData.name.trim() === '') {
            throw createValidationError('name', ErrorCode.VALIDATION_REQUIRED);
        }

        if (!sanitizedData.description || sanitizedData.description.trim() === '') {
            throw createValidationError('description', ErrorCode.VALIDATION_REQUIRED);
        }

        if (!sanitizedData.sku || !isValidSKU(sanitizedData.sku)) {
            throw createValidationError('sku', ErrorCode.VALIDATION_INVALID_FORMAT);
        }

        try {
            // Use MongoDB's built-in unique constraint instead of manual check
            // This prevents race conditions
            const product = new Product(sanitizedData);
            await product.save();
            return product;
        } catch (error: any) {
            // Handle duplicate key error (SKU already exists)
            if (error.code === 11000 && error.keyPattern?.sku) {
                throw createProductError(ErrorCode.PRODUCT_SKU_ALREADY_EXISTS, undefined, {
                    sku: sanitizedData.sku,
                    operation: 'create'
                });
            }

            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err: any) => err.message);
                throw createError(
                    ErrorCode.VALIDATION_INVALID_FORMAT,
                    {
                        field: 'product',
                        details: validationErrors.join('; '),
                        validationErrors,
                        category: 'validation'
                    },
                    error,
                    `Validation failed: ${validationErrors.join('; ')}`
                );
            }

            // Handle other database errors
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'createProduct',
                    sku: sanitizedData.sku
                },
                error
            );
        }
    }

    /**
     * Get products with pagination and filters
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async getProducts(limit: number = 10, offset: number = 0, filters?: IProductFilters): Promise<IProduct[]> {
        try {
            let query: any = {};

            // Apply filters
            if (filters?.status) {
                query.status = filters.status;
            }

            if (filters?.search) {
                query.$text = { $search: filters.search };
            }

            return await Product.find(query).sort({ createdAt: -1 }).limit(limit).skip(offset).lean(false); // Return Mongoose documents for method access
        } catch (error) {
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'getProducts',
                    pagination: { limit, offset },
                    filters
                },
                error as Error
            );
        }
    }

    /**
     * Get product by ID
     * @throws {TRPCError} BAD_REQUEST if ID is invalid
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async getProductById(productId: string): Promise<IProduct | null> {
        if (!isValidObjectId(productId)) {
            throw createValidationError('productId', ErrorCode.VALIDATION_INVALID_FORMAT, {
                expected: 'MongoDB ObjectId'
            });
        }

        try {
            return await Product.findById(productId);
        } catch (error) {
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'getProductById',
                    productId
                },
                error as Error
            );
        }
    }

    /**
     * Update product information
     * @throws {TRPCError} BAD_REQUEST if ID is invalid, SKU already exists, or invalid input
     * @throws {TRPCError} NOT_FOUND if product doesn't exist
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async updateProduct(productId: string, data: IUpdateProductData): Promise<IProduct | null> {
        if (!isValidObjectId(productId)) {
            throw createValidationError('productId', ErrorCode.VALIDATION_INVALID_FORMAT, {
                expected: 'MongoDB ObjectId'
            });
        }

        // Sanitize input data
        const sanitizedData = sanitizeProductInput(data);

        // Filter out undefined values
        const updateData = Object.fromEntries(Object.entries(sanitizedData).filter(([_key, value]) => value !== undefined && value !== null && value !== ''));

        if (Object.keys(updateData).length === 0) {
            // Nothing to update, return current product
            return this.getProductById(productId);
        }

        // Validate SKU if being updated
        if (updateData.sku && typeof updateData.sku === 'string' && !isValidSKU(updateData.sku)) {
            throw createValidationError('sku', ErrorCode.VALIDATION_INVALID_FORMAT);
        }

        // Check SKU uniqueness if SKU is being updated
        if (updateData.sku && typeof updateData.sku === 'string') {
            const existingProduct = await Product.findOne({
                sku: updateData.sku,
                _id: { $ne: productId }
            });
            if (existingProduct) {
                throw createProductError(ErrorCode.PRODUCT_SKU_ALREADY_EXISTS, productId, {
                    sku: updateData.sku,
                    operation: 'update',
                    conflictingProductId: existingProduct._id.toString()
                });
            }
        }

        try {
            // First check if product exists to avoid issues with populate
            const existingProduct = await Product.findById(productId);
            if (!existingProduct) {
                throw createProductError(ErrorCode.PRODUCT_NOT_FOUND, productId, {
                    operation: 'update'
                });
            }

            // Use findOneAndUpdate with upsert: false to prevent race conditions
            const product = await Product.findOneAndUpdate({ _id: productId }, updateData, {
                new: true,
                runValidators: true
            });

            return product;
        } catch (error: any) {
            // Handle duplicate key error for SKU updates
            if (error.code === 11000 && error.keyPattern?.sku) {
                throw createProductError(ErrorCode.PRODUCT_SKU_ALREADY_EXISTS, productId, {
                    sku: updateData.sku,
                    operation: 'update'
                });
            }

            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'updateProduct',
                    productId,
                    updateData: Object.keys(updateData)
                },
                error
            );
        }
    }

    /**
     * Delete product by ID
     * Also deletes associated images from Supabase Storage
     * @throws {TRPCError} BAD_REQUEST if ID is invalid
     * @throws {TRPCError} NOT_FOUND if product doesn't exist
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async deleteProduct(productId: string): Promise<boolean> {
        if (!isValidObjectId(productId)) {
            throw createValidationError('productId', ErrorCode.VALIDATION_INVALID_FORMAT, {
                expected: 'MongoDB ObjectId'
            });
        }

        // First check if product exists and get its images
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            throw createProductError(ErrorCode.PRODUCT_NOT_FOUND, productId, {
                operation: 'delete'
            });
        }

        // Collect all image URLs to delete
        const imageUrls: string[] = [];
        if (existingProduct.mainImage) {
            imageUrls.push(existingProduct.mainImage);
        }
        if (existingProduct.images && existingProduct.images.length > 0) {
            imageUrls.push(...existingProduct.images);
        }

        try {
            // Delete product from database first
            const result = await Product.findByIdAndDelete(productId);

            // Then try to delete images from Supabase
            // Don't fail the operation if image deletion fails
            if (imageUrls.length > 0) {
                try {
                    logger.info(`Deleting ${imageUrls.length} images for product ${productId}`);
                    await storageService.deleteImages(imageUrls);
                    logger.info(`Successfully deleted ${imageUrls.length} images`);
                } catch (imageError: any) {
                    // Log error but don't fail the deletion
                    logger.error(`Failed to delete images for product ${productId}: ${imageError.message}`, imageError);
                }
            }

            return !!result;
        } catch (error) {
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'deleteProduct',
                    productId
                },
                error as Error
            );
        }
    }

    /**
     * Search products by text (name/description)
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async searchProducts(query: string, limit: number = 10): Promise<IProduct[]> {
        try {
            // Try text search first
            try {
                return await Product.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
                    .sort({ score: { $meta: 'textScore' } })
                    .limit(limit)
                    .lean(false);
            } catch (textSearchError: any) {
                // Fallback to regex search if text index is not available
                if (textSearchError.code === 27 || textSearchError.message?.includes('text index')) {
                    return await Product.find({
                        $or: [{ name: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }]
                    })
                        .sort({ createdAt: -1 })
                        .limit(limit)
                        .lean(false);
                }
                throw textSearchError;
            }
        } catch (error) {
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'searchProducts',
                    query,
                    limit
                },
                error as Error
            );
        }
    }
}
