'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductOption {
  name: string;
  image: string;
}

const products: ProductOption[] = [
  { name: 'Watercolor Fine Art Paper', image: '/cuadro-horizontal-1.jpg' },
  { name: 'Canvas', image: '/cuadro-horizontal-2.jpg' },
  { name: 'Metal - White Gloss', image: '/cuadro-horizontal-3.jpg' },
  { name: 'Wood', image: '/cuadro-horizontal-4.jpg' },
  { name: '1/4 Acrylic', image: '/cuadro-horizontal-5.jpg' },
  { name: 'Hoodies (No Zip or Pullover)', image: '/BellaCanvas_Front_Army-New.png' },
  { name: 'T-Shirts', image: '/BellaCanvas_Front_Army-New.png' },
  { name: 'Tank Tops', image: '/BellaCanvas_Front_Army-New.png' },
  { name: 'Tote Bags', image: '/Bag_Tote_13x13_Overlay.png' },
  { name: 'Throw Pillows', image: '/14X14-ThrowPillow-SpunPolyester-SEWN_Background_Layer.png' },
  { name: 'Phone Cases', image: '/Iphone_16_Overlay.png' },
  { name: 'Mugs', image: '/cuadro-vertical-1_1.jpg' },
  { name: 'Puzzles', image: '/cuadro-vertical-2.jpg' },
  { name: 'Porcelain Ornaments', image: '/cuadro-vertical-3.jpg' },
  { name: 'Metal Ornaments', image: '/cuadro-vertical-4.jpg' },
];

const ProductSwitcher = () => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const handleNext = () => {
    setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrevious = () => {
    setCurrentProductIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length
    );
  };

  const currentProduct = products[currentProductIndex];

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4 text-center">
            {currentProduct.name}
          </h3>
          
          <div className="relative w-64 h-64 mb-4 bg-muted rounded-lg overflow-hidden">
            <Image
              src={currentProduct.image}
              alt={currentProduct.name}
              fill
              className="object-contain"
              sizes="256px"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              aria-label="Previous product"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {currentProductIndex + 1} / {products.length}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              aria-label="Next product"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSwitcher;
