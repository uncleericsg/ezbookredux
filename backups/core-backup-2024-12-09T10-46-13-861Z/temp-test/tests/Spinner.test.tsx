import React from 'react';
import { render, screen } from '../test-utils';
import { Spinner } from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('renders correctly', () => {
    render(<Spinner data-testid="spinner" />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('applies default size (md) styles', () => {
    render(<Spinner data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-8', 'w-8', 'border-3');
  });

  it('applies small size styles', () => {
    render(<Spinner size="sm" data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-4', 'w-4', 'border-2');
  });

  it('applies large size styles', () => {
    render(<Spinner size="lg" data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('h-12', 'w-12', 'border-4');
  });

  it('applies animation styles', () => {
    render(<Spinner data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('applies border styles', () => {
    render(<Spinner data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass(
      'border-gray-300',
      'border-t-gray-900',
      'dark:border-gray-600',
      'dark:border-t-gray-300'
    );
  });

  it('applies custom className', () => {
    render(<Spinner className="custom-class" data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Spinner ref={ref} data-testid="spinner" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('spreads additional props', () => {
    render(<Spinner aria-label="Loading" data-testid="spinner" />);
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});
