import { ProductService, Product } from '../services/ProductService';

describe('ProductService', () => {
    describe('getProducts', () => {
        it('should return all products', async () => {
            const products = await ProductService.getProducts();

            expect(products).toBeDefined();
            expect(Array.isArray(products)).toBe(true);
            expect(products.length).toBeGreaterThan(0);

            // Check first product structure
            const firstProduct = products[0];
            expect(firstProduct).toHaveProperty('id');
            expect(firstProduct).toHaveProperty('name');
            expect(firstProduct).toHaveProperty('price');
            expect(firstProduct).toHaveProperty('mainImage');
            expect(firstProduct).toHaveProperty('status');
        });

        it('should return products with correct types', async () => {
            const products = await ProductService.getProducts();

            products.forEach((product: Product) => {
                expect(typeof product.id).toBe('string');
                expect(typeof product.name).toBe('string');
                expect(typeof product.price).toBe('number');
                expect(typeof product.mainImage).toBe('string');
                expect(['active', 'inactive', 'out_of_stock']).toContain(product.status);
            });
        });
    });

    describe('createProduct', () => {
        it('should create a new product with generated ID', async () => {
            const newProductData = {
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                cost: 50.0,
                stock: 10,
                sku: 'TEST-001',
                mainImage: 'https://example.com/image.jpg',
                images: ['https://example.com/image.jpg'],
                category: 'Test',
                status: 'active' as const,
                rating: 5.0,
                reviewCount: 0
            };

            const createdProduct = await ProductService.createProduct(newProductData);

            expect(createdProduct).toBeDefined();
            expect(createdProduct.id).toBeDefined();
            expect(createdProduct.name).toBe(newProductData.name);
            expect(createdProduct.price).toBe(newProductData.price);
            expect(createdProduct.createdAt).toBeDefined();
            expect(createdProduct.updatedAt).toBeDefined();
        });
    });

    describe('Product data validation', () => {
        it('should have valid image URLs', async () => {
            const products = await ProductService.getProducts();

            products.forEach((product: Product) => {
                expect(product.mainImage).toMatch(/^https?:\/\//);
                if (product.images && product.images.length > 0) {
                    product.images.forEach((image: string) => {
                        expect(image).toMatch(/^https?:\/\//);
                    });
                }
            });
        });

        it('should have reasonable price values', async () => {
            const products = await ProductService.getProducts();

            products.forEach((product: Product) => {
                expect(product.price).toBeGreaterThan(0);
                expect(product.price).toBeLessThan(10000); // Reasonable upper limit
                if (product.discountPrice) {
                    expect(product.discountPrice).toBeLessThan(product.price);
                }
            });
        });
    });
});
