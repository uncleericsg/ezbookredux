import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importMappings = {
    '../ui/': '@components/',
    './ui/': '@components/',
    '@components/ui/': '@components/',
};

async function updateImports(filePath: string): Promise<boolean> {
    const content = await fs.readFile(filePath, 'utf-8');
    let modified = content;
    let hasChanges = false;

    // Update imports
    for (const [oldPath, newPath] of Object.entries(importMappings)) {
        const regex = new RegExp(`from ['"]${oldPath}([^'"]+)['"]`, 'g');
        const newContent = modified.replace(regex, (match, componentPath) => {
            // Determine the correct atomic design category
            let category = 'atoms';
            if (componentPath.toLowerCase().includes('dialog') || 
                componentPath.toLowerCase().includes('modal') ||
                componentPath.toLowerCase().includes('autocomplete')) {
                category = 'organisms';
            } else if (componentPath.toLowerCase().includes('card') ||
                      componentPath.toLowerCase().includes('select') ||
                      componentPath.toLowerCase().includes('toast') ||
                      componentPath.toLowerCase().includes('form') ||
                      componentPath.toLowerCase().includes('scroll')) {
                category = 'molecules';
            }
            
            return `from '${newPath}${category}/${componentPath}'`;
        });

        if (newContent !== modified) {
            modified = newContent;
            hasChanges = true;
        }
    }

    if (hasChanges) {
        await fs.writeFile(filePath, modified, 'utf-8');
        console.log(`Updated imports in ${filePath}`);
    }

    return hasChanges;
}

async function processDirectory(dir: string): Promise<number> {
    let updatedFiles = 0;
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            if (!file.name.includes('node_modules') && !file.name.includes('dist')) {
                updatedFiles += await processDirectory(fullPath);
            }
        } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
            if (await updateImports(fullPath)) {
                updatedFiles++;
            }
        }
    }

    return updatedFiles;
}

// Run the update
const projectRoot = path.resolve(__dirname, '../..');
console.log('Updating old component imports...');

processDirectory(projectRoot)
    .then(count => {
        console.log(`\nUpdated imports in ${count} files.`);
        console.log('Please verify the changes and run the build to ensure everything works correctly.');
    })
    .catch(console.error);
