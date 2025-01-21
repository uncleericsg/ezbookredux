import {
  isObject,
  isFunction,
  isPromise,
  hasSettingsProps,
  hasSaveableProps,
  isAppSettings,
  isAdminSettings,
  hasAppSettingsProps,
  hasAdminSettingsProps,
  isSettingsComponent,
  isSaveableSettingsComponent,
  validateSettings,
  validateSettingsUpdate,
  validateSaveHandler,
  validateComponentProps
} from '../typeGuards';

import type { AppSettings } from '@shared/types/appSettings';
import type { AdminSettings } from '@shared/types/settings';
import type { BaseSettingsProps, SaveableProps } from '@/types/components';

import {
  mockChatGPTSettings,
  mockAppSettings,
  mockAdminSettings
} from './mocks/settings';

describe('Type Guards', () => {
  describe('isObject', () => {
    it('should return true for valid objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(new Object())).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(42)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(42)).toBe(false);
    });
  });

  describe('isPromise', () => {
    it('should return true for promises', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise(() => {}))).toBe(true);
    });

    it('should return false for non-promises', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise(() => {})).toBe(false);
      expect(isPromise(null)).toBe(false);
    });
  });

  describe('hasSettingsProps', () => {
    const validProps: BaseSettingsProps = {
      settings: mockChatGPTSettings,
      loading: false,
      updateSettings: () => {}
    };

    it('should return true for valid settings props', () => {
      expect(hasSettingsProps(validProps)).toBe(true);
    });

    it('should return false for invalid settings props', () => {
      expect(hasSettingsProps({})).toBe(false);
      expect(hasSettingsProps({ settings: {} })).toBe(false);
      expect(hasSettingsProps({ settings: {}, loading: true })).toBe(false);
    });
  });

  describe('hasSaveableProps', () => {
    const validProps: SaveableProps = {
      loading: false,
      onSave: async () => {}
    };

    it('should return true for valid saveable props', () => {
      expect(hasSaveableProps(validProps)).toBe(true);
    });

    it('should return false for invalid saveable props', () => {
      expect(hasSaveableProps({})).toBe(false);
      expect(hasSaveableProps({ loading: true })).toBe(false);
      expect(hasSaveableProps({ onSave: () => {} })).toBe(false);
    });
  });

  describe('isAppSettings', () => {
    it('should return true for valid app settings', () => {
      expect(isAppSettings(mockAppSettings)).toBe(true);
    });

    it('should return false for invalid app settings', () => {
      expect(isAppSettings({})).toBe(false);
      expect(isAppSettings({ loginScreenEnabled: true })).toBe(false);
    });
  });

  describe('isAdminSettings', () => {
    it('should return true for valid admin settings', () => {
      expect(isAdminSettings(mockAdminSettings)).toBe(true);
    });

    it('should return false for invalid admin settings', () => {
      expect(isAdminSettings({})).toBe(false);
      expect(isAdminSettings({ integrations: {} })).toBe(false);
    });
  });

  describe('validateSettings', () => {
    it('should validate settings object structure', () => {
      const settings = { a: 1, b: 2, c: 3 };
      expect(validateSettings(settings, ['a', 'b'])).toBe(true);
      expect(validateSettings(settings, ['d'])).toBe(false);
    });
  });

  describe('validateSettingsUpdate', () => {
    it('should validate settings update function', () => {
      const validFn = () => {};
      const invalidFn = 'not a function';
      
      expect(validateSettingsUpdate(validFn)).toBe(true);
      expect(validateSettingsUpdate(invalidFn)).toBe(false);
    });
  });

  describe('validateSaveHandler', () => {
    it('should validate save handler function', () => {
      const validFn = async () => {};
      const invalidFn = () => {};
      
      expect(validateSaveHandler(validFn)).toBe(true);
      expect(validateSaveHandler(invalidFn)).toBe(false);
    });
  });

  describe('validateComponentProps', () => {
    it('should validate component props', () => {
      const props = { a: 1, b: 2, required: true };
      expect(validateComponentProps(props, ['required'])).toBe(true);
      expect(validateComponentProps(props, ['missing'])).toBe(false);
    });
  });

  describe('isSettingsComponent', () => {
    const validComponent = {
      propTypes: {
        settings: {},
        updateSettings: {},
        loading: {}
      }
    };

    it('should return true for valid settings component', () => {
      expect(isSettingsComponent(validComponent)).toBe(true);
    });

    it('should return false for invalid settings component', () => {
      expect(isSettingsComponent({})).toBe(false);
      expect(isSettingsComponent({ propTypes: {} })).toBe(false);
    });
  });

  describe('isSaveableSettingsComponent', () => {
    const validComponent = {
      propTypes: {
        settings: {},
        updateSettings: {},
        loading: {},
        onSave: {}
      }
    };

    it('should return true for valid saveable settings component', () => {
      expect(isSaveableSettingsComponent(validComponent)).toBe(true);
    });

    it('should return false for invalid saveable settings component', () => {
      expect(isSaveableSettingsComponent({})).toBe(false);
      expect(isSaveableSettingsComponent({ propTypes: {} })).toBe(false);
    });
  });
});
