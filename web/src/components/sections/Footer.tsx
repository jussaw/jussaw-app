import { siteContent } from '@/data/content';

interface FooterProps {
  id?: string;
}

export default function Footer({ id }: FooterProps = {}) {
  const { hostingNote } = siteContent;

  return (
    <footer
      id={id}
      className="px-6 py-8 border-t"
      style={{
        borderColor: 'color-mix(in srgb, var(--color-border) 80%, transparent)',
      }}
    >
      <div className="max-w-4xl mx-auto flex justify-center w-full">
        <p className="text-xs text-text-secondary">{hostingNote}</p>
      </div>
    </footer>
  );
}
