import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product Details - Hansy Fine Arts',
  description: 'View product details',
};

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock product data
const mockProduct = {
  _id: '1',
  productTitle: 'Abstract Waves',
  description:
    'A stunning abstract piece featuring flowing waves. This artwork captures the essence of movement and fluidity, perfect for modern interiors.',
  price: 299.99,
  category: 'abstract',
  image: '/cuadro-horizontal-1.jpg',
  images: [
    '/cuadro-horizontal-1.jpg',
    '/cuadro-horizontal-2.jpg',
    '/cuadro-horizontal-3.jpg',
  ],
  artist: 'Jane Smith',
  dimensions: { width: 24, height: 36 },
  material: 'Acrylic on Canvas',
  inStock: true,
  featured: true,
  tags: ['abstract', 'modern', 'colorful'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = mockProduct;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/shop" className="inline-flex items-center text-sm mb-6 hover:text-primary">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image}
              alt={product.productTitle}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.featured && <Badge className="mb-2">Featured</Badge>}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.productTitle}</h1>
          {product.artist && (
            <p className="text-lg text-muted-foreground mb-4">by {product.artist}</p>
          )}
          <p className="text-3xl font-bold text-primary mb-6">
            ${product.price.toFixed(2)}
          </p>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">{product.description}</p>
              
              {product.dimensions && (
                <div className="mb-2">
                  <span className="font-semibold">Dimensions: </span>
                  {product.dimensions.width}&quot; × {product.dimensions.height}&quot;
                </div>
              )}
              
              {product.material && (
                <div className="mb-2">
                  <span className="font-semibold">Material: </span>
                  {product.material}
                </div>
              )}
              
              <div className="mb-2">
                <span className="font-semibold">Availability: </span>
                {product.inStock ? (
                  <Badge variant="secondary">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 mb-8">
            <Button size="lg" className="flex-1" disabled={!product.inStock}>
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              Add to Wishlist
            </Button>
          </div>

          {/* Preview Section */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 text-lg">Preview Options</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">About this artwork</h4>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3D Preview</h4>
                  <p className="text-muted-foreground text-sm">3D preview will be available here</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AR Preview</h4>
                  <p className="text-muted-foreground text-sm">AR preview will be available here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
