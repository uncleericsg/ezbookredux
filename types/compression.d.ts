import { RequestHandler } from 'express';

declare module 'compression' {
  namespace compression {
    interface CompressionOptions {
      /**
       * Compression level (0-9)
       */
      level?: number;

      /**
       * Minimum size in bytes to compress responses
       */
      threshold?: number | string;

      /**
       * Function to determine if response should be compressed
       */
      filter?: (req: any, res: any) => boolean;

      /**
       * Minimum compression ratio (compressed/original)
       */
      chunkSize?: number;

      /**
       * Compression strategy (0-4)
       */
      strategy?: number;
    }
  }

  /**
   * Returns middleware that will attempt to compress response bodies
   */
  function compression(options?: compression.CompressionOptions): RequestHandler;

  export = compression;
}

// Add module augmentation for package.json exports
declare module 'compression/package.json' {
  const content: {
    name: string;
    version: string;
    exports: {
      '.': {
        types: string;
        require: string;
        import: string;
      };
    };
  };
  export = content;
}
