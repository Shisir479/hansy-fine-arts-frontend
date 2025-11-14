import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addToWishlist, removeFromWishlist, clearWishlist } from '@/lib/redux/slices/wishlistSlice';

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.wishlist);

  const add = (productId: string) => dispatch(addToWishlist(productId));
  const remove = (productId: string) => dispatch(removeFromWishlist(productId));
  const clear = () => dispatch(clearWishlist());
  const isInWishlist = (productId: string) => wishlist.items.includes(productId);

  return { wishlist, add, remove, clear, isInWishlist };
};
