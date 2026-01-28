// Example: How to test components with dump data services
// This shows different testing patterns you can use

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProductService } from '../services/ProductService';

// Pattern 1: Testing service directly with dump data
describe('ProductService - Direct Testing', () => {
    it('returns products with valid dump data', async () => {
        const products = await ProductService.getProducts();

        // Test data structure
        expect(products.every((p) => p.id && p.name && p.price)).toBe(true);

        // Test business logic
        expect(products.every((p) => p.price > 0)).toBe(true);
    });
});

// Pattern 2: Testing component with real service (simple)
describe('ProductList Component', () => {
    it('displays products from service', async () => {
        // Simple component that uses ProductService directly
        const ProductList = () => {
            const [products, setProducts] = React.useState<any[]>([]);

            React.useEffect(() => {
                ProductService.getProducts().then(setProducts);
            }, []);

            return (
                <div>
                    {products.map((p) => (
                        <div key={p.id}>{p.name}</div>
                    ))}
                </div>
            );
        };

        render(<ProductList />);

        await waitFor(() => {
            expect(screen.getByText('Premium Rose Bouquet')).toBeInTheDocument();
        });
    });
});

// Pattern 3: Testing with mocked service (recommended)
describe('ProductList Component - Mocked', () => {
    const mockProducts = [{ id: '1', name: 'Mock Product', price: 50, mainImage: 'mock.jpg' }] as any;

    beforeEach(() => {
        jest.spyOn(ProductService, 'getProducts').mockResolvedValue(mockProducts);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('displays mocked products', async () => {
        const ProductList = () => {
            const [products, setProducts] = React.useState<any[]>([]);

            React.useEffect(() => {
                ProductService.getProducts().then(setProducts);
            }, []);

            return (
                <div>
                    {products.map((p) => (
                        <div key={p.id}>{p.name}</div>
                    ))}
                </div>
            );
        };

        render(<ProductList />);

        await waitFor(() => {
            expect(screen.getByText('Mock Product')).toBeInTheDocument();
        });
    });
});

// Pattern 4: Testing user interactions
describe('ProductForm Component', () => {
    it('allows creating new product', async () => {
        const mockCreate = jest.spyOn(ProductService, 'createProduct').mockResolvedValue({
            id: 'new-id',
            name: 'New Product',
            price: 100,
            mainImage: 'new.jpg'
        } as any);

        const ProductForm = () => {
            const [name, setName] = React.useState('');

            const handleSubmit = () => {
                ProductService.createProduct({
                    name,
                    price: 100,
                    mainImage: 'test.jpg'
                } as any);
            };

            return (
                <div>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
                    <button onClick={handleSubmit}>Create</button>
                </div>
            );
        };

        render(<ProductForm />);

        fireEvent.change(screen.getByPlaceholderText('Product name'), {
            target: { value: 'New Product' }
        });

        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Product' }));
        });
    });
});
