import { render, screen, fireEvent } from '@testing-library/react';
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

  it('renders a setup button when onOpenSetup is provided', () => {
    render(<Footer onOpenSetup={() => {}} />);
    expect(screen.getByRole('button', { name: /setup/i })).toBeInTheDocument();
  });

  it('calls onOpenSetup when setup button is clicked', () => {
    const onOpenSetup = vi.fn();
    render(<Footer onOpenSetup={onOpenSetup} />);
    fireEvent.click(screen.getByRole('button', { name: /setup/i }));
    expect(onOpenSetup).toHaveBeenCalled();
  });
});
