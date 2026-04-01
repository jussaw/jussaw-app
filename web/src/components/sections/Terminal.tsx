'use client';

import { useEffect, useRef, useState } from 'react';

import SectionWrapper from '@/components/ui/SectionWrapper';
import { siteContent } from '@/data/content';
import { useTabCompletion } from '@/hooks/useTabCompletion';

import styles from './Terminal.module.css';

type Line = { type: 'input' | 'output'; text: string };

const DESTRUCTIVE = /^(sudo|rm|kill|shutdown|reboot|mkfs|dd\s)/i;

const COMMANDS: Record<string, () => string> = {
  help: () =>
    'available: cat <file>, clear, date, echo <text>, ls, pwd, uname, uptime, vim, whoami',
  whoami: () => `${siteContent.person.name} — ${siteContent.person.title}`,
  ls: () => 'skills.txt  experience.txt  projects.txt  hobbies.txt  setup.txt',
  'cat skills.txt': () => siteContent.skills.map((s) => s.name).join(', '),
  'cat experience.txt': () =>
    siteContent.experience.map((e) => `${e.role} @ ${e.company} (${e.period})`).join('\n'),
  'cat hobbies.txt': () => siteContent.hobbies.map((h) => h.label).join(', '),
  'cat projects.txt': () =>
    siteContent.projects
      .map((p) => `${p.title} — ${p.description} [${p.stack.join(', ')}]`)
      .join('\n'),
  'cat setup.txt': () => siteContent.kit.map((k) => `${k.label}: ${k.value}`).join('\n'),
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
  'cat hobbies.txt',
  'cat projects.txt',
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
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { complete, reset } = useTabCompletion({ commands: COMPLETABLE });
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(
    () => () => {
      if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
    },
    [],
  );

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const inputLine: Line = { type: 'input', text: raw.trim() };

    // Add to history
    if (raw.trim()) {
      historyRef.current.push(raw.trim());
    }
    historyIndexRef.current = -1;

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

    setLines((prev) => [...prev, inputLine, { type: 'output', text: response }]);
    setInput('');
    if (typingTimerRef.current !== null) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);
  };

  const handleHistoryNav = (direction: 'up' | 'down') => {
    const history = historyRef.current;
    if (history.length === 0) return;

    if (direction === 'up') {
      const newIndex =
        historyIndexRef.current === -1
          ? history.length - 1
          : Math.max(0, historyIndexRef.current - 1);
      historyIndexRef.current = newIndex;
      setInput(history[newIndex]);
    } else {
      if (historyIndexRef.current === -1) return;
      const newIndex = historyIndexRef.current + 1;
      if (newIndex >= history.length) {
        historyIndexRef.current = -1;
        setInput('');
      } else {
        historyIndexRef.current = newIndex;
        setInput(history[newIndex]);
      }
    }
  };

  return (
    <SectionWrapper id="terminal" className="mb-36">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={styles.container} onClick={() => inputRef.current?.focus()}>
        {/* Static top bar */}
        <div className={styles.header}>~ terminal</div>

        {/* Scrollable output */}
        <div ref={outputRef} className={styles.output}>
          {lines.map((line, i) => (
            <div key={i} className={styles.line}>
              {line.type === 'input' ? (
                <div>
                  <span aria-hidden="true" className={styles.prompt}>
                    jussaw@server
                  </span>
                  <span aria-hidden="true" className={styles.promptPath}>
                    :~{' '}
                  </span>
                  <span>{line.text}</span>
                </div>
              ) : (
                <div className={styles.lineOutput}>{line.text}</div>
              )}
            </div>
          ))}
          <div className={styles.line}>
            <div className={styles.activeInputLine}>
              <span aria-hidden="true" className={styles.prompt}>
                jussaw@server
              </span>
              <span aria-hidden="true" className={styles.promptPath}>
                :~{' '}
              </span>
              <div className={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  aria-label="Terminal input"
                  value={input}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  onChange={(e) => {
                    reset();
                    historyIndexRef.current = -1;
                    setInput(e.target.value);
                    setIsTyping(true);
                    if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
                    typingTimerRef.current = setTimeout(() => setIsTyping(false), 600);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      setInput(complete(input));
                    } else if (e.key === 'Enter') {
                      runCommand(input);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      handleHistoryNav('up');
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      handleHistoryNav('down');
                    }
                  }}
                  className={styles.inputField}
                />
                <span aria-hidden="true" className={styles.inputMirror}>
                  {input}
                </span>
                <span
                  aria-hidden="true"
                  className={`${styles.cursor} ${isFocused && !isTyping ? styles.cursorBlink : styles.cursorSolid}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
