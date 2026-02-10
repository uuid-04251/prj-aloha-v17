import Product from '@/lib/db/models/product.model';
import { createTestCategory } from '../../utils/testHelpers';

describe('Product Model', () => {
    let testCategory: any;

    beforeEach(async () => {
        testCategory = await createTestCategory();
    });

    describe('Schema validation', () => {
        it('should create a valid product with all required fields', async () => {
            const productData = {
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST123',
                mainImage: 'https://example.com/image.jpg',
                images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
                category: testCategory._id,
                status: 'active' as const
            };

            const product = new Product(productData);
            const savedProduct = await product.save();

            expect(savedProduct._id).toBeDefined();
            expect(savedProduct.name).toBe(productData.name);
            expect(savedProduct.description).toBe(productData.description);
            expect(savedProduct.sku).toBe(productData.sku.toUpperCase());
            expect(savedProduct.mainImage).toBe(productData.mainImage);
            expect(savedProduct.images).toEqual(productData.images);
            expect(savedProduct.category.toString()).toBe(testCategory._id.toString());
            expect(savedProduct.status).toBe(productData.status);
            expect(savedProduct.createdAt).toBeDefined();
            expect(savedProduct.updatedAt).toBeDefined();
        });

        it('should create a product with default status "active"', async () => {
            const productData = {
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST124',
                category: testCategory._id
            };

            const product = new Product(productData);
            const savedProduct = await product.save();

            expect(savedProduct.status).toBe('active');
        });

        it('should create a product without optional fields', async () => {
            const productData = {
                name: 'Minimal Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST125',
                category: testCategory._id
            };

            const product = new Product(productData);
            const savedProduct = await product.save();

            expect(savedProduct.mainImage).toBeUndefined();
            expect(savedProduct.images).toEqual([]);
        });

        it('should fail validation when name is missing', async () => {
            const product = new Product({
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST126',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when description is missing', async () => {
            const product = new Product({
                name: 'Test Product',
                sku: 'TEST127',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when sku is missing', async () => {
            const product = new Product({
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when category is missing', async () => {
            const product = new Product({
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST128'
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when name is too short', async () => {
            const product = new Product({
                name: 'Hi',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST129',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when name is too long', async () => {
            const longName = 'A'.repeat(201);
            const product = new Product({
                name: longName,
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST130',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when description is too short', async () => {
            const product = new Product({
                name: 'Test Product',
                description: 'Short',
                sku: 'TEST131',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when sku is too short', async () => {
            const product = new Product({
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'AB',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when sku is too long', async () => {
            const longSku = 'A'.repeat(51);
            const product = new Product({
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: longSku,
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should convert sku to uppercase', async () => {
            const productData = {
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'test132',
                category: testCategory._id
            };

            const product = new Product(productData);
            const savedProduct = await product.save();

            expect(savedProduct.sku).toBe('TEST132');
        });

        it('should fail validation when sku contains invalid characters', async () => {
            const product = new Product({
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST@133',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when mainImage is not a valid URL', async () => {
            const product = new Product({
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST134',
                mainImage: 'not-a-url',
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when images array contains invalid URL', async () => {
            const product = new Product({
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST135',
                images: ['https://example.com/image1.jpg', 'not-a-url'],
                category: testCategory._id
            });

            await expect(product.save()).rejects.toThrow();
        });

        it('should fail validation when status is invalid', async () => {
            const product = new Product({
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST136',
                category: testCategory._id,
                status: 'invalid_status'
            });

            await expect(product.save()).rejects.toThrow();
        });
    });

    describe('Indexes', () => {
        it('should enforce unique constraint on sku', async () => {
            const productData1 = {
                name: 'Test Product 1',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'UNIQUE137',
                category: testCategory._id
            };

            const productData2 = {
                name: 'Test Product 2',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'UNIQUE137', // Same SKU
                category: testCategory._id
            };

            await new Product(productData1).save();
            await expect(new Product(productData2).save()).rejects.toThrow();
        });
    });

    describe('Population', () => {
        it('should populate category field', async () => {
            const productData = {
                name: 'Test Product',
                description: 'This is a test product description with enough content to meet the minimum requirements.',
                sku: 'TEST138',
                category: testCategory._id
            };

            const product = new Product(productData);
            await product.save();

            const populatedProduct = await Product.findById(product._id).populate('category');
            expect(populatedProduct?.category).toBeDefined();
            expect((populatedProduct?.category as any).name).toBe(testCategory.name);
        });
    });

    describe('Text search', () => {
        beforeEach(async () => {
            await Product.create([
                {
                    name: 'Wireless Headphones',
                    description: 'High quality wireless headphones with noise cancellation.',
                    sku: 'HEAD139',
                    category: testCategory._id
                },
                {
                    name: 'Bluetooth Speaker',
                    description: 'Portable bluetooth speaker with excellent sound quality.',
                    sku: 'SPEAK140',
                    category: testCategory._id
                },
                {
                    name: 'Gaming Mouse',
                    description: 'Ergonomic gaming mouse with customizable buttons.',
                    sku: 'MOUSE141',
                    category: testCategory._id
                }
            ]);
        });

        it('should find products by text search on name', async () => {
            const results = await Product.find({ $text: { $search: 'wireless' } });
            expect(results.length).toBeGreaterThan(0);
            if (results[0]) {
                expect(results[0].name).toContain('Wireless');
            }
        });

        it('should find products by text search on description', async () => {
            const results = await Product.find({ $text: { $search: 'noise cancellation' } });
            expect(results.length).toBeGreaterThan(0);
            if (results[0]) {
                expect(results[0].description).toContain('noise cancellation');
            }
        });
    });
});
