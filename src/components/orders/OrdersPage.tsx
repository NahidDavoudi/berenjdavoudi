'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'react-feather';
import { useAuth } from '@/lib/hooks/useAuth';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoadingOrders(true);
      try {
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('خطا در دریافت سفارشات');
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (isLoading || !user) {
    return <div className="p-4 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <Link href="/profile" className="ml-3 p-2 rounded-full hover:bg-gray-100">
          <ArrowRight className="w-6 h-6 text-text-primary" />
        </Link>
        <h2 className="text-xl font-bold text-text-primary">سفارشات من</h2>
      </div>
      
      {error ? (
        <p className="text-center text-red-500 p-4">{error}</p>
      ) : isLoadingOrders ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-xl"></div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <Link href={`/orders/${order.id}`} key={order.id} className="block bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-text-primary">سفارش #{order.id}</p>
                  <p className="text-sm text-text-secondary">
                    {new Date(order.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${order.status === 'در حال پردازش' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${order.status === 'ارسال شده' ? 'bg-blue-100 text-blue-800' : ''}
                  ${order.status === 'تحویل شده' ? 'bg-green-100 text-green-800' : ''}
                  ${order.status === 'لغو شده' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {order.status}
                </span>
              </div>
              
              {/* Order Stepper */}
              <div className="my-4">
                <div className="stepper-box" style={{ padding: '16px', width: '100%', maxWidth: '100%' }}>
                  <div className="stepper-step stepper-completed">
                    <div className="stepper-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      <svg viewBox="0 0 16 16" fill="currentColor" height={14} width={14}>
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                      </svg>
                    </div>
                    <div className="stepper-line" style={{ left: '15px', top: '32px', bottom: '-24px' }} />
                    <div className="stepper-content">
                      <div className="stepper-title" style={{ fontSize: '13px' }}>ثبت سفارش</div>
                      <div className="stepper-status" style={{ fontSize: '11px' }}>تکمیل شده</div>
                    </div>
                  </div>
                  <div className={`stepper-step ${order.status === 'در حال پردازش' ? 'stepper-active' : order.status === 'ارسال شده' || order.status === 'تحویل شده' ? 'stepper-completed' : 'stepper-pending'}`}>
                    <div className="stepper-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {order.status === 'ارسال شده' || order.status === 'تحویل شده' ? (
                        <svg viewBox="0 0 16 16" fill="currentColor" height={14} width={14}>
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                        </svg>
                      ) : '2'}
                    </div>
                    <div className="stepper-line" style={{ left: '15px', top: '32px', bottom: '-24px' }} />
                    <div className="stepper-content">
                      <div className="stepper-title" style={{ fontSize: '13px' }}>آماده‌سازی</div>
                      <div className="stepper-status" style={{ fontSize: '11px' }}>
                        {order.status === 'در حال پردازش' ? 'در حال انجام' : order.status === 'ارسال شده' || order.status === 'تحویل شده' ? 'تکمیل شده' : 'در انتظار'}
                      </div>
                    </div>
                  </div>
                  <div className={`stepper-step ${order.status === 'ارسال شده' ? 'stepper-active' : order.status === 'تحویل شده' ? 'stepper-completed' : 'stepper-pending'}`}>
                    <div className="stepper-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {order.status === 'تحویل شده' ? (
                        <svg viewBox="0 0 16 16" fill="currentColor" height={14} width={14}>
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                        </svg>
                      ) : '3'}
                    </div>
                    <div className="stepper-content">
                      <div className="stepper-title" style={{ fontSize: '13px' }}>ارسال</div>
                      <div className="stepper-status" style={{ fontSize: '11px' }}>
                        {order.status === 'تحویل شده' ? 'تحویل داده شده' : order.status === 'ارسال شده' ? 'در حال ارسال' : 'در انتظار'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-text-secondary mb-2 border-t pt-2 mt-2">
                {order.items.map(item => (
                  <p key={item.product_id}>{item.product_name} × {item.quantity}</p>
                ))}
              </div>
              <p className="font-bold text-blue text-left">
                {formatPrice(order.total_amount)} تومان
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center p-4">شما هنوز سفارشی ثبت نکرده‌اید.</p>
      )}
    </div>
  );
}
