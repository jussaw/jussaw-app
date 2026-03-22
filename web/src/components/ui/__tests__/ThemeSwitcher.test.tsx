import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '../ThemeSwitcher';
import { themes } from '@/data/themes';

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    document.body.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('renders a palette button', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });

  it('opens the popover when palette button is clicked', () => {
    render(<ThemeSwitcher />);
    const btn = screen.getByRole('button', { name: /theme/i });
    fireEvent.click(btn);
    const swatches = screen.getAllByRole('button', { name: /switch to/i });
    expect(swatches.length).toBe(themes.length);
  });

  it('closes the popover when pressing Escape', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    expect(screen.getAllByRole('button', { name: /switch to/i }).length).toBeGreaterThan(0);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryAllByRole('button', { name: /switch to/i })).toHaveLength(0);
  });

  it('applies data-theme to body and persists to localStorage on swatch click', () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole('button', { name: /theme/i }));
    const swatch = screen.getAllByRole('button', { name: /switch to/i })[0];
    fireEvent.click(swatch);
    expect(document.body.getAttribute('data-theme')).toBeTruthy();
    expect(localStorage.getItem('theme')).toBeTruthy();
  });

  it('reads saved theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'warm-coral');
    render(<ThemeSwitcher />);
    expect(document.body.getAttribute('data-theme')).toBe('warm-coral');
  });
});
