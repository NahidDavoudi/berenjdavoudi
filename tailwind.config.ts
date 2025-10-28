import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['Vazirmatn', 'sans-serif']
      },
      colors: {
        // رنگ‌های جدید بر اساس JSON Design System
        'primary': '#162660',       // Royal
        'secondary': '#d0e6fd',     // Powder Blue
        'background': '#f1e4d1',    // Cream
        'surface': '#FFFFFF',
        'accent': '#FFC93C',
        'textPrimary': '#333333',
        'textSecondary': '#666666',
        'textOnPrimary': '#FFFFFF',
        'textOnSecondary': '#162660',
        'border': '#E0E0E0',
        'divider': '#EEEEEE',
        'success': '#4CAF50',
        'error': '#F44336',
        'warning': '#FF9800',
        'info': '#2196F3',
        
        // رنگ‌های قبلی برای سازگاری با کد موجود
        'milky': '#cbced4',
        'lime': '#eef5bf',
        'blue': '#162660',  // تغییر به رنگ اصلی جدید
        'green': '#435938',
        'warm-gray': '#6b7280',
        'text-primary': '#333333',  // تغییر به رنگ متن جدید
        'text-secondary': '#666666'  // تغییر به رنگ متن ثانویه جدید
      }
    },
  },
  plugins: [],
}

export default config
