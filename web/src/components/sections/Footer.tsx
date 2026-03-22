import { siteContent } from "@/data/content";

interface FooterProps {
  id?: string;
  onOpenSetup?: () => void;
}

export default function Footer({ id, onOpenSetup }: FooterProps = {}) {
  const { hostingNote } = siteContent;

  return (
    <footer
      id={id}
      className="px-6 py-8 border-t"
      style={{
        borderColor: "color-mix(in srgb, var(--color-border) 80%, transparent)",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between w-full">
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {hostingNote}
        </p>
        {onOpenSetup && (
          <button
            onClick={onOpenSetup}
            className="text-xs hover:opacity-70 transition-opacity"
            aria-label="Open setup"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Setup
          </button>
        )}
      </div>
    </footer>
  );
}
