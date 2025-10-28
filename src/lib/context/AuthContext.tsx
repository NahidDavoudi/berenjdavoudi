'use client';

import React, { createContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  register: (name: string, phone: string, password: string, referral?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => null,
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse user from localStorage:', e);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<User | null> => {
    try {
      // برای نام کاربری و رمز عبور ادمین، کاربر ادمین را برمی‌گردانیم
      if (username === 'admin' && password === 'mhmd5076') {
        const adminUser = {
          id: 0,
          name: 'مدیر سیستم',
          email: 'admin@example.com',
          phone: '09000000000',
          isAdmin: true,
          referralCode: ''
        };
        
        setUser(adminUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(adminUser));
        }
        
        return adminUser;
      }
      
      // In a real app, this would be an API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();
      const userData = result.data;
      
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, phone: string, password: string, referral?: string) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password, referral }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      // Registration successful, but user still needs to login
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    // In a real app, this would also call an API endpoint
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      // In a real app, this would be an API call
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Profile update failed');
      }

      // Update the user in state and localStorage
      if (user) {
        const updatedUser = { ...user, name, email };
        setUser(updatedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
