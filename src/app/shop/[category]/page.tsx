import { Metadata } from 'next';
import ProductCards from '@/components/shop/ProductCards';
import { Product } from '@/types/product';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  
  return {
    title: `${categoryName} Art - Hansy Fine Arts`,
    description: `Browse our ${categoryName} art collection`,
  };
}

async function getCategoryProducts(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/products`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch products');
      return [];
    }

    const products: Product[] = await response.json();
    return products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const products = await getCategoryProducts(category);
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="w-full">
      {products.length > 0 ? (
        <ProductCards products={products} />
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No {categoryName} products available at the moment.</p>
        </div>
      )}
    </div>
  );
}
