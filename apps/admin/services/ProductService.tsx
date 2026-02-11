import { vanillaClient } from '../utils/vanilla-client';

export interface Product {
    id: string;
    name: string;
    description: string;
    sku: string;
    mainImage?: string;
    images: string[];
    status: 'active' | 'inactive' | 'out_of_stock';
    createdAt: string;
    updatedAt: string;
}

// Helper function to map backend response to frontend format
function mapProductFromBackend(backendProduct: any): Product {
    return {
        id: backendProduct._id,
        name: backendProduct.name,
        description: backendProduct.description,
        sku: backendProduct.sku,
        mainImage: backendProduct.mainImage,
        images: backendProduct.images || [],
        status: backendProduct.status,
        createdAt: backendProduct.createdAt,
        updatedAt: backendProduct.updatedAt
    };
}

export const ProductService = {
    /**
     * Get all products with optional filters
     */
    async getProducts(filters?: { status?: 'active' | 'inactive' | 'out_of_stock'; search?: string }): Promise<Product[]> {
        try {
            const result = await vanillaClient.products.getProducts.query({
                limit: 100,
                offset: 0,
                status: filters?.status,
                search: filters?.search
            });

            return result.map(mapProductFromBackend);
        } catch (error: any) {
            console.error('Failed to fetch products:', error);
            throw new Error(error.message || 'Failed to fetch products');
        }
    },

    /**
     * Get a single product by ID
     */
    async getProductById(id: string): Promise<Product> {
        try {
            const result = await vanillaClient.products.getProductById.query({ productId: id });
            return mapProductFromBackend(result);
        } catch (error: any) {
            console.error('Failed to fetch product:', error);
            throw new Error(error.message || 'Failed to fetch product');
        }
    },

    /**
     * Create a new product
     */
    async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        try {
            // Remove empty strings and empty arrays to avoid validation errors
            const payload: any = {
                name: product.name,
                description: product.description,
                sku: product.sku,
                status: product.status
            };

            // Only include mainImage if it's a valid non-empty string
            if (product.mainImage && product.mainImage.trim() !== '') {
                payload.mainImage = product.mainImage;
            }

            // Only include images if array has items
            if (product.images && product.images.length > 0) {
                payload.images = product.images;
            }

            const result = await vanillaClient.products.createProduct.mutate(payload);

            return mapProductFromBackend(result);
        } catch (error: any) {
            console.error('Failed to create product:', error);
            throw new Error(error.message || 'Failed to create product');
        }
    },

    /**
     * Update an existing product
     */
    async updateProduct(product: Product): Promise<Product> {
        try {
            // Remove empty strings and empty arrays to avoid validation errors
            const payload: any = {
                productId: product.id,
                name: product.name,
                description: product.description,
                sku: product.sku,
                status: product.status
            };

            // Only include mainImage if it's a valid non-empty string
            if (product.mainImage && product.mainImage.trim() !== '') {
                payload.mainImage = product.mainImage;
            }

            // Only include images if provided
            if (product.images && product.images.length > 0) {
                payload.images = product.images;
            }

            const result = await vanillaClient.products.updateProduct.mutate(payload);

            return mapProductFromBackend(result);
        } catch (error: any) {
            console.error('Failed to update product:', error);
            throw new Error(error.message || 'Failed to update product');
        }
    },

    /**
     * Delete a product by ID
     */
    async deleteProduct(id: string): Promise<void> {
        try {
            await vanillaClient.products.deleteProduct.mutate({ productId: id });
        } catch (error: any) {
            console.error('Failed to delete product:', error);
            throw new Error(error.message || 'Failed to delete product');
        }
    }
};
