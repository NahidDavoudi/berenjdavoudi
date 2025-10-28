'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'react-feather';
import { useCart } from '@/lib/hooks/useCart';

export default function Header() {
  const { cartItemsCount } = useCart();

  return (
    <header className="sticky top-0 z-50 p-2 sm:pt-4">
      {/* گرادیان آبی برند و قاب طلایی */}
      <nav className="bg-gradient-to-r from-[#162660]/90 to-[#d0e6fd]/80 backdrop-blur-md shadow-lg rounded-2xl border border-sand/40">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* لوگو و نام برند */}
          <Link href="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-sand to-olive rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg"></span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">برنج داودی</h1>
              <p className="text-xs text-[#162660]">برنج ممتاز شمال</p>
            </div>
          </Link>

          {/* سبد خرید */}
          <div className="relative">
            <Link
              href="/cart"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all hover:bg-sand/20"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
            </Link>
            <span className="absolute -top-1 -right-1 bg-sand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {cartItemsCount}
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
}
