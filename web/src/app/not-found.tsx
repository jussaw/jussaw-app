export default function NotFound() {
  return (
    <main
      className="h-screen overflow-hidden flex flex-col items-center justify-center gap-4 px-6"
      style={{ background: "var(--color-bg)", color: "var(--color-text-primary)" }}
    >
      <p
        className="text-8xl font-bold tracking-tight"
        style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
      >
        404
      </p>
      <p
        className="text-base"
        style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}
      >
        This page doesn&apos;t exist.
      </p>
      <a
        href="/"
        className="mt-2 text-sm underline underline-offset-4 hover:opacity-70 transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none rounded-sm"
        style={{ color: "var(--color-accent)", fontFamily: "var(--font-sans)" }}
      >
        Back to home
      </a>
    </main>
  );
}
