// Path alias declarations
declare module '@/*' {
  const content: any;
  export * from content;
  export default content;
}

declare module '@components/*' {
  const content: any;
  export * from content;
  export default content;
}

declare module '@utils/*' {
  const content: any;
  export * from content;
  export default content;
}

declare module '@hooks/*' {
  const content: any;
  export * from content;
  export default content;
}

declare module '@store/*' {
  const content: any;
  export * from content;
  export default content;
}

declare module '@services/*' {
  const content: any;
  export * from content;
  export default content;
}

declare module '@types/*' {
  const content: any;
  export * from content;
  export default content;
}

declare module '@shared/*' {
  const content: any;
  export * from content;
  export default content;
}

declare module '@config/*' {
  const content: any;
  export * from content;
  export default content;
}

// Third-party module declarations
declare module 'tailwind-merge' {
  export function twMerge(...classLists: string[]): string;
}

declare module 'framer-motion' {
  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    onExitComplete?: () => void;
  }

  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    role?: string;
  }

  export const AnimatePresence: React.FC<AnimatePresenceProps>;
  export const motion: {
    div: React.FC<MotionProps>;
    span: React.FC<MotionProps>;
    button: React.FC<MotionProps>;
    a: React.FC<MotionProps>;
    nav: React.FC<MotionProps>;
    ul: React.FC<MotionProps>;
    li: React.FC<MotionProps>;
    p: React.FC<MotionProps>;
    h1: React.FC<MotionProps>;
    h2: React.FC<MotionProps>;
    h3: React.FC<MotionProps>;
    h4: React.FC<MotionProps>;
    h5: React.FC<MotionProps>;
    h6: React.FC<MotionProps>;
    img: React.FC<MotionProps>;
    svg: React.FC<MotionProps>;
    path: React.FC<MotionProps>;
  };
}

declare module 'lucide-react' {
  import type { FC, SVGProps } from 'react';
  
  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  // Basic icons
  export const CheckCircle: FC<IconProps>;
  export const XCircle: FC<IconProps>;
  export const AlertCircle: FC<IconProps>;
  export const Info: FC<IconProps>;
  export const Calendar: FC<IconProps>;
  export const CreditCard: FC<IconProps>;
  export const Wrench: FC<IconProps>;
  export const X: FC<IconProps>;

  // Navigation icons
  export const ChevronDown: FC<IconProps>;
  export const ChevronUp: FC<IconProps>;
  export const ChevronLeft: FC<IconProps>;
  export const ChevronRight: FC<IconProps>;
  export const Menu: FC<IconProps>;
  export const ExternalLink: FC<IconProps>;
  export const Link: FC<IconProps>;

  // Action icons
  export const Search: FC<IconProps>;
  export const Filter: FC<IconProps>;
  export const Settings: FC<IconProps>;
  export const User: FC<IconProps>;
  export const LogOut: FC<IconProps>;
  export const Plus: FC<IconProps>;
  export const Minus: FC<IconProps>;
  export const Edit: FC<IconProps>;
  export const Trash: FC<IconProps>;
  export const Trash2: FC<IconProps>;
  export const Save: FC<IconProps>;
  export const Upload: FC<IconProps>;
  export const Download: FC<IconProps>;
  export const Refresh: FC<IconProps>;
  export const Copy: FC<IconProps>;
  export const Check: FC<IconProps>;

  // Loading icons
  export const Loader: FC<IconProps>;
  export const Loader2: FC<IconProps>;

  // Media icons
  export const Image: FC<IconProps>;
  export const Video: FC<IconProps>;
  export const File: FC<IconProps>;
  export const FileText: FC<IconProps>;

  // UI icons
  export const GripVertical: FC<IconProps>;
  export const GripHorizontal: FC<IconProps>;
  export const MoreVertical: FC<IconProps>;
  export const MoreHorizontal: FC<IconProps>;
  export const ArrowUp: FC<IconProps>;
  export const ArrowDown: FC<IconProps>;
  export const ArrowLeft: FC<IconProps>;
  export const ArrowRight: FC<IconProps>;
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

// JSON declarations with type assertion
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