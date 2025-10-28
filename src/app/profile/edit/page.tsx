import React from 'react';
import { Metadata } from 'next';
import EditProfilePage from '@/components/profile/EditProfilePage';

export const metadata: Metadata = {
  title: 'ویرایش پروفایل - برنج داودی',
  description: 'ویرایش اطلاعات حساب کاربری شما در فروشگاه برنج داودی',
};

export default function EditProfile() {
  return <EditProfilePage />;
}
