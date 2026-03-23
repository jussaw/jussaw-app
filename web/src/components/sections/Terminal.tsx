'use client';

import { useEffect, useRef, useState } from 'react';
import { siteContent } from '@/data/content';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { useTabCompletion } from '@/hooks/useTabCompletion';

type Line = { type: 'input' | 'output'; text: string };

const DESTRUCTIVE = /^(sudo|rm|kill|shutdown|reboot|mkfs|dd\s)/i;

const COMMANDS: Record<string, () => string> = {
  help: () =>
    'available: cat <file>, clear, date, echo <text>, ls, pwd, uname, uptime, vim, whoami',
  whoami: () => `${siteContent.person.name} — ${siteContent.person.title}`,
  ls: () => 'skills.txt  experience.txt  hobbies/  setup.txt',
  'cat skills.txt': () => siteContent.skills.map((s) => s.name).join(', '),
  'cat experience.txt': () =>
    siteContent.experience
      .map((e) => `${e.role} @ ${e.company} (${e.period})`)
      .join('\n'),
  'cat setup.txt': () =>
    siteContent.kit.map((k) => `${k.label}: ${k.value}`).join('\n'),
  pwd: () => '/Users/justin/brain',
  uptime: () => 'up 31 years, load average: coffee, music, deadlines',
  date: () => new Date().toDateString(),
  uname: () => 'justOS 25.0.0 arm64 APPLESILICON',
  vim: () => "Entering vim...\nYou're trapped. Type :q! to escape.\nHint: it won't work here.",
  exit: () => 'this terminal is embedded — nowhere to exit to',
};

const COMPLETABLE = [
  'cat',
  'cat experience.txt',
  'cat setup.txt',
  'cat skills.txt',
  'clear',
  'date',
  'echo',
  'help',
  'ls',
  'pwd',
  'uname',
  'uptime',
  'vim',
  'whoami',
];

const WELCOME: Line = {
  type: 'output',
  text: "Welcome. Type 'help' to get started.",
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([WELCOME]);
  const [input, setInput] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const { complete, reset } = useTabCompletion({ commands: COMPLETABLE });

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const inputLine: Line = { type: 'input', text: raw.trim() };

    if (cmd === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

let response: string;
    if (cmd === 'sudo make me a sandwich') {
      response = 'okay.';
    } else if (DESTRUCTIVE.test(cmd)) {
      response = 'Permission denied. Nice try.';
    } else if (cmd.startsWith('echo ')) {
      response = raw.trim().slice(5).trim();
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

  return (
    <SectionWrapper id="terminal">
      <div
        style={{
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '10px',
          overflow: 'hidden',
          fontFamily: 'var(--font-jbmono, monospace)',
          fontSize: '0.85rem',
          color: '#c9d1d9',
        }}
      >
        {/* Scrollable output */}
        <div ref={outputRef} style={{ overflowY: 'auto', padding: '1rem', height: '420px' }}>
          {/* Inline label — no separate toolbar */}
          <div
            style={{
              color: 'var(--color-accent)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-jbmono, monospace)',
              borderBottom: '1px solid #21262d',
              paddingBottom: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            ~ terminal
          </div>
          {lines.map((line, i) => (
            <div key={i} style={{ marginBottom: '0.25rem', lineHeight: 1.6 }}>
              {line.type === 'input' ? (
                <div>
                  <span aria-hidden="true" style={{ color: '#58a6ff' }}>
                    jussaw@server
                  </span>
                  <span aria-hidden="true" style={{ color: '#8b949e' }}>
                    :~${' '}
                  </span>
                  <span>{line.text}</span>
                </div>
              ) : (
                <div style={{ color: '#8b949e', whiteSpace: 'pre-wrap' }}>
                  {line.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input row */}
        <div
          style={{
            padding: '0.5rem 1rem',
            borderTop: '1px solid #21262d',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span aria-hidden="true" style={{ color: '#58a6ff' }}>
            jussaw@server
          </span>
          <span aria-hidden="true" style={{ color: '#8b949e' }}>
            :~$
          </span>
          <input
            aria-label="Terminal input"
            value={input}
            onChange={(e) => {
              reset();
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                setInput(complete(input));
              } else if (e.key === 'Enter') {
                runCommand(input);
              }
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
    </SectionWrapper>
  );
}
