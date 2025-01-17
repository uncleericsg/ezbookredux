import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const ROOT_DIR = path.resolve(__dirname, '..');
const IMPORT_REGEX = /^import\s+(?:(?:(?:\{[^}]*\}|\*\s+as\s+[^,]*|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+[^,]*|\w+))*\s+from\s+)?['"]([^'"]+)['"]|['"]([^'"]+)['"])/gm;

const PATH_MAPPINGS = {
  '@/': './src/',
  '@server/': './server/',
  '@api/': './api/',
  '@shared/': './shared/',
  '@components/': './src/components/',
  '@hooks/': './src/hooks/',
  '@services/': './src/services/',
  '@utils/': './src/utils/',
  '@types/': './src/types/',
  '@config/': './src/config/',
  '@admin/': './src/components/admin/'
};

function fixImportPath(importPath: string, filePath: string): string {
  // Don't modify package imports
  if (importPath.startsWith('.') || importPath.startsWith('@')) {
    for (const [alias, mapping] of Object.entries(PATH_MAPPINGS)) {
      if (importPath.startsWith(alias)) {
        const relativePath = path.relative(
          path.dirname(filePath),
          path.join(ROOT_DIR, mapping, importPath.slice(alias.length))
        ).replace(/\\/g, '/');
        return relativePath.startsWith('.') ? relativePath : './' + relativePath;
      }
    }
  }
  return importPath;
}

function processFile(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let match;

  // Reset regex
  IMPORT_REGEX.lastIndex = 0;

  while ((match = IMPORT_REGEX.exec(content)) !== null) {
    const importPath = match[1] || match[2];
    const fixedPath = fixImportPath(importPath, filePath);
    if (importPath !== fixedPath) {
      newContent = newContent.replace(
        new RegExp(`(['"])${importPath}(['"])`, 'g'),
        `$1${fixedPath}$2`
      );
    }
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed imports in: ${path.relative(ROOT_DIR, filePath)}`);
  }
}

function main() {
  const patterns = [
    'src/**/*.{ts,tsx}',
    'server/**/*.ts',
    'api/**/*.ts',
    'shared/**/*.ts'
  ];

  patterns.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: ROOT_DIR });
    files.forEach(file => {
      const fullPath = path.join(ROOT_DIR, file);
      processFile(fullPath);
    });
  });
}

main(); 