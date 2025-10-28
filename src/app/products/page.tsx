import React from 'react';
import { Metadata } from 'next';
import ProductsGrid from '@/components/products/ProductsGrid';

export const metadata: Metadata = {
  title: 'محصولات - برنج داودی',
  description: 'مشاهده و خرید انواع برنج‌های مرغوب شمال - برنج داودی',
};

export default function ProductsPage() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">انواع برنج</h2>
      </div>
      <ProductsGrid />
    </div>
  );
}
