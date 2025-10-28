import React from 'react';
import { Metadata } from 'next';
import OrdersPage from '@/components/orders/OrdersPage';

export const metadata: Metadata = {
  title: 'سفارشات من - برنج داودی',
  description: 'مشاهده و پیگیری سفارشات شما در فروشگاه برنج داودی',
};

export default function Orders() {
  return <OrdersPage />;
}
