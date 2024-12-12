import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyDirectory(src: string, dest: string) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

async function createBackup() {
    const projectRoot = path.resolve(__dirname, '../..');
    const corePackagePath = path.join(projectRoot, 'packages/core');
    const backupsDir = path.join(projectRoot, 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `core-backup-${timestamp}`;
    const backupPath = path.join(backupsDir, backupName);

    try {
        console.log('Creating backup directory...');
        await fs.mkdir(backupsDir, { recursive: true });

        console.log('Copying files...');
        await copyDirectory(corePackagePath, backupPath);

        // Create a manifest file with backup information
        const manifest = {
            timestamp,
            backupName,
            originalPath: corePackagePath,
            backupPath,
            createdAt: new Date().toISOString()
        };

        await fs.writeFile(
            path.join(backupPath, 'backup-manifest.json'),
            JSON.stringify(manifest, null, 2)
        );

        console.log(`Backup completed successfully at: ${backupPath}`);
    } catch (error) {
        console.error('Error creating backup:', error);
        throw error;
    }
}

// Helper function to list files in a directory
async function listFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await listFiles(fullPath));
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

// Run the backup
createBackup().catch(console.error);
