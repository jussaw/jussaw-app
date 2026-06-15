# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This is a small monorepo for the jussaw.com personal portfolio site:

- `web/` — the Next.js 16 application. **This is where nearly all work happens.** It has its own detailed `web/CLAUDE.md` — read it before touching app code.
- `devops/` — deployment scripts (`deploy.sh`).
- `docs/` — design specs and plans (gitignored; not part of the build).

There is no root `package.json`. All build/lint/test tooling lives in `web/`, so **run pnpm commands from inside `web/`**, not the repo root.

## Git Hooks Gotcha

The pnpm `prepare` script (in `web/package.json`) points Git's `core.hooksPath` at `web/.husky` even though commits are made from the repo root. Husky + lint-staged run Prettier and ESLint on staged files; commits with lint errors are blocked. If hooks aren't firing, run `pnpm install` (or `pnpm prepare`) from `web/` to re-register them.

## Deployment

`devops/deploy.sh` is the production deploy: it `git pull --ff-only`s, then `docker compose -f web/docker-compose.yml up --build -d`. The container serves on **port 23412** (mapped to the app's internal 3000). The Dockerfile produces a Next.js `output: "standalone"` build, so `NEXT_PUBLIC_*` env vars must be passed as build args, not runtime env.

## App Architecture (high level)

See `web/CLAUDE.md` for commands, code style, and conventions. The big picture worth knowing up front:

- **Single-page composition**: `web/src/app/page.tsx` renders the portfolio as an ordered list of section components (Header → Hero → Skills → Experience → Projects → Hobbies → Terminal → Footer). There is no router beyond the App Router shell.
- **Content is data-driven**: all copy lives in `web/src/data/content.ts` (typed via `SiteContent`). Edit content there — do not hardcode text in components.
- **Scroll tracking is centralized**: `web/src/hooks/useActiveSection.ts` exports a single `SECTIONS` array (id + label) that is the source of truth for scroll-spy. `TimelineScrollbar` reads it to render the floating nav. A section's DOM `id` (passed from `page.tsx`) **must match** an entry in `SECTIONS`, or it won't be tracked or navigable.
- **Theming via CSS variables**: colors and fonts are defined in the `@theme` block of `web/src/app/globals.css` and consumed as `var(--color-*)`. Because Turbopack doesn't auto-generate utilities from `@theme`, custom classes (e.g. `bg-bg`, `text-accent`) are declared explicitly via `@utility` in the same file — add a matching `@utility` when introducing a new themed color.
