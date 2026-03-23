import { render, screen, fireEvent } from '@testing-library/react';
import Terminal from '../Terminal';

vi.stubGlobal('IntersectionObserver', vi.fn(function () {
  return {
    observe: vi.fn(),
    disconnect: vi.fn(),
  };
}));

describe('Terminal (section)', () => {
  it('renders without props', () => {
    render(<Terminal />);
    expect(screen.getByLabelText('Terminal input')).toBeInTheDocument();
  });

  it('shows welcome message on render', () => {
    render(<Terminal />);
    expect(screen.getByText(/Type 'help' to get started/i)).toBeInTheDocument();
  });

  it('responds to the help command', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'help' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/available/i)).toBeInTheDocument();
  });

  it('responds to the whoami command', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'whoami' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/justin sawyer/i)).toBeInTheDocument();
  });

  it('shows error for unknown commands', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'foobar' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/command not found/i)).toBeInTheDocument();
  });

  it('shows cheeky response for destructive commands', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'sudo rm -rf /' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText(/permission denied/i)).toBeInTheDocument();
  });

  it('exit prints embedded terminal message', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    fireEvent.change(input, { target: { value: 'exit' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(
      screen.getByText('this terminal is embedded — nowhere to exit to')
    ).toBeInTheDocument();
  });

  it('clear command removes output lines', () => {
    render(<Terminal />);
    const input = screen.getByLabelText('Terminal input');
    expect(screen.getByText(/Type 'help' to get started/i)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'clear' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.queryByText(/Type 'help' to get started/i)).not.toBeInTheDocument();
  });

  it('input has aria-label for accessibility', () => {
    render(<Terminal />);
    expect(screen.getByLabelText('Terminal input')).toBeInTheDocument();
  });
});
