import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminPanelLoader } from '../AdminPanelLoader';

describe('AdminPanelLoader', () => {
  it('renders with default props', () => {
    render(<AdminPanelLoader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(document.querySelector('.h-8.w-8')).toBeInTheDocument(); // medium size
  });

  it('renders with custom message', () => {
    const message = 'Custom loading message';
    render(<AdminPanelLoader message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<AdminPanelLoader size="small" />);
    expect(document.querySelector('.h-4.w-4')).toBeInTheDocument();

    rerender(<AdminPanelLoader size="medium" />);
    expect(document.querySelector('.h-8.w-8')).toBeInTheDocument();

    rerender(<AdminPanelLoader size="large" />);
    expect(document.querySelector('.h-12.w-12')).toBeInTheDocument();
  });

  it('handles empty message prop', () => {
    render(<AdminPanelLoader message="" />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('applies correct animation classes', () => {
    render(<AdminPanelLoader />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('rounded-full', 'border-b-2', 'border-white');
  });

  it('maintains consistent structure', () => {
    render(<AdminPanelLoader />);
    const container = document.querySelector('.flex.flex-col');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('items-center', 'justify-center', 'p-8');
  });

  // Type safety tests
  it('type checks size prop', () => {
    // @ts-expect-error - invalid size
    render(<AdminPanelLoader size="invalid" />);
    
    // Valid sizes should compile
    render(<AdminPanelLoader size="small" />);
    render(<AdminPanelLoader size="medium" />);
    render(<AdminPanelLoader size="large" />);
  });

  it('type checks message prop', () => {
    // @ts-expect-error - invalid message type
    render(<AdminPanelLoader message={123} />);
    
    // Valid message types should compile
    render(<AdminPanelLoader message="test" />);
    render(<AdminPanelLoader message="" />);
    render(<AdminPanelLoader message={undefined} />);
  });
});
