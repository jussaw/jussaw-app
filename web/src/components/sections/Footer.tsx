import { siteContent } from "@/data/content";

interface FooterProps {
  id?: string;
}

export default function Footer({ id }: FooterProps = {}) {
  const { person } = siteContent;

  return (
    <footer
      id={id}
      className="px-6 py-12 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          © {new Date().getFullYear()} {person.name}
        </p>
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${person.email}`}
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Email
          </a>
          <a
            href={person.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-text-secondary)" }}
          >
            GitHub
          </a>
          <a
            href={person.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-text-secondary)" }}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
