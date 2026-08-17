import { readFileSync } from 'fs';
import { resolve } from 'path';
import { runInNewContext } from 'vm';

import { renderToStaticMarkup } from 'react-dom/server';

import RootLayout from '@/app/layout';

// `next/font/google` loaders only exist after the Next compiler rewrites them,
// so importing layout.tsx under Vitest needs them stubbed.
vi.mock('next/font/google', () => {
  const loader = () => ({ variable: '--font-stub', className: 'font-stub', style: {} });
  return { Inter: loader, Lora: loader, JetBrains_Mono: loader };
});

/**
 * Regression guard for AUD-20260806-01.
 *
 * `.reveal` sections start at `opacity: 0` and are only revealed once
 * `useScrollReveal`'s IntersectionObserver adds `.visible`. If that hiding
 * lives in the unscoped cascade, then every visitor for whom no script runs at
 * all — JS disabled, the inline script blocked by CSP, a crawler that does not
 * execute JS — or whose browser lacks IntersectionObserver gets a blank page:
 * the markup ships, but nothing is ever painted.
 *
 * The contract enforced here is therefore: content is visible by default, and
 * the hiding styles apply *only* underneath a gate attribute that an inline
 * script puts on `<html>` before the first paint. No script run, no gate, no
 * hiding. Because the gate is set pre-paint, it does not cover a client bundle
 * that fails to load later — that case is out of scope here.
 */

const CONTENT_MARKER = 'no-js-reveal-content-marker';

const css = readFileSync(resolve(__dirname, '../globals.css'), 'utf8');

const layoutMarkup = renderToStaticMarkup(
  <RootLayout>
    <div id={CONTENT_MARKER} />
  </RootLayout>,
);

/** Inline `<script>` bodies from the layout, excluding data blocks like JSON-LD. */
function inlineScripts(markup: string): Array<{ body: string; index: number }> {
  const found: Array<{ body: string; index: number }> = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  let match = re.exec(markup);
  while (match !== null) {
    const [, attrs, body] = match;
    const typeMatch = /type="([^"]*)"/.exec(attrs);
    const type = typeMatch?.[1] ?? '';
    const isJs = type === '' || /javascript|module/.test(type);
    const isExternal = /\ssrc=/.test(attrs);
    if (isJs && !isExternal && body.trim()) {
      found.push({ body, index: match.index });
      // A gate script must not be deferred — it has to run before paint.
      expect(attrs).not.toMatch(/\s(defer|async)\b/);
    }
    match = re.exec(markup);
  }
  return found;
}

/**
 * Run an inline script against a detached `<html>` and report the `data-*`
 * attributes it set. Deriving the gate from the script (rather than hardcoding
 * a name) keeps the CSS and the script provably in agreement.
 *
 * `vm` — rather than `new Function` — is what actually models the browser here:
 * the script is evaluated as a standalone program against a sandboxed `window`
 * and `document`, not wrapped in a function body that would silently tolerate
 * things (a bare `return`, say) a real inline script would reject.
 */
function gateAttributesSetBy(body: string): Array<{ name: string; value: string }> {
  const root = document.createElement('html');
  const sandbox = {
    window: { IntersectionObserver: function IO() {} },
    document: { documentElement: root },
  };
  runInNewContext(body, sandbox);
  return Array.from(root.attributes)
    .filter((a) => a.name.startsWith('data-'))
    .map((a) => ({ name: a.name, value: a.value }));
}

/** The single gate attribute the layout's pre-paint script installs on `<html>`. */
function resolveGate() {
  const scripts = inlineScripts(layoutMarkup);
  const gates = scripts.flatMap((s) =>
    gateAttributesSetBy(s.body).map((attr) => ({ ...attr, index: s.index })),
  );
  expect(gates).toHaveLength(1);
  return gates[0];
}

/** Every style rule in the sheet, flattened out of any `@media` wrappers. */
function allStyleRules(): Array<{ rule: CSSStyleRule; media: string }> {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  const { cssRules } = style.sheet!;

  const out: Array<{ rule: CSSStyleRule; media: string }> = [];
  const walk = (rules: CSSRuleList, media: string) => {
    Array.from(rules).forEach((rule) => {
      if (rule instanceof CSSMediaRule) walk(rule.cssRules, rule.media.mediaText);
      else if (rule instanceof CSSStyleRule) out.push({ rule, media });
    });
  };
  walk(cssRules, '');

  document.head.removeChild(style);
  return out;
}

const isRevealRule = (rule: CSSStyleRule) => /\.reveal\b/.test(rule.selectorText);
const hidesContent = (rule: CSSStyleRule) => rule.style.getPropertyValue('opacity') === '0';

describe('reveal animation without JavaScript (AUD-20260806-01)', () => {
  it('installs exactly one pre-paint gate attribute on <html> before the page content', () => {
    const gate = resolveGate();
    expect(gate.value).not.toBe('');
    expect(gate.index).toBeLessThan(layoutMarkup.indexOf(CONTENT_MARKER));
  });

  it('still hides reveal content somewhere — the animation is not simply gone', () => {
    const hiding = allStyleRules().filter(({ rule }) => isRevealRule(rule) && hidesContent(rule));
    expect(hiding.length).toBeGreaterThan(0);
  });

  it('scopes every reveal-hiding rule under the JS gate attribute', () => {
    const gate = resolveGate();
    const hiding = allStyleRules().filter(({ rule }) => isRevealRule(rule) && hidesContent(rule));

    hiding.forEach(({ rule }) => {
      expect(rule.selectorText).toContain(`[${gate.name}`);
    });
  });

  it('leaves reveal content painted when the gate is absent', () => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const section = document.createElement('section');
    section.className = 'reveal';
    const child = document.createElement('div');
    child.className = 'reveal-stagger';
    section.appendChild(child);
    document.body.appendChild(section);

    expect(getComputedStyle(section).opacity).not.toBe('0');
    expect(getComputedStyle(child).opacity).not.toBe('0');

    document.body.removeChild(section);
    document.head.removeChild(style);
  });

  it('preserves the IntersectionObserver contract: .visible reveals gated content', () => {
    const gate = resolveGate();
    const visibleRules = allStyleRules().filter(
      ({ rule }) =>
        /\.reveal\.visible\b/.test(rule.selectorText) &&
        rule.style.getPropertyValue('opacity') === '1',
    );

    expect(visibleRules.length).toBeGreaterThan(0);
    visibleRules.forEach(({ rule }) => expect(rule.selectorText).toContain(`[${gate.name}`));
  });

  it('preserves reduced-motion semantics: no transform or transition under the gate', () => {
    const reduced = allStyleRules().filter(
      ({ media, rule }) => /prefers-reduced-motion:\s*reduce/.test(media) && isRevealRule(rule),
    );

    expect(reduced.length).toBeGreaterThan(0);
    reduced.forEach(({ rule }) => {
      expect(rule.style.getPropertyValue('opacity')).toBe('1');
      expect(rule.style.getPropertyValue('transition')).toBe('none');
    });
  });
});
