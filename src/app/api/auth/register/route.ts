import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateReferralCode } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, password, referralCode } = body;

    // Validate required fields
    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, message: 'نام، شماره تماس و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          { email: body.email || '' }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'کاربری با این شماره تماس یا ایمیل قبلاً ثبت شده است' },
        { status: 409 }
      );
    }

    // Generate a unique referral code
    const newReferralCode = await generateReferralCode();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data
    const userData: any = {
      name,
      phone,
      password: hashedPassword,
      referralCode: newReferralCode,
    };

    // Add email if provided
    if (body.email) {
      userData.email = body.email;
    }

    // Check if referred by someone
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode }
      });

      if (referrer) {
        userData.referredById = referrer.id;
      }
    }

    // Create user
    const newUser = await prisma.user.create({
      data: userData
    });

    // If user was referred, create referral record
    if (userData.referredById) {
      await prisma.referral.create({
        data: {
          referrerId: userData.referredById,
          referredUserId: newUser.id,
          status: 'pending'
        }
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'ثبت نام با موفقیت انجام شد',
        data: {
          id: newUser.id,
          name: newUser.name,
          referralCode: newUser.referralCode
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در ثبت نام. لطفا دوباره تلاش کنید' },
      { status: 500 }
    );
  }
}