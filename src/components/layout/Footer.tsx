'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Package, ShoppingBag, User } from 'react-feather';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto p-2">
        <nav className="bottom-nav rounded-2xl shadow-lg border border-white/20">
          <div className="flex justify-around px-2 py-2.5">
            <Link href="/" className="nav-item flex flex-col items-center py-2 px-3 rounded-xl transition-all">
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">خانه</span>
            </Link>
            <Link href="/products" className="nav-item flex flex-col items-center py-2 px-3 rounded-xl transition-all">
              <Package className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">محصولات</span>
            </Link>
            <Link href="/orders" className="nav-item flex flex-col items-center py-2 px-3 rounded-xl transition-all">
              <ShoppingBag className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">سفارشات</span>
            </Link>
            <Link href="/profile" className="nav-item flex flex-col items-center py-2 px-3 rounded-xl transition-all">
              <User className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">پروفایل</span>
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
}
