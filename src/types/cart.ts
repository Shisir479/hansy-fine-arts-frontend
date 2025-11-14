import { CartItem } from './product';

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface WishlistState {
  items: string[];
}
