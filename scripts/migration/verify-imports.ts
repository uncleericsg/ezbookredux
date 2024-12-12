import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ImportReference {
    file: string;
    line: string;
    lineNumber: number;
}

async function findOldImports(filePath: string): Promise<ImportReference[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const references: ImportReference[] = [];

    lines.forEach((line, index) => {
        // Look for imports from old components directory
        if (line.includes('from \'@components/ui/') || 
            line.includes('from "./ui/') || 
            line.includes('from \'../ui/') ||
            line.includes('from "../ui/')) {
            references.push({
                file: filePath,
                line: line.trim(),
                lineNumber: index + 1
            });
        }
    });

    return references;
}

async function processDirectory(dir: string): Promise<ImportReference[]> {
    const allReferences: ImportReference[] = [];
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            if (!file.name.includes('node_modules')) {
                const subDirReferences = await processDirectory(fullPath);
                allReferences.push(...subDirReferences);
            }
        } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
            const fileReferences = await findOldImports(fullPath);
            allReferences.push(...fileReferences);
        }
    }

    return allReferences;
}

// Run the verification
const projectRoot = path.resolve(__dirname, '../..');
console.log('Scanning for old component imports...');

processDirectory(projectRoot)
    .then(references => {
        if (references.length > 0) {
            console.log('\nFound references to old component directory:');
            references.forEach(ref => {
                console.log(`\nFile: ${ref.file}`);
                console.log(`Line ${ref.lineNumber}: ${ref.line}`);
            });
            console.log('\nPlease update these imports before removing the old components directory.');
        } else {
            console.log('\nNo references to old component directory found.');
            console.log('It should be safe to remove the old components directory.');
        }
    })
    .catch(console.error);
