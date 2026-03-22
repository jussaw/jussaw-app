'use client';

import { useEffect } from 'react';
import { siteContent } from '@/data/content';

interface SetupDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SetupDrawer({ open, onClose }: SetupDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="drawer-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 40,
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Setup and gear"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '380px',
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          zIndex: 50,
          padding: '2rem 1.5rem',
          overflowY: 'auto',
          animation: 'slideIn 0.25s ease',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close setup drawer"
          className="hover:opacity-70 transition-opacity mb-6 block"
          style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem' }}
        >
          ✕
        </button>

        <h2
          className="text-2xl font-semibold mb-2"
          style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--heading-font, var(--font-sans))' }}
        >
          Setup
        </h2>
        <p
          className="text-sm mb-8"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          The gear I use every day.
        </p>

        <ul className="space-y-4">
          {siteContent.kit.map((item) => (
            <li key={item.label} className="flex flex-col gap-0.5">
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: 'var(--color-accent)' }}
              >
                {item.label}
              </span>
              <span
                className="text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
