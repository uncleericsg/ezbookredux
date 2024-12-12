import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function removeUnusedImports(filePath: string) {
    const content = await fs.readFile(filePath, 'utf-8');
    let modified = content;

    // Remove unused React imports in test files
    if (filePath.includes('.test.tsx') && content.includes("import * as React from 'react';")) {
        modified = modified.replace("import * as React from 'react';", "import { render, screen } from '@testing-library/react';");
    }

    // Remove unused ComponentProps imports if not used in implementation
    if (!filePath.includes('.test.') && content.includes("import { ComponentProps }") && !content.includes('extends ComponentProps')) {
        modified = modified.replace(/import\s*{\s*ComponentProps\s*}[^;]*;(\r?\n)?/, '');
    }

    if (modified !== content) {
        await fs.writeFile(filePath, modified, 'utf-8');
        console.log(`Updated imports in ${filePath}`);
    }
}

async function processDirectory(dir: string) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            await processDirectory(fullPath);
        } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
            await removeUnusedImports(fullPath);
        }
    }
}

// Run the script
const projectRoot = path.resolve(__dirname, '../../packages/core/src');
const directories = [
    path.join(projectRoot, 'components-new'),
    path.join(projectRoot, 'components/ui')
];

Promise.all(directories.map(dir => processDirectory(dir))).catch(console.error);
