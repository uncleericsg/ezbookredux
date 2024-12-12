import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { Input } from '@components/atoms/Input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies error styles when error prop is true', () => {
    render(<Input error placeholder="Error input" />);
    expect(screen.getByPlaceholderText('Error input')).toHaveClass('border-red-500');
  });

  it('handles disabled state correctly', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('spreads additional props', () => {
    render(<Input data-testid="test-input" placeholder="Input" />);
    expect(screen.getByTestId('test-input')).toBeInTheDocument();
  });

  it('combines className prop with default classes', () => {
    render(<Input className="custom-class" placeholder="Input" />);
    expect(screen.getByPlaceholderText('Input')).toHaveClass('custom-class');
  });

  it('handles different input types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text input" />);
    expect(screen.getByPlaceholderText('Text input')).toHaveAttribute('type', 'text');

    rerender(<Input type="password" placeholder="Password input" />);
    expect(screen.getByPlaceholderText('Password input')).toHaveAttribute('type', 'password');

    rerender(<Input type="email" placeholder="Email input" />);
    expect(screen.getByPlaceholderText('Email input')).toHaveAttribute('type', 'email');
  });

  it('handles value and onChange', () => {
    const handleChange = jest.fn();
    render(
      <Input
        value="test"
        onChange={handleChange}
        placeholder="Input"
      />
    );
    const input = screen.getByPlaceholderText('Input');
    expect(input).toHaveValue('test');
    input.focus();
    input.blur();
    expect(handleChange).not.toHaveBeenCalled();
  });
});
