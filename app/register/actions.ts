'use server';

import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';

const registration = z.object({
  name: z.string().trim().min(1).max(100),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{3,30}$/),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
});

export async function register(formData: FormData) {
  const parsed = registration.safeParse({
    name: formData.get('name'),
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) redirect('/register?error=validation');

  try {
    await db.user.create({
      data: {
        email: parsed.data.email,
        passwordHash: await bcrypt.hash(parsed.data.password, 12),
        profile: {
          create: {
            username: parsed.data.username,
            name: parsed.data.name,
            headline: '',
            email: parsed.data.email,
            summary: '',
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      redirect('/register?error=exists');
    }
    throw error;
  }

  redirect('/login');
}
