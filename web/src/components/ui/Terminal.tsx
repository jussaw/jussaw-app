'use client';

import { useEffect, useRef, useState } from 'react';
import { siteContent } from '@/data/content';

interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

type Line = { type: 'input' | 'output'; text: string };

const DESTRUCTIVE = /^(sudo|rm|kill|shutdown|reboot|mkfs|dd\s)/i;

const COMMANDS: Record<string, () => string> = {
  help: () => 'available: whoami, ls, cat <file>, uptime, clear, exit',
  whoami: () =>
    `${siteContent.person.name} — ${siteContent.person.title}`,
  ls: () => 'skills.txt  experience.txt  hobbies/  setup.txt',
  'cat skills.txt': () =>
    siteContent.skills.map((s) => s.name).join(', '),
  'cat experience.txt': () =>
    siteContent.experience
      .map((e) => `${e.role} @ ${e.company} (${e.period})`)
      .join('\n'),
  'cat setup.txt': () =>
    siteContent.kit.map((k) => `${k.label}: ${k.value}`).join('\n'),
  uptime: () => 'up 847 days — still going',
};

const WELCOME: Line = {
  type: 'output',
  text: "Welcome. Type 'help' to get started.",
};

export default function Terminal({ open, onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([WELCOME]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Reset on open
  useEffect(() => {
    if (open) setLines([WELCOME]);
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const inputLine: Line = { type: 'input', text: raw.trim() };

    if (cmd === 'exit') {
      onClose();
      return;
    }

    if (cmd === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    let response: string;
    if (DESTRUCTIVE.test(cmd)) {
      response = 'Permission denied. Nice try.';
    } else if (COMMANDS[cmd]) {
      response = COMMANDS[cmd]();
    } else {
      response = `command not found: ${cmd}. try 'help'`;
    }

    setLines((prev) => [
      ...prev,
      inputLine,
      { type: 'output', text: response },
    ]);
    setInput('');
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Terminal"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0d1117',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-jbmono, monospace)',
        fontSize: '0.85rem',
        color: '#c9d1d9',
      }}
    >
      {/* Toolbar */}
      <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #21262d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span aria-hidden="true" style={{ color: '#8b949e', fontSize: '0.75rem' }}>justin@jussaw — terminal</span>
        <button
          onClick={onClose}
          aria-label="Close terminal"
          style={{ color: '#8b949e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
        >
          ✕
        </button>
      </div>

      {/* Output */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ marginBottom: '0.25rem', lineHeight: 1.6 }}>
            {line.type === 'input' ? (
              <div>
                <span aria-hidden="true" style={{ color: '#58a6ff' }}>justin@jussaw</span>
                <span aria-hidden="true" style={{ color: '#8b949e' }}>:~$ </span>
                <span>{line.text}</span>
              </div>
            ) : (
              <div style={{ color: '#8b949e', whiteSpace: 'pre-wrap' }}>{line.text}</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '0 1rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span aria-hidden="true" style={{ color: '#58a6ff' }}>justin@jussaw</span>
        <span aria-hidden="true" style={{ color: '#8b949e' }}>:~$</span>
        <input
          role="textbox"
          aria-label="Terminal input"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') runCommand(input);
          }}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#c9d1d9',
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        />
      </div>
    </div>
  );
}
