'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit3, Gift, Phone, LogOut, ChevronLeft, MapPin } from 'react-feather';
import { useAuth } from '@/lib/hooks/useAuth';
import { shareContent } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleShareReferral = () => {
    if (user?.referralCode) {
      shareContent(
        'معرفی فروشگاه برنج داودی',
        `با کد معرف ${user.referralCode} از فروشگاه برنج داودی خرید کنید!`,
        window.location.origin
      );
    }
  };

  if (isLoading || !user) {
    return <div className="p-4 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl p-6 shadow-md mb-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-lime to-green rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-3xl font-bold">
            {user.name ? user.name.charAt(0) : '?'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
        <p className="text-text-secondary">{user.phone || user.email}</p>
      </div>
      
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-lime/30 to-green/20 backdrop-blur-md rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-text-primary">کد معرف شما</span>
            <button 
              onClick={handleShareReferral} 
              className="text-blue text-sm font-semibold"
            >
              اشتراک‌گذاری
            </button>
          </div>
          <div className="bg-gradient-to-r from-lime to-green/30 rounded-lg p-3 text-center">
            <p className="font-bold text-lg text-green tracking-widest">
              {user.referralCode}
            </p>
          </div>
        </div>
        
        <Link 
          href="/profile/edit" 
          className="w-full bg-white rounded-xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <Edit3 className="w-5 h-5 text-blue" />
            <span className="font-semibold text-text-primary">ویرایش اطلاعات</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </Link>
        
        <Link 
          href="/profile/referrals" 
          className="w-full bg-white rounded-xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <Gift className="w-5 h-5 text-blue" />
            <span className="font-semibold text-text-primary">پاداش‌های من</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </Link>
        
        <Link 
          href="/profile/addresses" 
          className="w-full bg-white rounded-xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <MapPin className="w-5 h-5 text-blue" />
            <span className="font-semibold text-text-primary">آدرس‌های من</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </Link>
        
        <Link 
          href="/profile/contact" 
          className="w-full bg-white rounded-xl p-4 shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3 space-x-reverse">
            <Phone className="w-5 h-5 text-blue" />
            <span className="font-semibold text-text-primary">تماس با ما</span>
          </div>
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </Link>
        
        <button 
          onClick={handleLogout} 
          className="w-full bg-red-100 text-red-700 rounded-xl p-4 mt-4 shadow-md flex items-center justify-center font-semibold space-x-2 space-x-reverse"
        >
          <LogOut className="w-5 h-5" />
          <span>خروج از حساب کاربری</span>
        </button>
      </div>
    </div>
  );
}
