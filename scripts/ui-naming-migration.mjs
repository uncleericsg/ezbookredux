import { renameSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UI_DIR = join(process.cwd(), 'src/components/ui');

// Files to rename with their new names
const FILES_TO_RENAME = [
  { old: 'AddressAutocomplete.tsx', new: 'address-autocomplete.tsx' },
  { old: 'AddressConfirmationModal.tsx', new: 'address-confirmation-modal.tsx' },
  { old: 'Dialog.tsx', new: 'dialog.tsx' },
  { old: 'FormProgress.tsx', new: 'form-progress.tsx' },
  { old: 'Slider.tsx', new: 'slider.tsx' },
  { old: 'Switch.tsx', new: 'switch.tsx' },
  { old: 'Tooltip.tsx', new: 'tooltip.tsx' },
].map(file => ({
  ...file,
  old: join(UI_DIR, file.old),
  new: join(UI_DIR, file.new)
}));

// Files that need import updates
const filesToUpdate = [
  // Admin components
  'src/components/admin/CypressSettings.tsx',
  'src/components/admin/DashboardSettings.tsx',
  
  // Notification components
  'src/components/notifications/HolidayGreetingModal.tsx',
  'src/components/notifications/HolidayItem.tsx',
  'src/components/notifications/ScheduledMessagesList.tsx',
  
  // Booking components
  'src/components/booking/CustomerForm/components/AddressSection.tsx',
  
  // Type definitions
  'src/components/ui/types.d.ts'
];

// Rename files
function renameFiles() {
  let successCount = 0;
  const totalFiles = FILES_TO_RENAME.length;

  for (const { old, new: newName } of FILES_TO_RENAME) {
    try {
      renameSync(old, newName);
      successCount++;
      console.log(`✅ Renamed ${old.split('/').pop()} → ${newName.split('/').pop()}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error renaming ${old.split('/').pop()}:`, error.message);
      } else if (typeof error === 'string') {
        console.error(`❌ Error renaming ${old.split('/').pop()}:`, error);
      } else {
        console.error(`❌ Error renaming ${old.split('/').pop()}:`, 'Unknown error occurred');
      }
    }
  }

  console.log(`\nRenaming complete: ${successCount}/${totalFiles} files renamed successfully`);
  if (successCount < totalFiles) {
    console.warn('⚠️ Some files failed to rename. Check the logs above for details.');
  }
}

// Update imports in files
function updateImports() {
  for (const filePath of filesToUpdate) {
    try {
      const fullPath = join(process.cwd(), filePath);
      let content = readFileSync(fullPath, 'utf8');

      // Update imports to use lowercase
      for (const { old, new: newName } of FILES_TO_RENAME) {
        const componentName = old.split('/').pop()?.replace('.tsx', '') || '';
        const regex = new RegExp(`(@components/ui/|['"])${componentName}(['"])`, 'g');
        content = content.replace(regex, `$1${newName.split('/').pop()?.replace('.tsx', '')}$2`);
      }

      writeFileSync(fullPath, content);
      console.log(`✅ Updated imports in ${filePath}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
      } else if (typeof error === 'string') {
        console.error(`❌ Error updating ${filePath}:`, error);
      } else {
        console.error(`❌ Error updating ${filePath}:`, 'Unknown error occurred');
      }
    }
  }
}

// Run migration
function runMigration() {
  console.log('Starting UI component naming migration...\n');
  
  renameFiles();
  updateImports();
  
  console.log('\nMigration completed!');
  console.log('Please run tests to verify the changes.');
}

runMigration();