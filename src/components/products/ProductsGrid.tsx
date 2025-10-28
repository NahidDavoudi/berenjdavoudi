'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';

export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const result = await response.json();
        // API returns {success, data} format
        setProducts(result.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('خطا در بارگذاری محصولات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-200 animate-pulse h-48 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 p-4">{error}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
