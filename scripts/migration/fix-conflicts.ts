import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PackageJson {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    [key: string]: any;
}

async function readPackageJson(filePath: string): Promise<PackageJson> {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}

async function writePackageJson(filePath: string, content: PackageJson): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(content, null, 2) + '\n');
}

async function fixDependencyConflicts() {
    const projectRoot = path.resolve(__dirname, '../..');
    const corePackagePath = path.join(projectRoot, 'packages/core');
    
    try {
        // Update root package.json
        const rootPackageJsonPath = path.join(projectRoot, 'package.json');
        const rootPackageJson = await readPackageJson(rootPackageJsonPath);

        // Fix @tanstack/react-query version conflict
        rootPackageJson.dependencies = {
            ...rootPackageJson.dependencies,
            "@tanstack/react-query": "^5.62.0",
            "@trpc/client": "^11.0.0-next-beta.193",
            "@trpc/react-query": "^11.0.0-next-beta.193",
            "@trpc/server": "^11.0.0-next-beta.193"
        };

        // Remove deprecated packages
        delete rootPackageJson.dependencies['@tanstack/react-query-devtools'];

        // Update core package.json
        const corePackageJsonPath = path.join(corePackagePath, 'package.json');
        const corePackageJson = await readPackageJson(corePackageJsonPath);

        // Update core dependencies to use latest versions
        corePackageJson.dependencies = {
            "@emotion/react": "^11.11.3",
            "@emotion/styled": "^11.11.0",
            "@mui/material": "^5.15.11",
            "@radix-ui/react-dialog": "^1.0.5",
            "@radix-ui/react-label": "^2.0.2",
            "@radix-ui/react-scroll-area": "^1.0.5",
            "@radix-ui/react-toast": "^1.1.5"
        };

        // Update devDependencies to use latest versions
        corePackageJson.devDependencies = {
            ...corePackageJson.devDependencies,
            "eslint": "^8.57.0",
            "rimraf": "^5.0.5",
            "glob": "^10.3.10"
        };

        // Write updated package.json files
        await writePackageJson(rootPackageJsonPath, rootPackageJson);
        await writePackageJson(corePackageJsonPath, corePackageJson);

        console.log('Dependencies updated successfully!');
        console.log('Please run "npm install" in both root and core packages.');
    } catch (error) {
        console.error('Error fixing dependency conflicts:', error);
        throw error;
    }
}

// Run the fix
fixDependencyConflicts().catch(console.error);
