/* eslint-env node */
/* global console, process */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Create require for CommonJS modules
const require = createRequire(import.meta.url);

// Get current directory path
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Load tsconfig.json for path aliases
const tsconfig = JSON.parse(readFileSync(join(projectRoot, 'tsconfig.json'), 'utf-8'));
const pathAliases = Object.entries(tsconfig.compilerOptions.paths || {})
  .reduce((acc, [alias, paths]) => {
    acc[alias.replace('/*', '')] = paths[0].replace('/*', '');
    return acc;
  }, {});

// Define valid import patterns
const validImportPatterns = [
  /^@\/server\/services\//,
  /^@\/server\/repositories\//,
  /^@\/server\/middleware\//,
  /^@\/server\/types\//,
  /^@\/server\/utils\//,
  /^@\/server\/config\//,
  /^@\/server\/migrations\//,
  /^@\/api\//,
  /^@\/lib\//,
  /^@\/hooks\//,
  /^@\/components\//,
  /^@\/services\//,
  /^\.{1,2}\//, // Relative imports
  ...Object.keys(pathAliases).map(alias => new RegExp(`^${alias}`))
];

// Directories to exclude
const excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build'];

// Function to check if path should be excluded
function shouldExcludePath(path) {
  return excludeDirs.some(dir => path.includes(`/${dir}/`) || path.includes(`\\${dir}\\`));
}

// Cache for resolved paths
const resolvedPaths = new Map();

// Function to resolve import path
function resolveImportPath(importPath, filePath) {
  if (resolvedPaths.has(importPath)) {
    return resolvedPaths.get(importPath);
  }

  // Check if it's a path alias
  for (const [alias, path] of Object.entries(pathAliases)) {
    if (importPath.startsWith(alias)) {
      const resolved = join(projectRoot, path, importPath.slice(alias.length));
      resolvedPaths.set(importPath, resolved);
      return resolved;
    }
  }

  // Handle relative paths
  if (importPath.startsWith('.')) {
    const resolved = join(dirname(filePath), importPath);
    resolvedPaths.set(importPath, resolved);
    return resolved;
  }

  // Handle node_modules
  try {
    const resolved = require.resolve(importPath, { paths: [dirname(filePath)] });
    resolvedPaths.set(importPath, resolved);
    return resolved;
  } catch {
    return null;
  }
}

// Function to check file imports
function checkFileImports(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const importRegex = /(?:import|require)\(?['"](.*?)['"]\)?/g;
  
  let match;
  const errors = [];
  const warnings = [];
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip type-only imports
    if (importPath.endsWith('.d.ts')) continue;
    
    // Validate import pattern
    if (!validImportPatterns.some(pattern => pattern.test(importPath))) {
      errors.push({
        type: 'INVALID_PATTERN',
        file: relative(projectRoot, filePath),
        import: importPath
      });
      continue;
    }

    // Resolve and verify import
    const resolvedPath = resolveImportPath(importPath, filePath);
    if (!resolvedPath) {
      warnings.push({
        type: 'UNRESOLVED_IMPORT',
        file: relative(projectRoot, filePath),
        import: importPath
      });
      continue;
    }

    // Verify file exists
    try {
      statSync(resolvedPath);
    } catch {
      errors.push({
        type: 'MISSING_FILE',
        file: relative(projectRoot, filePath),
        import: importPath,
        resolvedPath: relative(projectRoot, resolvedPath)
      });
    }
  }
  
  return { errors, warnings };
}

// Main function to scan directory
function verifyImports(directory) {
  const files = readdirSync(directory);
  let allErrors = [];
  let allWarnings = [];
  
  for (const file of files) {
    const fullPath = join(directory, file);
    if (shouldExcludePath(fullPath)) continue;
    
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      const { errors, warnings } = verifyImports(fullPath);
      allErrors = allErrors.concat(errors);
      allWarnings = allWarnings.concat(warnings);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      const { errors, warnings } = checkFileImports(fullPath);
      allErrors = allErrors.concat(errors);
      allWarnings = allWarnings.concat(warnings);
    }
  }
  
  return { errors: allErrors, warnings: allWarnings };
}

// Run verification for all relevant directories
const dirsToScan = ['src', 'api', 'server'].map(dir => join(projectRoot, dir));
let allErrors = [];
let allWarnings = [];

for (const directory of dirsToScan) {
  try {
    const { errors, warnings } = verifyImports(directory);
    allErrors = allErrors.concat(errors);
    allWarnings = allWarnings.concat(warnings);
  } catch (error) {
    if (error.code !== 'ENOENT') { // Ignore if directory doesn't exist yet
      throw error;
    }
  }
}

// Generate report
if (allErrors.length > 0 || allWarnings.length > 0) {
  console.log('\nImport Verification Report:\n');
  
  if (allErrors.length > 0) {
    console.log('Errors:');
    allErrors.forEach((error, index) => {
      console.log(`\n${index + 1}. ${error.type}`);
      console.log(`   File: ${error.file}`);
      console.log(`   Import: ${error.import}`);
      if (error.resolvedPath) {
        console.log(`   Resolved Path: ${error.resolvedPath}`);
      }
    });
  }

  if (allWarnings.length > 0) {
    console.log('\nWarnings:');
    allWarnings.forEach((warning, index) => {
      console.log(`\n${index + 1}. ${warning.type}`);
      console.log(`   File: ${warning.file}`);
      console.log(`   Import: ${warning.import}`);
    });
  }

  process.exit(1);
} else {
  console.log('All imports are valid!');
  process.exit(0);
}