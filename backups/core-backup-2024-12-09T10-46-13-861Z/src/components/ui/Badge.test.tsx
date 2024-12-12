import React from 'react';
import { render, screen } from '../../utils/test-utils';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies the correct classes for different variants', () => {
    const variants = [
      {
        variant: 'default',
        expectedClass: 'bg-gray-900',
      },
      {
        variant: 'secondary',
        expectedClass: 'bg-gray-100',
      },
      {
        variant: 'destructive',
        expectedClass: 'bg-red-500',
      },
      {
        variant: 'outline',
        expectedClass: 'text-gray-950',
      },
      {
        variant: 'success',
        expectedClass: 'bg-green-500',
      },
      {
        variant: 'warning',
        expectedClass: 'bg-yellow-500',
      },
      {
        variant: 'info',
        expectedClass: 'bg-blue-500',
      },
    ] as const;

    variants.forEach(({ variant, expectedClass }) => {
      const { rerender } = render(
        <Badge variant={variant}>{variant} badge</Badge>
      );
      expect(screen.getByText(`${variant} badge`)).toHaveClass(expectedClass);
      rerender(<></>);
    });
  });

  it('combines className prop with default classes', () => {
    render(<Badge className="custom-class">Badge</Badge>);
    const badge = screen.getByText('Badge');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('inline-flex');
  });

  it('spreads additional props', () => {
    render(<Badge data-testid="test-badge">Badge</Badge>);
    expect(screen.getByTestId('test-badge')).toBeInTheDocument();
  });

  it('applies focus styles', () => {
    render(<Badge>Focus Badge</Badge>);
    const badge = screen.getByText('Focus Badge');
    expect(badge).toHaveClass('focus:outline-none', 'focus:ring-2');
  });

  it('applies hover styles', () => {
    render(<Badge variant="default">Hover Badge</Badge>);
    const badge = screen.getByText('Hover Badge');
    expect(badge).toHaveClass('hover:bg-gray-900/80');
  });

  it('renders children correctly', () => {
    render(
      <Badge>
        <span>Child 1</span>
        <span>Child 2</span>
      </Badge>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
