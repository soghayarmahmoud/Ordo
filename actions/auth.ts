'use server';

import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';

export interface SignupResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

export async function signupUser(formData: FormData): Promise<SignupResponse> {
  try {
    const name = formData.get('name') as string | null;
    const emailRaw = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;

    if (!emailRaw || !password) {
      return {
        success: false,
        error: 'Email and password are required to create an account.',
      };
    }

    const email = emailRaw.toLowerCase().trim();

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address.',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long.',
      };
    }

    // Check if duplicate email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    // Securely hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save the new user to PostgreSQL via Prisma
    const newUser = await prisma.user.create({
      data: {
        name: name?.trim() || email.split('@')[0],
        email,
        password: hashedPassword,
        role: 'MEMBER',
        status: 'focus',
        bio: 'Architect of high-performance workflows.',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      success: true,
      user: newUser,
    };
  } catch (error: any) {
    console.error('[Auth Action Error - Signup]:', error);

    // Handle Prisma unique constraint violation gracefully (e.g. race condition)
    if (error?.code === 'P2002') {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    return {
      success: false,
      error: error.message || 'An unexpected error occurred while creating your account.',
    };
  }
}
