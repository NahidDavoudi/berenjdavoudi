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
    
    // Get dashboard stats
    const [
      usersCount,
      productsCount,
      ordersCount,
      totalRevenueResult,
      referralsCount,
      activatedReferralsCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          finalAmount: true
        },
        where: {
          status: 'تحویل شده'
        }
      }),
      prisma.referral.count(),
      prisma.referral.count({
        where: {
          status: 'activated'
        }
      })
    ]);
    
    // Calculate total revenue
    const totalRevenue = totalRevenueResult._sum.finalAmount || 0;
    
    return NextResponse.json({
      success: true,
      data: {
        usersCount,
        productsCount,
        ordersCount,
        totalRevenue,
        referralsCount,
        activatedReferralsCount
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت آمار داشبورد' },
      { status: 500 }
    );
  }
}

