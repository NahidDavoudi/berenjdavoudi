import React from 'react';
import { Metadata } from 'next';
import ProductDetail from '@/components/products/ProductDetail';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// This would normally fetch from an API to get metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  // For demo purposes, we'll use a placeholder title
  return {
    title: `محصول ${params.id} - برنج داودی`,
    description: 'جزئیات و خرید محصول از فروشگاه برنج داودی',
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetail productId={parseInt(params.id)} />;
}
