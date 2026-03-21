# Scroll Effects & Scrollbar Removal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add fade+slide-up scroll reveal animations that re-trigger on every viewport re-entry, and hide the browser scrollbar across all browsers.

**Architecture:** A single `useScrollReveal` React hook wraps `IntersectionObserver` and toggles a `.visible` CSS class. The `.reveal` / `.reveal.visible` CSS classes in `globals.css` drive all animation via transitions. Three components (`SectionWrapper`, `Hero`, `ExperienceCard`) each call the hook on their root/content element. No animation library is added.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Vitest + @testing-library/react for unit tests, pnpm

---

## Parallelisation Map

```
Task 1 (test infra)
       ↓
Task 2 (CSS) ──┐
Task 3 (hook) ─┤  ← run Tasks 2 + 3 in parallel after Task 1
               ↓
Task 4 (SectionWrapper) ──┐
Task 5 (Hero)             ├─  ← run Tasks 4 + 5 + 6 in parallel after Task 3
Task 6 (ExperienceCard)   ┘
               ↓
Task 7 (build + smoke check)
```

Tasks 2 & 3 are independent and can be dispatched as a parallel agent pair.
Tasks 4, 5 & 6 each touch a different file and can be dispatched as a parallel agent trio.

---

## File Map

| File | Status | Responsibility |
|------|--------|----------------|
| `src/hooks/useScrollReveal.ts` | **Create** | IntersectionObserver hook — adds/removes `.visible` class |
| `src/test/setup.ts` | **Create** | Vitest global setup — imports jest-dom matchers |
| `src/hooks/__tests__/useScrollReveal.test.ts` | **Create** | Unit tests for the hook |
| `src/components/ui/__tests__/SectionWrapper.test.tsx` | **Create** | Unit tests for SectionWrapper reveal behaviour |
| `src/components/sections/__tests__/Hero.test.tsx` | **Create** | Unit tests for Hero reveal behaviour |
| `src/components/ui/__tests__/ExperienceCard.test.tsx` | **Create** | Unit tests for ExperienceCard reveal across all three display modes |
| `vitest.config.ts` | **Create** | Vitest configuration with jsdom + `@/` alias |
| `src/app/globals.css` | **Modify** | Add scrollbar CSS + `.reveal` / `.reveal.visible` / `prefers-reduced-motion` |
| `src/components/ui/SectionWrapper.tsx` | **Modify** | Add `'use client'`, `useRef`, `useScrollReveal`, `reveal` class |
| `src/components/sections/Hero.tsx` | **Modify** | Add `'use client'`, `useRef`, `useScrollReveal`, `reveal` + `transitionDelay` |
| `src/components/ui/ExperienceCard.tsx` | **Modify** | Add `'use client'`, `useRef`, `useScrollReveal`, `reveal` on all three branch roots |

---

## Task 1: Test Infrastructure Setup

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json` (add test script + devDependencies)

- [ ] **Step 1: Install test dependencies**

```bash
cd /home/jussaw/projects/jussaw-app/frontend
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

Expected: packages installed with no errors.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 4: Add test script to `package.json`**

In the `"scripts"` block, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify test infrastructure works**

Create a temporary sanity test at `src/test/sanity.test.ts`:
```ts
describe('test infra', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run:
```bash
pnpm test
```

Expected output: `1 passed` — no errors.

Delete the sanity file after it passes:
```bash
rm src/test/sanity.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts src/test/setup.ts package.json pnpm-lock.yaml
git commit -m "chore: add vitest + testing-library test infrastructure"
```

---

## Task 2: CSS — Scrollbar Removal + Reveal Classes

> **Can run in parallel with Task 3 after Task 1 is done.**

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Merge scrollbar-hiding into the existing `html` block**

Open `src/app/globals.css`. Find the existing `html` block (currently `html { scroll-behavior: smooth; }`).
Replace it with:

```css
html {
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
}

html::-webkit-scrollbar {
  display: none; /* Chrome / Safari */
}
```

Do **not** add a second `html {}` block — merge into the one that already exists.

- [ ] **Step 2: Add `.reveal` classes after the `body` block**

Append to the end of `globals.css`:

```css
/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 3: Visual smoke check**

```bash
pnpm dev
```

Open `http://localhost:3000`. Verify:
- No scrollbar visible (check right edge of window)
- Page content still visible (CSS didn't break layout)

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: hide scrollbar and add .reveal CSS classes"
```

---

## Task 3: `useScrollReveal` Hook

> **Can run in parallel with Task 2 after Task 1 is done.**

**Files:**
- Create: `src/hooks/__tests__/useScrollReveal.test.ts`
- Create: `src/hooks/useScrollReveal.ts`

`useScrollReveal` takes a `RefObject<HTMLElement | null>` and optional `threshold` (default `0.12`). Inside a `useEffect`, it creates an `IntersectionObserver` that:
- Adds class `visible` to `ref.current` when `isIntersecting` is `true`
- Removes class `visible` from `ref.current` when `isIntersecting` is `false`
- Returns the `disconnect` call as the `useEffect` cleanup

The hook file must begin with `'use client'`.

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/__tests__/useScrollReveal.test.ts`:

```ts
import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useScrollReveal } from '../useScrollReveal';

// IntersectionObserver does not exist in jsdom — mock it globally
type IOCallback = (entries: IntersectionObserverEntry[]) => void;
let capturedCallback: IOCallback;

const mockObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
};

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn((cb: IOCallback) => {
    capturedCallback = cb;
    return mockObserver;
  })
);

function makeEntry(isIntersecting: boolean, target: Element): IntersectionObserverEntry {
  return { isIntersecting, target } as unknown as IntersectionObserverEntry;
}

describe('useScrollReveal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds "visible" class when element enters viewport', () => {
    const div = document.createElement('div');
    const { result } = renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref);
      return ref;
    });

    capturedCallback([makeEntry(true, div)]);
    expect(div.classList.contains('visible')).toBe(true);
  });

  it('removes "visible" class when element leaves viewport', () => {
    const div = document.createElement('div');
    div.classList.add('visible');
    renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref);
      return ref;
    });

    capturedCallback([makeEntry(false, div)]);
    expect(div.classList.contains('visible')).toBe(false);
  });

  it('calls observer.observe with the ref element', () => {
    const div = document.createElement('div');
    renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref);
    });

    expect(mockObserver.observe).toHaveBeenCalledWith(div);
  });

  it('disconnects observer on unmount', () => {
    const div = document.createElement('div');
    const { unmount } = renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref);
    });

    unmount();
    expect(mockObserver.disconnect).toHaveBeenCalledTimes(1);
  });

  it('respects custom threshold option', () => {
    const div = document.createElement('div');
    renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref, { threshold: 0.5 });
    });

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    );
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
pnpm test
```

Expected: 5 tests fail with "Cannot find module '../useScrollReveal'".

- [ ] **Step 3: Implement `useScrollReveal`**

Create `src/hooks/useScrollReveal.ts`:

```ts
'use client';

import { useEffect, type RefObject } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  { threshold = 0.12 }: ScrollRevealOptions = {}
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('visible');
          } else {
            el.classList.remove('visible');
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm test
```

Expected: 5 passed, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useScrollReveal.ts src/hooks/__tests__/useScrollReveal.test.ts
git commit -m "feat: add useScrollReveal hook with IntersectionObserver"
```

---

## Task 4: Update `SectionWrapper`

> **Can run in parallel with Tasks 5 & 6 after Task 3 is done.**

**Files:**
- Create: `src/components/ui/__tests__/SectionWrapper.test.tsx`
- Modify: `src/components/ui/SectionWrapper.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/__tests__/SectionWrapper.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import SectionWrapper from '../SectionWrapper';

// Minimal IntersectionObserver mock (hook is tested separately)
vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
})));

describe('SectionWrapper', () => {
  it('renders a <section> element', () => {
    render(<SectionWrapper>content</SectionWrapper>);
    expect(screen.getByText('content').closest('section')).toBeInTheDocument();
  });

  it('applies the reveal class to the section', () => {
    render(<SectionWrapper>content</SectionWrapper>);
    const section = screen.getByText('content').closest('section');
    expect(section).toHaveClass('reveal');
  });

  it('forwards the id prop', () => {
    render(<SectionWrapper id="skills">content</SectionWrapper>);
    expect(document.getElementById('skills')).toBeInTheDocument();
  });

  it('forwards extra className prop', () => {
    render(<SectionWrapper className="extra">content</SectionWrapper>);
    const section = screen.getByText('content').closest('section');
    expect(section).toHaveClass('extra');
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test
```

Expected: "applies the reveal class" test fails.

- [ ] **Step 3: Update `SectionWrapper.tsx`**

Replace the full file content with:

```tsx
'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section
      ref={ref}
      id={id}
      className={`reveal px-6 py-20 max-w-4xl mx-auto w-full ${className}`}
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm test
```

Expected: all SectionWrapper tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SectionWrapper.tsx src/components/ui/__tests__/SectionWrapper.test.tsx
git commit -m "feat: add scroll reveal to SectionWrapper"
```

---

## Task 5: Update `Hero`

> **Can run in parallel with Tasks 4 & 6 after Task 3 is done.**

**Files:**
- Create: `src/components/sections/__tests__/Hero.test.tsx`
- Modify: `src/components/sections/Hero.tsx`

The reveal is applied to the **inner content `<div>`** (the first child div inside the `<section>`), not the outer `<section>` itself. A `transitionDelay` of `150ms` is applied inline on that div.

- [ ] **Step 1: Write the failing test**

Create `src/components/sections/__tests__/Hero.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import Hero from '../Hero';

vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
})));

describe('Hero', () => {
  it('renders the person name', () => {
    const { getByRole } = render(<Hero />);
    // siteContent.person.name is "jussaw"
    expect(getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('applies reveal class to the inner content div', () => {
    const { container } = render(<Hero />);
    // The inner content div is the first div inside the section
    const section = container.querySelector('section');
    const innerDiv = section?.querySelector('div');
    expect(innerDiv).toHaveClass('reveal');
  });

  it('applies 150ms transitionDelay to the inner content div', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('section');
    const innerDiv = section?.querySelector('div') as HTMLElement;
    expect(innerDiv?.style.transitionDelay).toBe('150ms');
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test
```

Expected: "applies reveal class" and "applies 150ms transitionDelay" fail.

- [ ] **Step 3: Update `Hero.tsx`**

Add `'use client'` as the first line. Add `useRef` and `useScrollReveal` imports. Attach `ref` + `reveal` class + `transitionDelay` to the first inner `<div>` (the one currently wrapping the badge `<span>`).

The section structure is:
```
<section>           ← outer, unchanged
  <div ref={ref} className="reveal ..." style={{ transitionDelay: '150ms' }}>   ← THIS div gets the hook
    <div className="mb-4">  ← badge
    <h1>
    <p>
    <div>  ← buttons
  </div>
</section>
```

Full updated file:

```tsx
'use client';

import { useRef } from 'react';
import { siteContent } from "@/data/content";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface HeroProps {
  layout?: "centered" | "left-aligned";
  headingStyle?: "serif-elegant" | "bold-sans" | "mono-minimal";
}

export default function Hero({ layout = "centered", headingStyle = "serif-elegant" }: HeroProps) {
  const { person } = siteContent;
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  const headingFont =
    headingStyle === "serif-elegant"
      ? "var(--font-serif)"
      : headingStyle === "mono-minimal"
      ? "var(--font-mono)"
      : "var(--font-sans)";

  const headingWeight =
    headingStyle === "bold-sans" ? "800" : "600";

  const isCenter = layout === "centered";

  return (
    <section
      className={`px-6 pt-32 pb-24 max-w-4xl mx-auto w-full ${isCenter ? "text-center" : "text-left"}`}
    >
      <div
        ref={ref}
        className="reveal"
        style={{ transitionDelay: '150ms' }}
      >
        <div className="mb-4">
          <span
            className="text-sm font-medium uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{
              color: "var(--color-accent)",
              borderColor: "var(--color-accent-2, var(--color-accent-muted))",
              background: "var(--color-surface)",
            }}
          >
            {person.title}
          </span>
        </div>
        <h1
          className="text-6xl md:text-7xl mb-6 leading-tight"
          style={{
            fontFamily: headingFont,
            fontWeight: headingWeight,
            color: "var(--color-text-primary)",
          }}
        >
          {person.name}
        </h1>
        <p
          className={`text-xl leading-relaxed max-w-2xl ${isCenter ? "mx-auto" : ""}`}
          style={{ color: "var(--color-text-secondary)" }}
        >
          {person.tagline}
        </p>
        <div className={`mt-10 flex gap-4 ${isCenter ? "justify-center" : "justify-start"}`}>
          <a
            href={`mailto:${person.email}`}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--color-accent)",
              color: "#fff",
            }}
          >
            Get in touch
          </a>
          <a
            href={person.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-sm font-medium border transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
              background: "var(--color-surface)",
            }}
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm test
```

Expected: all Hero tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/__tests__/Hero.test.tsx
git commit -m "feat: add scroll reveal entrance animation to Hero"
```

---

## Task 6: Update `ExperienceCard`

> **Can run in parallel with Tasks 4 & 5 after Task 3 is done.**

**Files:**
- Create: `src/components/ui/__tests__/ExperienceCard.test.tsx`
- Modify: `src/components/ui/ExperienceCard.tsx`

Each call to `ExperienceCard` creates its own `ref` + hook. The `reveal` class goes on the **root element** of each of the three render branches (`timeline` → outer `<div className="relative pl-8 pb-10">`, `minimal-text` → outer `<div className="pb-8 border-b ...">`, `cards` → outer `<div className="p-6 rounded-...">` ).

- [ ] **Step 1: Write the failing tests**

Create `src/components/ui/__tests__/ExperienceCard.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import ExperienceCard from '../ExperienceCard';
import type { ExperienceEntry } from '@/data/content';

vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
})));

const entry: ExperienceEntry = {
  company: 'Acme',
  role: 'Engineer',
  period: '2022–Present',
  location: 'Remote',
  bullets: ['Did a thing'],
};

describe('ExperienceCard', () => {
  it('timeline mode: root element has reveal class', () => {
    const { container } = render(<ExperienceCard entry={entry} displayMode="timeline" />);
    expect(container.firstChild).toHaveClass('reveal');
  });

  it('minimal-text mode: root element has reveal class', () => {
    const { container } = render(<ExperienceCard entry={entry} displayMode="minimal-text" />);
    expect(container.firstChild).toHaveClass('reveal');
  });

  it('cards mode (default): root element has reveal class', () => {
    const { container } = render(<ExperienceCard entry={entry} />);
    expect(container.firstChild).toHaveClass('reveal');
  });

  it('renders role and company in all modes', () => {
    (['timeline', 'minimal-text', 'cards'] as const).forEach((mode) => {
      const { getByText } = render(<ExperienceCard entry={entry} displayMode={mode} />);
      expect(getByText('Engineer')).toBeInTheDocument();
      expect(getByText('Acme')).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run test — verify it fails**

```bash
pnpm test
```

Expected: the three "has reveal class" tests fail.

- [ ] **Step 3: Update `ExperienceCard.tsx`**

Add `'use client'` as first line. Add `useRef` + `useScrollReveal` imports. Add `ref` + `reveal` class to the root `<div>` of all three branches. Note: each branch needs its own `useRef` call — **hooks cannot be called conditionally**, so all three refs must be declared at the top of the component, before any `if` statement.

```tsx
'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { ExperienceEntry } from "@/data/content";

interface ExperienceCardProps {
  entry: ExperienceEntry;
  displayMode?: "cards" | "timeline" | "minimal-text";
}

export default function ExperienceCard({ entry, displayMode = "cards" }: ExperienceCardProps) {
  // All three refs declared unconditionally (Rules of Hooks)
  const timelineRef = useRef<HTMLDivElement>(null);
  const minimalRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useScrollReveal(timelineRef);
  useScrollReveal(minimalRef);
  useScrollReveal(cardsRef);

  if (displayMode === "timeline") {
    return (
      <div ref={timelineRef} className="reveal relative pl-8 pb-10">
        <div
          className="absolute left-0 top-2 bottom-0 w-px"
          style={{ background: "var(--color-border)" }}
        />
        <div
          className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full border-2"
          style={{
            background: "var(--color-bg)",
            borderColor: "var(--color-accent)",
          }}
        />
        <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {entry.role}
          </h3>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-accent-2, var(--color-accent))" }}
          >
            {entry.company}
          </span>
        </div>
        <p className="text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
          {entry.period} · {entry.location}
        </p>
        <ul className="space-y-1.5">
          {entry.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <span style={{ color: "var(--color-accent)" }} className="mt-0.5 shrink-0">→</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (displayMode === "minimal-text") {
    return (
      <div ref={minimalRef} className="reveal pb-8 border-b last:border-b-0" style={{ borderColor: "var(--color-border)" }}>
        <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {entry.role}
          </h3>
          <span className="text-sm" style={{ color: "var(--color-accent-2, var(--color-accent))" }}>
            {entry.company}
          </span>
        </div>
        <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "var(--color-text-secondary)" }}>
          {entry.period} · {entry.location}
        </p>
        <ul className="space-y-1">
          {entry.bullets.map((b, i) => (
            <li key={i} className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {b}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // cards (default)
  return (
    <div
      ref={cardsRef}
      className="reveal p-6 rounded-[var(--card-radius,0.75rem)] border"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {entry.role}
        </h3>
        <span className="text-sm font-medium" style={{ color: "var(--color-accent-2, var(--color-accent))" }}>
          {entry.company}
        </span>
      </div>
      <p className="text-xs uppercase tracking-wide mb-4" style={{ color: "var(--color-text-secondary)" }}>
        {entry.period} · {entry.location}
      </p>
      <ul className="space-y-1.5">
        {entry.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            <span style={{ color: "var(--color-accent)" }} className="mt-0.5 shrink-0">▸</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
pnpm test
```

Expected: all ExperienceCard tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ExperienceCard.tsx src/components/ui/__tests__/ExperienceCard.test.tsx
git commit -m "feat: add scroll reveal to ExperienceCard (all display modes)"
```

---

## Task 7: Build Check + Visual Smoke Test

**Files:** none created; verifies all previous tasks integrate correctly.

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: all tests pass (useScrollReveal × 5, SectionWrapper × 4, Hero × 3, ExperienceCard × 4 = 16 total).

- [ ] **Step 2: Run production build**

```bash
pnpm build
```

Expected: exits with code 0, no TypeScript errors, no missing module errors.

- [ ] **Step 3: Start dev server and verify visually**

```bash
pnpm dev
```

Open `http://localhost:3000` and verify:
- No scrollbar visible on the right edge
- Hero content fades in ~150ms after page load
- Scrolling down: Skills section fades+slides up into view
- Scrolling down: each Experience card fades+slides up individually
- Scrolling down: Hobbies section fades+slides up
- Scrolling **back up**: sections fade out (become invisible) as they leave the viewport
- Scrolling back down again: sections re-animate in correctly

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: scroll reveal animations and scrollbar removal complete"
```
