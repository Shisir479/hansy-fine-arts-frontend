'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types/product';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils/helpers';
import { toast } from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { update, remove } = useCart();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    update(item._id, newQuantity);
  };

  const handleRemove = () => {
    remove(item._id);
    toast.success('Removed from cart');
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
        <Image
          src={item.image || '/placeholder.jpg'}
          alt={item.productTitle || 'Product'}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <h3 className="font-semibold text-lg mb-1">{item.productTitle}</h3>
        {item.artist && (
          <p className="text-sm text-muted-foreground mb-2">by {item.artist}</p>
        )}
        <p className="text-lg font-bold text-primary">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-semibold">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-lg font-semibold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
