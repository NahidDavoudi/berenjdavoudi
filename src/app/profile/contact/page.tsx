import React from 'react';
import { Metadata } from 'next';
import ContactPage from '@/components/profile/ContactPage';

export const metadata: Metadata = {
  title: 'تماس با ما - برنج داودی',
  description: 'اطلاعات تماس و درباره فروشگاه برنج داودی',
};

export default function Contact() {
  return <ContactPage />;
}
