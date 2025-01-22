import { existsSync, readdirSync, lstatSync, unlinkSync, rmdirSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

function deleteFolderRecursive(directoryPath) {
  if (existsSync(directoryPath)) {
    readdirSync(directoryPath).forEach((file) => {
      const curPath = join(directoryPath, file);
      if (lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        unlinkSync(curPath);
      }
    });
    rmdirSync(directoryPath);
  }
}

function cleanupBuildFiles() {
  // Get the project root directory (parent of scripts directory)
  const root = join(__dirname, '..');
  
  // Clean dist directory
  const distPath = join(root, 'dist');
  if (existsSync(distPath)) {
    deleteFolderRecursive(distPath);
    console.log('Cleaned dist directory');
  }

  // Clean tsbuildinfo files
  const tsBuildInfoFiles = [
    'tsconfig.tsbuildinfo',
    'dist/shared/.tsbuildinfo',
    'dist/node/.tsbuildinfo',
    'dist/app/.tsbuildinfo'
  ];

  tsBuildInfoFiles.forEach(file => {
    const filePath = join(root, file);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      console.log(`Removed ${file}`);
    }
  });

  // Create necessary directories
  const directories = ['dist', 'dist/shared', 'dist/node', 'dist/app'];
  directories.forEach(dir => {
    const dirPath = join(root, dir);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

cleanupBuildFiles();