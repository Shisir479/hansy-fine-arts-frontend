import { Metadata } from 'next';
import ShopArtCategory from '@/components/shop/ShopArtCategory';
import MasonaryGrid from '@/components/gallery/MasonaryGrid';

export const metadata: Metadata = {
  title: 'Gallery - Hansy Fine Arts',
  description: 'Browse our art galleries',
};

export default function GalleryPage() {
  return (
    <div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Art Galleries</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections of fine art by category
          </p>
        </div>
      </div>

      <ShopArtCategory />
      <MasonaryGrid />
    </div>
  );
}
