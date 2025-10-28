'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralHandler() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if there's a referral code in the URL
    const refCode = searchParams.get('ref');
    
    if (refCode && typeof window !== 'undefined') {
      // Save referral code to localStorage
      localStorage.setItem('referralCode', refCode);
      
      // Log the referral for analytics
      console.log(`Referral tracked: ${refCode}`);
    }
  }, [searchParams]);
  
  // This component doesn't render anything
  return null;
}

