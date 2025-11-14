import { Metadata } from 'next';
import ProductCards from '@/components/shop/ProductCards';
import { Product } from '@/types/product';

export const metadata: Metadata = {
  title: 'Shop - Hansy Fine Arts',
  description: 'Browse our collection of fine art pieces',
};

// Mock data - in production, fetch from API
const mockProducts: Product[] = [
  {
    _id: '1',
    productTitle: 'Abstract Waves',
    description: 'A stunning abstract piece featuring flowing waves',
    price: 299.99,
    category: 'abstract',
    image: '/cuadro-horizontal-1.jpg',
    artist: 'Jane Smith',
    inStock: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    productTitle: 'Contemporary Portrait',
    description: 'Modern portrait with bold colors',
    price: 499.99,
    category: 'contemporary',
    image: '/cuadro-horizontal-2.jpg',
    artist: 'John Doe',
    inStock: true,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    productTitle: 'Mountain Sunset',
    description: 'Beautiful landscape of mountains at sunset',
    price: 399.99,
    category: 'landscape',
    image: '/cuadro-horizontal-3.jpg',
    artist: 'Sarah Johnson',
    inStock: true,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Shop All Artworks</h1>
        <p className="text-lg text-muted-foreground">
          Discover unique pieces from talented artists
        </p>
      </div>

      <ProductCards products={mockProducts} />
    </div>
  );
}
