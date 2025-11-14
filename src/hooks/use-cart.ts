import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '@/lib/redux/slices/cartSlice';
import { Product } from '@/types/product';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  const add = (product: Product) => dispatch(addToCart(product));
  const remove = (id: string) => dispatch(removeFromCart(id));
  const update = (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity }));
  const clear = () => dispatch(clearCart());

  return { cart, add, remove, update, clear };
};
