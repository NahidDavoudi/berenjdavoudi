import React from 'react';
import { Metadata } from 'next';
import OrderDetail from '@/components/orders/OrderDetail';

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  return {
    title: `جزئیات سفارش ${params.id} - برنج داودی`,
    description: 'مشاهده جزئیات و وضعیت سفارش',
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return <OrderDetail orderId={parseInt(params.id)} />;
}
