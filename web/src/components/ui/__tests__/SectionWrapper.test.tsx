import { render, screen } from '@testing-library/react';

import SectionWrapper from '../SectionWrapper';

vi.stubGlobal(
  'IntersectionObserver',
  // eslint-disable-next-line prefer-arrow-callback
  vi.fn(function () {
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
);

describe('SectionWrapper', () => {
  it('renders a <section> element', () => {
    render(<SectionWrapper>content</SectionWrapper>);
    expect(screen.getByText('content').closest('section')).toBeInTheDocument();
  });

  it('applies the reveal class to the section', () => {
    render(<SectionWrapper>content</SectionWrapper>);
    const section = screen.getByText('content').closest('section');
    expect(section).toHaveClass('reveal');
  });

  it('forwards the id prop', () => {
    render(<SectionWrapper id="skills">content</SectionWrapper>);
    expect(document.getElementById('skills')).toBeInTheDocument();
  });

  it('forwards extra className prop', () => {
    render(<SectionWrapper className="extra">content</SectionWrapper>);
    const section = screen.getByText('content').closest('section');
    expect(section).toHaveClass('extra');
  });
});
