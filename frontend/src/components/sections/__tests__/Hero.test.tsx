import { render } from '@testing-library/react';
import Hero from '../Hero';

vi.stubGlobal('IntersectionObserver', vi.fn(function () {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
  };
}));

describe('Hero', () => {
  it('renders the person name', () => {
    const { getByRole } = render(<Hero />);
    expect(getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('applies reveal class to the inner content div', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('section');
    const innerDiv = section?.querySelector('div');
    expect(innerDiv).toHaveClass('reveal');
  });

  it('applies 150ms transitionDelay to the inner content div', () => {
    const { container } = render(<Hero />);
    const section = container.querySelector('section');
    const innerDiv = section?.querySelector('div') as HTMLElement;
    expect(innerDiv?.style.transitionDelay).toBe('150ms');
  });
});
