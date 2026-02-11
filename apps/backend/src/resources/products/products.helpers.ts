import { IProduct } from '../../lib/db/models/product.model';
import { IProductResponseData } from './products.types';

/**
 * Sanitize product data for API responses (remove internal fields)
 * @param product - Mongoose product document
 * @returns Sanitized product data safe for client consumption
 */
export function sanitizeProductResponse(product: IProduct): IProductResponseData {
    const productObj = product.toObject();

    return {
        _id: productObj._id.toString(),
        name: productObj.name,
        description: productObj.description,
        sku: productObj.sku,
        mainImage: productObj.mainImage,
        images: productObj.images,
        status: productObj.status,
        createdAt: productObj.createdAt.toISOString(),
        updatedAt: productObj.updatedAt.toISOString()
    };
}

/**
 * Sanitize multiple products for API responses
 * @param products - Array of Mongoose product documents
 * @returns Array of sanitized product data
 */
export function sanitizeProductsResponse(products: IProduct[]): IProductResponseData[] {
    return products.map((product) => sanitizeProductResponse(product));
}

/**
 * Sanitize and validate product input data
 * @param data - Raw input data
 * @returns Sanitized data
 */
export function sanitizeProductInput(data: any): any {
    const sanitized = { ...data };

    // Trim string fields
    if (sanitized.name) sanitized.name = sanitized.name.trim();
    if (sanitized.description) sanitized.description = sanitized.description.trim();
    if (sanitized.sku) sanitized.sku = sanitized.sku.trim().toUpperCase();

    // Ensure images is an array
    if (sanitized.images && !Array.isArray(sanitized.images)) {
        sanitized.images = [sanitized.images];
    }

    // Remove any potentially dangerous fields
    delete sanitized._id;
    delete sanitized.createdAt;
    delete sanitized.updatedAt;
    delete sanitized.__v;

    return sanitized;
}

/**
 * Validate SKU format
 * @param sku - SKU string to validate
 * @returns True if valid SKU format
 */
export function isValidSKU(sku: string): boolean {
    // SKU should be alphanumeric with dashes/underscores allowed
    return /^[A-Z0-9_-]+$/.test(sku) && sku.length >= 3 && sku.length <= 50;
}
