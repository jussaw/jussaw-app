import { render, screen } from '@testing-library/react';

import { siteContent } from '@/data/content';

import Hobbies from '../Hobbies';

vi.stubGlobal(
  'IntersectionObserver',
  // eslint-disable-next-line prefer-arrow-callback
  vi.fn(function () {
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
);

describe('Hobbies', () => {
  it('renders the section heading', () => {
    render(<Hobbies />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders all hobby names from content', () => {
    render(<Hobbies />);
    for (const hobby of siteContent.hobbies) {
      expect(screen.getByText(hobby.label)).toBeInTheDocument();
    }
  });

  it('renders the expected number of hobby items', () => {
    render(<Hobbies />);
    for (const hobby of siteContent.hobbies) {
      expect(screen.getByText(hobby.label)).toBeInTheDocument();
    }
    // Verify count matches content
    const hobbyLabels = siteContent.hobbies.map((h) => h.label);
    const renderedItems = hobbyLabels.filter((label) => screen.queryByText(label) !== null);
    expect(renderedItems).toHaveLength(siteContent.hobbies.length);
  });
});
