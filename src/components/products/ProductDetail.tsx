'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Minus, Plus, ShoppingBag, Package, Info } from 'react-feather';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils';

interface ProductDetailProps {
  productId: number;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // TODO: Implement API endpoint for reviews
        // const response = await fetch(`/api/products/${productId}/reviews`);
        // const data = await response.json();
        // setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const result = await response.json();
        setProduct(result.data);
      } catch (err) {
        console.error(`Error fetching product ${productId}:`, err);
        setError('خطا در بارگذاری اطلاعات محصول');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && (!product || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  // نمایش امتیاز محصول
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            size={16}
            fill={star <= Math.floor(rating) ? "#FFC93C" : "none"}
            stroke={star <= Math.floor(rating) ? "#FFC93C" : "#E0E0E0"}
            className="w-4 h-4 ml-0.5"
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-background min-h-screen">
        <div className="bg-gray-200 h-80 w-full"></div>
        <div className="bg-surface rounded-t-3xl -mt-6 relative z-10 p-6">
          <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="flex items-center mb-4">
            <div className="h-4 bg-gray-200 rounded w-24 mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-full mt-6"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 text-center min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-surface p-8 rounded-lg shadow-md max-w-md">
          <Info className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-xl font-bold text-textPrimary mb-2">خطا در بارگذاری</h2>
          <p className="text-textSecondary mb-6">{error || 'محصول یافت نشد'}</p>
          <Link href="/products" className="bg-primary text-textOnPrimary px-6 py-2 rounded-full inline-block">
            بازگشت به محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* هدر و دکمه بازگشت */}
      <div className="relative">
        <Link 
          href="/products" 
          className="absolute top-4 right-4 z-10 bg-surface shadow-sm rounded-full p-2"
        >
          <ArrowRight className="w-6 h-6 text-textPrimary" />
        </Link>
        
        {/* تصویر اصلی محصول */}
        <div className="relative w-full h-80">
          <Image 
            src={product.images?.[selectedImage] || product.image} 
            alt={product.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>
      
      {/* محتوای اصلی */}
      <div className="bg-surface rounded-t-3xl -mt-6 relative z-10 p-6">
        {/* نام محصول و امتیاز */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-textPrimary">{product.name}</h1>
          <div className="flex items-center mt-2">
            {renderRating(product.rating || 4)}
            <span className="text-textSecondary text-sm mr-2">
              ({product.reviewCount || 10} نظر)
            </span>
          </div>
        </div>
        
        {/* گالری تصاویر کوچک */}
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2 space-x-reverse mb-6 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image 
                  src={image}
                  alt={`${product.name} - تصویر ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
        
        {/* قیمت و انتخاب تعداد */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-textSecondary text-sm">قیمت:</span>
            <p className="text-primary font-bold text-xl">{formatPrice(product.price)} تومان</p>
          </div>
          
          <div className="flex items-center border border-border rounded-lg">
            <button 
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 flex items-center justify-center text-textPrimary"
              disabled={quantity <= 1}
            >
              <Minus size={18} className={quantity <= 1 ? 'text-textSecondary' : 'text-textPrimary'} />
            </button>
            <span className="w-10 text-center font-semibold">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 flex items-center justify-center text-textPrimary"
              disabled={product && quantity >= product.stock}
            >
              <Plus size={18} className={product && quantity >= product.stock ? 'text-textSecondary' : 'text-textPrimary'} />
            </button>
          </div>
        </div>
        
        {/* ویژگی‌های محصول */}
        <div className="bg-background rounded-lg p-4 mb-6">
          <div className="flex items-center mb-3">
            <Package className="w-5 h-5 text-textSecondary ml-2" />
            <span className="text-textPrimary font-medium">وزن: {product.weight || '10 کیلوگرم'}</span>
          </div>
          <div className="flex items-center">
            <ShoppingBag className="w-5 h-5 text-textSecondary ml-2" />
            <span className="text-textPrimary font-medium">موجودی: {product.stock} عدد</span>
          </div>
        </div>
        
        {/* تب‌های توضیحات و نظرات */}
        <div className="mb-6">
          <div className="flex border-b border-divider">
            <button 
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-textSecondary'}`}
              onClick={() => setActiveTab('description')}
            >
              توضیحات
            </button>
            <button 
              className={`flex-1 py-3 text-center font-medium ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-textSecondary'}`}
              onClick={() => setActiveTab('reviews')}
            >
              نظرات {reviews.length > 0 && `(${reviews.length})`}
            </button>
          </div>
          
          <div className="py-4">
            {activeTab === 'description' ? (
              <p className="text-textSecondary leading-relaxed">{product.description}</p>
            ) : (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="border-b border-divider pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-textPrimary">{review.userName}</h4>
                          <p className="text-xs text-textSecondary">{review.date}</p>
                        </div>
                        {renderRating(review.rating)}
                      </div>
                      <p className="text-textSecondary text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-textSecondary py-8">
                    هنوز نظری ثبت نشده است.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* دکمه افزودن به سبد خرید */}
        <button 
          onClick={handleAddToCart} 
          className="w-full bg-primary text-textOnPrimary py-4 rounded-full font-medium text-lg shadow-sm hover:shadow-md transition-shadow"
        >
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}
