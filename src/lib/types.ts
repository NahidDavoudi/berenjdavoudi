export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  weight?: string;
  images?: string[];
  category_id?: number;
  category_name?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  referralCode: string;
  isAdmin?: boolean;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  address: string;
  payment_method: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Discount {
  id: number;
  user_id: number;
  amount: number;
  reason: string;
  created_at: string;
}
