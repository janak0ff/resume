import Link from 'next/link';
import { register } from './actions';

export default async function Register({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Create your profile</h1>
      {params.error && (
        <p className="mt-3 rounded bg-red-50 p-3 text-red-700" role="alert">
          {params.error === 'validation'
            ? 'Use a username with 3–30 lowercase letters, numbers, or hyphens and a password with at least 8 characters.'
            : 'That email or username is already in use.'}
        </p>
      )}
      <form action={register} className="mt-8 space-y-4">
        <label className="block">Name<input required name="name" className="mt-1 w-full rounded border p-3" /></label>
        <label className="block">Username<input required name="username" pattern="[a-z0-9-]{3,30}" className="mt-1 w-full rounded border p-3" /></label>
        <label className="block">Email<input required name="email" type="email" className="mt-1 w-full rounded border p-3" /></label>
        <label className="block">Password<input required minLength={8} name="password" type="password" className="mt-1 w-full rounded border p-3" /></label>
        <button className="w-full rounded bg-blue-600 p-3 font-semibold text-white">Create account</button>
      </form>
      <p className="mt-5 text-sm">Already have an account? <Link className="text-blue-600 underline" href="/login">Sign in</Link></p>
    </main>
  );
}
