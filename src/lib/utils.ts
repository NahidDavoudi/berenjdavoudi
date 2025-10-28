import prisma from './prisma';

/**
 * Format a number as a price in Iranian Rials/Tomans
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR');
}

/**
 * Generate a unique referral code
 */
export async function generateReferralCode(): Promise<string> {
  // Generate a random 6-character alphanumeric code
  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  
  let referralCode = generateRandomCode();
  let isUnique = false;
  
  // Keep generating until we find a unique code
  while (!isUnique) {
    // Check if code exists
    const existingUser = await prisma.user.findUnique({
      where: { referralCode }
    });
    
    if (!existingUser) {
      isUnique = true;
    } else {
      referralCode = generateRandomCode();
    }
  }
  
  return referralCode;
}

/**
 * Calculate discount amount based on total
 * @param total - The total amount before discount
 * @param percentage - Discount percentage (e.g., 5 for 5%)
 */
export function calculateDiscount(total: number, percentage: number): number {
  return Math.round((total * percentage) / 100);
}

/**
 * Format a date to a Persian date string
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('fa-IR');
}

/**
 * Check if a string is a valid phone number
 */
export function isValidPhone(phone: string): boolean {
  // Simple validation for Iranian phone numbers
  return /^09\d{9}$/.test(phone);
}

/**
 * Check if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Share content using Web Share API or fallback to clipboard
 */
export function shareContent(title: string, text: string, url: string): void {
  if (typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({
      title,
      text,
      url
    }).catch(err => {
      console.error('Error sharing:', err);
      // Fallback to copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
        alert('پیام کپی شد');
      }
    });
  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
    // Fallback to clipboard
    navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
    alert('پیام کپی شد');
  }
}