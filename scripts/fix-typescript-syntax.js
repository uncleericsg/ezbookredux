import fs from 'fs';
import path from 'path';
import { ESLint } from 'eslint';
import prettier from 'prettier';

const fixTypescriptSyntax = async (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix common TypeScript syntax issues
    content = content
      // Fix malformed type declarations
      .replace(/:\s*;,/g, ': any;')
      .replace(/:\s*,/g, ': any,')
      // Fix malformed function declarations
      .replace(/\):\s*\(any\):/g, ') =>')
      .replace(/\):\s*\(.*?\):\s*\(.*?\):/g, ') =>')
      // Fix interface declarations
      .replace(/interface\s+(\w+)\s+extends\s+React\.HTMLAttributes/g, 'interface $1 extends HTMLAttributes')
      // Fix export declarations
      .replace(/export\s+const\s+(\w+):\s*;,/g, 'export const $1 = ')
      // Fix useEffect declarations
      .replace(/useEffect\(\):\s*\(.*?\):/g, 'useEffect(() =>')
      // Fix async function declarations
      .replace(/async\s*\(.*?\):\s*;,/g, 'async () => {')
      // Fix object property declarations
      .replace(/(\w+):\s*;,/g, '$1: any,');
    
    // Format with Prettier
    const prettierConfig = await prettier.resolveConfig(filePath);
    content = prettier.format(content, {
      ...prettierConfig,
      filepath: filePath
    });
    
    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed TypeScript syntax in ${path.basename(filePath)}`);
    
  } catch (error) {
    console.error(`Error fixing TypeScript syntax in ${path.basename(filePath)}:`, error);
  }
};

// Run on specified file
const filePath = process.argv[2];
if (!filePath) {
  console.error('Please provide a file path');
  process.exit(1);
}

fixTypescriptSyntax(filePath);
