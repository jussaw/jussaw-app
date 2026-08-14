import { readFileSync } from 'fs';
import { resolve } from 'path';

import { fireEvent, render, screen, within } from '@testing-library/react';

import Terminal from '../Terminal';

vi.stubGlobal(
  'IntersectionObserver',
  // eslint-disable-next-line prefer-arrow-callback
  vi.fn(function () {
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
);

const terminalSource = readFileSync(resolve(__dirname, '../Terminal.tsx'), 'utf8');

/**
 * Queries scoped to the scrollable output. This suite counts scrollback lines, and the live
 * region (AUD-20260802-01) holds a copy of the latest response outside it — an unscoped count
 * would conflate the two. Substring match needed because Vite hashes CSS module class names
 * (_output_abc123); .output renders before any .lineOutput divs, so it matches the container.
 */
const inScrollback = () => {
  const output = document.querySelector<HTMLElement>('[class*="output"]');
  if (!output) throw new Error('scrollback container not found');
  return within(output);
};

describe('Terminal scrollback line identity', () => {
  it('keeps duplicate output lines through append and clear', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');

    fireEvent.change(input, { target: { value: 'echo duplicate' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: 'echo duplicate' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(inScrollback().getAllByText('duplicate')).toHaveLength(2);

    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.change(input, { target: { value: 'echo duplicate' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(inScrollback().getAllByText('duplicate')).toHaveLength(1);
  });

  it('uses a line ID assigned at insertion as the React key', () => {
    expect(terminalSource).toMatch(/type Line = \{ id: number; type:/);
    expect(terminalSource).toMatch(/const id = lineIdRef\.current;/);
    expect(terminalSource).toMatch(/lineIdRef\.current \+= 1;/);
    expect(terminalSource).toMatch(/lines\.map\(\(line\) => \(/);
    expect(terminalSource).toMatch(/key=\{line\.id\}/);
    expect(terminalSource).not.toMatch(/lines\.map\(\(line,\s*(?:i|index)\)/);
    expect(terminalSource).not.toMatch(/eslint-disable[^\n]*react\/no-array-index-key/);
  });
});
