import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="h-screen overflow-hidden flex flex-col items-center justify-center gap-4 px-6 bg-bg text-text-primary">
      <p className="text-8xl font-bold tracking-tight text-text-secondary font-sans">404</p>
      <p className="text-base text-text-secondary font-sans">This page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-2 text-sm underline underline-offset-4 hover:opacity-70 transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none rounded-sm text-accent font-sans"
      >
        Back to home
      </Link>
    </main>
  );
}
