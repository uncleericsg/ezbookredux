import type { 
  ChangeEvent, 
  FormEvent, 
  MouseEvent, 
  KeyboardEvent,
  FocusEvent,
  DragEvent,
  SyntheticEvent
} from 'react';

// Base event handler types
export type ReactEventType = 
  | ChangeEvent<any>
  | FormEvent<any>
  | MouseEvent<any>
  | KeyboardEvent<any>
  | FocusEvent<any>
  | DragEvent<any>;

export type ElementType = HTMLElement;
export type InputElementType = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export type FormElementType = HTMLFormElement;

export type EventHandler<E extends ReactEventType, T extends ElementType = ElementType> = (
  event: E & { currentTarget: T }
) => void;

// Form event handler with values
export type FormHandler<T> = (values: T) => void | Promise<void>;

// Async event handler that prevents default
export type AsyncEventHandler<E extends ReactEventType, T extends ElementType = ElementType> = (
  event: E & { currentTarget: T }
) => Promise<void>;

// Event handler with data
export type DataEventHandler<E extends ReactEventType, D, T extends ElementType = ElementType> = (
  event: E & { currentTarget: T },
  data: D
) => void;

// Common event handler types
export type ChangeEventHandler<T extends InputElementType = HTMLInputElement> = 
  EventHandler<ChangeEvent<T>, T>;

export type FormEventHandler<T extends FormElementType = HTMLFormElement> = 
  EventHandler<FormEvent<T>, T>;

export type MouseEventHandler<T extends ElementType = HTMLElement> = 
  EventHandler<MouseEvent<T>, T>;

export type KeyboardEventHandler<T extends ElementType = HTMLElement> = 
  EventHandler<KeyboardEvent<T>, T>;

export type FocusEventHandler<T extends ElementType = HTMLElement> = 
  EventHandler<FocusEvent<T>, T>;

export type DragEventHandler<T extends ElementType = HTMLElement> = 
  EventHandler<DragEvent<T>, T>;

// Helper to create an event handler that prevents default
export function createPreventDefaultHandler<
  E extends ReactEventType,
  T extends ElementType = ElementType
>(handler?: EventHandler<E, T>): EventHandler<E, T> {
  return (event) => {
    event.preventDefault();
    handler?.(event);
  };
}

// Helper to create an async event handler that prevents default
export function createAsyncHandler<
  E extends ReactEventType,
  T extends ElementType = ElementType
>(handler: AsyncEventHandler<E, T>): EventHandler<E, T> {
  return (event) => {
    event.preventDefault();
    handler(event).catch(error => {
      console.error('Event handler error:', error);
      throw error;
    });
  };
}

// Helper to create a form submit handler
export function createFormHandler<T>(
  handler: FormHandler<T>
): FormEventHandler<HTMLFormElement> {
  return createPreventDefaultHandler(async (event) => {
    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData) as T;
    
    try {
      await handler(values);
    } catch (error) {
      console.error('Form handler error:', error);
      throw error;
    }
  });
}

// Helper to create a change handler for controlled inputs
export function createChangeHandler<T>(
  setter: (value: T) => void
): ChangeEventHandler<HTMLInputElement> {
  return (event) => {
    const target = event.currentTarget;
    const value = target.type === 'checkbox'
      ? target.checked as unknown as T
      : target.value as unknown as T;
    
    setter(value);
  };
}

// Helper to create a keyboard handler
export function createKeyHandler(
  keyMap: Record<string, () => void>
): KeyboardEventHandler {
  return (event) => {
    const handler = keyMap[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  };
}

// Helper to create a debounced event handler
export function createDebouncedHandler<
  E extends ReactEventType,
  T extends ElementType = ElementType
>(
  handler: EventHandler<E, T>,
  delay: number
): EventHandler<E, T> {
  let timeoutId: NodeJS.Timeout;

  return (event) => {
    // Clone the event since React pools events
    const eventClone = {
      ...event,
      persist: () => {},
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation()
    };
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      handler(eventClone as E & { currentTarget: T });
    }, delay);
  };
}

// Helper to create a throttled event handler
export function createThrottledHandler<
  E extends ReactEventType,
  T extends ElementType = ElementType
>(
  handler: EventHandler<E, T>,
  limit: number
): EventHandler<E, T> {
  let inThrottle = false;

  return (event) => {
    // Clone the event since React pools events
    const eventClone = {
      ...event,
      persist: () => {},
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation()
    };
    
    if (!inThrottle) {
      handler(eventClone as E & { currentTarget: T });
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Helper to create an event handler with data
export function createDataHandler<
  E extends ReactEventType,
  D,
  T extends ElementType = ElementType
>(
  handler: DataEventHandler<E, D, T>,
  data: D
): EventHandler<E, T> {
  return (event) => {
    handler(event, data);
  };
}

// Helper to create a conditional event handler
export function createConditionalHandler<
  E extends ReactEventType,
  T extends ElementType = ElementType
>(
  condition: () => boolean,
  handler: EventHandler<E, T>
): EventHandler<E, T> {
  return (event) => {
    if (condition()) {
      handler(event);
    }
  };
}

// Helper to create a composed event handler
export function composeHandlers<
  E extends ReactEventType,
  T extends ElementType = ElementType
>(
  ...handlers: Array<EventHandler<E, T> | undefined>
): EventHandler<E, T> {
  return (event) => {
    handlers.forEach(handler => {
      if (handler) {
        handler(event);
      }
    });
  };
}