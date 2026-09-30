import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

const validators = {
  links: z.object({ label: z.string().min(1).max(40), url: z.string().url() }),
  experiences: z.object({ company: z.string().min(1).max(120), role: z.string().min(1).max(120), location: z.string().max(120).optional(), startDate: z.string().min(1).max(30), endDate: z.string().max(30).optional(), bullets: z.array(z.string().min(1).max(500)).max(12) }),
  projects: z.object({ name: z.string().min(1).max(120), url: z.string().url().optional().or(z.literal('')), description: z.string().max(1000), bullets: z.array(z.string().min(1).max(500)).max(12) }),
  educations: z.object({ institution: z.string().min(1).max(120), degree: z.string().min(1).max(120), location: z.string().max(120).optional(), startDate: z.string().min(1).max(30), endDate: z.string().max(30).optional(), details: z.string().max(1000).optional() }),
  certifications: z.object({ title: z.string().min(1).max(160), issuer: z.string().min(1).max(120), url: z.string().url().optional().or(z.literal('')) }),
  skills: z.object({ name: z.string().min(1).max(60) }),
} as const;
const modelFor = { links: 'link', experiences: 'experience', projects: 'project', educations: 'education', certifications: 'certification', skills: 'skill' } as const;
type Resource = keyof typeof validators;

async function context(resource: string) {
  const user = await currentUser();
  if (!user?.profile || !(resource in validators)) return null;
  return { user, profileId: user.profile.id, resource: resource as Resource };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const ctx = await context(resource);
  if (!ctx) return NextResponse.json({ error: 'Unauthorized or unsupported resource' }, { status: 401 });
  const parsed = validators[ctx.resource].safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid resource data', issues: parsed.error.flatten() }, { status: 422 });
  const model = (db as Record<string, any>)[modelFor[ctx.resource]];
  const item = await model.create({ data: { ...parsed.data, profileId: ctx.profileId } });
  return NextResponse.json(item, { status: 201 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const ctx = await context(resource);
  if (!ctx) return NextResponse.json({ error: 'Unauthorized or unsupported resource' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  const parsed = validators[ctx.resource].partial().safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid resource data', issues: parsed.error.flatten() }, { status: 422 });
  const model = (db as Record<string, any>)[modelFor[ctx.resource]];
  const item = await model.updateMany({ where: { id, profileId: ctx.profileId }, data: parsed.data });
  if (!item.count) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const ctx = await context(resource);
  if (!ctx) return NextResponse.json({ error: 'Unauthorized or unsupported resource' }, { status: 401 });
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  const model = (db as Record<string, any>)[modelFor[ctx.resource]];
  const item = await model.deleteMany({ where: { id, profileId: ctx.profileId } });
  if (!item.count) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
