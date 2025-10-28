'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'react-feather';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();

  const handleProceedToCheckout = () => {
    // If not logged in, redirect to login page
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    window.location.href = '/checkout';
  };

  if (cart.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold text-text-primary mb-4">سبد خرید</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-text-secondary" />
          </div>
          <p className="text-text-secondary">سبد خرید شما خالی است</p>
          <Link href="/products" className="mt-4 text-blue font-semibold inline-block">
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-text-primary mb-4">سبد خرید</h2>
      <div className="space-y-3 mb-4">
        {cart.map(item => (
          <div key={item.id} className="bg-gradient-to-r from-lime/30 to-green/20 backdrop-blur-md rounded-lg p-3 shadow-md flex items-center space-x-3 space-x-reverse">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image 
                src={item.image || 'https://placehold.co/100x100/eef5bf/435938?text=برنج'} 
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-text-primary text-sm truncate">{item.name}</h4>
              <p className="text-blue font-bold text-sm mt-1">{formatPrice(item.price)} تومان</p>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button 
                onClick={() => updateQuantity(item.id, -1)} 
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm transition-transform hover:scale-110"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-text-primary text-lg">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, 1)} 
                className="w-8 h-8 bg-blue text-white rounded-full flex items-center justify-center text-sm transition-transform hover:scale-110"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-lime/30 to-green/20 backdrop-blur-md rounded-lg p-4 shadow-md mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary text-sm">جمع کل:</span>
          <span className="font-bold text-text-primary">{formatPrice(cartTotal)} تومان</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-text-secondary text-sm">هزینه ارسال:</span>
          <span className="text-green text-sm font-semibold">رایگان</span>
        </div>
        <hr className="my-2 border-green/20" />
        <div className="flex justify-between items-center">
          <span className="font-semibold text-text-primary">مبلغ نهایی:</span>
          <span className="font-bold text-lg text-blue">{formatPrice(cartTotal)} تومان</span>
        </div>
      </div>

      <button 
        onClick={handleProceedToCheckout} 
        className="w-full btn-primary py-3 rounded-lg font-semibold"
        disabled={cart.length === 0}
      >
        ادامه خرید
      </button>
    </div>
  );
}
