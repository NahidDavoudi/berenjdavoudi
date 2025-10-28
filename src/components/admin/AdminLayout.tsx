'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Package, 
  ShoppingBag, 
  Users, 
  Grid, 
  Gift, 
  LogOut, 
  Menu, 
  X 
} from 'react-feather';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const navItems = [
    { href: '/admin', label: 'داشبورد', icon: <Home className="w-5 h-5" /> },
    { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: <Grid className="w-5 h-5" /> },
    { href: '/admin/products', label: 'محصولات', icon: <Package className="w-5 h-5" /> },
    { href: '/admin/orders', label: 'سفارشات', icon: <ShoppingBag className="w-5 h-5" /> },
    { href: '/admin/users', label: 'کاربران', icon: <Users className="w-5 h-5" /> },
    { href: '/admin/referrals', label: 'معرفی‌ها', icon: <Gift className="w-5 h-5" /> },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">پنل مدیریت</h1>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 right-0 z-30 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } lg:static lg:translate-x-0`}
      >
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">پنل مدیریت</h1>
          <p className="text-xs text-gray-500">فروشگاه برنج داودی</p>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-10 pt-6 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 space-x-reverse px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>خروج</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:mr-64' : 'lg:mr-64'
      }`}>
        <div className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

