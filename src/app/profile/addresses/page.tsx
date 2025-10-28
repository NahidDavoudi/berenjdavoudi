import React from 'react';
import { Metadata } from 'next';
import AddressManager from '@/components/profile/AddressManager';

export const metadata: Metadata = {
  title: 'مدیریت آدرس‌ها - برنج داودی',
  description: 'مدیریت آدرس‌های ارسال سفارش در فروشگاه برنج داودی',
};

export default function AddressesPage() {
  return <AddressManager />;
}
