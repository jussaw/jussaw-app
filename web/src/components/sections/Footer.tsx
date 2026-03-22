import { siteContent } from "@/data/content";

interface FooterProps {
  id?: string;
}

export default function Footer({ id }: FooterProps = {}) {
  const { person, hostingNote } = siteContent;

  return (
    <footer
      id={id}
      className="px-6 py-8 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          © {new Date().getFullYear()} {person.name}
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {hostingNote}
        </p>
      </div>
    </footer>
  );
}
