import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let filesProcessed = 0;

function searchFiles(dir, searchString) {
  console.log(`Searching in directory: ${dir}`);
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      searchFiles(filePath, searchString);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
      filesProcessed++;
      const content = fs.readFileSync(filePath, 'utf-8');
      if (content.includes(searchString)) {
        console.log(`Found in ${filePath}:`);
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(searchString)) {
            console.log(`  Line ${index + 1}: ${line.trim()}`);
          }
        });
        console.log('');
      }
    }
  });
}

const rootDir = path.resolve(__dirname, '..');
console.log(`Starting search from root directory: ${rootDir}`);
searchFiles(rootDir, 'ErrorBoundary');
console.log(`Total files processed: ${filesProcessed}`);