'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPalette } from 'react-icons/fa';
import { themes, DEFAULT_THEME } from '@/data/themes';

const STORAGE_KEY = 'theme';

function ThemeSwatch({ t, active, onApply, onPreview }: {
  t: typeof themes[0];
  active: boolean;
  onApply: () => void;
  onPreview: () => void;
}) {
  return (
    <button
      aria-label={`Switch to ${t.label}`}
      title={t.label}
      onClick={onApply}
      onMouseEnter={onPreview}
      style={{
        width: 28,
        height: 28,
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        background: 'none',
        outline: active ? '2px solid var(--color-accent)' : 'none',
        outlineOffset: 2,
        flexShrink: 0,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        {/* Left half — background color */}
        <path d="M 11,11 L 11,1 A 10,10 0 1,0 11,21 Z" fill={t.bg} />
        {/* Upper-right quadrant — primary accent */}
        <path d="M 11,11 L 11,1 A 10,10 0 0,1 21,11 Z" fill={t.color1} />
        {/* Lower-right quadrant — secondary accent */}
        <path d="M 11,11 L 21,11 A 10,10 0 0,1 11,21 Z" fill={t.color2} />
        <circle cx="11" cy="11" r="10" fill="none" stroke="rgba(150,150,150,0.25)" strokeWidth="0.8" />
      </svg>
    </button>
  );
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(() =>
    typeof window !== 'undefined'
      ? (localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME)
      : DEFAULT_THEME
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

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
  };

  const previewTheme = (key: string) => {
    document.body.setAttribute('data-theme', key);
  };

  const cancelPreview = () => {
    document.body.setAttribute('data-theme', activeTheme);
  };

  const darkThemes = themes.slice(0, 18);
  const lightThemes = themes.slice(18);

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    opacity: 0.45,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--color-text-secondary)',
    userSelect: 'none',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 28px)',
    gap: '6px',
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
          onMouseLeave={cancelPreview}
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 100,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <div style={labelStyle}>Dark</div>
          <div style={gridStyle}>
            {darkThemes.map((t) => (
              <ThemeSwatch
                key={t.key}
                t={t}
                active={t.key === activeTheme}
                onApply={() => applyTheme(t.key)}
                onPreview={() => previewTheme(t.key)}
              />
            ))}
          </div>
          <div style={{ height: 1, background: 'var(--color-border)', margin: '2px 0' }} />
          <div style={labelStyle}>Light</div>
          <div style={gridStyle}>
            {lightThemes.map((t) => (
              <ThemeSwatch
                key={t.key}
                t={t}
                active={t.key === activeTheme}
                onApply={() => applyTheme(t.key)}
                onPreview={() => previewTheme(t.key)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
