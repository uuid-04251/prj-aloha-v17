import { createProductError, ErrorCode } from '../../lib/errors';
import { adminProcedure, protectedProcedure } from '../../lib/trpc/trpc';
import { sanitizeProductResponse, sanitizeProductsResponse } from './products.helpers';
import { createProductSchema, deleteProductInputSchema, deleteProductOutputSchema, getProductByIdInputSchema, getProductsOutputSchema, getProductsSchema, productResponseSchema, updateProductInputSchema } from './products.schemas';
import { ProductService } from './products.service';
import { IProductFilters } from './products.types';

/**
 * Get paginated list of products with filters
 * Requires authentication
 */
export const getProducts = protectedProcedure
    .input(getProductsSchema)
    .output(getProductsOutputSchema)
    .query(async ({ input }) => {
        // Build filters object, filtering out undefined values
        const filters: IProductFilters = {};
        if (input.category) filters.category = input.category;
        if (input.status) filters.status = input.status;
        if (input.search) filters.search = input.search;

        const products = await ProductService.getProducts(input.limit, input.offset, Object.keys(filters).length > 0 ? filters : undefined);
        return sanitizeProductsResponse(products);
    });

/**
 * Get a single product by ID
 * Requires authentication
 */
export const getProductById = protectedProcedure
    .input(getProductByIdInputSchema)
    .output(productResponseSchema)
    .query(async ({ input }) => {
        const product = await ProductService.getProductById(input.productId);

        if (!product) {
            throw createProductError(ErrorCode.PRODUCT_NOT_FOUND, input.productId, {
                operation: 'read'
            });
        }

        return sanitizeProductResponse(product);
    });

/**
 * Create a new product
 * Requires admin role
 */
export const createProduct = adminProcedure
    .input(createProductSchema)
    .output(productResponseSchema)
    .mutation(async ({ input }) => {
        const product = await ProductService.createProduct(input);
        return sanitizeProductResponse(product);
    });

/**
 * Update product information
 * Requires admin role
 */
export const updateProduct = adminProcedure
    .input(updateProductInputSchema)
    .output(productResponseSchema)
    .mutation(async ({ input }) => {
        const { productId, ...updateData } = input;

        const product = await ProductService.updateProduct(productId, updateData);

        if (!product) {
            throw createProductError(ErrorCode.PRODUCT_NOT_FOUND, productId, {
                operation: 'update'
            });
        }

        return sanitizeProductResponse(product);
    });

/**
 * Delete a product by ID
 * Requires admin role
 */
export const deleteProduct = adminProcedure
    .input(deleteProductInputSchema)
    .output(deleteProductOutputSchema)
    .mutation(async ({ input }) => {
        const deleted = await ProductService.deleteProduct(input.productId);

        if (!deleted) {
            throw createProductError(ErrorCode.PRODUCT_NOT_FOUND, input.productId, {
                operation: 'delete'
            });
        }

        return { success: true };
    });
