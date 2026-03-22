import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { siteContent } from '@/data/content';

describe('Footer', () => {
  it('renders the hosting note text from content', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.hostingNote)).toBeInTheDocument();
  });

  it('renders a footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('applies the id prop to the footer element', () => {
    render(<Footer id="contact" />);
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('renders without an id prop without crashing', () => {
    render(<Footer />);
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).not.toHaveAttribute('id');
  });
});
