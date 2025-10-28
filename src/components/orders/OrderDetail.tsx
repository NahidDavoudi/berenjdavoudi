'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package, Truck, Calendar, Clock, MapPin, CreditCard, Check, AlertCircle } from 'react-feather';
import { useAuth } from '@/lib/hooks/useAuth';
import { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface OrderDetailProps {
  orderId: number;
}

// تابع تبدیل تاریخ میلادی به شمسی (ساده)
const toJalali = (date: string) => {
  try {
    const d = new Date(date);
    // این تابع در یک برنامه واقعی باید با کتابخانه مناسب پیاده‌سازی شود
    return `${d.getFullYear() - 621}/${d.getMonth() + 1}/${d.getDate()}`;
  } catch (e) {
    return 'تاریخ نامعتبر';
  }
};

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  
  // مراحل سفارش
  const steps = [
    { title: 'ثبت سفارش', icon: <Check size={16} /> },
    { title: 'پردازش', icon: <Package size={16} /> },
    { title: 'ارسال', icon: <Truck size={16} /> },
    { title: 'تحویل', icon: <Check size={16} /> }
  ];
  
  // تعیین مرحله فعلی بر اساس وضعیت سفارش
  const getActiveStep = (status: string) => {
    switch (status) {
      case 'در حال پردازش':
        return 1;
      case 'ارسال شده':
        return 2;
      case 'تحویل شده':
        return 3;
      case 'لغو شده':
        return -1; // حالت خاص برای سفارش‌های لغو شده
      default:
        return 0;
    }
  };
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);
  
  // بارگذاری اطلاعات سفارش
  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return;
      
      setIsLoadingOrder(true);
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const foundOrder = await response.json();
        if (foundOrder) {
          setOrder(foundOrder);
          setActiveStep(getActiveStep(foundOrder.status));
        } else {
          setError('سفارش مورد نظر یافت نشد');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('خطا در دریافت اطلاعات سفارش');
      } finally {
        setIsLoadingOrder(false);
      }
    };
    
    fetchOrder();
  }, [user, orderId]);
  
  
  if (isLoading || !user) {
    return <div className="p-4 text-center">در حال بارگذاری...</div>;
  }
  
  if (isLoadingOrder) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="animate-pulse h-24 bg-gray-200 rounded"></div>
        <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
        <p className="text-error">{error || 'سفارش مورد نظر یافت نشد'}</p>
        <Link href="/orders" className="text-primary font-semibold mt-4 inline-block">
          بازگشت به لیست سفارشات
        </Link>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-16">
      {/* هدر و دکمه بازگشت */}
      <div className="flex items-center mb-6">
        <Link href="/orders" className="ml-3 p-2 rounded-full hover:bg-background">
          <ArrowRight className="w-6 h-6 text-textPrimary" />
        </Link>
        <h2 className="text-xl font-bold text-textPrimary">جزئیات سفارش</h2>
      </div>
      
      {/* شماره سفارش و وضعیت */}
      <div className="bg-surface rounded-lg p-4 shadow-sm mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-textSecondary">شماره سفارش</p>
          <p className="font-bold text-textPrimary">{order.id}</p>
        </div>
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${order.status === 'در حال پردازش' ? 'bg-warning bg-opacity-10 text-warning' : ''}
          ${order.status === 'ارسال شده' ? 'bg-info bg-opacity-10 text-info' : ''}
          ${order.status === 'تحویل شده' ? 'bg-success bg-opacity-10 text-success' : ''}
          ${order.status === 'لغو شده' ? 'bg-error bg-opacity-10 text-error' : ''}
        `}>
          {order.status}
        </span>
      </div>
      
      {/* نمایش مراحل سفارش */}
      <div className="bg-surface rounded-lg p-4 shadow-sm mb-4">
        <h3 className="font-semibold text-textPrimary mb-4">پیگیری سفارش</h3>
        
        <div className="relative">
          {/* خط اتصال مراحل */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-divider"></div>
          
          {/* مراحل */}
          <div className="flex justify-between relative">
            {steps.map((step, index) => {
              // تعیین وضعیت هر مرحله
              let status = 'pending';
              if (activeStep === -1) {
                status = index === 0 ? 'completed' : 'cancelled';
              } else if (index < activeStep) {
                status = 'completed';
              } else if (index === activeStep) {
                status = 'active';
              }
              
              return (
                <div key={index} className="flex flex-col items-center z-10">
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${status === 'completed' ? 'bg-success text-textOnPrimary' : ''}
                      ${status === 'active' ? 'bg-primary text-textOnPrimary' : ''}
                      ${status === 'pending' ? 'bg-surface border border-divider text-textSecondary' : ''}
                      ${status === 'cancelled' ? 'bg-error text-textOnPrimary' : ''}
                    `}
                  >
                    {step.icon}
                  </div>
                  <span className={`
                    text-xs mt-2 font-medium text-center
                    ${status === 'completed' ? 'text-success' : ''}
                    ${status === 'active' ? 'text-primary' : ''}
                    ${status === 'pending' ? 'text-textSecondary' : ''}
                    ${status === 'cancelled' ? 'text-error' : ''}
                  `}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* اطلاعات ارسال */}
        <div className="mt-8 pt-4 border-t border-divider">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-textSecondary ml-2 mt-0.5" />
              <div>
                <p className="text-xs text-textSecondary">تاریخ سفارش</p>
                <p className="text-sm font-medium text-textPrimary">
                  {toJalali(order.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-textSecondary ml-2 mt-0.5" />
              <div>
                <p className="text-xs text-textSecondary">زمان تحویل تقریبی</p>
                <p className="text-sm font-medium text-textPrimary">
                  {order.delivery_date ? toJalali(order.delivery_date) : 'در حال پردازش'}
                </p>
              </div>
            </div>
            
            {order.tracking_code && (
              <div className="flex items-start col-span-2">
                <Package className="w-5 h-5 text-textSecondary ml-2 mt-0.5" />
                <div>
                  <p className="text-xs text-textSecondary">کد رهگیری</p>
                  <p className="text-sm font-medium text-textPrimary">{order.tracking_code}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* اقلام سفارش */}
      <div className="bg-surface rounded-lg p-4 shadow-sm mb-4">
        <h3 className="font-semibold text-textPrimary mb-4">اقلام سفارش</h3>
        
        <div className="space-y-3">
          {order.items.map(item => (
            <div key={item.product_id} className="flex border-b border-divider pb-3">
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image 
                  src={item.image || 'https://berenjdavoudi.ir/images/product.png'} 
                  alt={item.product_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 mr-3">
                <p className="font-medium text-textPrimary">{item.product_name}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-textSecondary">{item.quantity} عدد</span>
                  <span className="font-semibold text-primary">{formatPrice(item.price)} تومان</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-divider">
          <div className="flex justify-between items-center">
            <span className="text-textSecondary">جمع کل:</span>
            <span className="font-bold text-lg text-primary">{formatPrice(order.total_amount)} تومان</span>
          </div>
        </div>
      </div>
      
      {/* اطلاعات ارسال و پرداخت */}
      <div className="bg-surface rounded-lg p-4 shadow-sm mb-4">
        <div className="flex items-start mb-4 pb-4 border-b border-divider">
          <MapPin className="w-5 h-5 text-textSecondary ml-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-textPrimary mb-1">آدرس تحویل</p>
            <p className="text-sm text-textSecondary">{order.address}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CreditCard className="w-5 h-5 text-textSecondary ml-2 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-textPrimary mb-1">روش پرداخت</p>
            <p className="text-sm text-textSecondary">
              {order.payment_method === 'cod' ? 'پرداخت در محل' : 'پرداخت آنلاین'}
            </p>
          </div>
        </div>
      </div>
      
      {/* تاریخچه وضعیت */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="bg-surface rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-textPrimary mb-4">تاریخچه وضعیت</h3>
          
          <div className="space-y-4">
            {order.timeline.map((event, index) => (
              <div key={index} className="relative">
                {/* خط عمودی اتصال */}
                {index < order.timeline.length - 1 && (
                  <div className="absolute top-8 bottom-0 right-4 w-0.5 bg-divider"></div>
                )}
                
                <div className="flex">
                  <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center ml-4">
                    <Check size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-textPrimary">{event.status}</p>
                      <p className="text-xs text-textSecondary">
                        {new Date(event.date).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    <p className="text-sm text-textSecondary mt-1">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
