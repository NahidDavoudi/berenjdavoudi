'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';

interface DashboardStatsProps {
  stats: {
    usersCount: number;
    productsCount: number;
    ordersCount: number;
    totalRevenue: number;
    referralsCount: number;
    activatedReferralsCount: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'کاربران',
      value: stats.usersCount,
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'محصولات',
      value: stats.productsCount,
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'سفارشات',
      value: stats.ordersCount,
      color: 'bg-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'درآمد کل',
      value: formatPrice(stats.totalRevenue) + ' تومان',
      color: 'bg-amber-500',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-100',
      isPrice: true
    },
    {
      title: 'معرفی‌ها',
      value: stats.referralsCount,
      color: 'bg-pink-500',
      textColor: 'text-pink-500',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'معرفی‌های فعال',
      value: stats.activatedReferralsCount,
      color: 'bg-teal-500',
      textColor: 'text-teal-500',
      bgColor: 'bg-teal-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">{stat.title}</h3>
            <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
              <span className={`${stat.textColor} font-bold text-lg`}>
                {typeof stat.value === 'number' ? stat.value.toString().charAt(0) : '#'}
              </span>
            </div>
          </div>
          <p className={`text-2xl font-bold ${stat.isPrice ? 'text-amber-600' : 'text-gray-800'}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

