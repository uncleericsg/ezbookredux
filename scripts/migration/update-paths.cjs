const fs = require('fs/promises');
const path = require('path');

class PathUpdater {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.corePackagePath = path.join(projectRoot, 'packages/core');
        this.oldComponentsDir = path.join(this.corePackagePath, 'src/components');
        this.newComponentsDir = path.join(this.corePackagePath, 'src/components-new');
        this.componentMap = new Map(); // Maps old paths to new paths
    }

    async execute() {
        try {
            console.log('Starting path updates...');

            // 1. Build component mapping
            await this.buildComponentMap();

            // 2. Update package.json to add path alias
            await this.updatePackageConfig();

            // 3. Update tsconfig.json paths
            await this.updateTsConfig();

            // 4. Update all import statements
            await this.updateImports();

            // 5. Create temporary re-export file for backward compatibility
            await this.createReExports();

            console.log('Path updates completed successfully!');
        } catch (error) {
            console.error('Error during path updates:', error);
            throw error;
        }
    }

    async buildComponentMap() {
        console.log('Building component mapping...');
        
        const newComponents = await this.scanComponents(this.newComponentsDir);
        
        for (const [name, type] of newComponents) {
            const oldPath = `@components/${name}`;
            const newPath = `@components/${type}/${name}`;
            this.componentMap.set(oldPath, newPath);
        }
    }

    async scanComponents(dir, type = '') {
        const components = new Map();
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
                if (['atoms', 'molecules', 'organisms'].includes(entry.name)) {
                    const subComponents = await this.scanComponents(fullPath, entry.name);
                    components.set(...subComponents);
                } else if (type) {
                    components.set(entry.name, type);
                }
            }
        }
        
        return components;
    }

    async updatePackageConfig() {
        console.log('Updating package configuration...');
        
        const packageJsonPath = path.join(this.corePackagePath, 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        
        // Add or update paths alias in package.json if needed
        if (!packageJson.imports) {
            packageJson.imports = {};
        }
        
        packageJson.imports['@components/*'] = './src/components-new/*';
        
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    async updateTsConfig() {
        console.log('Updating TypeScript configuration...');
        
        const tsconfigPath = path.join(this.corePackagePath, 'tsconfig.json');
        const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'));
        
        // Add or update paths in tsconfig.json
        if (!tsconfig.compilerOptions.paths) {
            tsconfig.compilerOptions.paths = {};
        }
        
        tsconfig.compilerOptions.paths['@components/*'] = ['./src/components-new/*'];
        
        await fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }

    async updateImports() {
        console.log('Updating import statements...');
        
        // Get all TypeScript files in the project
        const files = await this.getAllTypeScriptFiles(this.corePackagePath);
        
        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            let updatedContent = content;
            
            // Update import statements using the component map
            for (const [oldPath, newPath] of this.componentMap) {
                const importRegex = new RegExp(`from ['"]${oldPath}['"]`, 'g');
                updatedContent = updatedContent.replace(importRegex, `from '${newPath}'`);
            }
            
            if (content !== updatedContent) {
                await fs.writeFile(file, updatedContent);
                console.log(`Updated imports in: ${path.relative(this.projectRoot, file)}`);
            }
        }
    }

    async getAllTypeScriptFiles(dir) {
        const files = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory() && !entry.name.includes('node_modules')) {
                files.push(...await this.getAllTypeScriptFiles(fullPath));
            } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    async createReExports() {
        console.log('Creating re-export file for backward compatibility...');
        
        // Create a temporary file that re-exports everything from the new locations
        const reExportContent = Array.from(this.componentMap.entries())
            .map(([oldPath, newPath]) => `export * from '${newPath}';`)
            .join('\n');
        
        const reExportPath = path.join(this.oldComponentsDir, 'index.ts');
        await fs.writeFile(reExportPath, reExportContent);
        
        console.log('Created backward compatibility re-exports');
    }
}

// Execute path updates
const projectRoot = path.resolve(__dirname, '../..');
const updater = new PathUpdater(projectRoot);

updater.execute().catch(error => {
    console.error('Path updates failed:', error);
    process.exit(1);
});
