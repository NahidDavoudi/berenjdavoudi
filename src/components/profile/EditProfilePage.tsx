'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'react-feather';
import { useAuth } from '@/lib/hooks/useAuth';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    } else if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateProfile(name, email);
      router.push('/profile');
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'خطا در به‌روزرسانی پروفایل. لطفا دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return <div className="p-4 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <Link href="/profile" className="ml-3 p-2 rounded-full hover:bg-gray-100">
          <ArrowRight className="w-6 h-6 text-text-primary" />
        </Link>
        <h2 className="text-xl font-bold text-text-primary">ویرایش اطلاعات</h2>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">نام و نام خانوادگی</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">ایمیل</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full btn-primary py-3 rounded-xl font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </form>
    </div>
  );
}
