import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Common type import fixes
const importFixes = {
  // Fix verbatimModuleSyntax issues
  'import\\s*{([^}]*)Response([^}]*)}\\s*from\\s*[\'"]express[\'"]': 
    'import type { $1Response$2 } from \'express\'',
  'import\\s*{([^}]*)Request([^}]*)}\\s*from\\s*[\'"]express[\'"]':
    'import type { $1Request$2 } from \'express\'',
  
  // Fix missing type imports
  'import\\s*{([^}]*)Database([^}]*)}\\s*from\\s*[\'"]@/types/database[\'"]':
    'import type { $1Database$2 } from \'@/types/database\'',
  
  // Fix path alias issues
  'from\\s*[\'"]@types[\'"]': 'from \'@/types\'',
  'from\\s*[\'"]@store[\'"]': 'from \'@/store\'',
  'from\\s*[\'"]@server/\\*[\'"]': 'from \'@/server\'',
  
  // Fix type-only imports
  'import\\s*{([^}]*)Icon([^}]*)}\\s*from\\s*[\'"]lucide-react[\'"]':
    'import type { $1Icon$2 } from \'lucide-react\'',
};

function fixImports(content) {
  let fixedContent = content;
  
  for (const [pattern, replacement] of Object.entries(importFixes)) {
    const regex = new RegExp(pattern, 'g');
    fixedContent = fixedContent.replace(regex, replacement);
  }
  
  // Fix type-only imports with verbatimModuleSyntax
  const typeImportRegex = /import\s*{([^}]*)}\s*from\s*['"]([^'"]*types[^'"]*)['"]/g;
  fixedContent = fixedContent.replace(typeImportRegex, (match, imports, path) => {
    const typeImports = imports.split(',')
      .map(i => i.trim())
      .filter(i => i)
      .map(i => i.includes('type') ? i : `type ${i}`)
      .join(', ');
    return `import { ${typeImports} } from '${path}'`;
  });
  
  return fixedContent;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fixedContent = fixImports(content);
  
  if (content !== fixedContent) {
    fs.writeFileSync(filePath, fixedContent);
    console.log(`Fixed imports in: ${path.relative(rootDir, filePath)}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

// Process source directories
console.log('Fixing type imports...');
processDirectory(path.join(rootDir, 'src'));
console.log('Type import fixes complete!'); 