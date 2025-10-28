import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'شناسه دسته‌بندی نامعتبر است' },
        { status: 400 }
      );
    }
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        items: true
      }
    });
    
    if (!category) {
      return NextResponse.json(
        { success: false, message: 'دسته‌بندی یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error(`Error fetching category ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت اطلاعات دسته‌بندی' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'دسترسی غیرمجاز' },
        { status: 403 }
      );
    }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'شناسه دسته‌بندی نامعتبر است' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, description, imageUrl } = body;
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'دسته‌بندی یافت نشد' },
        { status: 404 }
      );
    }
    
    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'دسته‌بندی با موفقیت به‌روزرسانی شد',
      data: updatedCategory
    });
  } catch (error) {
    console.error(`Error updating category ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی دسته‌بندی' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'دسترسی غیرمجاز' },
        { status: 403 }
      );
    }
    
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'شناسه دسته‌بندی نامعتبر است' },
        { status: 400 }
      );
    }
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { items: true }
        }
      }
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, message: 'دسته‌بندی یافت نشد' },
        { status: 404 }
      );
    }
    
    // Check if category has products
    if (existingCategory._count.items > 0) {
      return NextResponse.json(
        { success: false, message: 'دسته‌بندی دارای محصول است و نمی‌تواند حذف شود' },
        { status: 400 }
      );
    }
    
    // Delete category
    await prisma.category.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'دسته‌بندی با موفقیت حذف شد'
    });
  } catch (error) {
    console.error(`Error deleting category ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف دسته‌بندی' },
      { status: 500 }
    );
  }
}

