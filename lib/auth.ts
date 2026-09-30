import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
import { db } from './db';
import bcrypt from 'bcryptjs';

const COOKIE = 'resume_session';
const SESSION_TTL = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error('AUTH_SECRET must be configured');
  return value;
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url');
}

function verify(value: string) {
  const [userId, signature] = value.split('.');
  if (!userId || !signature) return null;
  const expected = sign(userId);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  return userId;
}

export async function signIn(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null;
  (await cookies()).set(COOKIE, `${user.id}.${sign(user.id)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL,
    path: '/',
  });
  return user;
}

export async function signOut() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser() {
  const raw = (await cookies()).get(COOKIE)?.value;
  const id = raw ? verify(raw) : null;
  return id
    ? db.user.findUnique({
        where: { id },
        include: { profile: { include: { links: true, experiences: true, projects: true, educations: true, certifications: true, skills: true } } },
      })
    : null;
}
