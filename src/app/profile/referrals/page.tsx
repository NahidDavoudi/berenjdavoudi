import React from 'react';
import { Metadata } from 'next';
import ReferralSystem from '@/components/profile/ReferralSystem';

export const metadata: Metadata = {
  title: 'پاداش‌های من - برنج داودی',
  description: 'مشاهده پاداش‌های معرفی دوستان در فروشگاه برنج داودی',
};

export default function Referrals() {
  return <ReferralSystem />;
}
