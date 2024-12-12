const fs = require('fs/promises');
const path = require('path');

async function fixImports() {
    const projectRoot = path.resolve(__dirname, '../..');
    const corePackagePath = path.join(projectRoot, 'packages/core');
    const componentsPath = path.join(corePackagePath, 'src/components-new');

    try {
        console.log('Fixing component imports...');

        // Update imports in all components
        await updateImportsInDirectory(componentsPath);

        // Create types directory and file
        const typesDir = path.join(corePackagePath, 'src/types');
        await fs.mkdir(typesDir, { recursive: true });
        await fs.writeFile(
            path.join(typesDir, 'index.ts'),
            `export * from './components';\n`
        );

        // Create component types
        await fs.writeFile(
            path.join(typesDir, 'components.ts'),
            `import { HTMLAttributes } from 'react';

export interface ComponentBaseProps extends HTMLAttributes<HTMLElement> {
    className?: string;
}

export interface ComponentProps extends ComponentBaseProps {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}
`
        );

        // Create hooks directory
        const hooksDir = path.join(corePackagePath, 'src/hooks');
        await fs.mkdir(hooksDir, { recursive: true });
        await fs.writeFile(
            path.join(hooksDir, 'index.ts'),
            `// Add hooks exports here\n`
        );

        // Create constants directory
        const constantsDir = path.join(corePackagePath, 'src/constants');
        await fs.mkdir(constantsDir, { recursive: true });
        await fs.writeFile(
            path.join(constantsDir, 'index.ts'),
            `// Add constants here\n`
        );

        // Update package.json to include new dependencies
        const packageJsonPath = path.join(corePackagePath, 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        
        if (!packageJson.dependencies) {
            packageJson.dependencies = {};
        }

        // Add missing Radix UI dependencies
        packageJson.dependencies['@radix-ui/react-scroll-area'] = '^1.0.5';
        packageJson.dependencies['@radix-ui/react-toast'] = '^1.1.5';

        // Add testing library dependencies
        if (!packageJson.devDependencies) {
            packageJson.devDependencies = {};
        }
        packageJson.devDependencies['@testing-library/jest-dom'] = '^6.1.5';

        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

        console.log('Import fixes completed successfully!');
    } catch (error) {
        console.error('Error fixing imports:', error);
        throw error;
    }
}

async function updateImportsInDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            await updateImportsInDirectory(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
            await updateFileImports(fullPath);
        }
    }
}

async function updateFileImports(filePath) {
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Update relative imports to use @components path
    content = content.replace(
        /from ['"]\.\.?\/([\w-]+)['"]/g,
        (match, component) => {
            // Determine component type
            let type = 'atoms';
            if (['Card', 'FormProgress', 'ScrollArea', 'Select', 'Toast'].includes(component)) {
                type = 'molecules';
            } else if (['AddressAutocomplete', 'AddressConfirmationModal', 'Dialog'].includes(component)) {
                type = 'organisms';
            }
            return `from '@components/${type}/${component}'`;
        }
    );

    // Add types import if it's a component file
    if (content.includes('interface') && !content.includes('@components/types')) {
        content = `import { ComponentProps } from '@components/types';\n${content}`;
    }

    await fs.writeFile(filePath, content);
}

// Execute import fixes
fixImports().catch(console.error);
