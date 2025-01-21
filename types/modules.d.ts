declare module 'express-rate-limit' {
  import { Request, Response, NextFunction } from 'express';
  import { RateLimitOptions } from '@shared/types/middleware';

  function rateLimit(options?: RateLimitOptions): (req: Request, res: Response, next: NextFunction) => void;
  export = rateLimit;
}

declare module '*.svg' {
  const content: string;
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

declare module '*.bmp' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: { [key: string]: any };
  export default content;
}

declare module '*.css' {
  const content: { [key: string]: any };
  export default content;
}

declare module '*.scss' {
  const content: { [key: string]: any };
  export default content;
}

declare module '*.sass' {
  const content: { [key: string]: any };
  export default content;
}

declare module '*.less' {
  const content: { [key: string]: any };
  export default content;
}

declare module '*.styl' {
  const content: { [key: string]: any };
  export default content;
}
