import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Check if user is admin
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'دسترسی غیرمجاز' },
        { status: 403 }
      );
    }
    
    // Get all referrals with related users
    const referrals = await prisma.referral.findMany({
      include: {
        referrer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        },
        referredUser: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Calculate stats
    const total = referrals.length;
    const activated = referrals.filter(r => r.status === 'activated').length;
    const pending = total - activated;
    const conversionRate = total > 0 ? Math.round((activated / total) * 100) : 0;
    
    return NextResponse.json({
      success: true,
      data: {
        referrals,
        stats: {
          total,
          pending,
          activated,
          conversionRate
        }
      }
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت اطلاعات معرفی‌ها' },
      { status: 500 }
    );
  }
}

