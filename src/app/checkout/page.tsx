import React from 'react';
import { Metadata } from 'next';
import CheckoutPage from '@/components/checkout/CheckoutPage';

export const metadata: Metadata = {
  title: 'تکمیل سفارش - برنج داودی',
  description: 'تکمیل سفارش و پرداخت - فروشگاه برنج داودی',
};

export default function Checkout() {
  return <CheckoutPage />;
}
