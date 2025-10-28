'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Star } from 'react-feather';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
}

export default function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // نمایش امتیاز محصول
  const renderRating = () => {
    const rating = product.rating || 4.5;
    const reviewCount = product.reviewCount || 10;
    
    return (
      <div className="flex items-center mt-1 mb-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              size={14}
              fill={star <= Math.floor(rating) ? "#FFC93C" : "none"}
              stroke={star <= Math.floor(rating) ? "#FFC93C" : "#E0E0E0"}
              className="w-3 h-3 mr-0.5"
            />
          ))}
        </div>
        <span className="text-xs text-textSecondary mr-1 font-medium">{`(${reviewCount})`}</span>
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <div className="bg-surface border border-divider rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300">
        <Link href={`/products/${product.id}`} className="flex items-center space-x-3 space-x-reverse">
          <div className="relative w-16 h-16 rounded-md overflow-hidden">
            <Image 
              src={product.image || 'https://berenjdavoudi.ir/images/product.png'} 
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-textPrimary truncate">{product.name}</h4>
            <p className="text-primary font-bold text-sm mt-1">{formatPrice(product.price)} تومان</p>
          </div>
          <button 
            onClick={handleAddToCart} 
            className="bg-primary text-textOnPrimary px-4 py-2 rounded-full text-sm font-medium"
          >
            افزودن
          </button>
        </Link>
      </div>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="bg-surface rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
        {/* تصویر محصول */}
        <div className="relative w-full pb-[100%] rounded-t-lg overflow-hidden">
          <Image 
            src={product.image || 'https://berenjdavoudi.ir/images/product.png'} 
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.featured && (
            <div className="absolute top-2 right-2 bg-accent text-textPrimary px-2 py-1 rounded-full text-xs font-medium">
              جدید
            </div>
          )}
        </div>
        
        {/* محتوای کارت */}
        <div className="p-4">
          <h3 className="font-semibold text-textPrimary text-base">{product.name}</h3>
          
          {/* امتیاز محصول */}
          {renderRating()}
          
          {/* قیمت و دکمه افزودن به سبد */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-primary font-bold">{formatPrice(product.price)} تومان</span>
            <button 
              onClick={handleAddToCart} 
              className="bg-primary text-textOnPrimary w-8 h-8 rounded-md flex items-center justify-center transition-all hover:shadow-md"
              aria-label="افزودن به سبد خرید"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
