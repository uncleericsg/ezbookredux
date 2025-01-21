import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  BaseComponent,
  createFormComponent,
  createListComponent,
  Container,
  Button,
  type FormComponentProps
} from '../BaseComponent';

describe('Base Component System', () => {
  describe('BaseComponent', () => {
    it('should render with basic props', () => {
      render(
        <BaseComponent
          className="test-class"
          data-testid="test-component"
        >
          Test Content
        </BaseComponent>
      );

      const component = screen.getByTestId('test-component');
      expect(component).toHaveClass('test-class');
      expect(component).toHaveTextContent('Test Content');
    });

    it('should apply custom styles', () => {
      render(
        <BaseComponent
          style={{ backgroundColor: 'red' }}
          data-testid="test-component"
        >
          Test Content
        </BaseComponent>
      );

      const component = screen.getByTestId('test-component');
      expect(component).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  describe('Form Component', () => {
    interface TestFormData {
      value: string;
    }

    const TestInput = createFormComponent<string>(
      ({ value, onChange, disabled, placeholder }: FormComponentProps<string>) => (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
        />
      )
    );

    it('should render form component with label', () => {
      render(
        <TestInput
          name="test"
          label="Test Label"
          value=""
          onChange={() => {}}
        />
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should handle changes', () => {
      const handleChange = jest.fn();
      render(
        <TestInput
          name="test"
          value=""
          onChange={handleChange}
        />
      );

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'test value' }
      });

      expect(handleChange).toHaveBeenCalledWith('test value');
    });

    it('should show error message', () => {
      render(
        <TestInput
          name="test"
          value=""
          onChange={() => {}}
          error="Test error"
        />
      );

      expect(screen.getByText('Test error')).toHaveClass('text-error');
    });

    it('should show required indicator', () => {
      render(
        <TestInput
          name="test"
          label="Test Label"
          value=""
          onChange={() => {}}
          required
        />
      );

      expect(screen.getByText('*')).toHaveClass('text-error');
    });
  });

  describe('List Component', () => {
    interface TestItem {
      id: string;
      name: string;
    }

    const items: TestItem[] = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];

    const TestList = createListComponent<TestItem>();

    it('should render list items', () => {
      render(
        <TestList
          items={items}
          renderItem={(item) => <div>{item.name}</div>}
          keyExtractor={(item) => item.id}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('should show empty message', () => {
      render(
        <TestList
          items={[]}
          renderItem={(item) => <div>{item.name}</div>}
          emptyMessage="No items available"
        />
      );

      expect(screen.getByText('No items available')).toBeInTheDocument();
    });

    it('should handle item clicks', () => {
      const handleClick = jest.fn();
      render(
        <TestList
          items={items}
          renderItem={(item) => <div>{item.name}</div>}
          keyExtractor={(item) => item.id}
          onItemClick={handleClick}
        />
      );

      fireEvent.click(screen.getByText('Item 1'));
      expect(handleClick).toHaveBeenCalledWith(items[0], 0);
    });

    it('should show loading component', () => {
      render(
        <TestList
          items={[]}
          renderItem={(item) => <div>{item.name}</div>}
          loading={true}
          loadingComponent={<div>Loading...</div>}
        />
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Container', () => {
    it('should render with max width by default', () => {
      render(
        <Container data-testid="container">
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('max-w-7xl');
    });

    it('should render fluid container', () => {
      render(
        <Container fluid data-testid="container">
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('w-full');
      expect(container).not.toHaveClass('max-w-7xl');
    });

    it('should render with custom element', () => {
      render(
        <Container as="section" data-testid="container">
          Content
        </Container>
      );

      expect(screen.getByTestId('container').tagName).toBe('SECTION');
    });
  });

  describe('Button', () => {
    it('should render with variants', () => {
      render(
        <Button variant="primary" data-testid="button">
          Click me
        </Button>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('btn-primary');
    });

    it('should handle clicks', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick}>
          Click me
        </Button>
      );

      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalled();
    });

    it('should show loading state', () => {
      render(
        <Button loading data-testid="button">
          Click me
        </Button>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveClass('loading');
      expect(button).toBeDisabled();
    });

    it('should render with icons', () => {
      render(
        <Button
          icon={<span data-testid="icon">★</span>}
          iconPosition="right"
        >
          Click me
        </Button>
      );

      const icon = screen.getByTestId('icon');
      expect(icon.parentElement).toHaveClass('ml-2');
    });
  });
});