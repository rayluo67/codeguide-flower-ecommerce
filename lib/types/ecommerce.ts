// API Response Types
export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  images?: string[];
  stockQuantity: number;
  sku: string;
  featured: boolean;
  flowerType?: string;
  color?: string;
  occasion?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCount: number;
}

export interface ProductsListResponse {
  products: ProductResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: ProductResponse;
}

export interface CartResponse {
  items: CartItem[];
  total: string;
  itemCount: number;
}