import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = join(__dirname, '..');

function validateBuild() {
  console.log('Validating shared types build...');

  // Check if dist directory exists
  const distPath = join(projectRoot, 'dist');
  if (!existsSync(distPath)) {
    console.error('dist directory is missing!');
    process.exit(1);
  }

  // Check for .tsbuildinfo file
  const tsBuildInfoPath = join(distPath, '.tsbuildinfo');
  if (!existsSync(tsBuildInfoPath)) {
    console.error('.tsbuildinfo file is missing!');
    process.exit(1);
  }

  // Check for declaration files
  const declarationFiles = findDeclarationFiles(join(projectRoot, 'dist'));
  if (declarationFiles.length === 0) {
    console.error('No declaration files found!');
    process.exit(1);
  }

  // Validate declaration file structure
  const invalidFiles = declarationFiles.filter(file => !validateDeclarationFile(file));
  if (invalidFiles.length > 0) {
    console.error('Invalid declaration files found:', invalidFiles);
    process.exit(1);
  }

  console.log('Build validation successful!');
}

function findDeclarationFiles(dir) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findDeclarationFiles(fullPath));
    } else if (entry.name.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function validateDeclarationFile(filePath) {
  try {
    const stats = statSync(filePath);
    if (stats.size === 0) {
      console.error(`Empty declaration file: ${filePath}`);
      return false;
    }

    // Check for corresponding .d.ts.map file
    const mapFile = `${filePath}.map`;
    if (!existsSync(mapFile)) {
      console.error(`Missing source map for: ${filePath}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error validating ${filePath}:`, error);
    return false;
  }
}

validateBuild();