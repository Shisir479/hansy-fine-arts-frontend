'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { formatPrice } from '@/lib/utils/helpers';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { add: addToCart } = useCart();
  const { add: addToWishlist, remove: removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product._id);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <Card className="group overflow-hidden">
      <Link href={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image || '/placeholder.jpg'}
            alt={product.productTitle || 'Product'}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2">Featured</Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          
          {/* Wishlist Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={cn(
                'h-4 w-4',
                inWishlist && 'fill-current text-red-500'
              )}
            />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 hover:text-primary">
            {product.productTitle}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {product.description}
        </p>
        {product.artist && (
          <p className="text-sm text-muted-foreground mb-2">
            by {product.artist}
          </p>
        )}
        <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
