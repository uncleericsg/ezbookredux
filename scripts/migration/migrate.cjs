const fs = require('fs/promises');
const path = require('path');

class MigrationExecutor {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.corePackagePath = path.join(projectRoot, 'packages/core');
        this.componentsDir = path.join(this.corePackagePath, 'src/components');
        this.newComponentsDir = path.join(this.corePackagePath, 'src/components-new');
    }

    async execute() {
        try {
            console.log('Starting migration execution...');

            // 1. Create new directory structure
            await this.createNewStructure();

            // 2. Load analysis results
            const analysisResults = await this.loadAnalysisResults();

            // 3. Transform components
            await this.transformComponents(analysisResults);

            // 4. Update imports
            await this.updateImports(analysisResults);

            // 5. Create new index files
            await this.createIndexFiles();

            console.log('Migration completed successfully!');
        } catch (error) {
            console.error('Error during migration:', error);
            throw error;
        }
    }

    async createNewStructure() {
        console.log('Creating new directory structure...');
        
        // Create main directories
        await fs.mkdir(this.newComponentsDir, { recursive: true });
        await fs.mkdir(path.join(this.newComponentsDir, 'atoms'), { recursive: true });
        await fs.mkdir(path.join(this.newComponentsDir, 'molecules'), { recursive: true });
        await fs.mkdir(path.join(this.newComponentsDir, 'organisms'), { recursive: true });
        
        console.log('New directory structure created.');
    }

    async loadAnalysisResults() {
        console.log('Loading analysis results...');
        
        const importAnalysis = JSON.parse(
            await fs.readFile(path.join(this.projectRoot, 'migration-report/import-analysis.json'), 'utf-8')
        );
        
        const dependencyAnalysis = JSON.parse(
            await fs.readFile(path.join(this.projectRoot, 'migration-report/dependency-analysis.json'), 'utf-8')
        );

        return { importAnalysis, dependencyAnalysis };
    }

    async transformComponents({ dependencyAnalysis }) {
        console.log('Transforming components...');
        
        const { components } = dependencyAnalysis;
        
        for (const [name, component] of Object.entries(components)) {
            const componentType = this.determineComponentType(component);
            const newPath = path.join(this.newComponentsDir, componentType, name);
            
            // Create component directory
            await fs.mkdir(newPath, { recursive: true });
            
            // Transform and write component files
            await this.transformComponentFiles(name, component, newPath);
        }
    }

    determineComponentType(component) {
        // Determine if component is atom, molecule, or organism based on dependencies
        const { imports, children } = component;
        
        if (imports.length <= 2 && children.length === 0) {
            return 'atoms';
        } else if (imports.length <= 5 && children.length <= 2) {
            return 'molecules';
        } else {
            return 'organisms';
        }
    }

    async transformComponentFiles(name, component, newPath) {
        const oldPath = path.join(this.componentsDir, name);
        
        try {
            // Read component files
            const files = await fs.readdir(oldPath);
            
            for (const file of files) {
                if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                    const content = await fs.readFile(path.join(oldPath, file), 'utf-8');
                    const transformedContent = this.transformComponentContent(content, component);
                    await fs.writeFile(path.join(newPath, file), transformedContent);
                }
            }
        } catch (error) {
            console.warn(`Warning: Could not transform component ${name}:`, error.message);
        }
    }

    transformComponentContent(content, component) {
        // Transform imports to use new paths
        let transformed = content.replace(
            /from ['"]\.\.\/([^'"]+)['"]/g,
            (match, p1) => `from '@components/${this.determineComponentType({ imports: [], children: [] })}/${p1}'`
        );

        // Add any necessary new imports
        transformed = `import { ComponentProps } from '@components/types';\n${transformed}`;

        return transformed;
    }

    async updateImports({ importAnalysis }) {
        console.log('Updating imports...');
        
        // Update all import statements in the new components
        const files = await this.getAllFiles(this.newComponentsDir);
        
        for (const file of files) {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                const content = await fs.readFile(file, 'utf-8');
                const updatedContent = this.updateImportPaths(content);
                await fs.writeFile(file, updatedContent);
            }
        }
    }

    async getAllFiles(dir) {
        const files = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...await this.getAllFiles(fullPath));
            } else {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    updateImportPaths(content) {
        // Update relative imports to use new path structure
        return content.replace(
            /from ['"]\.\.\/([^'"]+)['"]/g,
            (match, p1) => {
                if (p1.includes('/')) {
                    const [type, ...rest] = p1.split('/');
                    return `from '@components/${type}/${rest.join('/')}'`;
                }
                return match;
            }
        );
    }

    async createIndexFiles() {
        console.log('Creating index files...');
        
        const types = ['atoms', 'molecules', 'organisms'];
        
        for (const type of types) {
            const typeDir = path.join(this.newComponentsDir, type);
            const components = await fs.readdir(typeDir);
            
            let indexContent = components
                .filter(comp => !comp.startsWith('index.'))
                .map(comp => `export * from './${comp}';`)
                .join('\n');
            
            await fs.writeFile(path.join(typeDir, 'index.ts'), indexContent);
        }

        // Create main index file
        const mainIndexContent = types
            .map(type => `export * from './${type}';`)
            .join('\n');
        
        await fs.writeFile(path.join(this.newComponentsDir, 'index.ts'), mainIndexContent);
    }
}

// Execute migration
const projectRoot = path.resolve(__dirname, '../..');
const migrator = new MigrationExecutor(projectRoot);

migrator.execute().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});
