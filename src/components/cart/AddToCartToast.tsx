'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, X, Check } from 'react-feather';
import Link from 'next/link';

interface AddToCartToastProps {
  productName: string;
  onClose: () => void;
  productId?: number;
}

export default function AddToCartToast({ productName, onClose, productId }: AddToCartToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // انیمیشن ورود
  useEffect(() => {
    // کمی تاخیر برای شروع انیمیشن ورود
    const enterTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(enterTimeout);
  }, []);
  
  // خروج با انیمیشن
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // زمان انیمیشن خروج
  };

  return (
    <div 
      className={`
        bg-surface shadow-md rounded-lg p-4 flex items-center gap-3
        transition-all duration-300 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        ${isExiting ? 'opacity-0 translate-y-4' : ''}
      `}
      style={{
        maxWidth: '350px',
        borderLeft: '4px solid #162660'
      }}
    >
      <div className="bg-primary bg-opacity-10 rounded-full p-2">
        <Check size={20} className="text-primary" />
      </div>
      
      <div className="flex-1">
        <h4 className="font-medium text-textPrimary">محصول به سبد خرید اضافه شد</h4>
        <p className="text-sm text-textSecondary">{productName}</p>
      </div>
      
      <div className="flex items-center gap-2">
        {productId && (
          <Link href="/cart" className="p-2 hover:bg-background rounded-full">
            <ShoppingBag size={18} className="text-primary" />
          </Link>
        )}
        
        <button 
          onClick={handleClose}
          className="p-2 hover:bg-background rounded-full"
          aria-label="بستن"
        >
          <X size={18} className="text-textSecondary" />
        </button>
      </div>
    </div>
  );
}

