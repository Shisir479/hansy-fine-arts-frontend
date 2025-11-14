import { Metadata } from 'next';
import AbstractArtGallery from '@/components/gallery/AbstractArtGallery';

export const metadata: Metadata = {
  title: 'Abstract Art Gallery - Hansy Fine Arts',
  description: 'Browse our abstract art collection',
};

export default function AbstractGalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Abstract Art Gallery</h1>
        <p className="text-lg text-muted-foreground">
          Explore bold, expressive abstract artworks that push the boundaries of creativity
        </p>
      </div>

      <AbstractArtGallery />
    </div>
  );
}
