import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Regression guard for AUD-20260726-01.
 *
 * The native scrollbar is the only scroll/navigation affordance below Tailwind's
 * `md` breakpoint (TimelineScrollbar is `hidden md:flex`). So the rules that hide
 * the native scrollbar must live inside `@media (min-width: 768px)` only — never
 * in the default/mobile cascade.
 */

const css = readFileSync(resolve(__dirname, '../globals.css'), 'utf8');

/** Parse globals.css through the browser CSSOM and return top-level vs. md-scoped rules. */
function loadRules() {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  const { cssRules } = style.sheet!;

  const topLevel: CSSStyleRule[] = [];
  let mdRule: CSSMediaRule | undefined;

  Array.from(cssRules).forEach((rule) => {
    if (rule instanceof CSSMediaRule) {
      if (/min-width:\s*768px/.test(rule.media.mediaText)) mdRule = rule;
    } else if (rule instanceof CSSStyleRule) {
      topLevel.push(rule);
    }
  });

  document.head.removeChild(style);
  return { topLevel, mdRule };
}

const suppressesScrollbar = (rule: CSSStyleRule) =>
  rule.style.getPropertyValue('scrollbar-width') === 'none' ||
  (/::-webkit-scrollbar/.test(rule.selectorText) &&
    rule.style.getPropertyValue('display') === 'none');

describe('globals.css native scrollbar contract', () => {
  it('hides the native scrollbar only inside the min-width:768px media query', () => {
    const { mdRule } = loadRules();
    expect(mdRule).toBeDefined();

    const inner = Array.from(mdRule!.cssRules).filter(
      (r): r is CSSStyleRule => r instanceof CSSStyleRule,
    );
    expect(inner.some((r) => r.style.getPropertyValue('scrollbar-width') === 'none')).toBe(true);
    expect(
      inner.some(
        (r) =>
          /::-webkit-scrollbar/.test(r.selectorText) &&
          r.style.getPropertyValue('display') === 'none',
      ),
    ).toBe(true);
  });

  it('leaves the native scrollbar visible in the default/mobile cascade', () => {
    const { topLevel } = loadRules();
    expect(topLevel.some(suppressesScrollbar)).toBe(false);
  });
});
