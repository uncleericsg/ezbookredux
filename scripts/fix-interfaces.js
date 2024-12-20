import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixInterfaces(directory) {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        await fixInterfaces(fullPath);
        continue;
      }
      
      if (!file.name.endsWith('.tsx')) continue;
      
      let content = await fs.readFile(fullPath, 'utf8');
      
      // Fix interface definitions with double curly braces
      content = content.replace(/extends React\.HTMLAttributes<HTMLDivElement>\s*{\s*{/g, 'extends React.HTMLAttributes<HTMLDivElement> {');
      
      // Fix missing React imports
      if (!content.includes('import React')) {
        content = "import React from 'react';\n" + content;
      }
      
      // Add empty line between import groups
      content = content.replace(/^import.*\n(?=import)/gm, '$&\n');
      
      await fs.writeFile(fullPath, content, 'utf8');
    }
  } catch (error) {
    console.error('Error fixing interfaces:', error);
  }
}

const adminDir = path.resolve(__dirname, '../src/components/admin');
fixInterfaces(adminDir);
