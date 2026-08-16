import { fireEvent, render, screen } from '@testing-library/react';

import Terminal from '../Terminal';

vi.stubGlobal(
  'IntersectionObserver',
  // eslint-disable-next-line prefer-arrow-callback
  vi.fn(function () {
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
);

const HELP = 'available: cat <file>, clear, date, echo <text>, ls, pwd, uname, uptime, vim, whoami';

const run = (input: HTMLElement, value: string) => {
  fireEvent.change(input, { target: { value } });
  fireEvent.keyDown(input, { key: 'Enter' });
};

/**
 * Records DOM changes inside the live region. `takeRecords()` drains synchronously,
 * so a re-announcement can be asserted without awaiting the observer callback.
 */
const watch = (node: Node) => {
  const observer = new MutationObserver(() => {});
  observer.observe(node, { childList: true, characterData: true, subtree: true });
  return {
    mutations: () => observer.takeRecords(),
    stop: () => observer.disconnect(),
  };
};

describe('Terminal command-response announcements (AUD-20260802-01)', () => {
  const setup = () => {
    const view = render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    const region = screen.getByRole('status');
    return { ...view, input, region };
  };

  describe('live region contract', () => {
    it('exposes exactly one polite, atomic status region', () => {
      setup();
      const regions = screen.getAllByRole('status');
      expect(regions).toHaveLength(1);
      expect(regions[0]).toHaveAttribute('aria-live', 'polite');
      expect(regions[0]).toHaveAttribute('aria-atomic', 'true');
    });

    it('is visually hidden rather than removed from the accessibility tree', () => {
      const { region } = setup();
      // A dedicated visually-hidden class — `display: none`/`hidden` would silence it.
      expect(region.className).toMatch(/srOnly/);
      expect(region).not.toHaveAttribute('hidden');
      expect(region).not.toHaveAttribute('aria-hidden');
    });

    it('lives outside the scrollback and does not wrap the input', () => {
      const { container, region, input } = setup();
      // Substring match needed because Vite hashes CSS module class names (_output_abc123).
      const scrollback = container.querySelector('[class*="output"]');
      expect(scrollback).toBeInTheDocument();
      expect(scrollback?.contains(region)).toBe(false);
      expect(region.contains(input)).toBe(false);
    });

    it('is silent on mount — the welcome banner is not announced', () => {
      const { region } = setup();
      expect(region.textContent).toBe('');
    });
  });

  describe('announces only the latest command response', () => {
    it('announces the response text alone, without the echoed command', () => {
      const { region, input } = setup();
      run(input, 'echo hello world');
      expect(region.textContent).toBe('hello world');
      expect(region.textContent).not.toMatch(/echo/);
    });

    it('does not carry the welcome banner or scrollback history', () => {
      const { region, input } = setup();
      run(input, 'help');
      expect(region.textContent).toBe(HELP);
      expect(region.textContent).not.toMatch(/get started/i);
    });

    it('replaces the previous response instead of appending', () => {
      const { region, input } = setup();
      run(input, 'echo first');
      run(input, 'echo second');
      expect(region.textContent).toBe('second');
      expect(region.textContent).not.toMatch(/first/);
    });

    it('announces the not-found response for unknown commands', () => {
      const { region, input } = setup();
      run(input, 'foobar');
      expect(region.textContent).toBe("command not found: foobar. try 'help'");
    });
  });

  describe('empty submissions are not announced', () => {
    it('bare Enter on a fresh terminal announces nothing', () => {
      const { region, input } = setup();
      const watcher = watch(region);
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(region.textContent).toBe('');
      expect(watcher.mutations()).toHaveLength(0);
      watcher.stop();
    });

    it('blank and whitespace-only Enter never re-announce the prior response', () => {
      const { region, input } = setup();
      run(input, 'echo keep me');
      const previous = region.firstChild;
      const watcher = watch(region);

      fireEvent.keyDown(input, { key: 'Enter' });
      run(input, '   ');

      expect(region.textContent).toBe('keep me');
      expect(region.firstChild).toBe(previous);
      expect(watcher.mutations()).toHaveLength(0);
      watcher.stop();
    });
  });

  describe('clear', () => {
    it('announces a concise confirmation, not the emptied scrollback', () => {
      const { region, input } = setup();
      run(input, 'help');
      run(input, 'clear');
      expect(region.textContent).toBe('Terminal cleared.');
      expect(region.textContent).not.toMatch(/available/);
    });
  });

  describe('repeated identical responses', () => {
    it('produces a fresh DOM node so the same text is announced again', () => {
      const { region, input } = setup();
      run(input, 'echo same');
      const first = region.firstChild;
      expect(region.textContent).toBe('same');

      const watcher = watch(region);
      run(input, 'echo same');

      expect(region.textContent).toBe('same');
      expect(watcher.mutations().length).toBeGreaterThan(0);
      expect(region.firstChild).not.toBe(first);
      watcher.stop();
    });

    it('re-announces a repeated non-echo command too', () => {
      const { region, input } = setup();
      run(input, 'pwd');
      const first = region.firstChild;

      const watcher = watch(region);
      run(input, 'pwd');

      expect(region.textContent).toBe('/Users/justin/brain');
      expect(watcher.mutations().length).toBeGreaterThan(0);
      expect(region.firstChild).not.toBe(first);
      watcher.stop();
    });
  });

  describe('focus is preserved', () => {
    it('leaves focus on the terminal input after a command runs', () => {
      const { input } = setup();
      (input as HTMLInputElement).focus();
      expect(document.activeElement).toBe(input);

      run(input, 'whoami');

      expect(document.activeElement).toBe(input);
    });

    it('keeps the live region out of the tab order', () => {
      const { region, input } = setup();
      run(input, 'help');
      expect(region).not.toHaveAttribute('tabindex');
      expect(document.activeElement).not.toBe(region);
    });
  });
});
