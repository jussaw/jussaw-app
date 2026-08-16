import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Regression guard for AUD-20260805-01.
 *
 * `html { scroll-behavior: smooth }` is what makes ordinary anchor navigation glide, but it
 * also silently animates every programmatic scroll that does not name a behavior — including
 * `scrollIntoView({ behavior: 'auto' })`. Under prefers-reduced-motion the <html> rule has to
 * be turned off, or the page keeps animating scrolls the user asked not to see.
 */

const css = readFileSync(resolve(__dirname, '../globals.css'), 'utf8');

function loadRules() {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  const { cssRules } = style.sheet!;

  const topLevel: CSSStyleRule[] = [];
  let reduceRule: CSSMediaRule | undefined;

  Array.from(cssRules).forEach((rule) => {
    if (rule instanceof CSSMediaRule) {
      if (/prefers-reduced-motion:\s*reduce/.test(rule.media.mediaText)) reduceRule = rule;
    } else if (rule instanceof CSSStyleRule) {
      topLevel.push(rule);
    }
  });

  document.head.removeChild(style);
  return { topLevel, reduceRule };
}

const htmlRules = (rules: CSSStyleRule[]) =>
  rules.filter((r) => /(^|,)\s*html\b/.test(r.selectorText));

describe('globals.css scroll-behavior contract', () => {
  it('disables smooth scrolling on <html> under prefers-reduced-motion', () => {
    const { reduceRule } = loadRules();
    expect(reduceRule).toBeDefined();

    const inner = Array.from(reduceRule!.cssRules).filter(
      (r): r is CSSStyleRule => r instanceof CSSStyleRule,
    );
    const behaviors = htmlRules(inner).map((r) => r.style.getPropertyValue('scroll-behavior'));

    expect(behaviors).toContain('auto');
    expect(behaviors).not.toContain('smooth');
  });

  it('keeps smooth scrolling as the default for users with no motion preference', () => {
    const { topLevel } = loadRules();
    const behaviors = htmlRules(topLevel).map((r) => r.style.getPropertyValue('scroll-behavior'));

    expect(behaviors).toContain('smooth');
  });
});
