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

async function updateDependencies() {
    const projectRoot = path.resolve(__dirname, '../..');
    const corePackagePath = path.join(projectRoot, 'packages/core');
    
    try {
        // Update root package.json
        const rootPackageJsonPath = path.join(projectRoot, 'package.json');
        const rootPackageJson = await readPackageJson(rootPackageJsonPath);

        // Update core package.json
        const corePackageJsonPath = path.join(corePackagePath, 'package.json');
        const corePackageJson = await readPackageJson(corePackageJsonPath);

        // Update core dependencies
        corePackageJson.dependencies = {
            "@emotion/react": "^11.11.0",
            "@emotion/styled": "^11.11.0",
            "@mui/material": "^5.14.19",
            "@radix-ui/react-dialog": "^1.0.5",
            "@radix-ui/react-label": "^2.0.2",
            "@radix-ui/react-scroll-area": "^1.0.5",
            "@radix-ui/react-toast": "^1.1.5"
        };

        corePackageJson.peerDependencies = {
            "react": "^18.2.0",
            "react-dom": "^18.2.0"
        };

        corePackageJson.devDependencies = {
            "@testing-library/jest-dom": "^6.1.4",
            "@testing-library/react": "^14.1.2",
            "@testing-library/user-event": "^14.5.1",
            "@types/jest": "^29.5.10",
            "@types/node": "^20.10.0",
            "@types/react": "^18.2.39",
            "@types/react-dom": "^18.2.17",
            "@typescript-eslint/eslint-plugin": "^6.13.1",
            "@typescript-eslint/parser": "^6.13.1",
            "@vitejs/plugin-react": "^4.2.0",
            "eslint": "^8.54.0",
            "eslint-plugin-react-hooks": "^4.6.0",
            "jest": "^29.7.0",
            "jest-environment-jsdom": "^29.7.0",
            "rimraf": "^5.0.5",
            "ts-jest": "^29.1.1",
            "typescript": "^5.3.2",
            "vite": "^5.0.4",
            "vite-plugin-dts": "^3.6.3"
        };

        // Update root dependencies
        rootPackageJson.dependencies = {
            "@emotion/react": "^11.11.0",
            "@emotion/styled": "^11.11.0",
            "@googlemaps/js-api-loader": "^1.16.2",
            "@headlessui/react": "^1.7.17",
            "@hello-pangea/dnd": "^16.3.0",
            "@hookform/resolvers": "^3.3.2",
            "@iaircon/core": "^0.1.0",
            "@libsql/client": "^0.4.0",
            "@mui/icons-material": "^5.14.19",
            "@mui/material": "^5.14.19",
            "@radix-ui/react-dialog": "^1.0.5",
            "@radix-ui/react-label": "^2.0.2",
            "@radix-ui/react-scroll-area": "^1.0.5",
            "@radix-ui/react-toast": "^1.1.5",
            "@react-google-maps/api": "^2.19.2",
            "@tanstack/react-query": "^4.36.1",
            "@trpc/client": "^10.44.1",
            "@trpc/react-query": "^10.44.1",
            "@trpc/server": "^10.44.1",
            "class-variance-authority": "^0.7.0",
            "clsx": "^2.0.0",
            "date-fns": "^2.30.0",
            "drizzle-orm": "^0.29.1",
            "lucide-react": "^0.294.0",
            "next": "^14.0.3",
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-hook-form": "^7.48.2",
            "tailwind-merge": "^2.1.0",
            "tailwindcss-animate": "^1.0.7",
            "zod": "^3.22.4"
        };

        rootPackageJson.devDependencies = {
            "@testing-library/jest-dom": "^6.1.4",
            "@testing-library/react": "^14.1.2",
            "@testing-library/user-event": "^14.5.1",
            "@types/jest": "^29.5.10",
            "@types/node": "^20.10.0",
            "@types/react": "^18.2.39",
            "@types/react-dom": "^18.2.17",
            "@typescript-eslint/eslint-plugin": "^6.13.1",
            "@typescript-eslint/parser": "^6.13.1",
            "autoprefixer": "^10.4.16",
            "drizzle-kit": "^0.20.6",
            "eslint": "^8.54.0",
            "eslint-config-next": "^14.0.3",
            "eslint-config-prettier": "^9.0.0",
            "eslint-plugin-react-hooks": "^4.6.0",
            "jest": "^29.7.0",
            "jest-environment-jsdom": "^29.7.0",
            "postcss": "^8.4.31",
            "prettier": "^3.1.0",
            "prettier-plugin-tailwindcss": "^0.5.7",
            "rimraf": "^5.0.5",
            "tailwindcss": "^3.3.5",
            "tsx": "^4.6.1",
            "turbo": "^1.10.16",
            "typescript": "^5.3.2",
            "vite": "^5.0.4",
            "vite-plugin-dts": "^3.6.3"
        };

        // Write updated package.json files
        await writePackageJson(rootPackageJsonPath, rootPackageJson);
        await writePackageJson(corePackageJsonPath, corePackageJson);

        console.log('Dependencies updated successfully!');
    } catch (error) {
        console.error('Error updating dependencies:', error);
        throw error;
    }
}

// Run the update
updateDependencies().catch(console.error);
