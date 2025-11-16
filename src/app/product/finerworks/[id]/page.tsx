import { Metadata } from 'next';
import Image from 'next/image';

interface FinerWorksProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: FinerWorksProductPageProps): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `FinerWorks Product ${id} - Hansy Fine Arts`,
    description: 'Explore our FinerWorks art collection',
  };
}

async function getFinerWorksProduct(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/arts/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching FinerWorks product:', error);
    return null;
  }
}

export default async function FinerWorksProductPage({ params }: FinerWorksProductPageProps) {
  const { id } = await params;
  const product = await getFinerWorksProduct(id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="relative">
          <div className="group">
            <Image
              src={product.image || '/cuadro-horizontal-1.jpg'}
              alt={product.productTitle || product.title}
              width={400}
              height={400}
              className="rounded-lg max-w-[400px] max-h-[400px] object-cover transform transition duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.productTitle || product.title}</h1>
          <p className="text-xl text-gray-600 font-semibold mb-4">${product.price}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mt-4">
            <label className="mr-2">Quantity:</label>
            <input
              type="number"
              defaultValue="1"
              min="1"
              className="w-16 border rounded p-2"
            />
          </div>

          {/* Add to Cart Buttons */}
          <div className="mt-4 flex gap-4">
            <button className="bg-black text-white px-6 py-3 rounded uppercase hover:bg-gray-800">
              Add to Cart
            </button>
            <button className="bg-gray-800 text-white px-6 py-3 rounded uppercase hover:bg-gray-900">
              Instant Checkout
            </button>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Additional Info */}
          {product.artist && (
            <div className="mt-4">
              <p className="text-gray-600">
                <strong>Artist:</strong> {product.artist}
              </p>
            </div>
          )}
          {product.category && (
            <div className="mt-2">
              <p className="text-gray-600">
                <strong>Category:</strong> {product.category}
              </p>
            </div>
          )}
          {product.inStock !== undefined && (
            <div className="mt-2">
              <p className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
