import {
  createPreventDefaultHandler,
  createAsyncHandler,
  createFormHandler,
  createChangeHandler,
  createKeyHandler,
  createDebouncedHandler,
  createThrottledHandler,
  createDataHandler,
  createConditionalHandler,
  composeHandlers
} from '../createEventHandler';
import type { 
  ChangeEvent, 
  FormEvent, 
  KeyboardEvent,
  MouseEvent
} from 'react';

// Mock AbstractView
const mockView = {
  styleMedia: {} as StyleMedia,
  document: document,
  defaultView: window,
  frameElement: null,
  history: window.history,
  innerHeight: 0,
  innerWidth: 0,
  locationbar: window.locationbar,
  menubar: window.menubar,
  name: '',
  navigator: window.navigator,
  onabort: null,
  onafterprint: null,
  onbeforeprint: null,
  onbeforeunload: null,
  onblur: null,
  oncanplay: null,
  oncanplaythrough: null,
  onchange: null,
  onclick: null,
  oncontextmenu: null,
  ondblclick: null,
  ondrag: null,
  ondragend: null,
  ondragenter: null,
  ondragleave: null,
  ondragover: null,
  ondragstart: null,
  ondrop: null,
  ondurationchange: null,
  onemptied: null,
  onended: null,
  onerror: null,
  onfocus: null,
  onhashchange: null,
  oninput: null,
  oninvalid: null,
  onkeydown: null,
  onkeypress: null,
  onkeyup: null,
  onload: null,
  onloadeddata: null,
  onloadedmetadata: null,
  onloadstart: null,
  onmessage: null,
  onmousedown: null,
  onmousemove: null,
  onmouseout: null,
  onmouseover: null,
  onmouseup: null,
  onmousewheel: null,
  onoffline: null,
  ononline: null,
  onpagehide: null,
  onpageshow: null,
  onpause: null,
  onplay: null,
  onplaying: null,
  onpopstate: null,
  onprogress: null,
  onratechange: null,
  onreset: null,
  onresize: null,
  onscroll: null,
  onseeked: null,
  onseeking: null,
  onselect: null,
  onshow: null,
  onstalled: null,
  onstorage: null,
  onsubmit: null,
  onsuspend: null,
  ontimeupdate: null,
  onunload: null,
  onvolumechange: null,
  onwaiting: null,
  outerHeight: 0,
  outerWidth: 0,
  pageXOffset: 0,
  pageYOffset: 0,
  parent: window,
  personalbar: window.personalbar,
  screen: window.screen,
  screenLeft: 0,
  screenTop: 0,
  screenX: 0,
  screenY: 0,
  scrollbars: window.scrollbars,
  scrollX: 0,
  scrollY: 0,
  self: window,
  status: '',
  statusbar: window.statusbar,
  toolbar: window.toolbar,
  top: window,
  window: window,
  length: 0,
  scrollTo: () => {},
  scrollBy: () => {},
  scroll: () => {},
  close: () => {},
  stop: () => {},
  focus: () => {},
  blur: () => {},
  open: () => null,
  alert: () => {},
  confirm: () => false,
  prompt: () => null,
  print: () => {},
  requestAnimationFrame: () => 0,
  cancelAnimationFrame: () => {},
  getComputedStyle: () => ({} as CSSStyleDeclaration),
  matchMedia: () => ({} as MediaQueryList),
  moveTo: () => {},
  moveBy: () => {},
  resizeTo: () => {},
  resizeBy: () => {},
  getSelection: () => null,
  releaseEvents: () => {},
  captureEvents: () => {}
};

// Base synthetic event properties
const baseSyntheticEvent = {
  bubbles: true,
  cancelable: true,
  defaultPrevented: false,
  eventPhase: 0,
  isTrusted: true,
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  isDefaultPrevented: () => false,
  isPropagationStopped: () => false,
  persist: () => {},
  timeStamp: Date.now(),
  nativeEvent: new Event('event'),
  view: mockView,
  detail: 0
};

// Mock event factories
const createMockChangeEvent = (
  partial?: Partial<HTMLInputElement>
): ChangeEvent<HTMLInputElement> => ({
  ...baseSyntheticEvent,
  target: {
    value: '',
    checked: false,
    type: 'text',
    ...partial
  } as HTMLInputElement,
  currentTarget: {
    value: '',
    checked: false,
    type: 'text',
    ...partial
  } as HTMLInputElement,
  type: 'change'
});

const createMockFormEvent = (): FormEvent<HTMLFormElement> => ({
  ...baseSyntheticEvent,
  target: document.createElement('form'),
  currentTarget: document.createElement('form'),
  type: 'submit'
});

const createMockKeyboardEvent = (
  key: string = ''
): KeyboardEvent<HTMLElement> => ({
  ...baseSyntheticEvent,
  key,
  code: key,
  keyCode: 0,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  repeat: false,
  locale: '',
  location: 0,
  charCode: 0,
  which: 0,
  target: document.createElement('div'),
  currentTarget: document.createElement('div'),
  type: 'keydown',
  getModifierState: () => false,
  nativeEvent: new KeyboardEvent('keydown')
});

describe('Event Handler Utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('createPreventDefaultHandler', () => {
    it('should prevent default and call handler', () => {
      const mockHandler = jest.fn();
      const event = createMockFormEvent();
      const handler = createPreventDefaultHandler(mockHandler);

      handler(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalledWith(event);
    });
  });

  describe('createAsyncHandler', () => {
    it('should handle async operations', async () => {
      const mockAsyncOperation = jest.fn().mockResolvedValue(undefined);
      const handler = createAsyncHandler(mockAsyncOperation);
      const event = createMockFormEvent();

      await handler(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockAsyncOperation).toHaveBeenCalledWith(event);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      const mockAsyncOperation = jest.fn().mockRejectedValue(error);
      const handler = createAsyncHandler(mockAsyncOperation);
      const event = createMockFormEvent();

      await expect(handler(event)).rejects.toThrow(error);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('createFormHandler', () => {
    it('should handle form submission', async () => {
      const mockSubmit = jest.fn();
      const handler = createFormHandler(mockSubmit);
      const formData = new FormData();
      formData.append('test', 'value');
      const event = createMockFormEvent();

      // Mock FormData
      global.FormData = jest.fn().mockImplementation(() => formData);

      await handler(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockSubmit).toHaveBeenCalledWith({ test: 'value' });
    });
  });

  describe('createChangeHandler', () => {
    it('should handle text input changes', () => {
      const mockSetter = jest.fn();
      const handler = createChangeHandler(mockSetter);
      const event = createMockChangeEvent({
        type: 'text',
        value: 'test value'
      });

      handler(event);

      expect(mockSetter).toHaveBeenCalledWith('test value');
    });

    it('should handle checkbox changes', () => {
      const mockSetter = jest.fn();
      const handler = createChangeHandler(mockSetter);
      const event = createMockChangeEvent({
        type: 'checkbox',
        checked: true
      });

      handler(event);

      expect(mockSetter).toHaveBeenCalledWith(true);
    });
  });

  describe('createKeyHandler', () => {
    it('should handle specified keys', () => {
      const mockHandler = jest.fn();
      const handler = createKeyHandler({
        Enter: mockHandler
      });
      const event = createMockKeyboardEvent('Enter');

      handler(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockHandler).toHaveBeenCalled();
    });

    it('should ignore unspecified keys', () => {
      const mockHandler = jest.fn();
      const handler = createKeyHandler({
        Enter: mockHandler
      });
      const event = createMockKeyboardEvent('Escape');

      handler(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('createDebouncedHandler', () => {
    it('should debounce events', () => {
      const mockHandler = jest.fn();
      const handler = createDebouncedHandler(mockHandler, 100);
      const event = createMockFormEvent();

      handler(event);
      handler(event);
      handler(event);

      expect(mockHandler).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('createThrottledHandler', () => {
    it('should throttle events', () => {
      const mockHandler = jest.fn();
      const handler = createThrottledHandler(mockHandler, 100);
      const event = createMockFormEvent();

      handler(event);
      handler(event);
      handler(event);

      expect(mockHandler).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      handler(event);
      expect(mockHandler).toHaveBeenCalledTimes(2);
    });
  });

  describe('createDataHandler', () => {
    it('should pass data to handler', () => {
      const mockHandler = jest.fn();
      const data = { test: 'value' };
      const handler = createDataHandler(mockHandler, data);
      const event = createMockFormEvent();

      handler(event);

      expect(mockHandler).toHaveBeenCalledWith(event, data);
    });
  });

  describe('createConditionalHandler', () => {
    it('should call handler when condition is true', () => {
      const mockHandler = jest.fn();
      const handler = createConditionalHandler(() => true, mockHandler);
      const event = createMockFormEvent();

      handler(event);

      expect(mockHandler).toHaveBeenCalledWith(event);
    });

    it('should not call handler when condition is false', () => {
      const mockHandler = jest.fn();
      const handler = createConditionalHandler(() => false, mockHandler);
      const event = createMockFormEvent();

      handler(event);

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('composeHandlers', () => {
    it('should call all handlers in order', () => {
      const mockHandler1 = jest.fn();
      const mockHandler2 = jest.fn();
      const handler = composeHandlers(mockHandler1, mockHandler2);
      const event = createMockFormEvent();

      handler(event);

      expect(mockHandler1).toHaveBeenCalledWith(event);
      expect(mockHandler2).toHaveBeenCalledWith(event);
      expect(mockHandler1).toHaveBeenCalledBefore(mockHandler2);
    });

    it('should handle undefined handlers', () => {
      const mockHandler = jest.fn();
      const handler = composeHandlers(undefined, mockHandler, undefined);
      const event = createMockFormEvent();

      handler(event);

      expect(mockHandler).toHaveBeenCalledWith(event);
    });
  });
});