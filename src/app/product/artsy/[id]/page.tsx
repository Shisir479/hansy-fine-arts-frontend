import { Metadata } from 'next';
import Image from 'next/image';

interface ArtsyProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ArtsyProductPageProps): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Artsy Product ${id} - Hansy Fine Arts`,
    description: 'Explore our artsy art collection',
  };
}

async function getArtsyProduct(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/arts/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching artsy product:', error);
    return null;
  }
}

export default async function ArtsyProductPage({ params }: ArtsyProductPageProps) {
  const { id } = await params;
  const product = await getArtsyProduct(id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <>
      <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0">
          <Image
            src="/gallery-banner.jpg"
            alt="Background"
            fill
            className="object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 text-white text-center py-10">
          <h1 className="text-4xl font-bold tracking-widest">
            HANS YAEGGY FINE ART
          </h1>
          <p className="text-lg italic mt-2">Artsy Product</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-96">
            <Image
              src={product.image || '/cuadro-horizontal-1.jpg'}
              alt={product.productTitle || product.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.productTitle || product.title}</h2>
            <p className="text-xl text-gray-700 mb-4">${product.price}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            {product.artist && (
              <p className="text-gray-600 mb-4">
                <strong>Artist:</strong> {product.artist}
              </p>
            )}
            {product.category && (
              <p className="text-gray-600 mb-4">
                <strong>Category:</strong> {product.category}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
