import { render, cleanup } from '@testing-library/react';
import ExperienceCard from '../ExperienceCard';
import type { ExperienceEntry } from '@/data/content';

vi.stubGlobal('IntersectionObserver', vi.fn(function () {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
  };
}));

const entry: ExperienceEntry = {
  company: 'Acme',
  role: 'Engineer',
  period: '2022–Present',
  location: 'Remote',
  bullets: ['Did a thing'],
};

describe('ExperienceCard', () => {
  it('timeline mode: root element has reveal class', () => {
    const { container } = render(<ExperienceCard entry={entry} displayMode="timeline" />);
    expect(container.firstChild).toHaveClass('reveal');
  });

  it('minimal-text mode: root element has reveal class', () => {
    const { container } = render(<ExperienceCard entry={entry} displayMode="minimal-text" />);
    expect(container.firstChild).toHaveClass('reveal');
  });

  it('cards mode (default): root element has reveal class', () => {
    const { container } = render(<ExperienceCard entry={entry} />);
    expect(container.firstChild).toHaveClass('reveal');
  });

  it('renders role and company in all modes', () => {
    (['timeline', 'minimal-text', 'cards'] as const).forEach((mode) => {
      const { getByText } = render(<ExperienceCard entry={entry} displayMode={mode} />);
      expect(getByText('Engineer')).toBeInTheDocument();
      expect(getByText('Acme')).toBeInTheDocument();
      cleanup();
    });
  });
});
