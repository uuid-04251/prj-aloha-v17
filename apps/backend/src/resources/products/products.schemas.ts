import { z } from 'zod';

// Zod schemas for Product validation
export const productSchema = z.object({
    _id: z.string(),
    name: z.string().min(3).max(200),
    description: z.string().min(10),
    sku: z.string().min(3).max(50),
    mainImage: z.string().url().optional(),
    images: z.array(z.string().url()).default([]),
    status: z.enum(['active', 'inactive', 'out_of_stock']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

export const createProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(200, 'Name cannot exceed 200 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    sku: z
        .string()
        .min(3, 'SKU must be at least 3 characters')
        .max(50, 'SKU cannot exceed 50 characters')
        .toUpperCase()
        .regex(/^[A-Z0-9_-]+$/, 'SKU can only contain uppercase letters, numbers, dashes, and underscores'),
    mainImage: z.string().url('Main image must be a valid URL').optional(),
    images: z.array(z.string().url('All images must be valid URLs')).optional(),
    status: z.enum(['active', 'inactive', 'out_of_stock']).optional().default('active')
});

export const updateProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(200, 'Name cannot exceed 200 characters').optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').optional(),
    sku: z
        .string()
        .min(3, 'SKU must be at least 3 characters')
        .max(50, 'SKU cannot exceed 50 characters')
        .toUpperCase()
        .regex(/^[A-Z0-9_-]+$/, 'SKU can only contain uppercase letters, numbers, dashes, and underscores')
        .optional(),
    mainImage: z.string().url('Main image must be a valid URL').optional(),
    images: z.array(z.string().url('All images must be valid URLs')).optional(),
    status: z.enum(['active', 'inactive', 'out_of_stock']).optional()
});

export const getProductsSchema = z.object({
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().min(0).default(0),
    status: z.enum(['active', 'inactive', 'out_of_stock']).optional(),
    search: z.string().optional()
});

export const getProductByIdInputSchema = z.object({
    productId: z.string()
});

export const updateProductInputSchema = z
    .object({
        productId: z.string()
    })
    .merge(updateProductSchema);

export const deleteProductInputSchema = z.object({
    productId: z.string()
});

// Output schemas
export const productResponseSchema = productSchema;
export const getProductsOutputSchema = z.array(productResponseSchema);
export const deleteProductOutputSchema = z.object({
    success: z.boolean()
});
