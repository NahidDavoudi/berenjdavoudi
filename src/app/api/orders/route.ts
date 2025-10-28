import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateDiscount } from '@/lib/utils';
import { sendOrderNotification } from '@/lib/telegram';

export async function GET(request: Request) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'کاربر احراز هویت نشده است' },
        { status: 401 }
      );
    }
    
    // Build query
    const query: any = {};
    
    // If not admin, only show user's orders
    if (userRole !== 'admin') {
      query.where = { userId: parseInt(userId) };
    }
    
    // Include related data
    query.include = {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true
        }
      },
      items: {
        include: {
          product: true
        }
      }
    };
    
    query.orderBy = { createdAt: 'desc' };
    
    // Get orders
    const orders = await prisma.order.findMany(query);
    
    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت سفارشات' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'کاربر احراز هویت نشده است' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { items, address, paymentMethod } = body;
    
    // Validate required fields
    if (!items || !items.length || !address) {
      return NextResponse.json(
        { success: false, message: 'اطلاعات سفارش ناقص است' },
        { status: 400 }
      );
    }
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        referralsAsReferred: {
          where: { status: 'pending' },
          include: { referrer: true }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }
    
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Check product availability and calculate total
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await tx.item.findUnique({
          where: { id: item.id }
        });
        
        if (!product) {
          throw new Error(`محصول با شناسه ${item.id} یافت نشد`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`موجودی محصول ${product.name} کافی نیست`);
        }
        
        // Calculate item total
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        
        // Prepare order item
        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price
        });
        
        // Update product stock
        await tx.item.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity }
        });
      }
      
      // Check if this is the user's first order
      const previousOrders = await tx.order.count({
        where: { userId: user.id }
      });
      
      const isFirstOrder = previousOrders === 0;
      
      // Apply discounts
      let discountApplied = 0;
      let finalAmount = totalAmount;
      
      // Check for first purchase discount (5%)
      if (isFirstOrder && user.referralsAsReferred.length > 0) {
        discountApplied = calculateDiscount(totalAmount, 5);
        finalAmount = totalAmount - discountApplied;
        
        // Update referral status to activated
        const referral = user.referralsAsReferred[0];
        await tx.referral.update({
          where: { id: referral.id },
          data: { status: 'activated' }
        });
        
        // Add discount credit to referrer (5% of the order total)
        const referrerDiscount = calculateDiscount(totalAmount, 5);
        await tx.user.update({
          where: { id: referral.referrer.id },
          data: {
            totalDiscountEarned: {
              increment: referrerDiscount
            }
          }
        });
        
        // Create discount record for tracking
        await tx.discount.create({
          data: {
            userId: referral.referrer.id,
            amount: referrerDiscount,
            reason: `پاداش معرفی کاربر ${user.name}`
          }
        });
      }
      // Check if user has earned discount from referrals
      else if (user.totalDiscountEarned > 0) {
        // Use the earned discount, but don't exceed the order total
        discountApplied = Math.min(user.totalDiscountEarned, totalAmount);
        finalAmount = totalAmount - discountApplied;
        
        // Reset user's discount balance
        await tx.user.update({
          where: { id: user.id },
          data: { totalDiscountEarned: 0 }
        });
      }
      
      // Create order
      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount,
          discountApplied,
          finalAmount,
          address,
          paymentMethod: paymentMethod || 'cod',
          items: {
            create: orderItems
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              referredById: true
            }
          },
          items: {
            include: {
              product: true
            }
          }
        }
      });
      
      return order;
    });
    
    // Send Telegram notification
    try {
      await sendOrderNotification(result);
    } catch (notificationError) {
      console.error('Failed to send Telegram notification:', notificationError);
      // Don't fail the request if notification fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'سفارش با موفقیت ثبت شد',
      data: {
        orderId: result.id,
        discountApplied: result.discountApplied,
        finalAmount: result.finalAmount
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'خطا در ثبت سفارش' },
      { status: 500 }
    );
  }
}