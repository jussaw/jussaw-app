import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Regression guard for AUD-20260728-01.
 *
 * The terminal prompt used to hide the native input (transparent text and caret) and
 * repaint the value into a mirror span next to a fake cursor div. A mirror cannot
 * scroll with the input, so any command longer than the prompt line clipped its own
 * tail and cursor. The fix is to let the native input paint itself and rely on its
 * built-in horizontal scrolling — which only works while it stays a flex child that
 * is allowed to shrink below its content width.
 */

const css = readFileSync(resolve(__dirname, '../Terminal.module.css'), 'utf8');
const tsx = readFileSync(resolve(__dirname, '../Terminal.tsx'), 'utf8');

/** Parse Terminal.module.css through the browser CSSOM. */
function loadStyleRules() {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  const rules = Array.from(style.sheet!.cssRules);
  document.head.removeChild(style);

  return rules.filter((r): r is CSSStyleRule => r instanceof CSSStyleRule);
}

/** jsdom exposes no CSSKeyframesRule, so read animation names off the source instead. */
const keyframeNames = () => Array.from(css.matchAll(/@keyframes\s+([\w-]+)/g), (m) => m[1]);

const ruleFor = (selector: string) => {
  const rule = loadStyleRules().find((r) => r.selectorText === selector);
  expect(rule, `expected a \`${selector}\` rule in Terminal.module.css`).toBeDefined();
  return rule!.style;
};

describe('Terminal input overflow contract', () => {
  it('paints the input text and caret rather than hiding them', () => {
    const style = ruleFor('.inputField');

    // Assert the declarations resolve through the theme, not that they equal a specific
    // color — the palette is free to change, invisibility is what must never come back.
    expect(style.getPropertyValue('color')).toMatch(/^var\(--color-/);
    expect(style.getPropertyValue('caret-color')).toMatch(/^var\(--color-/);
  });

  it('lets the input shrink below its content width so it can scroll horizontally', () => {
    const style = ruleFor('.inputField');

    // Without `min-width: 0` a flex item floors at its content width, pushing the
    // prompt line (and the page) into horizontal overflow instead of scrolling.
    expect(style.getPropertyValue('min-width')).toBe('0');

    const flex = style.getPropertyValue('flex') || style.getPropertyValue('flex-grow');
    expect(flex).not.toBe('');
    expect(flex).not.toMatch(/^(0|none)\b/);

    // `flex`/`min-width` only mean anything inside a flex container.
    expect(ruleFor('.activeInputLine').getPropertyValue('display')).toBe('flex');
  });

  it('has no mirror, cursor, or clipping-wrapper rules left in the stylesheet', () => {
    // Matched on selectors, not raw source, so `.container { cursor: text }` is not a hit.
    expect(
      loadStyleRules()
        .map((r) => r.selectorText)
        .filter((s) => /\.(inputWrapper|inputMirror|cursor)/.test(s)),
    ).toEqual([]);
    expect(keyframeNames().filter((n) => /cursor/i.test(n))).toEqual([]);
  });

  it('has no mirror, cursor, or clipping-wrapper class references left in Terminal.tsx', () => {
    expect(tsx).toMatch(/styles\.inputField/);
    expect(tsx.match(/styles\.(inputWrapper|inputMirror|cursor\w*)/g)).toBeNull();
  });
});
