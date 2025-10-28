import React from 'react';
import Link from 'next/link';
import FeaturedProducts from '@/components/products/FeaturedProducts';

export default function HomePage() {
  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-[#d0e6fd] to-[#162660]/20 p-6 rounded-2xl shadow-lg mb-6 fade-in">
        <h2 className="text-xl font-bold text-text-primary mb-2">برنج ممتاز شمال کشور</h2>
        <p className="text-text-secondary text-sm mb-4">بیش از ۲ دهه تجربه در عرضه بهترین برنج‌های ایرانی</p>
        <Link
          href="/products"
          className="btn-primary px-6 py-2 rounded-full text-sm font-semibold inline-block"
        >
          مشاهده محصولات
        </Link>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-3 text-text-primary px-2">محصولات ویژه</h3>
        <FeaturedProducts />
      </div>
    </div>
  );
}
