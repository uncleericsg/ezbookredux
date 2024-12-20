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
                const { fixed, content: fixedContent, messages } = await fixFileWithESLint(filePath, content);
                
                if (fixed) {
                    await fs.writeFile(filePath, fixedContent);
                    
                    // Verify the fixes
                    const { hasIssues, issues } = await verifyImports(filePath);
                    
                    if (!hasIssues) {
                        tracking.fixes.reactImports.fixedFiles.push(filePath);
                        console.log(`✓ Fixed React imports in ${filePath}`);
                    } else {
                        console.log(`! Partial fix in ${filePath}, remaining issues:`, issues);
                        tracking.fixes.reactImports.errors.push({
                            file: filePath,
                            issues
                        });
                    }
                } else {
                    console.log(`- No changes needed in ${filePath}`);
                }
            } catch (error) {
                console.error(`Error processing ${filePath}:`, error.message);
                tracking.fixes.reactImports.errors.push({
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
                reactImports: {
                    ...tracking.fixes.reactImports,
                    status: 'in_progress'
                }
            }
        });

        // Process each file from the import issues report
        const issuesReport = JSON.parse(await fs.readFile(path.join(__dirname, 'import-issues-report.json'), 'utf8'));
        const filesToProcess = issuesReport.details.duplicateReactImports.map(issue => path.join(rootDir, issue.file));

        // Update remaining files
        tracking.fixes.reactImports.remainingFiles = filesToProcess;
        await updateTrackingFile(tracking, {});

        console.log(`Starting to fix React imports in ${filesToProcess.length} files...`);

        // Process files sequentially
        for (const file of filesToProcess) {
            await fixFile(file);
            // Remove from remaining files after processing
            tracking.fixes.reactImports.remainingFiles = tracking.fixes.reactImports.remainingFiles
                .filter(f => f !== file);
            
            // Update tracking file after each file
            await updateTrackingFile(tracking, {});
        }

        // Update final status
        tracking = await updateTrackingFile(tracking, {
            fixes: {
                ...tracking.fixes,
                reactImports: {
                    ...tracking.fixes.reactImports,
                    status: 'completed'
                }
            }
        });

        console.log('\nSummary:');
        console.log(`Total files processed: ${filesToProcess.length}`);
        console.log(`Files fixed: ${tracking.fixes.reactImports.fixedFiles.length}`);
        console.log(`Files with errors: ${tracking.fixes.reactImports.errors.length}`);
    } catch (error) {
        console.error('Script failed:', error);
        process.exit(1);
    }
}

main();
