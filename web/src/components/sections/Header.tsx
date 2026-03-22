import { Mail, Github, Linkedin } from 'lucide-react';
import { siteContent } from "@/data/content";

export default function Header() {
  const { person } = siteContent;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-10 flex justify-end items-center gap-6 px-6 py-3 border-b"
      style={{
        background: "var(--color-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      <a
        href={`mailto:${person.email}`}
        className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <Mail size={15} />
        Email
      </a>
      <a
        href={person.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <Github size={15} />
        GitHub
      </a>
      <a
        href={person.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <Linkedin size={15} />
        LinkedIn
      </a>
    </header>
  );
}
