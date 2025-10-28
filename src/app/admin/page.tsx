'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    usersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    referralsCount: 0,
    activatedReferralsCount: 0
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            router.push('/auth/login');
            return;
          }
          throw new Error('Failed to fetch dashboard stats');
        }
        
        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, [router]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">داشبورد مدیریت</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <DashboardStats stats={stats} />
        )}
      </div>
    </AdminLayout>
  );
}

