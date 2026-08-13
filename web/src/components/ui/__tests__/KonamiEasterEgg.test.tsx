import { act, render, screen } from '@testing-library/react';

import KonamiEasterEgg from '../KonamiEasterEgg';

const PARTICLE_COUNT = 30;

const KONAMI_KEYS = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

// matchMedia not available in jsdom
function setReducedMotion(reduce: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduce && query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

function activateKonami() {
  act(() => {
    KONAMI_KEYS.forEach((key) => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }));
    });
  });
}

function getMessage(): HTMLElement {
  return screen.getByText('Achievement Unlocked').parentElement as HTMLElement;
}

describe('KonamiEasterEgg when the user prefers reduced motion', () => {
  beforeEach(() => {
    setReducedMotion(true);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('acknowledges the code statically, with no particle burst and no motion', () => {
    const { container } = render(<KonamiEasterEgg />);
    activateKonami();

    expect(screen.getByText('Achievement Unlocked')).toBeInTheDocument();
    expect(screen.getByText('↑↑↓↓←→←→BA')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-konami-particle]')).toHaveLength(0);

    const message = getMessage();
    expect(message.style.animation).toBe('');
    expect(message.style.transform).toBe('');
  });

  it('still dismisses itself after 4s', () => {
    render(<KonamiEasterEgg />);
    activateKonami();
    expect(screen.getByText('Achievement Unlocked')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Achievement Unlocked')).not.toBeInTheDocument();
  });
});

describe('KonamiEasterEgg when the user has no motion preference', () => {
  beforeEach(() => {
    setReducedMotion(false);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('bursts particles and animates the message', () => {
    const { container } = render(<KonamiEasterEgg />);
    activateKonami();

    const particles = container.querySelectorAll<HTMLElement>('[data-konami-particle]');
    expect(particles).toHaveLength(PARTICLE_COUNT);
    expect(particles[0].style.animation).toContain('konami-particle');
    expect(getMessage().style.animation).toContain('konami-text');
  });

  it('dismisses itself after 4s', () => {
    render(<KonamiEasterEgg />);
    activateKonami();
    expect(screen.getByText('Achievement Unlocked')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.queryByText('Achievement Unlocked')).not.toBeInTheDocument();
  });
});
