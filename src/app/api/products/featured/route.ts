import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const featuredProducts = await prisma.item.findMany({
      where: {
        featured: true
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      take: 3
    });

    return NextResponse.json({
      success: true,
      data: featuredProducts
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در بارگذاری محصولات ویژه' },
      { status: 500 }
    );
  }
}
