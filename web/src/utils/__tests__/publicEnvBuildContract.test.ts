import { readFileSync } from 'fs';
import { resolve } from 'path';

import sitemap from '@/app/sitemap';
import { PUBLIC_ENV_ALLOWLIST, SITE_URL } from '@/utils/publicEnv';

/**
 * Regression guard for AUD-20260728-02.
 *
 * The docs used to advertise a public build variable that no Dockerfile ARG,
 * Compose build arg, or application code ever read. These assertions keep the
 * four halves of the real contract — allowlist, static consumer, Docker/Compose
 * build path, and docs — from drifting apart again, and keep the build path
 * narrow (named args only, no wildcard forwarding, no secrets).
 */

const webRoot = resolve(__dirname, '../../..');
const repoRoot = resolve(webRoot, '..');

const read = (path: string) => readFileSync(path, 'utf8');

/** Source with comments removed, so prose about env access can't satisfy a code assertion. */
const stripComments = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const publicEnvSource = stripComments(read(resolve(webRoot, 'src/utils/publicEnv.ts')));
const layoutSource = read(resolve(webRoot, 'src/app/layout.tsx'));
const sitemapSource = read(resolve(webRoot, 'src/app/sitemap.ts'));
const robotsSource = read(resolve(webRoot, 'src/app/robots.ts'));
const dockerfile = read(resolve(webRoot, 'Dockerfile'));
const compose = read(resolve(webRoot, 'docker-compose.yml'));
const webReadme = read(resolve(webRoot, 'README.md'));
const webClaudeMd = read(resolve(webRoot, 'CLAUDE.md'));
const rootClaudeMd = read(resolve(repoRoot, 'CLAUDE.md'));

/** Lines of the `builder` stage, in order. */
const builderStageLines = (() => {
  const lines = dockerfile.split('\n');
  const start = lines.findIndex((line) => /^FROM\s+.*\s+AS\s+builder\s*$/.test(line));
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^FROM\s/.test(line));
  return end === -1 ? rest : rest.slice(0, end);
})();

/** Lines nested under a `key:` at `indent` spaces, up to the next sibling or shallower key. */
function yamlBlock(source: string, key: string, indent: number): string[] {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line === `${' '.repeat(indent)}${key}:`);
  expect(start, `expected "${key}:" at indent ${indent} in docker-compose.yml`).toBeGreaterThan(-1);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex(
    (line) => line.trim() !== '' && !line.startsWith(' '.repeat(indent + 1)),
  );
  return (end === -1 ? rest : rest.slice(0, end)).filter((line) => line.trim() !== '');
}

describe('public env allowlist is statically consumed', () => {
  it('reads each allowlisted variable as a static process.env property access', () => {
    PUBLIC_ENV_ALLOWLIST.forEach((name) => {
      expect(publicEnvSource).toContain(`process.env.${name}`);
    });
  });

  it('never looks env up dynamically (Next.js only inlines static accesses)', () => {
    expect(publicEnvSource).not.toMatch(/process\.env\s*\[/);
    expect(publicEnvSource).not.toMatch(/process\.env(\s*[,)}]|\s*$)/m);
  });

  it('routes layout metadata, the sitemap and robots through SITE_URL, not a hard-coded origin', () => {
    [layoutSource, sitemapSource, robotsSource].forEach((source) => {
      expect(source).toMatch(/import \{ SITE_URL \} from '@\/utils\/publicEnv';/);
      expect(source).not.toContain("'https://jussaw.com'");
    });
    expect(layoutSource).toContain('metadataBase: new URL(SITE_URL)');
    expect(layoutSource).toContain('canonical: SITE_URL');
    expect(sitemap()[0].url).toBe(SITE_URL);
  });
});

describe('Dockerfile build path', () => {
  it('declares one named ARG per allowlisted variable, before the build command', () => {
    const buildIndex = builderStageLines.findIndex((line) => /^RUN\s+pnpm build\s*$/.test(line));
    expect(buildIndex, 'builder stage must run `pnpm build`').toBeGreaterThan(-1);

    PUBLIC_ENV_ALLOWLIST.forEach((name) => {
      const argIndex = builderStageLines.findIndex((line) =>
        new RegExp(`^ARG\\s+${name}(=|\\s*$)`).test(line),
      );
      expect(argIndex, `missing builder-stage ARG ${name}`).toBeGreaterThan(-1);
      expect(argIndex).toBeLessThan(buildIndex);
    });
  });

  it('exposes no public variable outside the allowlist and forwards nothing wholesale', () => {
    const declared = dockerfile
      .split('\n')
      .map((line) => /^\s*(?:ARG|ENV)\s+(NEXT_PUBLIC_[A-Z0-9_]+)/.exec(line)?.[1])
      .filter((name): name is string => Boolean(name));
    expect(declared).toEqual([...PUBLIC_ENV_ALLOWLIST]);
    expect(dockerfile).not.toMatch(/\$\{?NEXT_PUBLIC_[A-Z0-9_]*\*/);
  });
});

describe('Compose build path', () => {
  it('uses long-form build with an explicit context', () => {
    expect(compose).toMatch(/^ {4}build:$/m);
    expect(yamlBlock(compose, 'build', 4).map((l) => l.trim())).toContain('context: .');
  });

  it('passes each allowlisted variable as a named build arg with a safe default', () => {
    const args = yamlBlock(compose, 'args', 6).map((line) => line.trim());
    const declared = args
      .filter((line) => !line.startsWith('#'))
      .map((line) => line.split(':')[0].trim());
    expect(declared).toEqual([...PUBLIC_ENV_ALLOWLIST]);
    // eslint-disable-next-line no-template-curly-in-string -- Compose interpolation, not a JS template
    expect(args).toContain('NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:-https://jussaw.com}');
  });

  it('keeps public values out of the runtime environment block', () => {
    const environment = yamlBlock(compose, 'environment', 4).map((line) => line.trim());
    const entries = environment.filter((line) => !line.startsWith('#'));
    expect(entries.join('\n')).not.toContain('NEXT_PUBLIC_');
    expect(entries).toContain('- NODE_ENV=production');
  });
});

describe('docs contract', () => {
  it('documents every allowlisted variable wherever the contract is described', () => {
    [webReadme, webClaudeMd, rootClaudeMd].forEach((doc) => {
      PUBLIC_ENV_ALLOWLIST.forEach((name) => expect(doc).toContain(name));
    });
  });

  it('no longer advertises the removed, unwired NEXT_PUBLIC_API_URL contract', () => {
    [webReadme, webClaudeMd, rootClaudeMd, dockerfile, compose].forEach((file) => {
      expect(file).not.toContain('NEXT_PUBLIC_API_URL');
    });
  });

  it('distinguishes public build-time values from server-only runtime values', () => {
    expect(webReadme).toMatch(/Public build-time variables/i);
    expect(webReadme).toMatch(/Server-only runtime variables/i);
    expect(webReadme).toContain('https://jussaw.com');
    expect(webClaudeMd).toMatch(/server-only/i);
  });
});
