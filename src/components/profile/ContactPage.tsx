'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, MessageCircle, MapPin } from 'react-feather';

export default function ContactPage() {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <Link href="/profile" className="ml-3 p-2 rounded-full hover:bg-gray-100">
          <ArrowRight className="w-6 h-6 text-text-primary" />
        </Link>
        <h2 className="text-xl font-bold text-text-primary">تماس و درباره ما</h2>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <h3 className="font-semibold mb-4 text-text-primary">اطلاعات تماس</h3>
        <div className="space-y-4">
          <a href="tel:09904670738" className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-blue/20 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">تلفن تماس</p>
              <p className="text-sm text-text-secondary font-mono">۰۹۹۰-۴۶۷-۰۷۳۸</p>
            </div>
          </a>
          
          <a href="https://wa.me/989123456789" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-green/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">واتساپ</p>
              <p className="text-sm text-text-secondary font-mono">۰۹۱۲-۳۴۵-۶۷۸۹</p>
            </div>
          </a>
          
          <div className="flex items-start space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-lime/80 rounded-lg flex items-center justify-center pt-1">
              <MapPin className="w-5 h-5 text-green" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">آدرس فروشگاه</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                مازندران، بابل، بلوار کشاورز، خیابان دانشجوی ۲۸، برنج داودی
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-md">
        <h3 className="font-semibold mb-4 text-text-primary">درباره برنج داودی</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          ما در فروشگاه برنج داودی با بیش از دو دهه سابقه، مفتخریم که عرضه‌کننده ممتازترین برنج‌های شمال کشور هستیم. 
          هدف ما ارائه محصولی با کیفیت، خوش‌طعم و اصیل ایرانی به سفره‌های شماست.
        </p>
      </div>
    </div>
  );
}
