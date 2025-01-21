import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';
import type { ValidationError } from '../../../shared/types/error';

interface TestForm extends Record<string, unknown> {
  email: string;
  password: string;
  age: number;
}

describe('useForm', () => {
  const initialValues: TestForm = {
    email: '',
    password: '',
    age: 0
  };

  const mockSubmit = jest.fn();

  const validate = (values: TestForm): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!values.email) {
      errors.push({
        field: 'email',
        message: 'Email is required',
        type: 'required',
        code: 'VALIDATION_ERROR'
      });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        type: 'email',
        code: 'VALIDATION_ERROR'
      });
    }

    if (!values.password) {
      errors.push({
        field: 'password',
        message: 'Password is required',
        type: 'required',
        code: 'VALIDATION_ERROR'
      });
    } else if (values.password.length < 8) {
      errors.push({
        field: 'password',
        message: 'Password must be at least 8 characters',
        type: 'minLength',
        code: 'VALIDATION_ERROR'
      });
    }

    if (values.age < 18) {
      errors.push({
        field: 'age',
        message: 'Must be at least 18 years old',
        type: 'min',
        code: 'VALIDATION_ERROR'
      });
    }

    return errors;
  };

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('should initialize with initial values', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate
      })
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({
      email: [],
      password: [],
      age: []
    });
    expect(result.current.touched).toEqual({
      email: false,
      password: false,
      age: false
    });
    expect(result.current.isDirty).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isValid).toBe(true);
    expect(result.current.submitCount).toBe(0);
  });

  it('should handle field changes', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
    expect(result.current.isDirty).toBe(true);
  });

  it('should handle field blur', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate
      })
    );

    act(() => {
      result.current.handleBlur('email');
    });

    expect(result.current.touched.email).toBe(true);
  });

  it('should validate on change when enabled', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate,
        validateOnChange: true
      })
    );

    act(() => {
      result.current.handleChange('email', 'invalid-email');
    });

    expect(result.current.errors.email).toHaveLength(1);
    expect(result.current.errors.email[0].message).toBe('Invalid email format');
  });

  it('should validate on blur when enabled', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate,
        validateOnBlur: true
      })
    );

    act(() => {
      result.current.handleChange('password', '123');
      result.current.handleBlur('password');
    });

    expect(result.current.errors.password).toHaveLength(1);
    expect(result.current.errors.password[0].message).toBe(
      'Password must be at least 8 characters'
    );
  });

  it('should validate on mount when enabled', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate,
        validateOnMount: true
      })
    );

    expect(result.current.errors.email).toHaveLength(1);
    expect(result.current.errors.password).toHaveLength(1);
    expect(result.current.errors.age).toHaveLength(1);
  });

  it('should handle form submission', async () => {
    const validValues: TestForm = {
      email: 'test@example.com',
      password: 'password123',
      age: 25
    };

    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues: validValues,
        onSubmit: mockSubmit,
        validate
      })
    );

    const mockEvent = {
      preventDefault: jest.fn()
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalledWith(validValues);
    expect(result.current.submitCount).toBe(1);
    expect(result.current.isDirty).toBe(false);
  });

  it('should not submit if validation fails', async () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate
      })
    );

    const mockEvent = {
      preventDefault: jest.fn()
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.email).toHaveLength(1);
    expect(result.current.errors.password).toHaveLength(1);
    expect(result.current.errors.age).toHaveLength(1);
  });

  it('should reset form state', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate
      })
    );

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleBlur('email');
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.touched).toEqual({
      email: false,
      password: false,
      age: false
    });
    expect(result.current.isDirty).toBe(false);
    expect(result.current.submitCount).toBe(0);
  });

  it('should handle direct field value updates', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate
      })
    );

    act(() => {
      result.current.setFieldValue('age', 20);
    });

    expect(result.current.values.age).toBe(20);
    expect(result.current.isDirty).toBe(true);
  });

  it('should handle direct field error updates', () => {
    const { result } = renderHook(() =>
      useForm<TestForm>({
        initialValues,
        onSubmit: mockSubmit,
        validate
      })
    );

    const customError: ValidationError = {
      field: 'email',
      message: 'Custom error',
      type: 'custom',
      code: 'VALIDATION_ERROR'
    };

    act(() => {
      result.current.setFieldError('email', customError);
    });

    expect(result.current.errors.email).toContainEqual(customError);
    expect(result.current.isValid).toBe(false);
  });
});