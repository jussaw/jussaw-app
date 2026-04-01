import { render } from '@testing-library/react';

import Header from '../Header';

describe('Header', () => {
  it('renders an email link', () => {
    const { getByRole } = render(<Header />);
    const link = getByRole('link', { name: /email/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('renders a GitHub link', () => {
    const { getByRole } = render(<Header />);
    const link = getByRole('link', { name: /github/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders a LinkedIn link', () => {
    const { getByRole } = render(<Header />);
    const link = getByRole('link', { name: /linkedin/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders a header element', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
