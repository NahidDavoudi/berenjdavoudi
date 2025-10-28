'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatPrice } from '@/lib/utils';
import { generateOrderNumber } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      router.push('/auth');
    }
  }, [user, router]);

  // Redirect to home if cart is empty
  React.useEffect(() => {
    if (cart.length === 0 && typeof window !== 'undefined') {
      router.push('/');
    }
  }, [cart, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('لطفا آدرس تحویل را وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
      //     address,
      //     payment: paymentMethod
      //   })
      // });
      
      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'خطا در ثبت سفارش');
      // }
      
      // const result = await response.json();
      
      // For demo purposes, simulate a successful order
      const orderNumber = generateOrderNumber();
      
      // Store order info in session storage for confirmation page
      sessionStorage.setItem('lastOrder', JSON.stringify({
        orderNumber,
        items: cart,
        total: cartTotal,
        address,
        paymentMethod
      }));
      
      clearCart();
      router.push('/checkout/confirmation');
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'خطا در ثبت سفارش. لطفا دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || cart.length === 0) {
    return <div className="p-4 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-text-primary mb-4">تکمیل سفارش</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl p-4 shadow-md mb-4">
          <h3 className="font-semibold mb-3 text-text-primary">آدرس تحویل</h3>
          <textarea 
            rows={3} 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent" 
            placeholder="آدرس کامل خود را وارد کنید..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-md mb-4">
          <h3 className="font-semibold mb-3 text-text-primary">روش پرداخت</h3>
          <div className="space-y-3">
            <label className="flex items-start space-x-3 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input 
                type="radio" 
                name="payment" 
                className="text-blue mt-1" 
                value="cod" 
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <div>
                <span className="font-medium text-text-primary">پرداخت در محل</span>
                <p className="text-xs text-text-secondary mt-1">پرداخت هنگام تحویل کالا</p>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 space-x-reverse cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input 
                type="radio" 
                name="payment" 
                className="text-blue mt-1" 
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <div>
                <span className="font-medium text-text-primary">کارت به کارت</span>
                <p className="text-xs text-text-secondary mt-1">انتقال وجه و ارسال رسید در واتساپ</p>
              </div>
            </label>
          </div>
          
          {paymentMethod === 'card' && (
            <div className="mt-4 p-3 bg-lime/20 rounded-lg border-r-4 border-green">
              <h4 className="font-semibold text-sm text-green mb-2">اطلاعات کارت:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">شماره کارت:</span>
                  <span className="font-mono font-semibold text-text-primary">۶۰۳۷-۹۹۱۲-۳۴۵۶-۷۸۹۰</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">نام صاحب کارت:</span>
                  <span className="font-semibold text-text-primary">محمدحسین داودی</span>
                </div>
                <div className="mt-3 p-2 bg-blue/10 rounded text-xs text-center">
                  <p className="text-blue">💡 پس از واریز، لطفاً رسید را به شماره واتساپ <strong className="font-mono">09123456789</strong> ارسال کنید.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-md mb-6">
          <h3 className="font-semibold mb-3 text-text-primary">خلاصه سفارش</h3>
          <div>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-2 text-sm">
                <span className="text-text-secondary">{item.name} × {item.quantity}</span>
                <span className="font-medium text-text-primary">{formatPrice(item.price * item.quantity)} تومان</span>
              </div>
            ))}
            <hr className="my-3" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-primary">مجموع:</span>
              <span className="font-bold text-blue">{formatPrice(cartTotal)} تومان</span>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="w-full btn-primary py-3 rounded-lg font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'در حال ثبت سفارش...' : 'تایید و ثبت سفارش'}
        </button>
      </form>
    </div>
  );
}
