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

A curated orientation map, not an exhaustive tree — it names the directories and the
components/hooks worth knowing up front. Treat the repository as the source of truth and
list the directory before assuming something does or does not exist.

```
web/
  src/
    app/            # App Router (layout.tsx, page.tsx, globals.css)
    components/
      sections/     # Page sections, in render order: Header, Hero, Skills, Experience,
                    #   Projects, Hobbies, Terminal, Footer
      ui/           # Reusable UI: SectionWrapper, SkillBadge, ExperienceCard, ProjectCard,
                    #   TimelineScrollbar, KonamiEasterEgg
    hooks/          # useActiveSection, useScrollReveal, useKonamiCode, useTabCompletion
    data/           # content.ts — all portfolio content lives here
    test/           # Vitest setup (setup.ts)
```

`Terminal` is a page section (`components/sections/Terminal.tsx`, with a colocated
`Terminal.module.css`), not a reusable UI component. `useTabCompletion` backs the Terminal's
input; `useKonamiCode` backs `ui/KonamiEasterEgg`.

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

### Public build-time vs. server-only runtime variables

`NEXT_PUBLIC_*` values are inlined into the client bundle by `next build`, so they are **build-time and browser-visible**. They travel through an explicit allowlist — there is no wildcard forwarding:

| Variable               | Default              | Consumed by                                                          |
| ---------------------- | -------------------- | -------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://jussaw.com` | `app/layout.tsx` metadata/JSON-LD, `app/sitemap.ts`, `app/robots.ts` |

Adding one means editing all four in the same change:

1. `src/utils/publicEnv.ts` — add to `PUBLIC_ENV_ALLOWLIST` **and** read it as a static `process.env.NEXT_PUBLIC_X` access (a dynamic `process.env[name]` lookup is not inlined by Next and is `undefined` in the browser).
2. `Dockerfile` — a named `ARG` in the builder stage, before `RUN pnpm build`.
3. `docker-compose.yml` — a named entry under `build.args`.
4. `README.md` — the supported-variables table.

`src/utils/__tests__/publicEnvBuildContract.test.ts` fails if those drift apart; `.github/workflows/docker-build-args.yml` proves the value actually reaches the bundle through `docker build`.

Server-only variables (no `NEXT_PUBLIC_` prefix) are runtime container env, are never baked into the image, and are the only place secrets belong. Never put a secret in an `ARG`, a `--build-arg`, or a `NEXT_PUBLIC_` name.
