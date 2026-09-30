'use server';

import { redirect } from 'next/navigation';
import { signIn } from '@/lib/auth';

export async function login(formData: FormData) {
  const user = await signIn(String(formData.get('email')), String(formData.get('password')));
  if (!user) redirect('/login?error=1');
  redirect('/dashboard');
}
