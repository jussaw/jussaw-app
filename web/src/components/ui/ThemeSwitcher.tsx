'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPalette } from 'react-icons/fa';
import { themes, DEFAULT_THEME } from '@/data/themes';

const STORAGE_KEY = 'theme';

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(() =>
    typeof window !== 'undefined'
      ? (localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME)
      : DEFAULT_THEME
  );
  const ref = useRef<HTMLDivElement>(null);

  // Apply active theme to DOM
  useEffect(() => {
    document.body.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const applyTheme = (key: string) => {
    document.body.setAttribute('data-theme', key);
    localStorage.setItem(STORAGE_KEY, key);
    setActiveTheme(key);
    setOpen(false);
  };

  const previewTheme = (key: string) => {
    document.body.setAttribute('data-theme', key);
  };

  const cancelPreview = () => {
    document.body.setAttribute('data-theme', activeTheme);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        aria-label="Switch theme"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center hover:opacity-70 transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none rounded-sm"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        <FaPalette size={18} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Theme picker"
          aria-modal="true"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 22px)',
            gap: '6px',
            zIndex: 100,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          {themes.map((t) => (
            <button
              key={t.key}
              aria-label={`Switch to ${t.key}`}
              title={t.key}
              onClick={() => applyTheme(t.key)}
              onMouseEnter={() => previewTheme(t.key)}
              onMouseLeave={cancelPreview}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                padding: 0,
                background: `linear-gradient(135deg, ${t.color1} 50%, ${t.color2} 50%)`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
