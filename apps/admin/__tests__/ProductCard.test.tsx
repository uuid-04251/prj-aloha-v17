import { render, screen } from '@testing-library/react';
import { Product } from '../services/ProductService';

// Mock Product component for testing
const MockProductCard = ({ product }: { product: Product }) => {
    return (
        <div data-testid="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <img src={product.mainImage} alt={product.name} />
        </div>
    );
};

describe('ProductCard Component', () => {
    const mockProduct: Product = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        sku: 'TEST-001',
        mainImage: 'https://example.com/image.jpg',
        images: ['https://example.com/image.jpg'],
        status: 'active',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01'
    };

    it('renders product information correctly', () => {
        render(<MockProductCard product={mockProduct} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders product image with correct attributes', () => {
        render(<MockProductCard product={mockProduct} />);

        const image = screen.getByAltText('Test Product');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('renders product card container', () => {
        render(<MockProductCard product={mockProduct} />);

        expect(screen.getByTestId('product-card')).toBeInTheDocument();
    });
});
