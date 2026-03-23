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
pnpm test         # Vitest (single run)
pnpm test:watch   # Vitest (watch mode)
```

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

## Conventions
- **Content changes**: Edit `src/data/content.ts` — never hardcode text in components.
- **Tests**: Colocated in `__tests__/` directories next to the files they test.
- **Section IDs**: Sections that need scroll tracking must have an `id` prop passed from `page.tsx`.
- **Path alias**: Always use `@/` imports, never relative paths that traverse directories.
- **Icons**: Use `react-icons` for all icons (e.g. `react-icons/fa`). Do not use `lucide-react`.

## Docker
```bash
docker compose up --build   # Build and run locally on port 23412
```
Environment variables prefixed `NEXT_PUBLIC_*` must be set at **build time**. Server-only vars can be set at runtime.
