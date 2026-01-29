export interface Product {
  _id: string;
  productTitle: string;
  name?: string; // Alias for productTitle
  description?: string;
  price: number;
  category: string;
  image: string; // Main image from API
  imageUrl?: string; // Alias for image
  images?: string[];
  artist?: string;
  dimensions?: { width?: number; height?: number };
  material?: string;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  sku?: string;
  quantity?: number;
  createdAt?: string;
  updatedAt?: string;
  variant?: string;
  variantDetails?: {
    label: string;
    value: string;
  }[];
}

export interface CartItem extends Product {
  quantity: number;
}
