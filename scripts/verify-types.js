import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Type definition map to track duplicates
const typeDefinitions = new Map();
// Track import patterns
const importPatterns = new Map();

function scanForTypes(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanForTypes(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      analyzeFile(fullPath);
    }
  }
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  
  // Find type definitions
  const typeDefRegex = /^(export )?type\s+(\w+)/gm;
  let match;
  
  while ((match = typeDefRegex.exec(content)) !== null) {
    const typeName = match[2];
    if (typeDefinitions.has(typeName)) {
      const existing = typeDefinitions.get(typeName);
      console.warn(`\nWarning: Duplicate type definition found for "${typeName}":
        - ${existing}
        - ${relativePath}`);
    } else {
      typeDefinitions.set(typeName, relativePath);
    }
  }
  
  // Analyze import patterns
  const importRegex = /import\s+(?:{[^}]*}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (!importPatterns.has(importPath)) {
      importPatterns.set(importPath, new Set());
    }
    importPatterns.get(importPath).add(relativePath);
  }
}

function validateTypeImports() {
  console.log('Validating type imports and definitions...');
  
  // Scan source directories
  const directories = [
    path.join(rootDir, 'src', 'types'),
    path.join(rootDir, 'shared', 'types')
  ];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      scanForTypes(dir);
    }
  });
  
  // Report import pattern statistics
  console.log('\nImport pattern analysis:');
  for (const [importPath, files] of importPatterns) {
    if (importPath.includes('types')) {
      console.log(`\n${importPath} is imported in ${files.size} files:`);
      files.forEach(file => console.log(`  - ${file}`));
    }
  }
  
  // Validate verbatimModuleSyntax compliance
  console.log('\nChecking verbatimModuleSyntax compliance...');
  const typeOnlyImportRegex = /import\s+type\s+{[^}]*}\s+from/g;
  const nonTypeImportRegex = /import\s+{[^}]*}\s+from/g;
  
  for (const [importPath, files] of importPatterns) {
    if (importPath.includes('types')) {
      files.forEach(file => {
        const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
        if (!typeOnlyImportRegex.test(content) && nonTypeImportRegex.test(content)) {
          console.warn(`\nWarning: Non-type-only import from types module in ${file}`);
        }
      });
    }
  }
}

// Run type checking
try {
  console.log('Running type check...');
  execSync('npm run validate:types', { stdio: 'inherit' });
} catch (error) {
  console.error('Type check failed!');
  process.exit(1);
}

// Validate type imports
validateTypeImports();

console.log('\nType validation complete!'); 