import { existsSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import type { ErrorCode } from '../shared/types/error';

interface ValidationError {
  code: ErrorCode;
  message: string;
  path?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

const DIST_DIR = resolve(__dirname, '../dist');
const REQUIRED_DIRS = ['shared', 'config'];

function validateBuildOrder(): ValidationResult {
  const errors: ValidationError[] = [];

  // Check if dist directory exists
  if (!existsSync(DIST_DIR)) {
    errors.push({
      code: 'NOT_FOUND',
      message: 'Dist directory not found. Run build first.'
    });
    return { isValid: false, errors };
  }

  // Check required directories
  for (const dir of REQUIRED_DIRS) {
    const dirPath = join(DIST_DIR, dir);
    if (!existsSync(dirPath)) {
      errors.push({
        code: 'NOT_FOUND',
        message: `Required directory ${dir} not found in dist`,
        path: dirPath
      });
      continue;
    }

    // Check for declaration files
    const files = readdirSync(dirPath);
    const hasDeclarations = files.some(file => file.endsWith('.d.ts'));
    if (!hasDeclarations) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: `No declaration files found in ${dir}`,
        path: dirPath
      });
    }

    // Check for build info
    const buildInfoPath = join(dirPath, '.tsbuildinfo');
    if (!existsSync(buildInfoPath)) {
      errors.push({
        code: 'NOT_FOUND',
        message: `Build info not found for ${dir}`,
        path: buildInfoPath
      });
    }
  }

  // Validate build timestamps
  const timestamps = REQUIRED_DIRS.map(dir => {
    const dirPath = join(DIST_DIR, dir);
    const buildInfoPath = join(dirPath, '.tsbuildinfo');
    if (existsSync(buildInfoPath)) {
      return {
        dir,
        time: statSync(buildInfoPath).mtime.getTime()
      };
    }
    return null;
  }).filter(Boolean);

  // Check build order
  if (timestamps.length > 1) {
    for (let i = 1; i < timestamps.length; i++) {
      const prev = timestamps[i - 1]!;
      const curr = timestamps[i]!;
      if (curr.time < prev.time) {
        errors.push({
          code: 'VALIDATION_ERROR',
          message: `Invalid build order: ${curr.dir} was built before ${prev.dir}`
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Run validation if called directly
if (require.main === module) {
  const result = validateBuildOrder();
  if (!result.isValid) {
    console.error('Build validation failed:');
    result.errors.forEach(error => {
      console.error(`- ${error.message}${error.path ? ` (${error.path})` : ''}`);
    });
    process.exit(1);
  }
  console.log('Build validation successful');
}

export { validateBuildOrder, type ValidationResult, type ValidationError }; 