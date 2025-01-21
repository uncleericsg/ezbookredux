/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="node" />

// Path alias declarations
declare module '@/*' {
  const content: any;
  export default content;
  export * from content;
}

declare module '@components/*' {
  const content: any;
  export default content;
  export * from content;
}

declare module '@utils/*' {
  const content: any;
  export default content;
  export * from content;
}

declare module '@hooks/*' {
  const content: any;
  export default content;
  export * from content;
}

declare module '@store/*' {
  const content: any;
  export default content;
  export * from content;
}

declare module '@services/*' {
  const content: any;
  export default content;
  export * from content;
}

declare module '@types/*' {
  const content: any;
  export default content;
  export * from content;
}

declare module '@shared/*' {
  const content: any;
  export default content;
  export * from content;
}

declare module '@config/*' {
  const content: any;
  export default content;
  export * from content;
}

// Asset declarations
declare module '*.svg' {
  import type { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.styl' {
  const content: { [className: string]: string };
  export default content;
}

// JSON declarations
declare module '*.json' {
  const content: any;
  export default content;
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_GOOGLE_MAPS_KEY: string;
  readonly VITE_FIREBASE_CONFIG: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ENVIRONMENT: 'development' | 'staging' | 'production';
  readonly VITE_VERSION: string;
  readonly VITE_BUILD_TIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global window extensions
interface Window {
  config: {
    apiUrl: string;
    environment: string;
    version: string;
    buildTime: string;
    features: {
      analytics: boolean;
      darkMode: boolean;
      notifications: boolean;
    };
  };
  google?: {
    maps: typeof google.maps;
  };
  Stripe?: stripe.Stripe;
  dataLayer?: any[];
  fbq?: (...args: any[]) => void;
  gtag?: (...args: any[]) => void;
}

// Global process extensions
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT?: string;
    PWD: string;
  }
}

// Utility types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

type ValueOf<T> = T[keyof T];

type Nullable<T> = T | null;

type Optional<T> = T | undefined;

type Primitive = string | number | boolean | null | undefined;

type AnyObject = Record<string, unknown>;

type EmptyObject = Record<string, never>;

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
