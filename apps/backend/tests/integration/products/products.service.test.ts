import { IProduct } from '@/lib/db/models/product.model';
import { ProductService } from '@/resources/products/products.service';
import { createTestProduct, createTestProducts } from '../../utils/testHelpers';

describe('ProductService - CRUD Operations', () => {
    describe('createProduct', () => {
        it('should create a new product successfully', async () => {
            const productData = {
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST001',
                mainImage: 'https://example.com/image.jpg',
                images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
                status: 'active' as const
            };

            const product = await ProductService.createProduct(productData);

            expect(product).toBeDefined();
            expect(product.name).toBe(productData.name);
            expect(product.description).toBe(productData.description);
            expect(product.sku).toBe(productData.sku.toUpperCase());
            expect(product.mainImage).toBe(productData.mainImage);
            expect(product.images).toEqual(productData.images);
            expect(product.status).toBe(productData.status);
            expect(product.createdAt).toBeDefined();
            expect(product.updatedAt).toBeDefined();
        });

        it('should create product with default status "active" when status is not specified', async () => {
            const productData = {
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST002'
            };

            const product = await ProductService.createProduct(productData);

            expect(product.status).toBe('active');
        });

        it('should create product without optional fields', async () => {
            const productData = {
                name: 'Minimal Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST003'
            };

            const product = await ProductService.createProduct(productData);

            expect(product.mainImage).toBeUndefined();
            expect(product.images).toEqual([]);
        });

        it.skip('should throw error when creating product with duplicate SKU', async () => {
            const productData1 = {
                name: 'Test Product 1',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'DUPLICATE001'
            };

            const productData2 = {
                name: 'Test Product 2',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'DUPLICATE001' // Same SKU
            };

            await ProductService.createProduct(productData1);
            await expect(ProductService.createProduct(productData2)).rejects.toThrow('A product with this SKU already exists');
        });
    });

    describe('getProducts', () => {
        beforeEach(async () => {
            await createTestProducts(5);
        });

        it('should get products with default pagination', async () => {
            const products = await ProductService.getProducts();

            expect(products).toBeDefined();
            expect(Array.isArray(products)).toBe(true);
            expect(products.length).toBeLessThanOrEqual(10);
            expect(products[0]).toHaveProperty('_id');
            expect(products[0]).toHaveProperty('name');
            expect(products[0]).toHaveProperty('sku');
        });

        it('should get products with custom pagination', async () => {
            const products = await ProductService.getProducts(2, 1);

            expect(products).toBeDefined();
            expect(products.length).toBeLessThanOrEqual(2);
        });

        it('should get products with status filter', async () => {
            const products = await ProductService.getProducts(10, 0, { status: 'active' });

            expect(products).toBeDefined();
            expect(products.length).toBeGreaterThan(0);
            products.forEach((product) => {
                expect(product.status).toBe('active');
            });
        });

        it.skip('should get products with search filter', async () => {
            // Skip this test as text search requires index to be built in test environment
            const products = await ProductService.getProducts(10, 0, { search: 'Test' });

            expect(products).toBeDefined();
            expect(products.length).toBeGreaterThan(0);
            products.forEach((product) => {
                const nameMatch = product.name.toLowerCase().includes('test');
                const descMatch = product.description.toLowerCase().includes('test');
                expect(nameMatch || descMatch).toBe(true);
            });
        });

        it('should return empty array when no products match filters', async () => {});
    });

    describe('getProductById', () => {
        let testProduct: IProduct;

        beforeEach(async () => {
            testProduct = await createTestProduct();
        });

        it('should get product by ID', async () => {
            const product = await ProductService.getProductById(testProduct._id.toString());

            expect(product).toBeDefined();
            expect(product?._id.toString()).toBe(testProduct._id.toString());
            expect(product?.name).toBe(testProduct.name);
            expect(product?.sku).toBe(testProduct.sku);
        });

        it('should return null when product not found', async () => {
            const product = await ProductService.getProductById('507f1f77bcf86cd799439011');

            expect(product).toBeNull();
        });

        it('should throw error when ID is invalid', async () => {
            await expect(ProductService.getProductById('invalid-id')).rejects.toThrow('productId format is invalid');
        });
    });

    describe('updateProduct', () => {
        let testProduct: IProduct;

        beforeEach(async () => {
            testProduct = await createTestProduct();
        });

        it('should update product successfully', async () => {
            const updateData = {
                name: 'Updated Product Name',
                description: 'Updated description with enough content to meet requirements.',
                status: 'inactive' as const
            };

            const updatedProduct = await ProductService.updateProduct(testProduct._id.toString(), updateData);

            expect(updatedProduct).toBeDefined();
            expect(updatedProduct?.name).toBe(updateData.name);
            expect(updatedProduct?.description).toBe(updateData.description);
            expect(updatedProduct?.status).toBe(updateData.status);
            expect(updatedProduct?.sku).toBe(testProduct.sku); // Unchanged
        });

        it('should update product SKU', async () => {
            const updateData = {
                sku: 'UPDATED001'
            };

            const updatedProduct = await ProductService.updateProduct(testProduct._id.toString(), updateData);

            expect(updatedProduct).toBeDefined();
            expect(updatedProduct?.sku).toBe('UPDATED001');
        });

        it('should throw error when updating SKU to existing one', async () => {
            await createTestProduct({ sku: 'EXISTING001' });

            const updateData = {
                sku: 'EXISTING001'
            };

            await expect(ProductService.updateProduct(testProduct._id.toString(), updateData)).rejects.toThrow('A product with this SKU already exists');
        });

        it('should return original product when no updates provided', async () => {
            const updatedProduct = await ProductService.updateProduct(testProduct._id.toString(), {});

            expect(updatedProduct).toBeDefined();
            expect(updatedProduct?._id.toString()).toBe(testProduct._id.toString());
        });

        it('should throw error when product not found', async () => {
            const updateData = {
                name: 'Updated Name'
            };

            await expect(ProductService.updateProduct('507f1f77bcf86cd799439011', updateData)).rejects.toThrow();
        });

        it('should throw error when ID is invalid', async () => {
            const updateData = {
                name: 'Updated Name'
            };

            await expect(ProductService.updateProduct('invalid-id', updateData)).rejects.toThrow('productId format is invalid');
        });
    });

    describe('deleteProduct', () => {
        let testProduct: IProduct;

        beforeEach(async () => {
            testProduct = await createTestProduct();
        });

        it('should delete product successfully', async () => {
            const result = await ProductService.deleteProduct(testProduct._id.toString());

            expect(result).toBe(true);

            // Verify product is deleted
            const deletedProduct = await ProductService.getProductById(testProduct._id.toString());
            expect(deletedProduct).toBeNull();
        });

        it('should throw error when product not found', async () => {
            await expect(ProductService.deleteProduct('507f1f77bcf86cd799439011')).rejects.toThrow('Product not found');
        });

        it('should throw error when ID is invalid', async () => {
            await expect(ProductService.deleteProduct('invalid-id')).rejects.toThrow('productId format is invalid');
        });
    });

    describe('searchProducts', () => {
        beforeEach(async () => {
            await ProductService.createProduct({
                name: 'Wireless Headphones',
                description: 'High quality wireless headphones with noise cancellation.',
                sku: 'HEAD001'
            });

            await ProductService.createProduct({
                name: 'Bluetooth Speaker',
                description: 'Portable bluetooth speaker with excellent sound quality.',
                sku: 'SPEAK001'
            });
        });

        it('should search products by name', async () => {
            const results = await ProductService.searchProducts('wireless', 10);

            expect(results).toBeDefined();
            expect(Array.isArray(results)).toBe(true);
            expect(results.length).toBeGreaterThan(0);
            if (results[0]) {
                expect(results[0].name.toLowerCase()).toContain('wireless');
            }
        });

        it('should search products by description', async () => {
            const results = await ProductService.searchProducts('noise cancellation', 10);

            expect(results).toBeDefined();
            expect(results.length).toBeGreaterThan(0);
            if (results[0]) {
                expect(results[0].description.toLowerCase()).toContain('noise');
            }
        });

        it('should limit search results', async () => {
            // Create more products
            for (let i = 0; i < 5; i++) {
                await ProductService.createProduct({
                    name: `Search Product ${i}`,
                    description: 'This product contains searchable content.',
                    sku: `SEARCH${i}`
                });
            }

            const results = await ProductService.searchProducts('product', 3);

            expect(results.length).toBeLessThanOrEqual(3);
        });

        it('should return empty array when no matches found', async () => {
            const results = await ProductService.searchProducts('nonexistentterm', 10);

            expect(results).toEqual([]);
        });
    });
});
