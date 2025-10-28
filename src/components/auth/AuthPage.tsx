'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerReferral, setRegisterReferral] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // اگر نام کاربری و رمز عبور admin باشد، مستقیم به پنل ادمین هدایت می‌شود
      if (loginUsername === 'admin' && loginPassword === 'mhmd5076') {
        await login(loginUsername, loginPassword);
        router.push('/admin');
        return;
      }
      
      const result = await login(loginUsername, loginPassword);
      
      // اگر کاربر ادمین است، به پنل ادمین هدایت می‌شود
      if (result && result.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/profile');
      }
      
      // نمایش نوتیفیکیشن موفقیت
      showSuccessNotification();
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'خطا در ورود. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // نمایش نوتیفیکیشن موفقیت
  const showSuccessNotification = () => {
    // در اینجا می‌توانید از کامپوننت Notification استفاده کنید
    // یا از یک state برای نمایش نوتیفیکیشن استفاده کنید
    const event = new CustomEvent('show-notification', { 
      detail: {
        type: 'success',
        message: 'ورود موفقیت‌آمیز',
        description: 'خوش آمدید!'
      }
    });
    window.dispatchEvent(event);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await register(registerName, registerPhone, registerPassword, registerReferral);
      alert('ثبت نام موفق! اکنون میتوانید وارد شوید.');
      setIsLogin(true);
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || 'خطا در ثبت نام. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-lime to-green rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">ب</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">ورود / ثبت نام</h2>
        <p className="text-text-secondary">برای ادامه خرید وارد حساب کاربری خود شوید</p>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {isLogin ? (
        <div>
          <div className="bg-gradient-to-r from-lime/30 to-green/20 backdrop-blur-md rounded-xl p-4 shadow-md">
            <h3 className="font-semibold mb-4 text-text-primary">ورود به حساب</h3>
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">شماره تماس یا ایمیل</label>
                <input 
                  type="text" 
                  placeholder="09123456789" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">رمز عبور</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full btn-primary py-3 rounded-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'در حال ورود...' : 'ورود'}
              </button>
            </form>
          </div>
          <div className="text-center mt-4">
            <p className="text-text-secondary text-sm">
              حساب کاربری ندارید؟{' '}
              <button 
                onClick={() => setIsLogin(false)} 
                className="text-blue font-semibold"
              >
                ثبت نام کنید
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-gradient-to-r from-lime/30 to-green/20 backdrop-blur-md rounded-xl p-4 shadow-md">
            <h3 className="font-semibold mb-4 text-text-primary">ثبت نام</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">نام و نام خانوادگی</label>
                <input 
                  type="text" 
                  placeholder="نام کامل خود را وارد کنید" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">شماره تماس</label>
                <input 
                  type="tel" 
                  placeholder="09123456789" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">رمز عبور</label>
                <input 
                  type="password" 
                  placeholder="حداقل ۶ کاراکتر" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">کد معرف (اختیاری)</label>
                <input 
                  type="text" 
                  placeholder="کد معرف را وارد کنید" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent"
                  value={registerReferral}
                  onChange={(e) => setRegisterReferral(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="w-full btn-primary py-3 rounded-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'در حال ثبت نام...' : 'ثبت نام'}
              </button>
            </form>
          </div>
          <div className="text-center mt-4">
            <p className="text-text-secondary text-sm">
              قبلاً ثبت نام کرده‌اید؟{' '}
              <button 
                onClick={() => setIsLogin(true)} 
                className="text-blue font-semibold"
              >
                وارد شوید
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
