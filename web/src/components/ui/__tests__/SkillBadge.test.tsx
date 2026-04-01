import { render, screen } from '@testing-library/react';

import type { Skill } from '@/data/content';

import SkillBadge from '../SkillBadge';

describe('SkillBadge', () => {
  it('renders the skill name', () => {
    const skill: Skill = { name: 'React', category: 'frontend' };
    render(<SkillBadge skill={skill} />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders a frontend skill without crashing', () => {
    const skill: Skill = { name: 'Next.js', category: 'frontend' };
    render(<SkillBadge skill={skill} />);
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('renders a backend skill without crashing', () => {
    const skill: Skill = { name: 'Node.js', category: 'backend' };
    render(<SkillBadge skill={skill} />);
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('renders a language skill without crashing', () => {
    const skill: Skill = { name: 'TypeScript', category: 'language' };
    render(<SkillBadge skill={skill} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders a database skill without crashing', () => {
    const skill: Skill = { name: 'PostgreSQL', category: 'database' };
    render(<SkillBadge skill={skill} />);
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('renders a devops skill without crashing', () => {
    const skill: Skill = { name: 'Docker', category: 'devops' };
    render(<SkillBadge skill={skill} />);
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });
});
