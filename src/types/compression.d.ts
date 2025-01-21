declare module 'compression' {
  import { RequestHandler } from 'express';

  /**
   * Returns the compression middleware using the given options.
   * The middleware will attempt to compress response bodies for all request that traverse through the middleware.
   */
  function compression(options?: compression.CompressionOptions): RequestHandler;

  namespace compression {
    interface CompressionOptions {
      /**
       * See https://www.npmjs.com/package/bytes for a list of supported formats.
       * @default '1kb'
       */
      threshold?: string | number;

      /**
       * The level of compression to use, from 1 to 9, where 9 is maximum compression.
       * @default 6
       */
      level?: number;

      /**
       * The compression filter function.
       * @default compression.filter
       */
      filter?: (req: any, res: any) => boolean;

      /**
       * @default true
       */
      flush?: boolean;
    }

    /**
     * Filter function to determine whether to compress response or not.
     */
    function filter(req: any, res: any): boolean;
  }

  export = compression;
}
