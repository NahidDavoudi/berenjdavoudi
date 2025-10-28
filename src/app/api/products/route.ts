import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');
    
    // Build query conditions
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    // Get products
    const products = await prisma.item.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت محصولات' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'دسترسی غیرمجاز' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { name, price, description, stock, imageUrl, categoryId, featured, discount } = body;
    
    // Validate required fields
    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'نام، قیمت و دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }
    
    // Create product
    const product = await prisma.item.create({
      data: {
        name,
        price: parseInt(price),
        description,
        stock: parseInt(stock) || 0,
        imageUrl,
        categoryId: parseInt(categoryId),
        featured: featured === true,
        discount: parseInt(discount) || 0
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت ایجاد شد',
      data: product
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد محصول' },
      { status: 500 }
    );
  }
}