import React from 'react';
import { Metadata } from 'next';
import AuthPage from '@/components/auth/AuthPage';

export const metadata: Metadata = {
  title: 'ورود / ثبت نام - برنج داودی',
  description: 'ورود به حساب کاربری یا ثبت نام در فروشگاه برنج داودی',
};

export default function Auth() {
  return <AuthPage />;
}
