import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const createBackup = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups', `backup-${timestamp}`);
  
  // Create backup directory
  fs.mkdirSync(backupDir, { recursive: true });
  
  // Directories to backup
  const dirsToBackup = [
    'src/contexts',
    'src/components',
    'src/hooks',
    'src/services',
    'src/types',
  ];
  
  // Copy directories
  dirsToBackup.forEach(dir => {
    const sourcePath = path.join(__dirname, '..', dir);
    const destPath = path.join(backupDir, dir);
    
    if (fs.existsSync(sourcePath)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.cpSync(sourcePath, destPath, { recursive: true });
      console.log(`Backed up ${dir}`);
    }
  });
  
  // Create backup manifest
  const manifest = {
    timestamp,
    backupDate: new Date().toISOString(),
    directories: dirsToBackup,
    gitCommit: execSync('git rev-parse HEAD').toString().trim(),
  };
  
  fs.writeFileSync(
    path.join(backupDir, 'backup-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`Backup created at: ${backupDir}`);
  return backupDir;
};

if (require.main === module) {
  createBackup();
}

export { createBackup };
