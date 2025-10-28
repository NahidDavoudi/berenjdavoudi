'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'react-feather';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function Notification({
  type = 'info',
  message,
  description,
  onClose,
  autoClose = true,
  duration = 5000
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // انیمیشن ورود
    const enterTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    // بستن خودکار
    let closeTimeout: NodeJS.Timeout;
    if (autoClose) {
      closeTimeout = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      clearTimeout(enterTimeout);
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [autoClose, duration]);

  // خروج با انیمیشن
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // آیکون بر اساس نوع نوتیفیکیشن
  const renderIcon = () => {
    const iconProps = { size: 20, className: 'ml-2' };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-success" />;
      case 'error':
        return <AlertCircle {...iconProps} className="text-error" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="text-warning" />;
      case 'info':
      default:
        return <Info {...iconProps} className="text-info" />;
    }
  };

  // رنگ حاشیه بر اساس نوع نوتیفیکیشن
  const getBorderColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'warning': return '#FF9800';
      case 'info':
      default: return '#2196F3';
    }
  };

  // رنگ پس‌زمینه آیکون بر اساس نوع نوتیفیکیشن
  const getIconBgColor = () => {
    switch (type) {
      case 'success': return 'bg-success bg-opacity-10';
      case 'error': return 'bg-error bg-opacity-10';
      case 'warning': return 'bg-warning bg-opacity-10';
      case 'info':
      default: return 'bg-info bg-opacity-10';
    }
  };

  return (
    <div
      className={`
        bg-surface shadow-md rounded-lg p-4 flex items-center gap-3
        transition-all duration-300 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
        ${isExiting ? 'opacity-0 translate-y-4' : ''}
      `}
      style={{
        maxWidth: '350px',
        borderRight: `4px solid ${getBorderColor()}`
      }}
    >
      <div className={`rounded-full p-2 ${getIconBgColor()}`}>
        {renderIcon()}
      </div>

      <div className="flex-1">
        <h4 className="font-medium text-textPrimary">{message}</h4>
        {description && <p className="text-sm text-textSecondary">{description}</p>}
      </div>

      <button
        onClick={handleClose}
        className="p-2 hover:bg-background rounded-full"
        aria-label="بستن"
      >
        <X size={18} className="text-textSecondary" />
      </button>
    </div>
  );
}
