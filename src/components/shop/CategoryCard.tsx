import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/product';

interface CategoryInfoProps {
  name: string;
  slug: string;
  imageUrl: string;
  productCount?: number;
}

interface ProductProps {
  product: Product;
}

type CategoryCardProps = CategoryInfoProps | ProductProps;

export default function CategoryCard(props: CategoryCardProps) {
  // Check if props has 'product' property
  if ('product' in props) {
    const { product } = props;
    return (
      <Link href={`/product/${product._id}`} className="group">
        <Card className="overflow-hidden cursor-pointer">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={product.image || '/placeholder.jpg'}
              alt={product.productTitle || 'Product'}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center text-white">
              <h3 className="text-xl font-bold capitalize">
                {product.category}
              </h3>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Handle category info props
  const { name, slug, imageUrl, productCount } = props;
  return (
    <Link href={`/shop/${slug}`}>
      <Card className="group overflow-hidden cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center text-white">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            {productCount !== undefined && (
              <p className="text-sm">{productCount} Products</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
