'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'react-feather';

interface OrderInfo {
  orderNumber: string;
  items: any[];
  total: number;
  address: string;
  paymentMethod: string;
}

export default function OrderConfirmation() {
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    // Get order info from session storage
    const savedOrder = sessionStorage.getItem('lastOrder');
    if (savedOrder) {
      try {
        setOrderInfo(JSON.parse(savedOrder));
        // Play ding sound on success
        playSuccessSound();
      } catch (e) {
        console.error('Failed to parse order info:', e);
      }
    }
  }, []);

  const playSuccessSound = () => {
    try {
      // Create audio context for ding sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for ding sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure for a pleasant ding sound
      oscillator.frequency.value = 800; // Hz
      oscillator.type = 'sine';
      
      // Envelope for ding effect
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      // Second higher note for ding effect
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        oscillator2.frequency.value = 1000;
        oscillator2.type = 'sine';
        
        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator2.start(audioContext.currentTime);
        oscillator2.stop(audioContext.currentTime + 0.5);
      }, 100);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  if (!orderInfo) {
    return (
      <div className="p-4 text-center">
        <p>اطلاعات سفارش در دسترس نیست.</p>
        <Link href="/" className="text-blue font-semibold mt-4 inline-block">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Success Notification Card */}
      {showNotification && (
        <div className="success-card mx-auto mb-6 animate-slide-in">
          <button 
            type="button" 
            className="success-dismiss"
            onClick={() => setShowNotification(false)}
          >
            ×
          </button>
          <div className="success-header">
            <div className="success-image">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  <path d="M20 7L9.00004 18L3.99994 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>
            <div className="success-content">
              <span className="success-title">سفارش تایید شد</span>
              <p className="success-message">
                از خرید شما متشکریم. بسته شما ظرف ۲-۳ روز کاری ارسال خواهد شد
              </p>
            </div>
            <div className="success-actions">
              <Link href="/orders">
                <button type="button" className="success-history">
                  سفارشات من
                </button>
              </Link>
              <Link href="/orders">
                <button type="button" className="success-track">
                  پیگیری مرسوله
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-green/20 rounded-full mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-4">سفارش شما ثبت شد!</h2>
        <p className="text-text-secondary mb-6">سفارش شما با موفقیت ثبت شد و به زودی آماده ارسال خواهد بود.</p>
        
        <div className="bg-white rounded-xl p-4 shadow-md mb-6 text-right">
          <div className="flex justify-between mb-2">
            <span className="text-text-secondary">شماره سفارش:</span>
            <span className="font-bold text-text-primary">{orderInfo.orderNumber}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-text-secondary">زمان تحویل:</span>
            <span className="font-semibold text-text-primary">۲-۳ روز کاری</span>
          </div>
        </div>
        
        <Link href="/orders" className="w-full btn-primary py-3 rounded-xl font-semibold mb-3 inline-block">
          مشاهده سفارشات من
        </Link>
        
        <Link href="/" className="w-full bg-gray-200 text-text-primary py-3 rounded-xl font-semibold inline-block">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
