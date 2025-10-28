import React from 'react';
import { Metadata } from 'next';
import OrderConfirmation from '@/components/checkout/OrderConfirmation';

export const metadata: Metadata = {
  title: 'سفارش ثبت شد - برنج داودی',
  description: 'سفارش شما با موفقیت ثبت شد - فروشگاه برنج داودی',
};

export default function ConfirmationPage() {
  return <OrderConfirmation />;
}
