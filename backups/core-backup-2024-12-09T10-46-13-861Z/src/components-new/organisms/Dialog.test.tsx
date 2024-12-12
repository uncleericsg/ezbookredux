import React from 'react';
import { render, screen, fireEvent } from '../../utils/test-utils';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@components/organisms/Dialog';

describe('Dialog Components', () => {
  beforeEach(() => {
    // Create a div with id "root" for the portal
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  });

  afterEach(() => {
    // Clean up the portal div
    const root = document.getElementById('root');
    if (root) {
      document.body.removeChild(root);
    }
  });

  describe('Dialog and DialogTrigger', () => {
    it('opens dialog when trigger is clicked', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      // Initially dialog should not be visible
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument();

      // Click trigger button
      fireEvent.click(screen.getByText('Open Dialog'));

      // Dialog should now be visible
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
  });

  describe('DialogContent', () => {
    it('renders with correct classes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      const content = screen.getByText('Dialog Content');
      expect(content).toHaveClass(
        'fixed',
        'left-[50%]',
        'top-[50%]',
        'z-50',
        'grid',
        'w-full',
        'max-w-lg',
        'translate-x-[-50%]',
        'translate-y-[-50%]',
        'gap-4',
        'border',
        'bg-white',
        'p-6',
        'shadow-lg',
        'duration-200',
        'sm:rounded-lg'
      );
    });

    it('applies custom className correctly', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent className="custom-class">Content</DialogContent>
        </Dialog>
      );

      const content = screen.getByText('Content');
      expect(content).toHaveClass('custom-class');
    });
  });

  describe('DialogHeader', () => {
    it('renders with correct classes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>Header Content</DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const header = screen.getByText('Header Content');
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'text-center', 'sm:text-left');
    });
  });

  describe('DialogFooter', () => {
    it('renders with correct classes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogFooter>Footer Content</DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const footer = screen.getByText('Footer Content');
      expect(footer).toHaveClass(
        'flex',
        'flex-col-reverse',
        'sm:flex-row',
        'sm:justify-end',
        'sm:space-x-2'
      );
    });
  });

  describe('DialogTitle', () => {
    it('renders with correct classes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByText('Dialog Title');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'leading-none', 'tracking-tight');
    });
  });

  describe('DialogDescription', () => {
    it('renders with correct classes', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const description = screen.getByText('Dialog Description');
      expect(description).toHaveClass('text-sm', 'text-gray-500');
    });
  });

  describe('Dialog Integration', () => {
    it('renders full dialog structure correctly', () => {
      render(
        <Dialog defaultOpen>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome</DialogTitle>
              <DialogDescription>This is a sample dialog</DialogDescription>
            </DialogHeader>
            <div>Main Content</div>
            <DialogFooter>
              <button>Close</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('This is a sample dialog')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });
});
