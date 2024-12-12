const fs = require('fs/promises');
const path = require('path');

// Component categorization rules
const atomicCategories = {
    atoms: [
        'Badge',
        'Button',
        'Input',
        'Label',
        'Skeleton',
        'Spinner',
        'Textarea',
        'Tooltip'
    ],
    molecules: [
        'Card',
        'FormProgress',
        'ScrollArea',
        'Select',
        'Toast'
    ],
    organisms: [
        'AddressAutocomplete',
        'AddressConfirmationModal',
        'Dialog'
    ]
};

async function categorizeComponents() {
    const projectRoot = path.resolve(__dirname, '../..');
    const corePackagePath = path.join(projectRoot, 'packages/core');
    const oldComponentsPath = path.join(corePackagePath, 'src/components');
    const newComponentsPath = path.join(corePackagePath, 'src/components-new');

    try {
        console.log('Starting component categorization...');

        // Ensure new directories exist
        for (const category of Object.keys(atomicCategories)) {
            await fs.mkdir(path.join(newComponentsPath, category), { recursive: true });
        }

        // Move UI components to their new locations
        const uiDir = path.join(oldComponentsPath, 'ui');
        const files = await fs.readdir(uiDir);

        for (const file of files) {
            if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue;
            
            const componentName = path.basename(file, path.extname(file));
            const category = getCategoryForComponent(componentName);
            
            if (!category) {
                console.log(`Skipping ${componentName} - no category assigned`);
                continue;
            }

            // Copy component and its test file if it exists
            const sourcePath = path.join(uiDir, file);
            const targetPath = path.join(newComponentsPath, category, file);
            
            await fs.copyFile(sourcePath, targetPath);
            console.log(`Moved ${componentName} to ${category}`);

            // Copy test file if it exists
            const testFile = `${componentName}.test.tsx`;
            const testSourcePath = path.join(uiDir, testFile);
            try {
                await fs.access(testSourcePath);
                const testTargetPath = path.join(newComponentsPath, category, testFile);
                await fs.copyFile(testSourcePath, testTargetPath);
                console.log(`Moved ${testFile} to ${category}`);
            } catch (error) {
                // Test file doesn't exist, skip
            }
        }

        // Create index files for each category
        for (const [category, components] of Object.entries(atomicCategories)) {
            const indexContent = components
                .map(component => `export * from './${component}';`)
                .join('\n');
            
            await fs.writeFile(
                path.join(newComponentsPath, category, 'index.ts'),
                indexContent + '\n'
            );
        }

        // Create main index file
        const mainIndexContent = Object.keys(atomicCategories)
            .map(category => `export * from './${category}';`)
            .join('\n') + '\n';
        
        await fs.writeFile(
            path.join(newComponentsPath, 'index.ts'),
            mainIndexContent
        );

        console.log('Component categorization completed successfully!');
    } catch (error) {
        console.error('Error during component categorization:', error);
        throw error;
    }
}

function getCategoryForComponent(componentName) {
    for (const [category, components] of Object.entries(atomicCategories)) {
        if (components.includes(componentName)) {
            return category;
        }
    }
    return null;
}

// Execute categorization
categorizeComponents().catch(console.error);
