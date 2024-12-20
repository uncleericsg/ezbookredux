/**
 * @ai-protection
 * 
 * IMPORTANT: This file contains critical functionality for fixing and maintaining code conventions.
 * Any modifications by AI must follow these strict rules:
 * 
 * 1. NO REMOVAL: Do not remove or delete any existing features, functions, or code without explicit user consent
 * 2. NO OVERWRITE: Do not overwrite or replace existing functionality without user approval
 * 3. PRESERVATION: All existing fixes, validations, and component-specific handling must be preserved
 * 4. ENHANCEMENT ONLY: New features should only enhance, not replace, existing functionality
 * 5. DOCUMENTATION: Any changes must be clearly documented and explained
 * 
 * Core Features (DO NOT REMOVE):
 * - Interface formatting and brace fixing
 * - Export convention enforcement
 * - React imports management
 * - Type definitions handling
 * - Component exports fixing
 * - Admin component type fixes
 * - TypeScript validation
 * - Convention checking
 * 
 * @last-modified 2024-12-21
 * @requires-consent-for-removal
 */

import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import path from 'path';
import ts from 'typescript';
import readline from 'readline';
import { glob } from 'glob';

// Configuration for the fix process
const FIX_CONFIG = {
  dryRun: false, // Set to false to apply changes
  backup: true,  // Create backups before modifying
  batchSize: 3, // Process 3 files at a time
  phases: {
    displayName: true,     // Phase 1: Add displayName
    typeExports: true,     // Phase 2: Fix type exports
    namingConventions: true, // Phase 3: Fix naming conventions
    imports: true,         // Phase 4: Fix imports
    organization: true     // Phase 5: Fix file organization
  },
  excludeDirs: [
    'node_modules',
    'dist',
    'build',
    '.next'
  ],
  excludeFiles: [
    'store/index.ts',     // Skip store configuration files
    'test-fixes.ts'       // Skip self
  ],
  COMPONENTS: {
    DISPLAY_NAME_REQUIRED: true,
    TYPES_AT_TOP: true,
    CONST_DECLARATION: true
  }
} as const;

// Convention rules from .cascade-config.json
const CONVENTION_RULES = {
  exports: {
    style: 'named_only',
    components: {
      pattern: 'named_only',
      rules: {
        types: 'top',
        displayName: 'required',
        defaultExport: 'forbidden'
      }
    }
  },
  imports: {
    style: 'named_imports',
    prefer_named: true
  }
} as const;

// File type definitions for targeted fixes
const FILE_TYPES = {
  COMPONENT: 'component',
  STORE: 'store',
  UTIL: 'util',
  TEST: 'test',
  OTHER: 'other'
} as const;

type FileType = typeof FILE_TYPES[keyof typeof FILE_TYPES];

// Enhanced regex patterns
const PATTERNS = {
  COMPONENT: {
    DECLARATION: /^(?:export\s+)?const\s+(\w+)(?:\s*:\s*(?:React\.)?(?:FC|FunctionComponent)(?:<[^>]+>)?|\s*=\s*(?:\([^)]*\)\s*=>|\(\)\s*=>|function\s*\([^)]*\)))/m,
    DISPLAY_NAME: /(\w+)\.displayName\s*=\s*['"]([^'"]+)['"]/,
    TYPE_EXPORT: /^export\s+(type|interface)\s+(\w+Props)(?:\s*=\s*[^;]+|[^;]*{[^}]*})/gm,
    NAMED_EXPORT: /export\s+{\s*(\w+)\s*}/g,
    DEFAULT_EXPORT_TO_REMOVE: /export\s+default\s+\w+/g
  },
  IMPORTS: {
    RELATIVE_PATH: /from\s+['"]\.\.?\//g,
    ABSOLUTE_PATH: /from\s+['"]@\//g,
    UI_COMPONENTS: /from\s+['"]@mui\/material['"]/g,
    UTILS: /from\s+['"]\.\.\/.+\/utils['"]/g,
    TYPES: /from\s+['"]\.\.\/.+\/types['"]/g,
    HOOKS: /from\s+['"]\.\.\/.+\/hooks['"]/g,
    DEFAULT_IMPORT: /import\s+(\w+)\s+from/g,
    NAMED_IMPORT: /import\s*{\s*([^}]+)\s*}\s*from/g
  },
  EXPORTS: {
    NAMED_EXPORT: /^export\s+(?:const|let|var|function|class|interface|type)\s+(\w+)/gm,
    EXPORT_STATEMENT: /^export\s+{\s*([^}]+)\s*}/gm,
    EXPORT_TYPE: /^export\s+type\s+{\s*([^}]+)\s*}/gm,
    DUPLICATE_EXPORT: /export\s+(?:const|let|var)\s+(\w+)[\s\S]*?export\s+{\s*\1/m
  }
};

interface ConventionViolation {
  type: 'error' | 'warning';
  message: string;
  fix?: () => string;
  location?: {
    line: number;
    column: number;
  };
}

interface FixResult {
  filePath: string;
  fileType: FileType;
  fixes: string[];
  errors?: string[];
  skipped?: boolean;
  validationErrors?: ts.Diagnostic[];
  violations?: ConventionViolation[];
}

const DEFAULT_INTERFACE_BODIES = {
  RouteMetadata: {
    path: 'string',
    title: '?string',
    requiresAuth: '?boolean',
    roles: '?string[]'
  },
  Props: {
    children: '?React.ReactNode'
  }
};

class FileManager {
  async readFile(path: string): Promise<string> {
    return fsPromises.readFile(path, 'utf-8');
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!FIX_CONFIG.dryRun) {
      await fsPromises.writeFile(path, content, 'utf-8');
    }
  }

  async createBackup(path: string): Promise<string> {
    const backupPath = `${path}.backup`;
    if (FIX_CONFIG.backup && !FIX_CONFIG.dryRun) {
      await fsPromises.copyFile(path, backupPath);
    }
    return backupPath;
  }

  async restoreBackup(originalPath: string, backupPath: string): Promise<void> {
    if (FIX_CONFIG.backup && !FIX_CONFIG.dryRun) {
      await fsPromises.copyFile(backupPath, originalPath);
      await fsPromises.unlink(backupPath);
    }
  }
}

class ConventionChecker {
  checkFile(content: string, filePath: string): ConventionViolation[] {
    const violations: ConventionViolation[] = [];
    
    // Skip excluded files
    if (FIX_CONFIG.excludeFiles.some(pattern => 
      new RegExp(pattern.replace('*', '.*')).test(filePath)
    )) {
      return violations;
    }

    // Check remaining convention violations
    if (!this.isIndexFile(filePath)) {
      // Check for any remaining default exports
      const defaultExports = content.match(/export\s+default\s+\w+/g);
      if (defaultExports) {
        violations.push({
          type: 'error',
          message: 'Default exports still present after fixes',
          fix: () => content.replace(/export\s+default\s+\w+/g, '')
        });
      }

      // Check for any remaining relative imports
      const relativeImports = content.match(/from\s+['"]\.\.?\//g);
      if (relativeImports) {
        violations.push({
          type: 'warning',
          message: 'Relative imports still present after fixes',
          fix: () => this.fixImportPaths(content)
        });
      }

      // Check for any remaining type placement issues
      const firstType = content.search(/export\s+(type|interface)/);
      const firstNonImport = content.search(/^(?!import).+$/m);
      if (firstType > -1 && firstType > firstNonImport) {
        violations.push({
          type: 'error',
          message: 'Types should be at the top after imports',
          fix: () => this.moveTypesToTop(content)
        });
      }
    }

    return violations;
  }

  private isIndexFile(filePath: string): boolean {
    return filePath.endsWith('/index.ts') || filePath.endsWith('/index.tsx');
  }

  private fixImportPaths(content: string): string {
    return content
      .replace(/from\s+['"]\.\.\/.+\/utils['"]/g, 'from \'@/lib/utils\'')
      .replace(/from\s+['"]\.\.\/.+\/types['"]/g, 'from \'@/types\'')
      .replace(/from\s+['"]\.\.\/.+\/hooks['"]/g, 'from \'@/hooks\'')
      .replace(/from\s+['"]\.\.\/.+\/components\/ui['"]/g, 'from \'@/components/ui\'');
  }

  private moveTypesToTop(content: string): string {
    const types = Array.from(content.matchAll(/export\s+(type|interface)[^;]+;/g))
      .map(m => m[0]);
    
    if (types.length === 0) return content;

    let newContent = content;
    types.forEach(type => {
      newContent = newContent.replace(type, '');
    });

    const lastImport = newContent.lastIndexOf('import');
    const insertPos = lastImport === -1 ? 0 : 
      newContent.indexOf(';', lastImport) + 1;

    return newContent.slice(0, insertPos) + 
           '\n\n' + types.join('\n') + '\n' + 
           newContent.slice(insertPos);
  }
}

class CodeModifier {
  private conventionChecker: ConventionChecker;

  constructor(private fileManager: FileManager) {
    this.conventionChecker = new ConventionChecker();
  }

  // Convert default exports to named exports
  private convertDefaultToNamed(content: string): string {
    const defaultExportMatch = content.match(/export\s+default\s+(\w+)/);
    if (!defaultExportMatch) return content;

    const componentName = defaultExportMatch[1];
    return content
      .replace(/export\s+default\s+\w+/, `export { ${componentName} };`);
  }

  // Update imports to use named imports
  private updateImportsToNamed(content: string): string {
    return content.replace(
      /import\s+(\w+)\s+from\s+(['"].*['"])/g,
      'import { $1 } from $2'
    );
  }

  // Validate against .cascade-config.json rules
  private validateAgainstConfig(content: string): ConventionViolation[] {
    const violations: ConventionViolation[] = [];
    
    // Check for default exports (forbidden)
    if (content.match(PATTERNS.COMPONENT.DEFAULT_EXPORT_TO_REMOVE)) {
      violations.push({
        type: 'error',
        message: 'Default exports are forbidden as per .cascade-config.json',
        fix: () => this.convertDefaultToNamed(content)
      });
    }

    // Check for displayName
    const componentMatch = content.match(PATTERNS.COMPONENT.DECLARATION);
    if (componentMatch) {
      const componentName = componentMatch[1];
      if (!content.includes(`${componentName}.displayName`)) {
        violations.push({
          type: 'error',
          message: 'Component must have a displayName',
          fix: () => this.addDisplayName(content, componentName)
        });
      }
    }

    // Check types at top
    const firstType = content.search(/export\s+(type|interface)/);
    const firstNonImport = content.search(/^(?!import).+$/m);
    if (firstType > -1 && firstType > firstNonImport) {
      violations.push({
        type: 'error',
        message: 'Types must be at the top after imports',
        fix: () => this.moveTypesToTop(content)
      });
    }

    return violations;
  }

  // Fix component exports to follow convention
  private fixComponentExports(content: string): string {
    let newContent = content;

    // Convert default exports to named
    newContent = this.convertDefaultToNamed(newContent);

    // Update imports to named
    newContent = this.updateImportsToNamed(newContent);

    // Move types to top
    if (newContent.match(/export\s+(type|interface)/)) {
      newContent = this.moveTypesToTop(newContent);
    }

    return newContent;
  }

  private addDisplayName(content: string, componentName: string): string {
    const lastBrace = content.lastIndexOf('}');
    if (lastBrace === -1) return content;

    return content.slice(0, lastBrace) +
      `\n\n${componentName}.displayName = '${componentName}';\n` +
      content.slice(lastBrace);
  }

  private moveTypesToTop(content: string): string {
    const types = Array.from(content.matchAll(/export\s+(type|interface)[^;]+;/g))
      .map(m => m[0]);
    
    if (types.length === 0) return content;

    let newContent = content;
    types.forEach(type => {
      newContent = newContent.replace(type, '');
    });

    const lastImport = newContent.lastIndexOf('import');
    const insertPos = lastImport === -1 ? 0 : 
      newContent.indexOf(';', lastImport) + 1;

    return newContent.slice(0, insertPos) + 
           '\n\n' + types.join('\n') + '\n' + 
           newContent.slice(insertPos);
  }

  async modifyFile(filePath: string): Promise<FixResult> {
    try {
      const content = await this.fileManager.readFile(filePath);
      const violations = this.conventionChecker.checkFile(content, filePath);
      
      if (violations.length === 0) {
        return {
          filePath,
          fileType: this.getFileType(filePath),
          fixes: [],
          success: true,
          modified: false,
          message: 'No violations found'
        };
      }

      let modifiedContent = content;
      let modified = false;

      for (const violation of violations) {
        const fix = this.getFix(violation);
        if (fix) {
          modifiedContent = fix(modifiedContent);
          modified = true;
        }
      }

      if (modified && !FIX_CONFIG.dryRun) {
        await this.fileManager.writeFile(filePath, modifiedContent);
        return {
          filePath,
          fileType: this.getFileType(filePath),
          fixes: violations.map(v => v.message),
          success: true,
          modified: true,
          message: `Fixed ${violations.length} violations`
        };
      }

      return {
        filePath,
        fileType: this.getFileType(filePath),
        fixes: [],
        success: true,
        modified: false,
        message: FIX_CONFIG.dryRun ? 'Dry run - no changes made' : 'No fixes applied'
      };

    } catch (error) {
      return {
        filePath,
        fileType: this.getFileType(filePath),
        fixes: [],
        success: false,
        modified: false,
        message: `Error: ${error.message}`
      };
    }
  }

  private getFileType(filePath: string): FileType {
    if (filePath.includes('/components/')) return 'component';
    if (filePath.includes('/store/')) return 'store';
    if (filePath.includes('/utils/')) return 'util';
    if (filePath.endsWith('.test.ts') || filePath.endsWith('.spec.ts')) return 'test';
    return 'other';
  }

  private getFix(violation: ConventionViolation): ((content: string) => string) | undefined {
    switch (violation.message) {
      case 'Default exports are forbidden as per .cascade-config.json':
        return this.convertDefaultToNamed;
      case 'Component must have a displayName':
        return (content: string) => this.addDisplayName(content, 'Component');
      case 'Types must be at the top after imports':
        return this.moveTypesToTop;
      default:
        return undefined;
    }
  }

  private async validateTypeScript(content: string, filePath: string): Promise<ts.Diagnostic[]> {
    const compilerOptions = await this.loadTsConfig(path.dirname(filePath));
    const host = this.createCustomHost(path.dirname(filePath), content, filePath);
    const program = ts.createProgram([filePath], compilerOptions, host);
    
    const diagnostics = [
      ...program.getSyntacticDiagnostics(),
      ...program.getSemanticDiagnostics(),
      ...program.getDeclarationDiagnostics()
    ];

    return diagnostics.filter(diagnostic => {
      // Filter out known false positives
      const text = diagnostic.messageText.toString().toLowerCase();
      return !(
        text.includes('cannot find module') ||
        text.includes('cannot find name \'react\'') ||
        text.includes('jsx element implicitly has type \'any\'')
      );
    });
  }

  private loadTsConfig(projectRoot: string): Promise<ts.CompilerOptions> {
    return Promise.resolve({
      jsx: ts.JsxEmit.React,
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      baseUrl: projectRoot,
      paths: {
        '@/*': ['./src/*']
      }
    });
  }

  private createCustomHost(projectRoot: string, content: string, fileName: string): ts.CompilerHost {
    const compilerOptions = {
      jsx: ts.JsxEmit.React,
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      baseUrl: projectRoot,
      paths: {
        '@/*': ['./src/*']
      }
    };

    return {
      getSourceFile: (name: string) => {
        if (name === fileName) {
          return ts.createSourceFile(
            fileName,
            content,
            ts.ScriptTarget.ESNext,
            true,
            ts.ScriptKind.TSX
          );
        }
        const defaultLibFileName = ts.getDefaultLibFileName(compilerOptions);
        if (name === defaultLibFileName) {
          const defaultLibContent = ts.sys.readFile(defaultLibFileName) || '';
          return ts.createSourceFile(
            name,
            defaultLibContent,
            ts.ScriptTarget.ESNext
          );
        }
        return undefined;
      },
      writeFile: () => {},
      getDefaultLibFileName: () => ts.getDefaultLibFileName(compilerOptions),
      useCaseSensitiveFileNames: () => true,
      getCanonicalFileName: fileName => fileName,
      getCurrentDirectory: () => projectRoot,
      getNewLine: () => '\n',
      getDirectories: () => [],
      fileExists: (fileName) => {
        if (fileName === ts.getDefaultLibFileName(compilerOptions)) {
          return true;
        }
        return false;
      },
      readFile: (fileName) => {
        if (fileName === ts.getDefaultLibFileName(compilerOptions)) {
          return ts.sys.readFile(fileName) || '';
        }
        return undefined;
      }
    };
  }
}

const MISSING_HTML_TYPES = {
  button: ['HTMLButtonElement'],
  table: [
    'HTMLTableElement',
    'HTMLTableSectionElement',
    'HTMLTableRowElement',
    'HTMLTableHeaderCellElement',
    'HTMLTableDataCellElement',
    'HTMLTableCaptionElement'
  ]
};

class FixRunner {
  private results: FixResult[] = [];
  private codeModifier: CodeModifier;

  constructor(
    private config: typeof FIX_CONFIG,
    private fileManager: FileManager
  ) {
    this.codeModifier = new CodeModifier(fileManager);
  }

  async run(specificFiles?: string[]): Promise<void> {
    try {
      const files = specificFiles || await this.getFiles();
      console.log('Target files:', files);
      console.log('Running fixes...\n');

      for (const file of files) {
        const result = await this.codeModifier.modifyFile(file);
        this.results.push(result);
        this.printResult(result);
      }

      this.printSummary();
    } catch (error) {
      console.error('Error running fixes:', error);
    }
  }

  private async getFiles(): Promise<string[]> {
    const patterns = ['src/**/*.tsx', 'src/**/*.ts'];
    const files = await glob(patterns, {
      ignore: [...FIX_CONFIG.excludeDirs, ...FIX_CONFIG.excludeFiles]
    });
    return files;
  }

  private printResult(result: FixResult): void {
    if (!FIX_CONFIG.verbose) return;

    console.log(`\nFile: ${result.filePath}`);
    console.log(`Type: ${result.fileType}`);
    
    if (result.skipped) {
      console.log('Status: Skipped');
      return;
    }

    if (result.fixes.length > 0) {
      console.log('Fixes applied:');
      result.fixes.forEach(fix => console.log(`- ${fix}`));
    }

    if (result.errors?.length) {
      console.log('Errors:');
      result.errors.forEach(error => console.log(`- ${error}`));
    }

    if (result.validationErrors?.length) {
      console.log('Validation Errors:');
      result.validationErrors.forEach(diag => {
        console.log(`- ${ts.flattenDiagnosticMessageText(diag.messageText, '\n')}`);
      });
    }
  }

  private printSummary(): void {
    const total = this.results.length;
    const successful = this.results.filter(r => !r.errors?.length && !r.skipped).length;
    const skipped = this.results.filter(r => r.skipped).length;
    const failed = this.results.filter(r => r.errors?.length).length;

    console.log('\nSummary:');
    console.log(`Total files processed: ${total}`);
    console.log(`Successfully modified: ${successful}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Failed: ${failed}`);
  }
}

// Add test functions
async function runTests() {
  const testFiles = {
    defaultExport: `
      const Component = () => {};
      export default Component;
    `,
    missingDisplayName: `
      export const Component = () => {};
    `,
    typesNotAtTop: `
      export const Component = () => {};
      export interface Props {};
    `,
    defaultImport: `
      import Component from './Component';
    `
  };

  const fileManager = new FileManager();
  const modifier = new CodeModifier(fileManager);

  // Test default to named conversion
  const namedExport = modifier.convertDefaultToNamed(testFiles.defaultExport);
  console.assert(!namedExport.includes('export default'), 'Should remove default export');
  console.assert(namedExport.includes('export { Component }'), 'Should add named export');

  // Test displayName addition
  const withDisplayName = modifier.addDisplayName(testFiles.missingDisplayName, 'Component');
  console.assert(withDisplayName.includes('Component.displayName'), 'Should add displayName');

  // Test types to top
  const typesAtTop = modifier.moveTypesToTop(testFiles.typesNotAtTop);
  console.assert(typesAtTop.indexOf('interface') < typesAtTop.indexOf('Component'), 'Types should be at top');

  // Test import conversion
  const namedImport = modifier.updateImportsToNamed(testFiles.defaultImport);
  console.assert(namedImport.includes('import { Component }'), 'Should convert to named import');

  console.log('All tests completed');
}

// Add test execution to main
async function main() {
  const args = process.argv.slice(2);
  const specificFiles = args.length > 0 ? args : undefined;
  
  const fileManager = new FileManager();
  const fixRunner = new FixRunner(fileManager);
  await fixRunner.run(specificFiles);
}

main().catch(console.error);
