import { glob } from 'glob';
import { unlink } from 'fs/promises';
import { resolve, relative } from 'path';
import { existsSync } from 'fs';

async function cleanupDeclarationFiles() {
  const rootDir = resolve(__dirname, '..');
  const distDir = resolve(rootDir, 'dist');
  
  // Only proceed if dist directory exists
  if (!existsSync(distDir)) {
    console.log('No dist directory found. Skipping cleanup.');
    return;
  }

  try {
    // Find all .d.ts files in dist
    const declarationFiles = await glob('dist/**/*.d.ts', {
      cwd: rootDir,
      absolute: true
    });

    // Find all .ts and .tsx source files
    const sourceFiles = await glob('src/**/*.{ts,tsx}', {
      cwd: rootDir,
      absolute: true
    });

    // Convert source files to expected declaration file paths
    const expectedDeclarations = sourceFiles.map(sourcePath => {
      const relativePath = relative(resolve(rootDir, 'src'), sourcePath);
      return resolve(distDir, relativePath.replace(/\.tsx?$/, '.d.ts'));
    });

    // Find orphaned declaration files
    const orphanedFiles = declarationFiles.filter(
      declFile => !expectedDeclarations.includes(declFile)
    );

    // Delete orphaned files
    if (orphanedFiles.length > 0) {
      console.log(`Found ${orphanedFiles.length} orphaned declaration files`);
      
      for (const file of orphanedFiles) {
        await unlink(file);
        console.log(`Deleted: ${relative(rootDir, file)}`);
      }
    } else {
      console.log('No orphaned declaration files found');
    }
  } catch (error) {
    console.error('Error cleaning up declaration files:', error);
    process.exit(1);
  }
}

// Run cleanup if called directly
if (require.main === module) {
  cleanupDeclarationFiles();
}

export { cleanupDeclarationFiles }; 