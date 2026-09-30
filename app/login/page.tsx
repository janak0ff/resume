import Link from 'next/link';
import { login } from './actions';

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Sign in</h1>
      {params.error && <p className="mt-3 rounded bg-red-50 p-3 text-red-700" role="alert">Invalid email or password.</p>}
      <form action={login} className="mt-8 space-y-4">
        <label className="block">Email<input required name="email" type="email" className="mt-1 w-full rounded border p-3" /></label>
        <label className="block">Password<input required minLength={8} name="password" type="password" className="mt-1 w-full rounded border p-3" /></label>
        <button className="w-full rounded bg-blue-600 p-3 font-semibold text-white">Sign in</button>
      </form>
      <p className="mt-5 text-sm">New here? <Link className="text-blue-600 underline" href="/register">Create an account</Link></p>
    </main>
  );
}
