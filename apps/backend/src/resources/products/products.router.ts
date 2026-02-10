import { router } from '../../lib/trpc/trpc';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './products.procedures';

/**
 * Product management router
 * Handles all product-related operations including CRUD and search
 */
export const productsRouter = router({
    // CRUD Operations
    createProduct, // CREATE (admin only)
    getProducts, // READ (all with filters, authenticated users)
    getProductById, // READ (by ID, authenticated users)
    updateProduct, // UPDATE (admin only)
    deleteProduct // DELETE (admin only)
});

export type ProductsRouter = typeof productsRouter;
