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

// Mock category products
const getCategoryProducts = (category: string): Product[] => {
  return [
    {
      _id: `${category}-1`,
      productTitle: `${category.charAt(0).toUpperCase() + category.slice(1)} Masterpiece`,
      description: `A stunning ${category} artwork`,
      price: 349.99,
      category,
      image: `/cuadro-horizontal-1.jpg`,
      artist: 'Featured Artist',
      inStock: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const products = getCategoryProducts(category);
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{categoryName} Art</h1>
        <p className="text-lg text-muted-foreground">
          Explore our curated collection of {category} artworks
        </p>
      </div>

      <ProductCards products={products} />
    </div>
  );
}
