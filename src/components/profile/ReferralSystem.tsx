'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Gift, Share2, Copy, Check, Users } from 'react-feather';
import { formatPrice } from '@/lib/utils';

interface Referral {
  id: number;
  referredUser: string;
  date: string;
  status: 'pending' | 'completed';
  reward: number;
}

interface Discount {
  id: number;
  amount: number;
  reason: string;
  date: string;
  used: boolean;
  code: string;
}

export default function ReferralSystem() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'referrals' | 'discounts'>('referrals');
  const [copied, setCopied] = useState(false);
  const [totalReward, setTotalReward] = useState(0);
  const [availableDiscount, setAvailableDiscount] = useState(0);
  
  // بارگذاری داده‌ها
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement API endpoints
        // const referralsResponse = await fetch('/api/user/referrals');
        // const discountsResponse = await fetch('/api/user/discounts');
        
        // For now, load from localStorage as fallback
        if (typeof window !== 'undefined') {
          const savedReferrals = localStorage.getItem('userReferrals');
          const savedDiscounts = localStorage.getItem('userDiscounts');
          
          if (savedReferrals && savedDiscounts) {
            setReferrals(JSON.parse(savedReferrals));
            setDiscounts(JSON.parse(savedDiscounts));
            
            // محاسبه جوایز و تخفیف‌های موجود
            const totalRewardAmount = JSON.parse(savedReferrals)
              .filter((ref: Referral) => ref.status === 'completed')
              .reduce((sum: number, ref: Referral) => sum + ref.reward, 0);
              
            const availableDiscountAmount = JSON.parse(savedDiscounts)
              .filter((disc: Discount) => !disc.used)
              .reduce((sum: number, disc: Discount) => sum + disc.amount, 0);
              
            setTotalReward(totalRewardAmount);
            setAvailableDiscount(availableDiscountAmount);
          } else {
            setReferrals([]);
            setDiscounts([]);
            setTotalReward(0);
            setAvailableDiscount(0);
          }
        }
        
      } catch (error) {
        console.error('Error fetching referral data:', error);
        setReferrals([]);
        setDiscounts([]);
        setTotalReward(0);
        setAvailableDiscount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // کپی کردن کد معرف
  const copyReferralCode = () => {
    if (user?.referralCode && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // اشتراک‌گذاری کد معرف
  const shareReferralCode = () => {
    if (user?.referralCode && typeof navigator !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: 'کد معرف من در فروشگاه برنج داودی',
          text: `با استفاده از کد معرف ${user.referralCode} از فروشگاه برنج داودی خرید کنید و هر دو تخفیف بگیریم!`,
          url: window.location.origin
        }).catch(err => console.error('Error sharing:', err));
      } else {
        copyReferralCode();
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-textPrimary mb-6 flex items-center">
        <Gift className="ml-2" />
        سیستم معرفی و پاداش
      </h2>
      
      {/* کارت کد معرف */}
      <div className="bg-surface rounded-lg p-4 shadow-sm mb-6 border border-divider">
        <h3 className="font-semibold text-textPrimary mb-3">کد معرف شما</h3>
        <div className="bg-background rounded-lg p-4 flex justify-between items-center">
          <span className="font-bold text-lg text-primary tracking-widest">
            {user?.referralCode}
          </span>
          <div className="flex space-x-2 space-x-reverse">
            <button 
              onClick={copyReferralCode}
              className="p-2 hover:bg-surface rounded-full text-textSecondary"
              aria-label="کپی کردن کد"
            >
              {copied ? <Check size={20} className="text-success" /> : <Copy size={20} />}
            </button>
            <button 
              onClick={shareReferralCode}
              className="p-2 hover:bg-surface rounded-full text-textSecondary"
              aria-label="اشتراک‌گذاری کد"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
        <p className="text-sm text-textSecondary mt-3">
          با معرفی دوستان خود به فروشگاه برنج داودی، هر دو از تخفیف ۵۰,۰۰۰ تومانی بهره‌مند شوید.
        </p>
      </div>
      
      {/* خلاصه اطلاعات */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-lg p-4 shadow-sm border border-divider">
          <div className="flex items-center mb-2">
            <Users size={18} className="ml-2 text-primary" />
            <span className="text-sm text-textSecondary">کل پاداش‌ها</span>
          </div>
          <p className="font-bold text-lg text-textPrimary">{formatPrice(totalReward)} تومان</p>
        </div>
        <div className="bg-surface rounded-lg p-4 shadow-sm border border-divider">
          <div className="flex items-center mb-2">
            <Gift size={18} className="ml-2 text-primary" />
            <span className="text-sm text-textSecondary">تخفیف موجود</span>
          </div>
          <p className="font-bold text-lg text-textPrimary">{formatPrice(availableDiscount)} تومان</p>
        </div>
      </div>
      
      {/* تب‌ها */}
      <div className="mb-6">
        <div className="flex border-b border-divider">
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'referrals' ? 'text-primary border-b-2 border-primary' : 'text-textSecondary'}`}
            onClick={() => setActiveTab('referrals')}
          >
            معرفی‌های من
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'discounts' ? 'text-primary border-b-2 border-primary' : 'text-textSecondary'}`}
            onClick={() => setActiveTab('discounts')}
          >
            تخفیف‌های من
          </button>
        </div>
      </div>
      
      {/* محتوای تب */}
      <div>
        {activeTab === 'referrals' ? (
          <div className="space-y-4">
            {referrals.length > 0 ? (
              referrals.map(referral => (
                <div key={referral.id} className="bg-surface rounded-lg p-4 shadow-sm border border-divider">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-textPrimary">{referral.referredUser}</p>
                      <p className="text-xs text-textSecondary mt-1">{referral.date}</p>
                    </div>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${referral.status === 'completed' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}
                    `}>
                      {referral.status === 'completed' ? 'تکمیل شده' : 'در انتظار'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-textSecondary">پاداش:</span>
                    <span className="font-semibold text-primary">{formatPrice(referral.reward)} تومان</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-background rounded-lg">
                <Gift size={40} className="mx-auto mb-3 text-textSecondary opacity-50" />
                <p className="text-textSecondary">هنوز کسی را معرفی نکرده‌اید.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {discounts.length > 0 ? (
              discounts.map(discount => (
                <div key={discount.id} className="bg-surface rounded-lg p-4 shadow-sm border border-divider">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-textPrimary">{discount.reason}</p>
                      <p className="text-xs text-textSecondary mt-1">{discount.date}</p>
                    </div>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${discount.used ? 'bg-gray-100 text-textSecondary' : 'bg-success bg-opacity-10 text-success'}
                    `}>
                      {discount.used ? 'استفاده شده' : 'قابل استفاده'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-textSecondary">کد تخفیف:</p>
                    <div className="bg-background rounded p-2 mt-1 flex justify-between items-center">
                      <span className="font-medium text-textPrimary">{discount.code}</span>
                      {!discount.used && (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(discount.code);
                            alert('کد تخفیف کپی شد');
                          }}
                          className="text-primary"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-textSecondary">مبلغ تخفیف:</span>
                    <span className="font-semibold text-primary">{formatPrice(discount.amount)} تومان</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-background rounded-lg">
                <Gift size={40} className="mx-auto mb-3 text-textSecondary opacity-50" />
                <p className="text-textSecondary">هنوز تخفیفی دریافت نکرده‌اید.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
