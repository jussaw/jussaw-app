'use client';

import { useEffect, useRef, useState } from 'react';

import SectionWrapper from '@/components/ui/SectionWrapper';
import { siteContent } from '@/data/content';
import { useTabCompletion } from '@/hooks/useTabCompletion';

import styles from './Terminal.module.css';

type Line = { id: number; type: 'input' | 'output'; text: string };

// The live region renders one announcement at a time. The id is what forces a fresh DOM node
// when the same command is run twice in a row (see `announce` below).
type Announcement = { id: number; text: string };

const CLEAR_ANNOUNCEMENT = 'Terminal cleared.';

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
  id: 0,
  type: 'output',
  text: "Welcome. Type 'help' to get started.",
};

export default function Terminal() {
  // IDs are assigned when a line enters scrollback, rather than from its position or text.
  // The counter intentionally survives `clear`, so a newly appended duplicate never reuses a
  // retired line's React identity.
  const lineIdRef = useRef(WELCOME.id + 1);
  const makeLine = (type: Line['type'], text: string): Line => {
    const id = lineIdRef.current;
    lineIdRef.current += 1;
    return { id, type, text };
  };
  const [lines, setLines] = useState<Line[]>([WELCOME]);
  const [input, setInput] = useState('');
  // Screen-reader announcement of the most recent command response only. It starts empty so the
  // welcome banner is not read on page load, and never mirrors the scrollback or the input.
  const announcementIdRef = useRef(0);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const announce = (text: string) => {
    announcementIdRef.current += 1;
    setAnnouncement({ id: announcementIdRef.current, text });
  };
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { complete, reset } = useTabCompletion({ commands: COMPLETABLE });
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const runCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();

    // Empty or whitespace-only submit: just clear the input, no echo/output/history. Deliberately
    // leaves the live region untouched so a bare Enter neither speaks nor repeats the last response.
    if (!cmd) {
      setInput('');
      return;
    }

    // Add to history
    if (raw.trim()) {
      historyRef.current.push(raw.trim());
    }
    historyIndexRef.current = -1;

    if (cmd === 'clear') {
      setLines([]);
      setInput('');
      // Emptied scrollback has nothing to read back, so confirm the action instead.
      announce(CLEAR_ANNOUNCEMENT);
      return;
    }

    const inputLine = makeLine('input', raw.trim());

    let response: string;
    if (cmd === 'sudo make me a sandwich') {
      response = 'okay.';
    } else if (DESTRUCTIVE.test(cmd)) {
      response = 'Permission denied. Nice try.';
    } else if (cmd === 'echo' || cmd.startsWith('echo ')) {
      response = raw.trim().slice(5).trim();
    } else if (COMMANDS[cmd]) {
      response = COMMANDS[cmd]();
    } else {
      response = `command not found: ${cmd}. try 'help'`;
    }

    const outputLine = makeLine('output', response);
    setLines((prev) => [...prev, inputLine, outputLine]);
    setInput('');
    announce(response);
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
          {lines.map((line) => (
            <div key={line.id} className={styles.line}>
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
                }}
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
            </div>
          </div>
        </div>
      </div>

      {/*
       * AUD-20260802-01. A screen reader gets nothing useful from the scrollback: it is a plain
       * scroll container, so a new response is silent. This region sits outside both the
       * scrollback and the input, holds only the latest response, and is announced atomically.
       * The keyed span is load-bearing — re-running a command whose response is identical must
       * still mutate the DOM, and React would otherwise leave a same-text node in place and the
       * repeat would go unspoken. It is never focused, so the caret stays in the input.
       */}
      <div role="status" aria-live="polite" aria-atomic="true" className={styles.srOnly}>
        {announcement ? <span key={announcement.id}>{announcement.text}</span> : null}
      </div>
    </SectionWrapper>
  );
}
