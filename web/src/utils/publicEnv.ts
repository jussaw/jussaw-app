/**
 * Public (browser-visible) build-time configuration.
 *
 * Every `NEXT_PUBLIC_*` value is inlined into the JavaScript bundle by
 * `next build`, so anything listed here is public forever — never route a
 * secret through this module. Server-only values (API keys, database URLs)
 * stay out of this file and are injected as container runtime env instead.
 *
 * The allowlist below is the single source of truth for the build contract:
 * `web/Dockerfile` declares a matching builder-stage `ARG` and
 * `web/docker-compose.yml` a matching `build.args` entry, so a documented
 * variable actually reaches `pnpm build`. Adding a variable means touching all
 * three (plus the docs) — `src/utils/__tests__/publicEnvBuildContract.test.ts`
 * fails until they agree.
 *
 * Reads must be *static* `process.env.NEXT_PUBLIC_X` property accesses.
 * Next.js replaces them textually at build time; a dynamic lookup such as
 * `process.env[name]` is not substituted and resolves to `undefined` in the
 * browser.
 */

/** Every public variable the build is allowed to inject. Literal, not derived. */
export const PUBLIC_ENV_ALLOWLIST = ['NEXT_PUBLIC_SITE_URL'] as const;

/** Canonical public origin used when `NEXT_PUBLIC_SITE_URL` is unset or invalid. */
export const DEFAULT_SITE_URL = 'https://jussaw.com';

const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]'];

/**
 * Reduce a candidate site URL to a bare, trusted origin.
 *
 * The value ends up in `metadataBase`, the canonical link, Open Graph tags and
 * JSON-LD, so it is validated rather than trusted: only `https` (or `http` on a
 * loopback host, for local/preview builds), no credentials, no path, query or
 * fragment. Anything else falls back to {@link DEFAULT_SITE_URL} — a bad build
 * arg degrades to the real site instead of publishing an attacker-chosen or
 * malformed origin, and never fails the build mid-prerender.
 */
export function normalizeSiteUrl(raw: string | undefined): string {
  if (!raw) return DEFAULT_SITE_URL;

  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return DEFAULT_SITE_URL;
  }

  // `hostname` (not `host`) excludes the port and keeps an IPv6 literal in its
  // canonical bracketed form, so `http://[::1]:3000` matches the `[::1]` entry.
  const isLoopback = LOCAL_HOSTNAMES.includes(parsed.hostname);
  const protocolOk = parsed.protocol === 'https:' || (parsed.protocol === 'http:' && isLoopback);
  if (!protocolOk) return DEFAULT_SITE_URL;
  if (parsed.username || parsed.password) return DEFAULT_SITE_URL;
  if (parsed.pathname !== '/' || parsed.search || parsed.hash) return DEFAULT_SITE_URL;

  return parsed.origin;
}

/** Public site origin, without a trailing slash (e.g. `https://jussaw.com`). */
export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
