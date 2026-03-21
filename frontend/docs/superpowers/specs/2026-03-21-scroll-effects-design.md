# Scroll Effects & Scrollbar Removal — Design Spec

**Date:** 2026-03-21
**Status:** Approved

---

## Goal

Add fade + slide-up scroll reveal animations to the jussaw.com portfolio page, and remove the default browser scrollbar. Animations re-trigger every time an element re-enters the viewport (not once-only).

---

## Scrollbar Removal

Merge into the existing `html` block in `src/app/globals.css` (do not add a second `html {}` block):

```css
html {
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
}
html::-webkit-scrollbar {
  display: none; /* Chrome / Safari */
}
```

No JavaScript required. Page remains scrollable — only the visible scrollbar track is hidden.

---

## Scroll Reveal Hook

**File:** `src/hooks/useScrollReveal.ts`

Must begin with `'use client'` directive (uses `useEffect` and `useRef`, browser-only APIs).

- Accepts a `RefObject<HTMLElement | null>` and an optional `threshold` (default `0.12`)
- Creates an `IntersectionObserver` inside a `useEffect` — **not** `useLayoutEffect` (SSR safety: `useLayoutEffect` produces warnings during server rendering; `useEffect` is the correct choice for DOM observation)
- `new IntersectionObserver(...)` must only be called inside `useEffect`, never at module scope or in the component body, to avoid SSR errors
- On **enter** (isIntersecting): adds class `visible` to the element
- On **leave** (!isIntersecting): removes class `visible` from the element
- Returns the cleanup function from `useEffect` that calls `observer.disconnect()`

---

## CSS Classes

Added to `src/app/globals.css`:

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Respect user's motion preference */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

---

## Application Points

### SectionWrapper (`src/components/ui/SectionWrapper.tsx`)
- Add `'use client'` directive at top of file
- Add a `ref` to the section's outer element
- Call `useScrollReveal(ref)`
- Add `reveal` to the element's className
- Effect: every section (Skills, Experience, Hobbies, Footer) animates in as a unit

### Hero (`src/components/sections/Hero.tsx`)
- The Hero is above the fold on page load — it is always visible without scrolling. The intent is a **page load entrance animation**, not a scroll reveal.
- Add `'use client'` directive
- Add `reveal` class + `useScrollReveal` to the inner content container div
- Add `transition-delay: 150ms` via inline style (`style={{ transitionDelay: '150ms' }}`) so the entrance animation plays after a brief moment, feeling intentional rather than a flash
- The IntersectionObserver will fire immediately on mount since the element is in the viewport; this is expected and produces the desired entrance effect

### ExperienceCard (`src/components/ui/ExperienceCard.tsx`)
- Add `'use client'` directive
- The component has three render branches: `timeline`, `cards`, and `minimal-text`. Apply `ref` + `useScrollReveal` + `reveal` class to the **root element of all three branches**, since each branch returns a different root element. This ensures all display modes animate regardless of which is active.

---

## What Does NOT Animate

- `<main>` wrapper
- `<body>` / `<html>`
- Skill badges within the Skills section (section-level reveal is sufficient)

No layout shifts introduced.

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/globals.css` | Merge scrollbar CSS into existing `html` block; add `.reveal` / `.reveal.visible` / `prefers-reduced-motion` |
| `src/hooks/useScrollReveal.ts` | New file — `'use client'`, `useEffect`-based IntersectionObserver hook |
| `src/components/ui/SectionWrapper.tsx` | Add `'use client'`, ref, hook, `reveal` class |
| `src/components/sections/Hero.tsx` | Add `'use client'`, ref, hook, `reveal` class, 150ms `transitionDelay` |
| `src/components/ui/ExperienceCard.tsx` | Add `'use client'`, ref, hook, `reveal` class on root element of all three render branches |

---

## Non-Goals

- No parallax
- No scroll-driven CSS animations (limited browser support)
- No Framer Motion or animation libraries
- Skills badges do not stagger individually
- `will-change: opacity, transform` not added (portfolio has few animated elements; GPU compositing hints are unnecessary at this scale)
