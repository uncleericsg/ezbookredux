import React from 'react';
import { render, screen } from '../../utils/test-utils';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@components/molecules/Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders correctly', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies default classes', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toHaveClass(
        'rounded-xl',
        'border',
        'bg-white'
      );
    });

    it('combines custom className with default classes', () => {
      render(<Card className="custom-class">Card Content</Card>);
      const card = screen.getByText('Card Content');
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('rounded-xl');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Card Content</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardHeader', () => {
    it('renders correctly', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('applies correct spacing classes', () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText('Header Content')).toHaveClass(
        'flex',
        'flex-col',
        'space-y-1.5',
        'p-6'
      );
    });
  });

  describe('CardFooter', () => {
    it('renders correctly', () => {
      render(<CardFooter>Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('applies correct spacing classes', () => {
      render(<CardFooter>Footer Content</CardFooter>);
      expect(screen.getByText('Footer Content')).toHaveClass(
        'flex',
        'items-center',
        'p-6',
        'pt-0'
      );
    });
  });

  describe('CardTitle', () => {
    it('renders correctly', () => {
      render(<CardTitle>Card Title</CardTitle>);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('applies correct typography classes', () => {
      render(<CardTitle>Card Title</CardTitle>);
      expect(screen.getByText('Card Title')).toHaveClass(
        'font-semibold',
        'leading-none',
        'tracking-tight'
      );
    });
  });

  describe('CardDescription', () => {
    it('renders correctly', () => {
      render(<CardDescription>Card Description</CardDescription>);
      expect(screen.getByText('Card Description')).toBeInTheDocument();
    });

    it('applies correct typography classes', () => {
      render(<CardDescription>Card Description</CardDescription>);
      expect(screen.getByText('Card Description')).toHaveClass(
        'text-sm',
        'text-gray-500'
      );
    });
  });

  describe('CardContent', () => {
    it('renders correctly', () => {
      render(<CardContent>Content</CardContent>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies correct padding classes', () => {
      render(<CardContent>Content</CardContent>);
      expect(screen.getByText('Content')).toHaveClass('p-6', 'pt-0');
    });
  });

  describe('Card Component Integration', () => {
    it('renders all card components together correctly', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Main Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });
});
