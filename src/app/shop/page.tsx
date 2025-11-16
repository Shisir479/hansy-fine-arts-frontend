import { Metadata } from 'next';
import ProductCards from '@/components/shop/ProductCards';
import { Product } from '@/types/product';

export const metadata: Metadata = {
  title: 'Shop - Hansy Fine Arts',
  description: 'Browse our collection of fine art pieces',
};

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/products`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch products');
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="w-full">
      {products.length > 0 ? (
        <ProductCards products={products} />
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}
