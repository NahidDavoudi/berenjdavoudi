import React from 'react';
import { Metadata } from 'next';
import ProfilePage from '@/components/profile/ProfilePage';

export const metadata: Metadata = {
  title: 'پروفایل کاربری - برنج داودی',
  description: 'مدیریت حساب کاربری شما در فروشگاه برنج داودی',
};

export default function Profile() {
  return <ProfilePage />;
}
