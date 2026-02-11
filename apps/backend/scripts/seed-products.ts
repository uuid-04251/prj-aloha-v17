import mongoose from 'mongoose';
import Product from '../src/lib/db/models/product.model';
import { logger } from '../src/util/logger';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
    {
        name: 'Premium Rose Bouquet',
        description: "Beautiful arrangement of 12 red roses with baby's breath, perfect for expressing love and admiration",
        sku: 'RB-001',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg', 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'active' as const
    },
    {
        name: 'Snake Plant',
        description: 'Low-maintenance indoor plant perfect for offices and homes, purifies air naturally',
        sku: 'SP-002',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'active' as const
    },
    {
        name: 'Wedding Centerpiece',
        description: 'Elegant floral centerpiece for wedding receptions with roses, lilies and hydrangeas',
        sku: 'WC-003',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg', 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'active' as const
    },
    {
        name: 'Gift Basket Deluxe',
        description: 'Luxury gift basket with chocolates, wine, and floral arrangement for special occasions',
        sku: 'GB-004',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'active' as const
    },
    {
        name: 'Holiday Wreath',
        description: 'Festive Christmas wreath with pine cones, berries and ribbons for holiday decoration',
        sku: 'HW-005',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg', 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'out_of_stock' as const
    }
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI not found in environment variables');
        }

        logger.info('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        logger.info('Connected to MongoDB');

        // Clear existing products
        logger.info('Clearing existing products...');
        await Product.deleteMany({});
        logger.info('Cleared existing products');

        // Insert sample products
        logger.info('Inserting sample products...');
        const createdProducts = await Product.insertMany(sampleProducts);
        logger.info(`Successfully inserted ${createdProducts.length} products`);

        // Display created products
        createdProducts.forEach((product) => {
            logger.info(`- ${product.name} (${product.sku}) - ${product.status}`);
        });

        process.exit(0);
    } catch (error) {
        logger.error(error, 'Error seeding products:');
        process.exit(1);
    }
}

seedProducts();
