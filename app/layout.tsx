import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Resume Studio',
  description: 'Build and publish a polished resume',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="no-print border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold text-blue-600">Resume Studio</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/login">Sign in</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
