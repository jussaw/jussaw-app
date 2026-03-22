import { render, screen, fireEvent } from '@testing-library/react';
import SetupDrawer from '../SetupDrawer';

describe('SetupDrawer', () => {
  it('does not render content when closed', () => {
    render(<SetupDrawer open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(<SetupDrawer open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders kit items from content', () => {
    render(<SetupDrawer open={true} onClose={() => {}} />);
    expect(screen.getByText(/keyboard/i)).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<SetupDrawer open={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<SetupDrawer open={true} onClose={onClose} />);
    const backdrop = screen.getByTestId('drawer-backdrop');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});
