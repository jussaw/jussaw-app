import { render, screen, fireEvent, within } from '@testing-library/react';

import Terminal from '../Terminal';

vi.stubGlobal(
  'IntersectionObserver',
  // eslint-disable-next-line prefer-arrow-callback
  vi.fn(function () {
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
);

/**
 * Queries scoped to the scrollable output. The live region (AUD-20260802-01) repeats the
 * latest response outside the scrollback, so an unscoped `screen` query matches twice; this
 * keeps "the terminal printed X" assertions about what is on screen. The live region's own
 * text is asserted in Terminal.announcements.test.tsx.
 *
 * Substring match needed because Vite hashes CSS module class names (_output_abc123).
 * .output renders before any .lineOutput divs, so this matches the scrollable container.
 */
const inScrollback = () => {
  const output = document.querySelector<HTMLElement>('[class*="output"]');
  if (!output) throw new Error('scrollback container not found');
  return within(output);
};

describe('Terminal (section)', () => {
  it('renders without props', () => {
    render(<Terminal />);
    expect(screen.getByLabelText('Terminal input')).toBeInTheDocument();
  });

  it('shows welcome message on render', () => {
    render(<Terminal />);
    expect(screen.getByText(/Type 'help' to get started/i)).toBeInTheDocument();
  });

  it('responds to the help command', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(inScrollback().getByText(/available/i)).toBeInTheDocument();
  });

  it('responds to the whoami command', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(inScrollback().getByText(/justin sawyer/i)).toBeInTheDocument();
  });

  it('echoes its argument', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'echo hello world' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(inScrollback().getByText('hello world')).toBeInTheDocument();
  });

  it('bare echo outputs an empty line instead of command not found', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'echo' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.queryByText(/command not found/i)).not.toBeInTheDocument();
  });

  it('shows error for unknown commands', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'foobar' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(inScrollback().getByText(/command not found/i)).toBeInTheDocument();
  });

  it('shows cheeky response for destructive commands', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'sudo rm -rf /' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(inScrollback().getByText(/permission denied/i)).toBeInTheDocument();
  });

  it('exit prints embedded terminal message', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'exit' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(
      inScrollback().getByText('this terminal is embedded — nowhere to exit to'),
    ).toBeInTheDocument();
  });

  it('clear command removes output lines', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    expect(screen.getByText(/Type 'help' to get started/i)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.queryByText(/Type 'help' to get started/i)).not.toBeInTheDocument();
  });

  it('input has aria-label for accessibility', () => {
    render(<Terminal />);
    expect(screen.getByLabelText('Terminal input')).toBeInTheDocument();
  });

  describe('tab completion', () => {
    it('completes an unambiguous prefix on Tab', () => {
      render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: 'wh' } });
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(input).toHaveValue('whoami');
    });

    it('does not change input when Tab is pressed with no matching prefix', () => {
      render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: 'xyz' } });
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(input).toHaveValue('xyz');
    });

    it('cycles to next match when Tab is pressed a second time without typing', () => {
      render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: 'cat ' } });
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(input).toHaveValue('cat experience.txt');
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(input).toHaveValue('cat hobbies.txt');
    });

    it('resets cycle when user types between Tab presses', () => {
      render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: 'cat ' } });
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(input).toHaveValue('cat experience.txt');
      // User types — triggers onChange → reset()
      fireEvent.change(input, { target: { value: 'cat e' } });
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(input).toHaveValue('cat experience.txt');
    });

    it('Tab on an exact single match leaves value unchanged', () => {
      render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: 'whoami' } });
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(input).toHaveValue('whoami');
    });

    it('Tab does not submit the command', () => {
      render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: 'help' } });
      // No output lines yet (only welcome message)
      expect(screen.queryByText(/available/i)).not.toBeInTheDocument();
      fireEvent.keyDown(input, { key: 'Tab' });
      expect(screen.queryByText(/available/i)).not.toBeInTheDocument();
    });
  });

  describe('empty submissions', () => {
    // Substring match needed because Vite hashes CSS module class names (_output_abc123).
    // .output renders before any .lineOutput divs, so this matches the scrollable container.
    const scrollback = (container: HTMLElement) =>
      container.querySelector('[class*="output"]')?.textContent;

    it('bare Enter produces neither an error nor extra output', () => {
      const { container } = render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      const before = scrollback(container);
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.queryByText(/command not found/i)).not.toBeInTheDocument();
      expect(scrollback(container)).toBe(before);
    });

    it('whitespace-only Enter clears the input and adds no output', () => {
      const { container } = render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      const before = scrollback(container);
      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(input).toHaveValue('');
      expect(screen.queryByText(/command not found/i)).not.toBeInTheDocument();
      expect(scrollback(container)).toBe(before);
    });

    it('repeated blank Enter leaves the scrollback unchanged', () => {
      const { container } = render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      const before = scrollback(container);
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.change(input, { target: { value: '  ' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(scrollback(container)).toBe(before);
    });

    it('blank Enter does not disturb history recall', () => {
      render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: 'help' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      expect(input).toHaveValue('help');
    });
  });

  describe('long input has a single native text surface (AUD-20260728-01)', () => {
    // Comfortably wider than the terminal at any viewport, so the tail of the value
    // is off-screen and only the input's own scrolling can keep the caret visible.
    const ARG = 'overflowing-argument-'.repeat(8);
    const LONG = `echo ${ARG}`;

    it('keeps a long value in the native input only — no mirror or fake cursor surface', () => {
      const { container } = render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: LONG } });

      expect(input).toHaveValue(LONG);
      expect(container.querySelector('[class*="inputMirror"]')).toBeNull();
      expect(container.querySelector('[class*="cursor"]')).toBeNull();
      // A mirror would duplicate the value as rendered text; the input's value is not text.
      expect(screen.queryByText(LONG)).not.toBeInTheDocument();
    });

    it('puts the input directly in the prompt line, with no clipping wrapper', () => {
      const { container } = render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');

      expect(input.parentElement?.className).toMatch(/activeInputLine/);
      expect(container.querySelector('[class*="inputWrapper"]')).toBeNull();
    });

    it('clears the input and echoes the long command after Enter', () => {
      render(<Terminal />);
      const input = screen.getByLabelText('Terminal input');
      fireEvent.change(input, { target: { value: LONG } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveValue('');
      expect(inScrollback().getByText(ARG)).toBeInTheDocument();
    });
  });

  describe('CSS module classes', () => {
    it('applies container class to the outer wrapper', () => {
      const { container } = render(<Terminal />);
      // The outermost div inside SectionWrapper should have the container class
      const wrapper = container.querySelector('[class*="container"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('applies output class to the scrollable area', () => {
      const { container } = render(<Terminal />);
      // Substring match needed because Vite hashes CSS module class names (_output_abc123).
      // .output renders before any .lineOutput divs in the DOM, so this correctly
      // matches the scrollable container.
      const output = container.querySelector('[class*="output"]');
      expect(output).toBeInTheDocument();
    });
  });
});
