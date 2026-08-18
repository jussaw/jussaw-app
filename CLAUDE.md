# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

This is a small monorepo for the jussaw.com personal portfolio site:

- `web/` — the Next.js 16 application. **This is where nearly all work happens.** It has its own detailed `web/CLAUDE.md` — read it before touching app code.
- `.github/workflows/` — CI (see below).
- `docs/` — design specs and plans (gitignored; not part of the build).

There is no root `package.json`. All build/lint/test tooling lives in `web/`, so **run pnpm commands from inside `web/`**, not the repo root.

## CI

`.github/workflows/quality.yml` defines the `quality` job, which runs on pull requests targeting `main` and on pushes to `main`. Using Node 22 and pnpm 11.5.3, it runs `pnpm format:check`, `pnpm lint`, `pnpm test`, then `pnpm build` from `web/`, stopping at the first failure. `quality` is a required status check for merging into `main` — run those four commands from `web/` before pushing.

The same workflow publishes the deployable image, but **only on pushes to `main`** and only after `quality` passes: `publish-image` builds `linux/amd64` and `linux/arm64` on native runners (`ubuntu-24.04` and `ubuntu-24.04-arm`) and pushes each by digest, then `publish-manifest` joins them into one multi-arch manifest tagged `latest` and `sha-<commit>`. They live in `quality.yml` rather than their own file so `needs: quality` can gate them — a red build must not publish an image, because pi4's watchtower deploys `:latest` automatically. Both are skipped on pull requests.

`.github/workflows/docker-build-args.yml` is separate and path-filtered: it proves the public build-arg contract through a real `docker build`.

## Git Hooks Gotcha

The pnpm `prepare` script (in `web/package.json`) points Git's `core.hooksPath` at `web/.husky` even though commits are made from the repo root. Husky + lint-staged run Prettier and ESLint on staged files; commits with lint errors are blocked. If hooks aren't firing, run `pnpm install` (or `pnpm prepare`) from `web/` to re-register them.

## Deployment

**This repository does not deploy itself.** CI publishes `ghcr.io/jussaw/jussaw-app` (public package, multi-arch), and the running stack is owned by [jussaw-server](https://github.com/jussaw/jussaw-server), which deploys the `sites` stack from its own clone of the private `portainer-compose` repo — the compose file lives at `pi4/sites/docker-compose.yml` there, not here. The container serves on **port 23412** (mapped to the app's internal 3000), which cloudflared routes jussaw.com to; changing that port means changing the tunnel.

`web/docker-compose.yml` is for **local builds only**. Running it on a node would stand up a second compose project competing with the managed stack. It stays in the repo because the build-arg contract test and `docker-build-args.yml` both assert against it.

The Dockerfile produces a Next.js `output: "standalone"` build, so `NEXT_PUBLIC_*` env vars must be passed as build args, not runtime env — that is why the publish job passes `NEXT_PUBLIC_SITE_URL` with `--build-arg` rather than leaving it to the container's environment.

Public build-time variables go through an explicit allowlist rather than blanket forwarding: `PUBLIC_ENV_ALLOWLIST` in `web/src/utils/publicEnv.ts`, a matching builder-stage `ARG` in `web/Dockerfile`, and a matching `build.args` entry in `web/docker-compose.yml`. Today that is one variable, `NEXT_PUBLIC_SITE_URL` (default `https://jussaw.com`). Its value is browser-visible, so it must never carry a secret — server-only values stay as runtime `environment` entries. See `web/CLAUDE.md` for the procedure when adding one.

## App Architecture (high level)

See `web/CLAUDE.md` for commands, code style, and conventions. The big picture worth knowing up front:

- **Single-page composition**: `web/src/app/page.tsx` renders the portfolio as an ordered list of section components (Header → Hero → Skills → Experience → Projects → Hobbies → Terminal → Footer). There is no router beyond the App Router shell.
- **Content is data-driven**: all copy lives in `web/src/data/content.ts` (typed via `SiteContent`). Edit content there — do not hardcode text in components.
- **Scroll tracking is centralized**: `web/src/hooks/useActiveSection.ts` exports a single `SECTIONS` array (id + label) that is the source of truth for scroll-spy. `TimelineScrollbar` reads it to render the floating nav. A section's DOM `id` (passed from `page.tsx`) **must match** an entry in `SECTIONS`, or it won't be tracked or navigable.
- **Theming via CSS variables**: colors and fonts are defined in the `@theme` block of `web/src/app/globals.css` and consumed as `var(--color-*)`. Because Turbopack doesn't auto-generate utilities from `@theme`, custom classes (e.g. `bg-bg`, `text-accent`) are declared explicitly via `@utility` in the same file — add a matching `@utility` when introducing a new themed color.
