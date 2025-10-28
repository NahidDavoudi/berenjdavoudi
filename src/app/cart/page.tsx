import React from 'react';
import { Metadata } from 'next';
import CartPage from '@/components/cart/CartPage';

export const metadata: Metadata = {
  title: 'سبد خرید - برنج داودی',
  description: 'مشاهده سبد خرید و تکمیل سفارش - فروشگاه برنج داودی',
};

export default function Cart() {
  return <CartPage />;
}
