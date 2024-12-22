import { ESLint } from 'eslint';
import prettier from 'prettier';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function formatWithPrettier(content, filePath) {
    try {
        // Load Prettier config from the project
        const prettierConfig = await prettier.resolveConfig(filePath);
        
        // Format the content
        return prettier.format(content, {
            ...prettierConfig,
            filepath: filePath // This ensures Prettier uses the correct parser based on file extension
        });
    } catch (error) {
        console.warn('Prettier formatting failed:', error.message);
        return content; // Return original content if Prettier fails
    }
}

export async function createESLintInstance() {
    return new ESLint({
        fix: true,
        useEslintrc: true, // Use project's ESLint config
        overrideConfig: {
            env: {
                browser: true,
                es2021: true,
                node: true
            },
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:react/recommended',
                'plugin:react-hooks/recommended',
                'plugin:prettier/recommended' // Integrate Prettier with ESLint
            ],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint', 'react', 'prettier'],
            rules: {
                // Import rules
                'no-duplicate-imports': 'error',
                '@typescript-eslint/no-duplicate-imports': ['error'],
                'import/no-duplicates': 'error',
                'import/order': ['error', {
                    'groups': [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index'
                    ],
                    'newlines-between': 'always',
                    'alphabetize': {
                        'order': 'asc',
                        'caseInsensitive': true
                    }
                }],
                // React rules
                'react/jsx-uses-react': 'error',
                'react/jsx-uses-vars': 'error',
                'react/react-in-jsx-scope': 'error',
                // TypeScript rules
                '@typescript-eslint/consistent-type-imports': ['error', {
                    'prefer': 'type-imports'
                }],
                // Prettier rules
                'prettier/prettier': ['error', {
                    // These will be overridden by .prettierrc if it exists
                    singleQuote: true,
                    trailingComma: 'es5',
                    tabWidth: 2,
                    semi: true,
                    printWidth: 100
                }]
            }
        }
    });
}

export async function fixFileWithESLint(filePath, content, options = {}) {
    const eslint = await createESLintInstance();
    
    try {
        // First run ESLint fixes
        const results = await eslint.lintText(content, {
            filePath,
            ...options
        });

        let fixedContent = results[0].output || content;

        // Then format with Prettier
        fixedContent = await formatWithPrettier(fixedContent, filePath);

        return {
            fixed: fixedContent !== content,
            content: fixedContent,
            messages: results[0].messages
        };
    } catch (error) {
        console.error(`ESLint/Prettier error for ${filePath}:`, error);
        throw error;
    }
}

export async function verifyImports(filePath) {
    const eslint = await createESLintInstance();
    
    try {
        const results = await eslint.lintFiles([filePath]);
        const importIssues = results[0].messages.filter(msg => 
            msg.ruleId && (
                msg.ruleId.includes('import') || 
                msg.ruleId.includes('react') ||
                msg.ruleId.includes('@typescript-eslint') ||
                msg.ruleId.includes('prettier')
            )
        );
        
        return {
            hasIssues: importIssues.length > 0,
            issues: importIssues
        };
    } catch (error) {
        console.error(`Verification error for ${filePath}:`, error);
        throw error;
    }
}

export async function verifyAllFiles(files) {
    const eslint = await createESLintInstance();
    const results = await eslint.lintFiles(files);
    
    const issues = results.map(result => ({
        filePath: result.filePath,
        errorCount: result.errorCount,
        warningCount: result.warningCount,
        messages: result.messages
    }));
    
    return {
        totalErrors: results.reduce((sum, result) => sum + result.errorCount, 0),
        totalWarnings: results.reduce((sum, result) => sum + result.warningCount, 0),
        issues
    };
}

export async function updateTrackingFile(tracking, updates) {
    const trackingPath = path.join(__dirname, 'fix-tracking.json');
    const updatedTracking = { ...tracking, ...updates };
    await fs.writeFile(trackingPath, JSON.stringify(updatedTracking, null, 2));
    return updatedTracking;
}
