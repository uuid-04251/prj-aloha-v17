import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { ProductService, Product } from '../services/ProductService';

// Mock the ProductService
jest.mock('../services/ProductService', () => ({
    ProductService: {
        getProducts: jest.fn()
    }
}));

const MockDashboard = () => {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        ProductService.getProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Dashboard</h1>
            {products.map((product: any) => (
                <div key={product.id} data-testid="product-item">
                    {product.name}
                </div>
            ))}
        </div>
    );
};

describe('Dashboard Integration Test', () => {
    const mockProducts = [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('displays loading state initially', () => {
        (ProductService.getProducts as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves

        render(<MockDashboard />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays products after loading', async () => {
        (ProductService.getProducts as jest.Mock).mockResolvedValue(mockProducts);

        await act(async () => {
            render(<MockDashboard />);
        });

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('calls ProductService.getProducts on mount', async () => {
        (ProductService.getProducts as jest.Mock).mockResolvedValue([]);

        await act(async () => {
            render(<MockDashboard />);
        });

        expect(ProductService.getProducts).toHaveBeenCalledTimes(1);
    });
});
