export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images?: string[];
  artist?: string;
  dimensions?: { width: number; height: number };
  material?: string;
  inStock: boolean;
  featured?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}
