import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { fixFileWithESLint, updateTrackingFile, verifyImports } from './eslint-fixer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function main() {
    try {
        // Load tracking file
        const trackingPath = path.join(__dirname, 'fix-tracking.json');
        let tracking = JSON.parse(await fs.readFile(trackingPath, 'utf8'));

        async function fixFile(filePath) {
            try {
                console.log(`Processing ${filePath}...`);
                const content = await fs.readFile(filePath, 'utf8');
                
                // Fix with ESLint
                const { fixed, content: fixedContent, messages } = await fixFileWithESLint(filePath, content, {
                    // Additional rules specific to duplicate identifiers
                    rules: {
                        'no-duplicate-imports': 'error',
                        '@typescript-eslint/no-duplicate-imports': ['error'],
                        'import/no-duplicates': 'error'
                    }
                });
                
                if (fixed) {
                    await fs.writeFile(filePath, fixedContent);
                    
                    // Verify the fixes
                    const { hasIssues, issues } = await verifyImports(filePath);
                    
                    if (!hasIssues) {
                        tracking.fixes.duplicateIdentifiers.fixedFiles.push(filePath);
                        console.log(`✓ Fixed duplicate identifiers in ${filePath}`);
                    } else {
                        console.log(`! Partial fix in ${filePath}, remaining issues:`, issues);
                        tracking.fixes.duplicateIdentifiers.errors.push({
                            file: filePath,
                            issues
                        });
                    }
                } else {
                    console.log(`- No changes needed in ${filePath}`);
                }
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error.message);
                tracking.fixes.duplicateIdentifiers.errors.push({
                    file: filePath,
                    error: error.message
                });
            }
        }

        // Update tracking status
        tracking = await updateTrackingFile(tracking, {
            lastScan: new Date().toISOString(),
            fixes: {
                ...tracking.fixes,
                duplicateIdentifiers: {
                    ...tracking.fixes.duplicateIdentifiers,
                    status: 'in_progress'
                }
            }
        });

        // Process each file from the import issues report
        const issuesReport = JSON.parse(await fs.readFile(path.join(__dirname, 'import-issues-report.json'), 'utf8'));
        const filesToProcess = issuesReport.details.duplicateIdentifiers.map(issue => path.join(rootDir, issue.file));

        // Update remaining files
        tracking.fixes.duplicateIdentifiers.remainingFiles = filesToProcess;
        await updateTrackingFile(tracking, {});

        console.log(`Starting to fix duplicate identifiers in ${filesToProcess.length} files...`);

        // Process files sequentially
        for (const file of filesToProcess) {
            await fixFile(file);
            // Remove from remaining files after processing
            tracking.fixes.duplicateIdentifiers.remainingFiles = tracking.fixes.duplicateIdentifiers.remainingFiles
                .filter(f => f !== file);
            
            // Update tracking file after each file
            await updateTrackingFile(tracking, {});
        }

        // Update final status
        tracking = await updateTrackingFile(tracking, {
            fixes: {
                ...tracking.fixes,
                duplicateIdentifiers: {
                    ...tracking.fixes.duplicateIdentifiers,
                    status: 'completed'
                }
            }
        });

        console.log('\nSummary:');
        console.log(`Total files processed: ${filesToProcess.length}`);
        console.log(`Files fixed: ${tracking.fixes.duplicateIdentifiers.fixedFiles.length}`);
        console.log(`Files with errors: ${tracking.fixes.duplicateIdentifiers.errors.length}`);
    } catch (error) {
        console.error('Script failed:', error);
        process.exit(1);
    }
}

main();
