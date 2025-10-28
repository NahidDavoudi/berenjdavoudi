'use client';

import React, { createContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/lib/types';
import AddToCartToast from '@/components/cart/AddToCartToast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, change: number) => void;
  clearCart: () => void;
  cartItemsCount: number;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartItemsCount: 0,
  cartTotal: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastProductName, setToastProductName] = useState('');

  // Load cart from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart from localStorage:', e);
        }
      }
    }
  }, []);

  // Update localStorage and derived states whenever cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemsCount(itemCount);
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity < product.stock) {
          // Show toast
          setToastProductName(product.name);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          
          return prevCart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        }
        return prevCart; // Don't add if it would exceed stock
      } else {
        // Add new item with quantity 1
        // Show toast
        setToastProductName(product.name);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        
        return [...prevCart, { 
          id: product.id, 
          name: product.name, 
          price: product.price, 
          image: product.image,
          quantity: 1 
        }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          // Remove item if quantity would be 0 or less
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartItemsCount,
      cartTotal
    }}>
      {children}
      
      {/* Toast Notification */}
      {showToast && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 9999,
          width: '90%',
          maxWidth: '350px'
        }}>
          <AddToCartToast 
            productName={toastProductName} 
            onClose={() => setShowToast(false)}
            productId={cart.find(item => item.name === toastProductName)?.id}
          />
        </div>
      )}
    </CartContext.Provider>
  );
}
