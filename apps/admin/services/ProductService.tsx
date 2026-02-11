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

const products: Product[] = [
    {
        id: '1',
        name: 'Premium Rose Bouquet',
        description: "Beautiful arrangement of 12 red roses with baby's breath",
        sku: 'RB-001',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: [
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'
        ],
        status: 'active',
        createdAt: '2023-01-15',
        updatedAt: '2023-12-01'
    },
    {
        id: '2',
        name: 'Snake Plant',
        description: 'Low-maintenance indoor plant perfect for offices and homes',
        sku: 'SP-002',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'active',
        createdAt: '2023-02-20',
        updatedAt: '2023-11-15'
    },
    {
        id: '3',
        name: 'Wedding Centerpiece',
        description: 'Elegant floral centerpiece for wedding receptions',
        sku: 'WC-003',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: [
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'
        ],
        status: 'active',
        createdAt: '2023-03-10',
        updatedAt: '2023-10-20'
    },
    {
        id: '4',
        name: 'Gift Basket Deluxe',
        description: 'Luxury gift basket with chocolates, wine, and floral arrangement',
        sku: 'GB-004',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg', 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'active',
        createdAt: '2023-04-05',
        updatedAt: '2023-09-30'
    },
    {
        id: '5',
        name: 'Holiday Wreath',
        description: 'Festive Christmas wreath with pine cones and berries',
        sku: 'HW-005',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: [
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'
        ],
        status: 'out_of_stock',
        createdAt: '2023-05-12',
        updatedAt: '2023-12-15'
    },
    {
        id: '6',
        name: 'Peace Lily Plant',
        description: 'Beautiful white flowering plant that purifies air',
        sku: 'PL-006',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'active',
        createdAt: '2023-06-08',
        updatedAt: '2023-08-25'
    },
    {
        id: '7',
        name: 'Sympathy Arrangement',
        description: 'Elegant white lily arrangement for sympathy and funerals',
        sku: 'SA-007',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: ['https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg', 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'],
        status: 'inactive',
        createdAt: '2023-07-20',
        updatedAt: '2023-11-30'
    },
    {
        id: '8',
        name: 'Corporate Planter',
        description: 'Large decorative planter perfect for office lobbies',
        sku: 'CP-008',
        mainImage: 'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
        images: [
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg',
            'https://flowersight.com/wp-content/uploads/2024/08/bo-hoa-tulip-10-bong.jpg'
        ],
        status: 'active',
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
