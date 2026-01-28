export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    cost: number;
    stock: number;
    sku: string;
    mainImage: string;
    images: string[];
    category: string;
    status: 'active' | 'inactive' | 'out_of_stock';
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

const products: Product[] = [
    {
        id: '1',
        name: 'Premium Rose Bouquet',
        description: "Beautiful arrangement of 12 red roses with baby's breath",
        price: 89.99,
        discountPrice: 79.99,
        cost: 45.0,
        stock: 25,
        sku: 'RB-001',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: [
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'
        ],
        category: 'Flowers',
        status: 'active',
        rating: 4.8,
        reviewCount: 156,
        createdAt: '2023-01-15',
        updatedAt: '2023-12-01'
    },
    {
        id: '2',
        name: 'Snake Plant',
        description: 'Low-maintenance indoor plant perfect for offices and homes',
        price: 34.99,
        cost: 18.5,
        stock: 42,
        sku: 'SP-002',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        category: 'Plants',
        status: 'active',
        rating: 4.6,
        reviewCount: 89,
        createdAt: '2023-02-20',
        updatedAt: '2023-11-15'
    },
    {
        id: '3',
        name: 'Wedding Centerpiece',
        description: 'Elegant floral centerpiece for wedding receptions',
        price: 156.99,
        discountPrice: 139.99,
        cost: 78.0,
        stock: 8,
        sku: 'WC-003',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: [
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'
        ],
        category: 'Wedding',
        status: 'active',
        rating: 4.9,
        reviewCount: 67,
        createdAt: '2023-03-10',
        updatedAt: '2023-10-20'
    },
    {
        id: '4',
        name: 'Gift Basket Deluxe',
        description: 'Luxury gift basket with chocolates, wine, and floral arrangement',
        price: 124.99,
        cost: 65.0,
        stock: 15,
        sku: 'GB-004',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg', 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        category: 'Gifts',
        status: 'active',
        rating: 4.7,
        reviewCount: 203,
        createdAt: '2023-04-05',
        updatedAt: '2023-09-30'
    },
    {
        id: '5',
        name: 'Holiday Wreath',
        description: 'Festive Christmas wreath with pine cones and berries',
        price: 67.99,
        discountPrice: 54.99,
        cost: 32.0,
        stock: 0,
        sku: 'HW-005',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: [
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'
        ],
        category: 'Seasonal',
        status: 'out_of_stock',
        rating: 4.5,
        reviewCount: 134,
        createdAt: '2023-05-12',
        updatedAt: '2023-12-15'
    },
    {
        id: '6',
        name: 'Peace Lily Plant',
        description: 'Beautiful white flowering plant that purifies air',
        price: 42.99,
        cost: 22.0,
        stock: 18,
        sku: 'PL-006',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        category: 'Plants',
        status: 'active',
        rating: 4.4,
        reviewCount: 78,
        createdAt: '2023-06-08',
        updatedAt: '2023-08-25'
    },
    {
        id: '7',
        name: 'Sympathy Arrangement',
        description: 'Elegant white lily arrangement for sympathy and funerals',
        price: 98.99,
        cost: 52.0,
        stock: 12,
        sku: 'SA-007',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg', 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        category: 'Funeral',
        status: 'inactive',
        rating: 4.8,
        reviewCount: 45,
        createdAt: '2023-07-20',
        updatedAt: '2023-11-30'
    },
    {
        id: '8',
        name: 'Corporate Planter',
        description: 'Large decorative planter perfect for office lobbies',
        price: 299.99,
        discountPrice: 249.99,
        cost: 145.0,
        stock: 5,
        sku: 'CP-008',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: [
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'
        ],
        category: 'Corporate',
        status: 'active',
        rating: 4.6,
        reviewCount: 23,
        createdAt: '2023-08-15',
        updatedAt: '2023-10-10'
    }
];

export const ProductService = {
    getProducts(): Promise<Product[]> {
        return Promise.resolve(products);
    },

    createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        const newProduct: Product = {
            ...product,
            id: this.generateId(),
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        products.push(newProduct);
        return Promise.resolve(newProduct);
    },

    updateProduct(product: Product): Promise<Product> {
        const index = products.findIndex((p) => p.id === product.id);
        if (index !== -1) {
            products[index] = {
                ...product,
                updatedAt: new Date().toISOString().split('T')[0]
            };
            return Promise.resolve(products[index]);
        } else {
            return Promise.reject(new Error('Product not found'));
        }
    },

    deleteProduct(id: string): Promise<void> {
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('Product not found'));
        }
    },

    generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
};
