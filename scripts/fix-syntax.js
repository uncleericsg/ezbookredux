import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix common syntax issues in TypeScript files
function fixSyntaxIssues(content) {
  // Fix missing semicolons after interface properties
  content = content.replace(/(\w+)\s*:\s*[^;{]+(?!\s*[;{])\s*$/gm, '$1;');
  
  // Fix trailing commas in object literals
  content = content.replace(/,(\s*[}\]])/g, '$1');
  
  // Fix missing braces in interface declarations
  content = content.replace(/interface\s+(\w+)([^{]*)\s*(?!{)/g, 'interface $1$2 {');
  
  // Fix missing export statements
  content = content.replace(/^(?!export\s|import\s)interface\s/gm, 'export interface ');
  
  // Fix incorrect import syntax
  content = content.replace(/import\s*{(\s*;)/, 'import {');
  
  // Fix missing type annotations
  content = content.replace(/:\s*;/g, ': any;');
  
  return content;
}

// Function to process a TypeScript file
async function processFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const fixed = fixSyntaxIssues(content);
    
    if (content !== fixed) {
      await fs.writeFile(filePath, fixed, 'utf8');
      console.log(`Fixed syntax issues in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to recursively find TypeScript files
async function findTypeScriptFiles(dir) {
  const files = await fs.readdir(dir);
  const typeScriptFiles = [];
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      const subDirFiles = await findTypeScriptFiles(fullPath);
      typeScriptFiles.push(...subDirFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      typeScriptFiles.push(fullPath);
    }
  }
  
  return typeScriptFiles;
}

// Main function to run the script
async function main() {
  try {
    const srcDir = path.join(__dirname, '..', 'src');
    const files = await findTypeScriptFiles(srcDir);
    
    console.log(`Found ${files.length} TypeScript files to process`);
    
    for (const file of files) {
      await processFile(file);
    }
    
    console.log('Finished processing all files');
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
}

main();
