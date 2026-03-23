'use client';

import { useEffect, useRef, useState } from 'react';
import { siteContent } from '@/data/content';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { useTabCompletion } from '@/hooks/useTabCompletion';
import styles from './Terminal.module.css';

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
      <div className={styles.container}>
        {/* Scrollable output */}
        <div ref={outputRef} className={styles.output}>
          {/* Inline label — no separate toolbar */}
          <div className={styles.header}>
            ~ terminal
          </div>
          {lines.map((line, i) => (
            <div key={i} className={styles.line}>
              {line.type === 'input' ? (
                <div>
                  <span aria-hidden="true" className={styles.prompt}>
                    jussaw@server
                  </span>
                  <span aria-hidden="true" className={styles.promptPath}>
                    :~${' '}
                  </span>
                  <span>{line.text}</span>
                </div>
              ) : (
                <div className={styles.lineOutput}>
                  {line.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input row */}
        <div className={styles.inputRow}>
          <span aria-hidden="true" className={styles.prompt}>
            jussaw@server
          </span>
          <span aria-hidden="true" className={styles.promptPath}>
            :~$
          </span>
          <input
            aria-label="Terminal input"
            placeholder="type a command..."
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
            className={styles.inputField}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}
