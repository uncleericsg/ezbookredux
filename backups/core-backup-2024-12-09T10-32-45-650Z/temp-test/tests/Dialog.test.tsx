import React from 'react';
import { render, screen, within } from '../test-utils';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';

describe('Dialog', () => {
  const TestDialog = ({ defaultOpen = false }) => (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <button data-testid="dialog-trigger">Open Dialog</button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-content">
        <DialogHeader>
          <DialogTitle data-testid="dialog-title">Test Dialog</DialogTitle>
          <DialogDescription data-testid="dialog-description">
            This is a test dialog description
          </DialogDescription>
        </DialogHeader>
        <div data-testid="dialog-body">Dialog content goes here</div>
        <DialogFooter data-testid="dialog-footer">
          <button>Cancel</button>
          <button>Save</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  it('renders trigger button correctly', () => {
    render(<TestDialog />);
    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
  });

  it('opens dialog when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDialog />);
    
    await user.click(screen.getByTestId('dialog-trigger'));
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('renders dialog content when defaultOpen is true', () => {
    render(<TestDialog defaultOpen={true} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('renders header components correctly', () => {
    render(<TestDialog defaultOpen={true} />);
    const dialog = screen.getByRole('dialog');
    
    expect(within(dialog).getByTestId('dialog-title')).toHaveTextContent('Test Dialog');
    expect(within(dialog).getByTestId('dialog-description')).toHaveTextContent(
      'This is a test dialog description'
    );
  });

  it('renders footer with correct layout', () => {
    render(<TestDialog defaultOpen={true} />);
    const footer = screen.getByTestId('dialog-footer');
    expect(footer).toHaveClass('flex', 'flex-col-reverse', 'sm:flex-row');
  });

  it('closes dialog when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TestDialog defaultOpen={true} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes dialog when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<TestDialog defaultOpen={true} />);
    
    await user.keyboard('{Escape}');
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies animation classes', () => {
    render(<TestDialog defaultOpen={true} />);
    const content = screen.getByTestId('dialog-content');
    
    expect(content).toHaveClass(
      'data-[state=open]:animate-in',
      'data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0',
      'data-[state=open]:fade-in-0'
    );
  });

  it('applies correct styling to title and description', () => {
    render(<TestDialog defaultOpen={true} />);
    
    const title = screen.getByTestId('dialog-title');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'leading-none');

    const description = screen.getByTestId('dialog-description');
    expect(description).toHaveClass('text-sm', 'text-gray-500');
  });

  it('renders with custom className', () => {
    const CustomDialog = () => (
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-class" data-testid="custom-dialog">
          <div>Custom Dialog</div>
        </DialogContent>
      </Dialog>
    );

    render(<CustomDialog />);
    const trigger = screen.getByRole('button', { name: /open/i });
    userEvent.click(trigger);
    
    const dialog = screen.getByTestId('custom-dialog');
    expect(dialog).toHaveClass('custom-class');
  });
});
