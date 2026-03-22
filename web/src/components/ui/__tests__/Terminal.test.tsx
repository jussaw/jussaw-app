import { render, screen, fireEvent } from '@testing-library/react';
import Terminal from '../Terminal';

describe('Terminal', () => {
  it('does not render when closed', () => {
    render(<Terminal open={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows welcome message on open', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    expect(screen.getByText(/help/i)).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<Terminal open={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('responds to the help command', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/available/i)).toBeInTheDocument();
  });

  it('responds to the whoami command', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/justin/i)).toBeInTheDocument();
  });

  it('shows error for unknown commands', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'foobar' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/command not found/i)).toBeInTheDocument();
  });

  it('shows cheeky response for destructive commands', () => {
    render(<Terminal open={true} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'sudo rm -rf /' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/permission denied/i)).toBeInTheDocument();
  });
});
