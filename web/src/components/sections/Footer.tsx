import { Mail, Github, Linkedin } from 'lucide-react';
import { siteContent } from "@/data/content";

interface FooterProps {
  id?: string;
}

export default function Footer({ id }: FooterProps = {}) {
  const { person, hostingNote } = siteContent;

  return (
    <footer
      id={id}
      className="px-6 pt-12 pb-4 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            © {new Date().getFullYear()} {person.name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {hostingNote}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`mailto:${person.email}`}
              aria-label="Email"
              className="flex items-center hover:opacity-70 transition-opacity"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Mail size={18} />
            </a>
            <a
              href={person.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center hover:opacity-70 transition-opacity"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Github size={18} />
            </a>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center hover:opacity-70 transition-opacity"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <Linkedin size={18} />
            </a>
          </div>
      </div>
    </footer>
  );
}
