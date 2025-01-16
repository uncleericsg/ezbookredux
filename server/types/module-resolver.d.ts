declare module './module-resolver.js' {
  import { Router } from 'express';
  
  /**
   * Resolves module paths using custom aliases
   * @param modulePath - The module path to resolve
   * @returns The resolved module
   * @throws {Error} If the module cannot be resolved
   */
  export function resolveModule(modulePath: string): unknown;
  
  /**
   * Module resolver configuration
   */
  export interface ModuleResolverConfig {
    aliases: Record<string, string>;
    extensions: string[];
  }

  /**
   * Custom require function with type support
   */
  export function require(modulePath: string): {
    default: Router | any;
  };

  /**
   * Environment variable mapping configuration
   */
  export interface EnvMapping {
    [key: string]: string | undefined;
  }
}