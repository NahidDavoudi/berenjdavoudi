import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت دسته‌بندی‌ها' },
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
    const { name, description, imageUrl } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'نام دسته‌بندی الزامی است' },
        { status: 400 }
      );
    }
    
    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        description,
        imageUrl
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'دسته‌بندی با موفقیت ایجاد شد',
      data: category
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ایجاد دسته‌بندی' },
      { status: 500 }
    );
  }
}

