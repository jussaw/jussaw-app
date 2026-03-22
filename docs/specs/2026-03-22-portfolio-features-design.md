# Portfolio Features Design

**Date:** 2026-03-22
**Status:** Approved

## Overview

Add four new features to jussaw.com to signal both engineering craft and distinct personality:

1. **Theme Switcher** — interactive swatch popover in the header
2. **Projects Section** — portfolio as its own case study on the main page
3. **Setup Drawer** — slide-in panel showing personal kit/gear
4. **Interactive Terminal Easter Egg** — hidden terminal overlay triggered by `~` key

## Goals

- Signal "strong engineer who cares about craft" through technical depth (theme system, self-hosting, Docker)
- Signal "distinct personality and fun to work with" through personality layers (setup, easter egg)
- Keep the single-page feel intact — no sprawling navigation

## Feature Specs

### 1. Theme Switcher

**Location:** Header (`components/sections/Header.tsx`), alongside existing contact icons

**Behavior:**

- A palette icon button in the header
- Clicking opens a swatch popover — a grid of circular color swatches, one per theme (derive count from `src/styles/themes/` directory at build time)
- Hovering a swatch previews the theme live on the page (applies `data-theme` to `<body>` temporarily)
- Clicking a swatch locks the theme in and persists to `localStorage`
- On page load, apply theme from `localStorage` if set, otherwise use the default
- Popover closes when clicking outside or pressing Escape

**Implementation:**

- New `ThemeSwitcher` component at `src/components/ui/ThemeSwitcher.tsx`
- Theme list derived from CSS files in `src/styles/themes/` — each file name is the theme key (count derived at build time, not hardcoded)
- Each swatch reads the primary color from the theme (use a hardcoded color map or extract from CSS)
- Uses `document.body.setAttribute('data-theme', themeName)` to switch (matches existing `body[data-theme]` CSS selectors in `layout.tsx`)

---

### 2. Projects Section

**Location:** New section on `src/app/page.tsx`, placed between Experience and Hobbies

**Content:** Single project card for this portfolio site. Content lives in `src/data/content.ts` following existing conventions.

**Card structure:**

- Title: "jussaw.com"
- Short description: "This site — designed, built, and self-hosted"
- 4-5 bullet highlights:
  - 27-theme design system via CSS custom properties
  - Self-hosted on Raspberry Pi via Docker + Docker Compose
  - Standalone Next.js build optimized for minimal production artifact
  - Scroll-triggered animations with Intersection Observer API
  - Full test coverage with Vitest + React Testing Library
- Tech stack badge row: Next.js 16, TypeScript, Tailwind CSS 4, Docker, Raspberry Pi
- Links: Live site (jussaw.com), GitHub repo — both URLs stored in `src/data/content.ts` under the project entry, not hardcoded in the component

**Implementation:**

- New `Projects` section component at `src/components/sections/Projects.tsx`
- New `ProjectCard` UI component at `src/components/ui/ProjectCard.tsx`
- Content added to `src/data/content.ts` under a `projects` key
- Follows the same `SectionWrapper` and scroll-reveal patterns as other sections

---

### 3. Setup Drawer

**Trigger:** A subtle "Setup" or "Uses" link in the footer

**Behavior:**

- Clicking the link slides in a panel from the right edge of the viewport
- Panel shows personal kit data (already exists in `content.ts`) in a clean categorized list
- Categories: Keyboard, Laptop, Headphones, Editor, Terminal
- Closes via Escape key or clicking the backdrop overlay
- Smooth slide-in/out animation (CSS transition)

**Implementation:**

- New `SetupDrawer` component at `src/components/ui/SetupDrawer.tsx`
- Drawer open/close state managed in `src/app/page.tsx` (root page) — passed as props to Footer (trigger) and SetupDrawer; no context provider needed given the shallow prop chain
- Footer updated to include the trigger link
- Content driven by existing kit data in `src/data/content.ts`

---

### 4. Interactive Terminal Easter Egg

**Trigger:** Pressing `~` anywhere on the page (global `keydown` listener)

**Behavior:**

- Opens a full-screen dark overlay styled like a terminal (dark background, monospace font, green/blue accents)
- Auto-prints a welcome line on open: e.g. `Welcome. Type 'help' to get started.`
- Visitor can type commands at a prompt: `justin@jussaw:~$`
- Supported commands:
  - `help` — lists available commands
  - `whoami` — prints a short bio line
  - `ls` — lists "files": `skills.txt`, `experience.txt`, `hobbies/`, `setup.txt`
  - `cat skills.txt` / `cat experience.txt` / `cat setup.txt` — prints relevant content
  - `uptime` — prints a cheeky uptime line (e.g. "up 847 days — still going")
  - `clear` — clears terminal output
  - `exit` — closes the overlay
- Unknown commands return a cheeky error (e.g. `command not found. try 'help'`)
- Destructive-looking commands (`rm`, `sudo`, etc.) get a special response (`Permission denied. Nice try.`)
- Closes with Escape key or `exit` command

**Implementation:**

- New `Terminal` component at `src/components/ui/Terminal.tsx`
- Global `keydown` listener registered via a custom hook — must guard against firing when focus is inside any input/textarea element
- Terminal content/responses driven by a command map — easy to extend
- No external dependencies

---

## Architecture Notes

- All new content (projects, setup) goes in `src/data/content.ts` — never hardcoded in components
- New UI components go in `src/components/ui/`
- New section components go in `src/components/sections/`
- Follow existing scroll-reveal animation patterns using `useScrollReveal` hook
- Follow existing test structure — colocated `__tests__/` folders with Vitest + RTL

## Out of Scope

- Blog or writing section
- Multiple projects (only this portfolio for now)
- Analytics or visitor tracking
- Any backend changes
