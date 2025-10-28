'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2 } from 'react-feather';
import { useAuth } from '@/lib/hooks/useAuth';

interface Address {
  id: number;
  title: string;
  fullAddress: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressManager() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  
  // فرم جدید
  const [title, setTitle] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  // بارگذاری آدرس‌ها
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        // در یک اپلیکیشن واقعی، این یک درخواست API خواهد بود
        // const response = await fetch('/api/user/addresses');
        // const data = await response.json();
        
        // ذخیره در localStorage برای استفاده بعدی
        if (typeof window !== 'undefined') {
          const savedAddresses = localStorage.getItem('userAddresses');
          if (savedAddresses) {
            setAddresses(JSON.parse(savedAddresses));
          } else {
            setAddresses([]);
          }
        } else {
          setAddresses([]);
        }
        
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAddresses();
  }, []);
  
  // ذخیره آدرس‌ها در localStorage هر بار که تغییر می‌کنند
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      localStorage.setItem('userAddresses', JSON.stringify(addresses));
    }
  }, [addresses, isLoading]);
  
  // افزودن آدرس جدید
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    
    // اگر آدرس پیش‌فرض است، همه آدرس‌های دیگر را غیر پیش‌فرض کنیم
    let updatedAddresses = [...addresses];
    if (isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    // آدرس جدید
    const newAddress: Address = {
      id: Date.now(),
      title,
      fullAddress,
      postalCode,
      isDefault
    };
    
    // اگر هیچ آدرسی وجود ندارد، این آدرس پیش‌فرض است
    if (addresses.length === 0) {
      newAddress.isDefault = true;
    }
    
    setAddresses([...updatedAddresses, newAddress]);
    resetForm();
    setShowAddForm(false);
  };
  
  // ویرایش آدرس
  const handleEditAddress = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddressId === null) return;
    
    // اگر آدرس پیش‌فرض است، همه آدرس‌های دیگر را غیر پیش‌فرض کنیم
    let updatedAddresses = [...addresses];
    if (isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: false
      }));
    }
    
    // به‌روزرسانی آدرس
    updatedAddresses = updatedAddresses.map(addr => 
      addr.id === editingAddressId 
        ? { ...addr, title, fullAddress, postalCode, isDefault } 
        : addr
    );
    
    setAddresses(updatedAddresses);
    resetForm();
    setEditingAddressId(null);
  };
  
  // حذف آدرس
  const handleDeleteAddress = (id: number) => {
    // آیا آدرس پیش‌فرض است؟
    const isDefaultAddress = addresses.find(addr => addr.id === id)?.isDefault;
    
    // حذف آدرس
    let updatedAddresses = addresses.filter(addr => addr.id !== id);
    
    // اگر آدرس پیش‌فرض حذف شده و آدرس دیگری وجود دارد، اولین آدرس را پیش‌فرض کنیم
    if (isDefaultAddress && updatedAddresses.length > 0) {
      updatedAddresses = [
        { ...updatedAddresses[0], isDefault: true },
        ...updatedAddresses.slice(1)
      ];
    }
    
    setAddresses(updatedAddresses);
  };
  
  // شروع ویرایش آدرس
  const startEditAddress = (address: Address) => {
    setTitle(address.title);
    setFullAddress(address.fullAddress);
    setPostalCode(address.postalCode);
    setIsDefault(address.isDefault);
    setEditingAddressId(address.id);
    setShowAddForm(true);
  };
  
  // تنظیم آدرس پیش‌فرض
  const setDefaultAddress = (id: number) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    
    setAddresses(updatedAddresses);
  };
  
  // ریست کردن فرم
  const resetForm = () => {
    setTitle('');
    setFullAddress('');
    setPostalCode('');
    setIsDefault(false);
  };
  
  // لغو فرم
  const cancelForm = () => {
    resetForm();
    setShowAddForm(false);
    setEditingAddressId(null);
  };
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-textPrimary mb-6 flex items-center">
        <MapPin className="ml-2" />
        آدرس‌های من
      </h2>
      
      {/* لیست آدرس‌ها */}
      {addresses.length > 0 ? (
        <div className="space-y-4 mb-6">
          {addresses.map(address => (
            <div 
              key={address.id} 
              className={`
                bg-surface rounded-lg p-4 shadow-sm border-2
                ${address.isDefault ? 'border-primary' : 'border-transparent'}
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold text-textPrimary">{address.title}</h3>
                    {address.isDefault && (
                      <span className="mr-2 bg-primary bg-opacity-10 text-primary text-xs px-2 py-0.5 rounded-full">
                        پیش‌فرض
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-textSecondary mt-1">{address.fullAddress}</p>
                  <p className="text-sm text-textSecondary mt-1">کد پستی: {address.postalCode}</p>
                </div>
                
                <div className="flex space-x-2 space-x-reverse">
                  <button 
                    onClick={() => startEditAddress(address)}
                    className="p-2 hover:bg-background rounded-full text-textSecondary"
                    aria-label="ویرایش"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 hover:bg-background rounded-full text-error"
                    aria-label="حذف"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              {!address.isDefault && (
                <button 
                  onClick={() => setDefaultAddress(address.id)}
                  className="mt-3 text-sm text-primary font-medium"
                >
                  تنظیم به عنوان آدرس پیش‌فرض
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-background rounded-lg mb-6">
          <p className="text-textSecondary">هنوز آدرسی ثبت نکرده‌اید.</p>
        </div>
      )}
      
      {/* دکمه افزودن آدرس */}
      {!showAddForm ? (
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center bg-surface border-2 border-dashed border-border rounded-lg p-4 text-textSecondary hover:bg-background transition-colors"
        >
          <Plus size={20} className="ml-2" />
          افزودن آدرس جدید
        </button>
      ) : (
        <div className="bg-surface rounded-lg p-4 shadow-sm border border-border">
          <h3 className="font-semibold text-textPrimary mb-4">
            {editingAddressId ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
          </h3>
          
          <form onSubmit={editingAddressId ? handleEditAddress : handleAddAddress} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">عنوان آدرس</label>
              <input 
                type="text" 
                placeholder="مثال: منزل، محل کار" 
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">آدرس کامل</label>
              <textarea 
                placeholder="آدرس کامل خود را وارد کنید" 
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">کد پستی</label>
              <input 
                type="text" 
                placeholder="کد پستی 10 رقمی" 
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                pattern="[0-9]{10}"
                title="کد پستی باید 10 رقم باشد"
              />
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="isDefault" 
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <label htmlFor="isDefault" className="mr-2 text-sm text-textPrimary">
                تنظیم به عنوان آدرس پیش‌فرض
              </label>
            </div>
            
            <div className="flex space-x-3 space-x-reverse pt-2">
              <button 
                type="submit" 
                className="bg-primary text-textOnPrimary px-4 py-2 rounded-lg text-sm font-medium"
              >
                {editingAddressId ? 'ذخیره تغییرات' : 'افزودن آدرس'}
              </button>
              <button 
                type="button" 
                onClick={cancelForm}
                className="bg-surface border border-border text-textPrimary px-4 py-2 rounded-lg text-sm font-medium"
              >
                انصراف
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
