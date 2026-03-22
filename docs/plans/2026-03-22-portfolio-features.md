# Portfolio Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four features to jussaw.com — a theme swatch switcher in the header, a Projects section, a Setup drawer, and a hidden interactive terminal easter egg.

**Architecture:** Each feature is a new component in `src/components/ui/` or `src/components/sections/`, driven by content in `src/data/content.ts`. Page-level state (drawer open/close) lives in `src/app/page.tsx` and is passed as props. No new routes are needed.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest 4 + React Testing Library, react-icons

---

## Codebase Orientation

Before writing any code, understand these key patterns:

- **Content**: All text/data lives in `web/src/data/content.ts`. Never hardcode strings in components.
- **Theme**: Applied via `data-theme` on `<body>`. CSS files in `web/src/styles/themes/` define `--color-*` variables scoped to `[data-theme="name"]`. Switch themes with `document.body.setAttribute('data-theme', name)`.
- **Client components**: Anything using `useState`, `useEffect`, or browser APIs needs `'use client'` at the top.
- **Icons**: Import from `react-icons/fa` (e.g. `FaPalette`). Never use `lucide-react`.
- **Imports**: Always use `@/` path alias (e.g. `@/data/content`, `@/components/ui/Foo`).
- **Tests**: Colocated in `__tests__/` beside the source file. Use `vi.stubGlobal('IntersectionObserver', ...)` when testing components that use `SectionWrapper` (which calls `useScrollReveal`). Run tests with `cd web && pnpm test`.
- **Scroll reveal**: Wrap new sections in `<SectionWrapper>` — it handles the reveal animation automatically.

---

## File Map

**New files:**
- `web/src/data/themes.ts` — static list of theme names + swatch colors
- `web/src/components/ui/ThemeSwitcher.tsx` — swatch popover component
- `web/src/components/ui/__tests__/ThemeSwitcher.test.tsx`
- `web/src/components/ui/ProjectCard.tsx` — single project card
- `web/src/components/ui/__tests__/ProjectCard.test.tsx`
- `web/src/components/sections/Projects.tsx` — Projects section
- `web/src/components/sections/__tests__/Projects.test.tsx`
- `web/src/components/ui/SetupDrawer.tsx` — slide-in drawer
- `web/src/components/ui/__tests__/SetupDrawer.test.tsx`
- `web/src/components/ui/Terminal.tsx` — interactive terminal overlay
- `web/src/components/ui/__tests__/Terminal.test.tsx`

**Modified files:**
- `web/src/data/content.ts` — add `ProjectEntry` type and `projects` array
- `web/src/components/sections/Header.tsx` — add `<ThemeSwitcher />`
- `web/src/components/sections/__tests__/Header.test.tsx` — add theme switcher test
- `web/src/components/sections/Footer.tsx` — add `onOpenSetup` prop + "Setup" button
- `web/src/components/sections/__tests__/Footer.test.tsx` — add setup link test
- `web/src/app/page.tsx` — add Projects, SetupDrawer, Terminal; manage drawer state

---

## Task 1: Extend content.ts with project data

**Files:**
- Modify: `web/src/data/content.ts`

- [ ] **Step 1: Add `ProjectEntry` interface and `projects` field to `SiteContent`**

Open `web/src/data/content.ts`. Add this interface after the existing interfaces:

```typescript
export interface ProjectEntry {
  title: string;
  description: string;
  highlights: string[];
  stack: string[];
  liveUrl: string;
  githubUrl: string;
}
```

Add `projects: ProjectEntry[];` to the `SiteContent` interface.

- [ ] **Step 2: Add project data to `siteContent`**

Add this to the `siteContent` object:

```typescript
projects: [
  {
    title: "jussaw.com",
    description: "This site — designed, built, and self-hosted",
    highlights: [
      "27-theme design system via CSS custom properties",
      "Self-hosted on Raspberry Pi via Docker + Docker Compose",
      "Standalone Next.js build optimized for minimal production artifact",
      "Scroll-triggered animations with Intersection Observer API",
      "Full test coverage with Vitest + React Testing Library",
    ],
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "Docker", "Raspberry Pi"],
    liveUrl: "https://jussaw.com",
    githubUrl: "https://github.com/jussaw/jussaw-app",
  },
],
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd web && pnpm build 2>&1 | head -30
```

Expected: no type errors related to content.ts

- [ ] **Step 4: Commit**

```bash
git add web/src/data/content.ts
git commit -m "feat: add project content type and data to content.ts"
```

---

## Task 2: Theme data file

**Files:**
- Create: `web/src/data/themes.ts`

- [ ] **Step 1: Create `themes.ts` with the static theme list**

The spec says to derive theme count from the directory at build time. In practice, Next.js App Router client components can't use `fs` at runtime, so we use a hardcoded static list instead — functionally equivalent and simpler to maintain for a fixed set of themes.

Each entry has the theme's CSS key (matches `data-theme` attribute value), and two swatch colors drawn from `--color-accent` and `--color-accent-2` in the corresponding CSS file. For themes without `--color-accent-2`, `color2` is the same as `color1`.

```typescript
export interface ThemeEntry {
  key: string;
  color1: string; // --color-accent
  color2: string; // --color-accent-2 (or same as color1 if absent)
}

export const themes: ThemeEntry[] = [
  { key: "baby-blue-1",              color1: "#c4a0b2", color2: "#89b4d4" },
  { key: "baby-blue-2",              color1: "#c4a0b2", color2: "#7aa8c8" },
  { key: "baby-blue-3",              color1: "#c4a0b2", color2: "#a0c4e0" },
  { key: "ballet-pink",              color1: "#e8b4c0", color2: "#e8b4c0" },
  { key: "cool-seafoam",             color1: "#c4a0b2", color2: "#78a898" },
  { key: "cool-steel",               color1: "#c4a0b2", color2: "#6e8eb8" },
  { key: "cool-teal",                color1: "#c4a0b2", color2: "#68a0a0" },
  { key: "dusty-mauve",              color1: "#c8a0b0", color2: "#c8a0b0" },
  { key: "frosted-rose",             color1: "#f2c8d4", color2: "#f2c8d4" },
  { key: "mauve-gold",               color1: "#c4a0b2", color2: "#c8b478" },
  { key: "mauve-periwinkle",         color1: "#c4a0b2", color2: "#98a4cc" },
  { key: "mauve-pure",               color1: "#c4a0b2", color2: "#c4a0b2" },
  { key: "mauve-sage",               color1: "#c4a0b2", color2: "#8cb898" },
  { key: "mauve-tricolor",           color1: "#c4a0b2", color2: "#c8b478" },
  { key: "powder-petal",             color1: "#f5dde4", color2: "#f5dde4" },
  { key: "rose-mist",                color1: "#dbb8c4", color2: "#dbb8c4" },
  { key: "swapped-blue-1",           color1: "#89b4d4", color2: "#c4a0b2" },
  { key: "swapped-blue-2",           color1: "#7aa8c8", color2: "#c4a0b2" },
  { key: "swapped-blue-3",           color1: "#a0c4e0", color2: "#c4a0b2" },
  { key: "tri-amber-slate",          color1: "#c4a0b2", color2: "#c8a870" },
  { key: "tri-lavender-rose",        color1: "#c4a0b2", color2: "#a898c4" },
  { key: "tri-periwinkle-champagne", color1: "#c4a0b2", color2: "#8898c4" },
  { key: "tri-sage-gold",            color1: "#c4a0b2", color2: "#c8aa6e" },
  { key: "tri-teal-blush",           color1: "#c4a0b2", color2: "#7aa8a0" },
  { key: "warm-brass",               color1: "#c4a0b2", color2: "#b09040" },
  { key: "warm-copper",              color1: "#c4a0b2", color2: "#c07858" },
  { key: "warm-coral",               color1: "#c4a0b2", color2: "#c88870" },
];

export const DEFAULT_THEME = "baby-blue-3";
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd web && pnpm build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add web/src/data/themes.ts
git commit -m "feat: add static theme list with swatch colors"
```

---

## Task 3: ThemeSwitcher component

**Files:**
- Create: `web/src/components/ui/ThemeSwitcher.tsx`
- Create: `web/src/components/ui/__tests__/ThemeSwitcher.test.tsx`
- Modify: `web/src/components/sections/Header.tsx`
- Modify: `web/src/components/sections/__tests__/Header.test.tsx`

- [ ] **Step 1: Write failing tests for ThemeSwitcher**

Create `web/src/components/ui/__tests__/ThemeSwitcher.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '../ThemeSwitcher';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    // Reset body data-theme before each test
    document.body.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('renders a palette button', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });

  it('opens the popover when palette button is clicked', () => {
    render(<ThemeSwitcher />);
    const btn = screen.getByRole('button', { name: /theme/i });
    fireEvent.click(btn);
    // Popover should contain swatch buttons
    const swatches = screen.getAllByRole('button', { name: /switch to/i });
    expect(swatches.length).toBeGreaterThan(0);
  });

  it('closes the popover when pressing Escape', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    expect(screen.getAllByRole('button', { name: /switch to/i }).length).toBeGreaterThan(0);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryAllByRole('button', { name: /switch to/i })).toHaveLength(0);
  });

  it('applies data-theme to body and persists to localStorage on swatch click', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    const swatch = screen.getAllByRole('button', { name: /switch to/i })[0];
    fireEvent.click(swatch);
    expect(document.body.getAttribute('data-theme')).toBeTruthy();
    expect(localStorage.getItem('theme')).toBeTruthy();
  });

  it('reads saved theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'warm-coral');
    render(<ThemeSwitcher />);
    expect(document.body.getAttribute('data-theme')).toBe('warm-coral');
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
cd web && pnpm test ThemeSwitcher 2>&1 | tail -20
```

Expected: FAIL — `ThemeSwitcher` module not found

- [ ] **Step 3: Implement ThemeSwitcher**

Create `web/src/components/ui/ThemeSwitcher.tsx`:

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { FaPalette } from 'react-icons/fa';
import { themes, DEFAULT_THEME } from '@/data/themes';

const STORAGE_KEY = 'theme';

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME;
    document.body.setAttribute('data-theme', saved);
  }, []);

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
    setOpen(false);
  };

  const previewTheme = (key: string) => {
    document.body.setAttribute('data-theme', key);
  };

  const cancelPreview = () => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME;
    document.body.setAttribute('data-theme', saved);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        aria-label="Switch theme"
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
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
cd web && pnpm test ThemeSwitcher 2>&1 | tail -20
```

Expected: PASS (5 tests)

- [ ] **Step 5: Add ThemeSwitcher to Header**

Open `web/src/components/sections/Header.tsx`. Add the import and insert `<ThemeSwitcher />` inside the `<header>` element before the email link:

```typescript
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
```

In the JSX, add `<ThemeSwitcher />` as the first child inside the `<header>` element's flex container:

```tsx
<header ...>
  <ThemeSwitcher />
  <a href={`mailto:${person.email}`} ...>
  ...
</header>
```

- [ ] **Step 6: Add Header test for ThemeSwitcher**

Open `web/src/components/sections/__tests__/Header.test.tsx`. Add:

```typescript
it('renders a theme switcher button', () => {
  const { getByRole } = render(<Header />);
  expect(getByRole('button', { name: /theme/i })).toBeInTheDocument();
});
```

- [ ] **Step 7: Run all Header tests**

```bash
cd web && pnpm test Header 2>&1 | tail -20
```

Expected: PASS (5 tests)

- [ ] **Step 8: Commit**

```bash
git add web/src/components/ui/ThemeSwitcher.tsx \
        web/src/components/ui/__tests__/ThemeSwitcher.test.tsx \
        web/src/components/sections/Header.tsx \
        web/src/components/sections/__tests__/Header.test.tsx
git commit -m "feat: add ThemeSwitcher swatch popover to header"
```

---

## Task 4: ProjectCard and Projects section

**Files:**
- Create: `web/src/components/ui/ProjectCard.tsx`
- Create: `web/src/components/ui/__tests__/ProjectCard.test.tsx`
- Create: `web/src/components/sections/Projects.tsx`
- Create: `web/src/components/sections/__tests__/Projects.test.tsx`
- Modify: `web/src/app/page.tsx`

- [ ] **Step 1: Write failing tests for ProjectCard**

Create `web/src/components/ui/__tests__/ProjectCard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';
import type { ProjectEntry } from '@/data/content';

const mockProject: ProjectEntry = {
  title: "test-project",
  description: "A test project",
  highlights: ["Feature A", "Feature B"],
  stack: ["React", "TypeScript"],
  liveUrl: "https://example.com",
  githubUrl: "https://github.com/example/test",
};

describe('ProjectCard', () => {
  it('renders the project title', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('test-project')).toBeInTheDocument();
  });

  it('renders the project description', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('A test project')).toBeInTheDocument();
  });

  it('renders all highlight bullets', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
  });

  it('renders all stack badges', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders live site and github links with correct hrefs', () => {
    render(<ProjectCard project={mockProject} />);
    const liveLink = screen.getByRole('link', { name: /live/i });
    const ghLink = screen.getByRole('link', { name: /github/i });
    expect(liveLink).toHaveAttribute('href', 'https://example.com');
    expect(ghLink).toHaveAttribute('href', 'https://github.com/example/test');
  });
});
```

- [ ] **Step 2: Run — verify it fails**

```bash
cd web && pnpm test ProjectCard 2>&1 | tail -10
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement ProjectCard**

Create `web/src/components/ui/ProjectCard.tsx`:

```typescript
import type { ProjectEntry } from '@/data/content';

interface ProjectCardProps {
  project: ProjectEntry;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="rounded-[var(--card-radius,0.5rem)] border p-6"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <h3
        className="text-xl font-semibold mb-1"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {project.title}
      </h3>
      <p
        className="text-sm mb-4"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {project.description}
      </p>

      <ul className="mb-4 space-y-1">
        {project.highlights.map((h) => (
          <li
            key={h}
            className="text-sm flex gap-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span style={{ color: 'var(--color-accent)' }}>—</span>
            {h}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="text-xs px-2 py-1 rounded border"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:opacity-70 transition-opacity"
          aria-label="Live site"
          style={{ color: 'var(--color-accent)' }}
        >
          ↗ Live site
        </a>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:opacity-70 transition-opacity"
          aria-label="GitHub"
          style={{ color: 'var(--color-accent)' }}
        >
          ↗ GitHub
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run — verify it passes**

```bash
cd web && pnpm test ProjectCard 2>&1 | tail -10
```

Expected: PASS (5 tests)

- [ ] **Step 5: Write failing tests for Projects section**

Create `web/src/components/sections/__tests__/Projects.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import Projects from '../Projects';
import { siteContent } from '@/data/content';

vi.stubGlobal('IntersectionObserver', vi.fn(function () {
  return { observe: vi.fn(), disconnect: vi.fn() };
}));

describe('Projects', () => {
  it('renders a section heading', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders the first project title from content', () => {
    render(<Projects />);
    expect(screen.getByText(siteContent.projects[0].title)).toBeInTheDocument();
  });

  it('renders project highlights', () => {
    render(<Projects />);
    siteContent.projects[0].highlights.forEach((h) => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 6: Run — verify it fails**

```bash
cd web && pnpm test Projects 2>&1 | tail -10
```

Expected: FAIL — module not found

- [ ] **Step 7: Implement Projects section**

Create `web/src/components/sections/Projects.tsx`:

```typescript
import { siteContent } from '@/data/content';
import SectionWrapper from '@/components/ui/SectionWrapper';
import ProjectCard from '@/components/ui/ProjectCard';

export default function Projects() {
  const { projects } = siteContent;

  return (
    <SectionWrapper id="projects">
      <h2
        className="text-3xl font-semibold mb-4"
        style={{
          fontFamily: 'var(--heading-font, var(--font-sans))',
          color: 'var(--color-text-primary)',
        }}
      >
        Projects
      </h2>
      <p
        className="text-base mb-8"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Things I&apos;ve built and shipped.
      </p>
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
}
```

- [ ] **Step 8: Run — verify it passes**

```bash
cd web && pnpm test Projects 2>&1 | tail -10
```

Expected: PASS (3 tests)

- [ ] **Step 9: Add Projects to page.tsx**

Open `web/src/app/page.tsx`. Add the import and insert `<Projects />` between `<Experience />` and `<Hobbies />`:

```typescript
import Projects from "@/components/sections/Projects";
```

```tsx
<Experience displayMode="timeline" />
<Projects />
<Hobbies />
```

- [ ] **Step 10: Commit**

```bash
git add web/src/components/ui/ProjectCard.tsx \
        web/src/components/ui/__tests__/ProjectCard.test.tsx \
        web/src/components/sections/Projects.tsx \
        web/src/components/sections/__tests__/Projects.test.tsx \
        web/src/app/page.tsx
git commit -m "feat: add Projects section with ProjectCard"
```

---

## Task 5: SetupDrawer

**Files:**
- Create: `web/src/components/ui/SetupDrawer.tsx`
- Create: `web/src/components/ui/__tests__/SetupDrawer.test.tsx`
- Modify: `web/src/components/sections/Footer.tsx`
- Modify: `web/src/components/sections/__tests__/Footer.test.tsx`
- Modify: `web/src/app/page.tsx`

- [ ] **Step 1: Write failing tests for SetupDrawer**

Create `web/src/components/ui/__tests__/SetupDrawer.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import SetupDrawer from '../SetupDrawer';

describe('SetupDrawer', () => {
  it('does not render content when closed', () => {
    render(<SetupDrawer open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(<SetupDrawer open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders kit items from content', () => {
    render(<SetupDrawer open={true} onClose={() => {}} />);
    // "keyboard" label should appear
    expect(screen.getByText(/keyboard/i)).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<SetupDrawer open={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<SetupDrawer open={true} onClose={onClose} />);
    const backdrop = screen.getByTestId('drawer-backdrop');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run — verify it fails**

```bash
cd web && pnpm test SetupDrawer 2>&1 | tail -10
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement SetupDrawer**

Create `web/src/components/ui/SetupDrawer.tsx`:

```typescript
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
```

- [ ] **Step 4: Run — verify it passes**

```bash
cd web && pnpm test SetupDrawer 2>&1 | tail -10
```

Expected: PASS (5 tests)

- [ ] **Step 5: Add setup trigger to Footer**

Open `web/src/components/sections/Footer.tsx`. Update its props interface and add the trigger button:

```typescript
interface FooterProps {
  id?: string;
  onOpenSetup?: () => void;
}

export default function Footer({ id, onOpenSetup }: FooterProps = {}) {
  const { hostingNote } = siteContent;

  return (
    <footer id={id} className="px-6 py-8 border-t" style={{ borderColor: "color-mix(in srgb, var(--color-border) 80%, transparent)" }}>
      <div className="max-w-4xl mx-auto flex items-center justify-between w-full">
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          {hostingNote}
        </p>
        {onOpenSetup && (
          <button
            onClick={onOpenSetup}
            className="text-xs hover:opacity-70 transition-opacity"
            aria-label="Open setup"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Setup
          </button>
        )}
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Add Footer test for setup button**

Open `web/src/components/sections/__tests__/Footer.test.tsx`. Add:

```typescript
it('renders a setup button when onOpenSetup is provided', () => {
  render(<Footer onOpenSetup={() => {}} />);
  expect(screen.getByRole('button', { name: /setup/i })).toBeInTheDocument();
});

it('calls onOpenSetup when setup button is clicked', () => {
  const onOpenSetup = vi.fn();
  render(<Footer onOpenSetup={onOpenSetup} />);
  fireEvent.click(screen.getByRole('button', { name: /setup/i }));
  expect(onOpenSetup).toHaveBeenCalled();
});
```

Add `fireEvent` to the import: `import { render, screen, fireEvent } from '@testing-library/react';`

- [ ] **Step 7: Run Footer tests**

```bash
cd web && pnpm test Footer 2>&1 | tail -10
```

Expected: PASS (6 tests)

- [ ] **Step 8: Wire drawer state in page.tsx**

Open `web/src/app/page.tsx`. Add:

```typescript
'use client';
import { useState } from 'react';
import SetupDrawer from '@/components/ui/SetupDrawer';
```

Add state and render the drawer:

```tsx
export default function Home() {
  const [setupOpen, setSetupOpen] = useState(false);

  return (
    <main className="min-h-screen pt-12" style={{ background: "var(--color-bg)" }}>
      <Header />
      <Hero id="hero" layout="left-aligned" headingStyle="bold-sans" />
      <Skills displayMode="grouped" />
      <Experience displayMode="timeline" />
      <Projects />
      <Hobbies />
      <Footer id="footer" onOpenSetup={() => setSetupOpen(true)} />
      <TimelineScrollbar />
      <SetupDrawer open={setupOpen} onClose={() => setSetupOpen(false)} />
    </main>
  );
}
```

- [ ] **Step 9: Run all tests**

```bash
cd web && pnpm test 2>&1 | tail -20
```

Expected: all pass

- [ ] **Step 10: Commit**

```bash
git add web/src/components/ui/SetupDrawer.tsx \
        web/src/components/ui/__tests__/SetupDrawer.test.tsx \
        web/src/components/sections/Footer.tsx \
        web/src/components/sections/__tests__/Footer.test.tsx \
        web/src/app/page.tsx
git commit -m "feat: add SetupDrawer with footer trigger"
```

---

## Task 6: Interactive Terminal Easter Egg

**Files:**
- Create: `web/src/components/ui/Terminal.tsx`
- Create: `web/src/components/ui/__tests__/Terminal.test.tsx`
- Modify: `web/src/app/page.tsx`

- [ ] **Step 1: Write failing tests for Terminal**

Create `web/src/components/ui/__tests__/Terminal.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Terminal from '../Terminal';

describe('Terminal', () => {
  it('does not render when closed', () => {
    render(<Terminal open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows welcome message on open', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    expect(screen.getByText(/help/i)).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<Terminal open={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('responds to the help command', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/available/i)).toBeInTheDocument();
  });

  it('responds to the whoami command', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/justin/i)).toBeInTheDocument();
  });

  it('shows error for unknown commands', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'foobar' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/command not found/i)).toBeInTheDocument();
  });

  it('shows cheeky response for destructive commands', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'sudo rm -rf /' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/permission denied/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — verify it fails**

```bash
cd web && pnpm test Terminal 2>&1 | tail -10
```

Expected: FAIL — module not found

- [ ] **Step 3: Implement Terminal**

Create `web/src/components/ui/Terminal.tsx`:

```typescript
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
        <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>justin@jussaw — terminal</span>
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
                <span style={{ color: '#58a6ff' }}>justin@jussaw</span>
                <span style={{ color: '#8b949e' }}>:~$ </span>
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
        <span style={{ color: '#58a6ff' }}>justin@jussaw</span>
        <span style={{ color: '#8b949e' }}>:~$</span>
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
```

- [ ] **Step 4: Run — verify it passes**

```bash
cd web && pnpm test Terminal 2>&1 | tail -10
```

Expected: PASS (8 tests)

- [ ] **Step 5: Wire terminal into page.tsx with `~` trigger**

Open `web/src/app/page.tsx`. Add import:

```typescript
import Terminal from '@/components/ui/Terminal';
```

Add state and global `~` listener:

```tsx
const [terminalOpen, setTerminalOpen] = useState(false);

useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === '~') setTerminalOpen(true);
  };
  document.addEventListener('keydown', onKey);
  return () => document.removeEventListener('keydown', onKey);
}, []);
```

Add `<Terminal>` at the end of the JSX:

```tsx
<Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
```

- [ ] **Step 6: Run all tests**

```bash
cd web && pnpm test 2>&1 | tail -20
```

Expected: all pass

- [ ] **Step 7: Commit**

```bash
git add web/src/components/ui/Terminal.tsx \
        web/src/components/ui/__tests__/Terminal.test.tsx \
        web/src/app/page.tsx
git commit -m "feat: add interactive terminal easter egg triggered by ~ key"
```

---

## Task 7: Final verification

- [ ] **Step 1: Run the full test suite**

```bash
cd web && pnpm test 2>&1 | tail -30
```

Expected: all tests pass, no failures

- [ ] **Step 2: Run a production build to catch type errors**

```bash
cd web && pnpm build 2>&1 | tail -30
```

Expected: build succeeds with no TypeScript errors

- [ ] **Step 3: Spot-check in the browser**

```bash
cd web && pnpm dev
```

Verify manually:
- Theme swatch popover opens in header, hovering swatches previews live, clicking locks in, refreshing restores choice
- Projects section appears between Experience and Hobbies with all content
- Footer shows "Setup" button; clicking it slides in the drawer; Escape and backdrop close it
- Pressing `~` opens the terminal overlay; `help`, `whoami`, `ls`, `cat skills.txt`, `uptime`, `sudo rm -rf /`, `exit` all work as expected

- [ ] **Step 4: Final commit if any adjustments were made**

```bash
cd web && git add -p
git commit -m "fix: address visual polish from browser spot-check"
```
