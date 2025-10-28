'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/featured');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        
        const result = await response.json();
        const products = result.data || [];
        setProducts(products);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('خطا در بارگذاری محصولات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 animate-pulse h-24 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="space-y-3">
      {products.map(product => (
        <ProductCard key={product.id} product={product} variant="list" />
      ))}
    </div>
  );
}
