import { CartItem } from './product';

export interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: 'paypal' | 'stripe';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}
