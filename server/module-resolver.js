import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/**
 * Resolves module paths using custom aliases
 * @param {string} modulePath - The module path to resolve
 * @returns {any} The resolved module
 * @throws {Error} If the module cannot be resolved
 */
export function resolveModule(modulePath) {
  try {
    // Handle @routes/* aliases
    if (modulePath.startsWith('@routes/')) {
      const routePath = modulePath.replace('@routes/', '');
      const resolvedPath = path.resolve(__dirname, '../src/routes', `${routePath}.js`);
      
      // Try .ts extension if .js not found
      try {
        return require(resolvedPath);
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          const tsPath = path.resolve(__dirname, 'routes', `${routePath}.ts`);
          return require(tsPath);
        }
        throw err;
      }
    }
    
    // Handle other aliases
    const aliases = {
      '@api': './api',
      '@components': './src/components',
      '@config': './src/config',
      '@utils': './src/utils'
    };

    for (const [alias, aliasPath] of Object.entries(aliases)) {
      if (modulePath.startsWith(alias)) {
        const resolvedPath = path.resolve(__dirname, aliasPath, modulePath.slice(alias.length));
        return require(resolvedPath);
      }
    }

    // Fallback to default resolution
    return require(modulePath);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      throw new Error(`Cannot find module '${modulePath}'`);
    }
    throw err;
  }
}