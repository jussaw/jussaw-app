# jussaw-app — CLAUDE.md

## Project

Personal portfolio site for Justin Sawyer (jussaw.com). A Next.js 16 app with Docker-based deployment.

## ⚠️ Next.js 16 — Read Before Writing Code

This is **not** the Next.js you know from training data. APIs, conventions, and file structure may all differ. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/`. Heed deprecation notices.

## Stack

- **Framework**: Next.js 16 (App Router, `output: "standalone"`)
- **Language**: TypeScript (strict mode, `@/*` → `./src/*` alias)
- **Styling**: Tailwind CSS 4.x
- **Testing**: Vitest 4 + jsdom + @testing-library/react
- **Package manager**: pnpm
- **Deployment**: Docker / Docker Compose (port 23412)

## Key Commands

```bash
pnpm dev          # Dev server at http://localhost:3000
pnpm build        # Production build (standalone)
pnpm start        # Run production build
pnpm lint         # ESLint
pnpm lint:fix     # ESLint auto-fix
pnpm format       # Prettier format all src files
pnpm format:check # Prettier check (no writes)
pnpm test         # Vitest (single run)
pnpm test:watch   # Vitest (watch mode)
```

## Code Style

- **Linter**: ESLint with [Airbnb style guide](https://github.com/airbnb/javascript) via `eslint-config-airbnb` + `eslint-config-airbnb-typescript`
- **Formatter**: Prettier (single quotes, 2-space indent, trailing commas, 100-char line width)
- **Pre-commit**: `husky` + `lint-staged` — Prettier and ESLint run automatically on staged files
- Run `pnpm lint:fix` to auto-fix all lint violations
- Run `pnpm format` to reformat all source files

## Directory Layout

```
web/
  src/
    app/            # App Router (layout.tsx, page.tsx, globals.css)
    components/
      sections/     # Page sections: Hero, Skills, Experience, Projects, Hobbies, Footer
      ui/           # Reusable UI: SectionWrapper, SkillBadge, ExperienceCard, TimelineScrollbar, ProjectCard, SetupDrawer, Terminal
    hooks/          # useScrollReveal, useActiveSection
    data/           # content.ts — all portfolio content lives here
    test/           # Vitest setup (setup.ts)
```

## Editing site content

All portfolio copy lives in `src/data/content.ts`. Whenever you change `siteContent`, you must also refresh the freshness metadata in the same commit, so `app/sitemap.ts` reports an honest `lastModified`:

1. Make your content edit(s).
2. Run `pnpm test src/data/__tests__/content.test.ts`. The `content freshness` test recomputes a SHA-256 fingerprint of `siteContent`; if it changed, the test **fails and prints the new hash**.
3. Paste that hash into `CONTENT_FINGERPRINT`, and set `CONTENT_LAST_UPDATED` to today's date (`YYYY-MM-DD`).
4. Re-run the test — it should pass.

The date must stay a **static literal** (never `new Date()`, git metadata, or any runtime source) so the sitemap is deterministic across Docker builds. The fingerprint tripwire is what makes a content change without a date bump fail CI.

## Conventions

- **Content changes**: Edit `src/data/content.ts` — never hardcode text in components. Bump the freshness metadata (see "Editing site content" above).
- **Tests**: Colocated in `__tests__/` directories next to the files they test.
- **Section IDs**: Sections that need scroll tracking must have an `id` prop passed from `page.tsx`.
- **Path alias**: Always use `@/` imports, never relative paths that traverse directories.
- **Icons**: Use `react-icons` for all icons (e.g. `react-icons/fa`). Do not use `lucide-react`.

## Docker

```bash
docker compose up --build   # Build and run locally on port 23412
```

Environment variables prefixed `NEXT_PUBLIC_*` must be set at **build time**. Server-only vars can be set at runtime.
