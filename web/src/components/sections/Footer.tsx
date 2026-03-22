import { siteContent } from "@/data/content";

interface FooterProps {
  id?: string;
}

export default function Footer({ id }: FooterProps = {}) {
  const { hostingNote } = siteContent;

  return (
    <footer
      id={id}
      className="px-6 py-8 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center w-full">
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {hostingNote}
        </p>
      </div>
    </footer>
  );
}
