import { Metadata } from 'next';
import ContemporaryArtGallery from '@/components/gallery/ContemporaryArtGallery';

export const metadata: Metadata = {
  title: 'Contemporary Art Gallery - Hansy Fine Arts',
  description: 'Browse our contemporary art collection',
};

export default function ContemporaryGalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Contemporary Art Gallery</h1>
        <p className="text-lg text-muted-foreground">
          Discover modern contemporary pieces that reflect our current times
        </p>
      </div>

      <ContemporaryArtGallery />
    </div>
  );
}
