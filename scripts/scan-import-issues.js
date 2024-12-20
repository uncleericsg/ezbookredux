import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Regular expressions to detect common import issues
const patterns = {
    duplicateReactImport: /^import\s+(?:{\s*([^}]+)\s*}|\s*([^;]+))\s+from\s+['"]react['"];?\s*$/gm,
    duplicateIdentifiers: /import\s*{([^}]+)}\s*from/g,
    multipleImportStatements: /import.*from\s+['"]([^'"]+)['"]/g
};

const issues = {
    duplicateReactImports: [],
    duplicateIdentifiers: [],
    multipleImportsFromSameModule: []
};

function scanFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(rootDir, filePath);
        
        // Check for duplicate React imports
        const reactImports = content.match(patterns.duplicateReactImport);
        if (reactImports && reactImports.length > 1) {
            issues.duplicateReactImports.push({
                file: relativePath,
                count: reactImports.length,
                imports: reactImports
            });
        }

        // Check for duplicate identifiers in imports
        const importedIdentifiers = new Set();
        let match;
        while ((match = patterns.duplicateIdentifiers.exec(content)) !== null) {
            const identifiers = match[1].split(',').map(id => id.trim());
            identifiers.forEach(id => {
                if (importedIdentifiers.has(id)) {
                    issues.duplicateIdentifiers.push({
                        file: relativePath,
                        identifier: id
                    });
                }
                importedIdentifiers.add(id);
            });
        }

        // Check for multiple imports from same module
        const moduleImports = new Map();
        while ((match = patterns.multipleImportStatements.exec(content)) !== null) {
            const module = match[1];
            if (!moduleImports.has(module)) {
                moduleImports.set(module, []);
            }
            moduleImports.get(module).push(match[0]);
        }

        moduleImports.forEach((imports, module) => {
            if (imports.length > 1) {
                issues.multipleImportsFromSameModule.push({
                    file: relativePath,
                    module,
                    count: imports.length,
                    imports
                });
            }
        });

    } catch (error) {
        console.error(`Error scanning ${filePath}:`, error.message);
    }
}

function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            scanDirectory(fullPath);
        } else if (
            entry.isFile() && 
            (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || 
             entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))
        ) {
            scanFile(fullPath);
        }
    }
}

console.log('Scanning for import issues...');
scanDirectory(rootDir);

// Generate report
const report = {
    timestamp: new Date().toISOString(),
    summary: {
        filesWithDuplicateReactImports: issues.duplicateReactImports.length,
        filesWithDuplicateIdentifiers: issues.duplicateIdentifiers.length,
        filesWithMultipleImports: issues.multipleImportsFromSameModule.length
    },
    details: issues
};

// Save report
const reportPath = path.join(__dirname, 'import-issues-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

// Print summary
console.log('\nImport Issues Summary:');
console.log('----------------------');
console.log(`Files with duplicate React imports: ${report.summary.filesWithDuplicateReactImports}`);
console.log(`Files with duplicate identifiers: ${report.summary.filesWithDuplicateIdentifiers}`);
console.log(`Files with multiple imports from same module: ${report.summary.filesWithMultipleImports}`);
console.log(`\nFull report saved to: ${reportPath}`);

// Print files that need immediate attention
if (issues.duplicateReactImports.length > 0) {
    console.log('\nFiles with duplicate React imports:');
    issues.duplicateReactImports.forEach(({file}) => console.log(`- ${file}`));
}

if (issues.duplicateIdentifiers.length > 0) {
    console.log('\nFiles with duplicate identifiers:');
    const uniqueFiles = new Set(issues.duplicateIdentifiers.map(i => i.file));
    uniqueFiles.forEach(file => console.log(`- ${file}`));
}
