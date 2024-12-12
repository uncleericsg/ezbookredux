const fs = require('fs/promises');
const path = require('path');
const { execSync } = require('child_process');

async function createBackup() {
    const projectRoot = path.resolve(__dirname, '../..');
    const corePackagePath = path.join(projectRoot, 'packages/core');
    const backupsDir = path.join(projectRoot, 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `core-backup-${timestamp}`;
    const backupPath = path.join(backupsDir, backupName);

    try {
        // Create backups directory if it doesn't exist
        await fs.mkdir(backupsDir, { recursive: true });

        // Create a backup using fs operations instead of git
        console.log('Creating backup...');
        await copyDirectory(corePackagePath, backupPath);
        
        // Create a manifest file with important information
        const manifest = {
            timestamp: new Date().toISOString(),
            backupName,
            packageVersion: require(path.join(corePackagePath, 'package.json')).version,
            files: await listFiles(corePackagePath)
        };

        await fs.writeFile(
            path.join(backupPath + '-manifest.json'),
            JSON.stringify(manifest, null, 2)
        );

        console.log(`Backup created successfully at: ${backupPath}`);
        console.log('Files created:');
        console.log(`- ${backupName} (Source code backup)`);
        console.log(`- ${backupName}-manifest.json (Backup information)`);

    } catch (error) {
        console.error('Error creating backup:', error);
        process.exit(1);
    }
}

async function copyDirectory(src, dest) {
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

async function listFiles(dir) {
    const files = [];
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
