import React from 'react';
import { render, screen } from '../test-utils';
import { Label } from '@/components/ui/Label';

describe('Label', () => {
  it('renders correctly', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(<Label>Default Label</Label>);
    const label = screen.getByText('Default Label');
    expect(label).toHaveClass('text-sm', 'font-medium', 'leading-none');
  });

  it('applies custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>);
    const label = screen.getByText('Custom Label');
    expect(label).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('spreads additional props', () => {
    render(<Label data-testid="test-label">Props Label</Label>);
    expect(screen.getByTestId('test-label')).toBeInTheDocument();
  });

  it('applies peer-disabled styles', () => {
    render(<Label>Disabled Label</Label>);
    const label = screen.getByText('Disabled Label');
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70');
  });

  it('works with htmlFor attribute', () => {
    render(
      <>
        <Label htmlFor="test-input">Input Label</Label>
        <input id="test-input" type="text" />
      </>
    );
    const label = screen.getByText('Input Label');
    expect(label).toHaveAttribute('for', 'test-input');
  });
});
