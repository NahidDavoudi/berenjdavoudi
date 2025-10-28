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
        { success: false, message: 'شناسه محصول نامعتبر است' },
        { status: 400 }
      );
    }
    
    const product = await prisma.item.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'محصول یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت اطلاعات محصول' },
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
        { success: false, message: 'شناسه محصول نامعتبر است' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { name, price, description, stock, imageUrl, categoryId, featured, discount } = body;
    
    // Check if product exists
    const existingProduct = await prisma.item.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'محصول یافت نشد' },
        { status: 404 }
      );
    }
    
    // Update product
    const updatedProduct = await prisma.item.update({
      where: { id },
      data: {
        name: name || undefined,
        price: price !== undefined ? parseInt(price) : undefined,
        description: description !== undefined ? description : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        categoryId: categoryId !== undefined ? parseInt(categoryId) : undefined,
        featured: featured !== undefined ? featured : undefined,
        discount: discount !== undefined ? parseInt(discount) : undefined
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت به‌روزرسانی شد',
      data: updatedProduct
    });
  } catch (error) {
    console.error(`Error updating product ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی محصول' },
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
        { success: false, message: 'شناسه محصول نامعتبر است' },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const existingProduct = await prisma.item.findUnique({
      where: { id }
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'محصول یافت نشد' },
        { status: 404 }
      );
    }
    
    // Delete product
    await prisma.item.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'محصول با موفقیت حذف شد'
    });
  } catch (error) {
    console.error(`Error deleting product ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف محصول' },
      { status: 500 }
    );
  }
}