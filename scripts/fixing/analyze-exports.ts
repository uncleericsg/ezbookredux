/**
 * @ai-protection
 * 
 * IMPORTANT: This file contains critical analysis functionality for the codebase.
 * Any modifications by AI must follow these strict rules:
 * 
 * 1. NO REMOVAL: Do not remove or delete any existing analysis features without explicit user consent
 * 2. NO FOLDER MODIFICATION: The FOLDERS_TO_ANALYZE constant must not be modified without user approval
 * 3. PRESERVATION: All existing checks must be preserved:
 *    - Component analysis (named exports, default exports, displayName, types)
 *    - Module analysis (imports, exports, duplicates)
 *    - Syntax validation
 *    - Path resolution
 * 4. ENHANCEMENT ONLY: New features should only enhance, not replace, existing analysis
 * 5. DOCUMENTATION: Any changes must be clearly documented and explained
 * 
 * Core Analysis Features (DO NOT REMOVE):
 * - Component Checks:
 *   - Named/Default export validation
 *   - DisplayName presence
 *   - Type exports validation
 *   - Duplicate detection
 * 
 * - Module Checks:
 *   - Import/Export correlation
 *   - Path resolution
 *   - Syntax validation
 *   - Duplicate detection
 * 
 * - Report Generation:
 *   - Detailed issue reporting
 *   - Location tracking
 *   - Error categorization
 * 
 * This script works in conjunction with test-fixes.ts to maintain codebase consistency.
 * 
 * @last-modified 2024-12-21
 * @requires-consent-for-removal
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// All critical folders to analyze
const FOLDERS_TO_ANALYZE = [
  'src/components/admin',
  'src/components/auth',
  'src/components/booking',
  'src/components/common',
  'src/components/ui',
  'src/hooks',
  'src/services'
];

interface ImportInfo {
  source: string;
  imports: Array<{
    name: string;
    importedBy: string;
  }>;
}

interface ExportInfo {
  namedExports: string[];
  hasDefaultExport: boolean;
  defaultExportName?: string;
  duplicateExports: Map<string, string[]>;
}

interface ModuleAnalysis {
  imports: ImportInfo[];
  exports: ExportInfo;
}

interface AnalysisResult {
  folder: string;
  issues: {
    components: {
      missingNamedExport: string[];
      missingDefaultExport: string[];
      missingDisplayName: string[];
      missingTypeExports: string[];
      duplicateExports: Array<{
        file: string;
        exportName: string;
        locations: string[];
      }>;
      syntaxErrors: Array<{
        file: string;
        line: number;
        column: number;
        message: string;
      }>;
    };
    modules: {
      missingExports: Array<{
        file: string;
        missingExport: string;
        importedBy: string;
      }>;
      duplicateExports: Array<{
        file: string;
        exportName: string;
        locations: string[];
      }>;
      syntaxErrors: Array<{
        file: string;
        line: number;
        column: number;
        message: string;
      }>;
    };
  };
}

interface FileExports {
  [key: string]: ExportInfo;
}

// Track exports across all files
const moduleExports = new Map<string, string[]>();

function isReactComponent(filePath: string): boolean {
  const fileName = path.basename(filePath, '.tsx');
  return (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) && 
         /^[A-Z][a-zA-Z0-9]*$/.test(fileName);
}

function isLocalModule(source: string): boolean {
  // Check if it's a relative import or starts with @/
  return source.startsWith('.') || source.startsWith('@/') || source.startsWith('src/');
}

function resolveModulePath(basePath: string, importPath: string): string {
  // Handle @/ imports by replacing with src/
  if (importPath.startsWith('@/')) {
    importPath = 'src/' + importPath.slice(2);
  }
  
  // Resolve relative paths
  const resolvedPath = path.resolve(path.dirname(basePath), importPath);
  
  // Try different extensions and index files
  const extensions = ['.ts', '.tsx'];
  const possiblePaths = [];

  // Try with extensions
  for (const ext of extensions) {
    possiblePaths.push(resolvedPath + ext);
  }

  // Try index files
  for (const ext of extensions) {
    possiblePaths.push(path.join(resolvedPath, `index${ext}`));
  }

  // Return the first path that exists
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }
  
  return resolvedPath;
}

function analyzeModuleImportsExports(filePath: string, importedBy: string): ModuleAnalysis {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );

  const imports: ImportInfo[] = [];
  const exports: ExportInfo = {
    namedExports: [],
    hasDefaultExport: false,
    defaultExportName: undefined,
    duplicateExports: new Map<string, string[]>()
  };

  function trackExport(name: string, location: string) {
    if (!exports.duplicateExports.has(name)) {
      exports.duplicateExports.set(name, []);
    }
    exports.duplicateExports.get(name)?.push(location);
    
    if (exports.duplicateExports.get(name)?.length === 1) {
      exports.namedExports.push(name);
    }
  }

  function visit(node: ts.Node) {
    // Track node position for better error reporting
    const nodePos = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    const location = `${nodePos.line + 1}:${nodePos.character + 1}`;

    // Analyze imports
    if (ts.isImportDeclaration(node)) {
      const sourceFile = node.moduleSpecifier.getText().replace(/['"]/g, '');
      const importedSymbols: Array<{ name: string; importedBy: string }> = [];

      if (node.importClause) {
        // Named imports
        if (node.importClause.namedBindings) {
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            node.importClause.namedBindings.elements.forEach(element => {
              // Handle import aliases
              const importName = element.propertyName?.text || element.name.text;
              importedSymbols.push({
                name: importName,
                importedBy: importedBy
              });
            });
          } else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            // Handle namespace imports
            importedSymbols.push({
              name: '*',
              importedBy: importedBy
            });
          }
        }
        // Default import
        if (node.importClause.name) {
          importedSymbols.push({
            name: 'default',
            importedBy: importedBy
          });
        }
      }

      // Only track local module imports
      if (isLocalModule(sourceFile)) {
        imports.push({
          source: sourceFile,
          imports: importedSymbols
        });
      }
    }

    // Analyze exports
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach(element => {
          const exportName = element.propertyName?.text || element.name.text;
          trackExport(exportName, location);
        });
      } else if (!node.exportClause && node.moduleSpecifier) {
        // Re-export all from another module
        const modulePath = resolveModulePath(filePath, node.moduleSpecifier.getText().replace(/['"]/g, ''));
        if (fs.existsSync(modulePath)) {
          const moduleAnalysis = analyzeModuleImportsExports(modulePath, filePath);
          moduleAnalysis.exports.namedExports.forEach(name => trackExport(name, location));
          if (moduleAnalysis.exports.hasDefaultExport) {
            exports.hasDefaultExport = true;
          }
        }
      }
    }

    // Variable declarations
    if (ts.isVariableStatement(node) && 
        node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(decl => {
        if (ts.isIdentifier(decl.name)) {
          trackExport(decl.name.text, location);
        }
      });
    }

    // Function declarations
    if (ts.isFunctionDeclaration(node) && 
        node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name) {
        trackExport(node.name.text, location);
      }
    }

    // Class declarations
    if (ts.isClassDeclaration(node) && 
        node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name) {
        trackExport(node.name.text, location);
      }
    }

    // Export assignment (default export)
    if (ts.isExportAssignment(node)) {
      exports.hasDefaultExport = true;
      if (ts.isIdentifier(node.expression)) {
        exports.defaultExportName = node.expression.text;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Process duplicate exports
  const duplicates = Array.from(exports.duplicateExports.entries())
    .filter(([_, locations]) => locations.length > 1)
    .map(([name, locations]) => ({
      exportName: name,
      locations
    }));

  return {
    imports,
    exports: {
      ...exports,
      duplicates
    }
  };
}

function checkSyntaxErrors(sourceFile: ts.SourceFile): Array<{
  line: number;
  column: number;
  message: string;
}> {
  const errors: Array<{
    line: number;
    column: number;
    message: string;
  }> = [];

  function visit(node: ts.Node) {
    // Check for interface declarations without curly braces
    if (ts.isInterfaceDeclaration(node)) {
      const text = node.getText();
      if (text.endsWith(';') || !text.includes('{')) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        errors.push({
          line: line + 1,
          column: character + 1,
          message: 'Expected "{" but found ";"'
        });
      }
    }

    // Check for missing closing braces in interface declarations
    if (ts.isInterfaceDeclaration(node)) {
      const text = node.getText();
      const openBraces = (text.match(/{/g) || []).length;
      const closeBraces = (text.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        errors.push({
          line: line + 1,
          column: character + 1,
          message: 'Missing closing brace in interface declaration'
        });
      }
    }

    // Check for export statements without proper syntax
    if (ts.isExportDeclaration(node)) {
      const text = node.getText();
      if (text.includes('export') && !text.includes('{') && !text.includes('*')) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        errors.push({
          line: line + 1,
          column: character + 1,
          message: 'Invalid export statement syntax'
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return errors;
}

function analyzeFile(filePath: string): { 
  hasNamedExport: boolean;
  hasDefaultExport: boolean; 
  hasDisplayName: boolean;
  hasTypeExports: boolean;
  componentName: string;
  moduleAnalysis: ModuleAnalysis;
  syntaxErrors: Array<{
    line: number;
    column: number;
    message: string;
  }>;
} {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );

  const syntaxErrors = checkSyntaxErrors(sourceFile);
  
  const componentName = path.basename(filePath, path.extname(filePath));
  let hasNamedExport = false;
  let hasDefaultExport = false;
  let hasDisplayName = false;
  let hasTypeExports = false;
  const exportedNames = new Set<string>();

  function visit(node: ts.Node) {
    // Check for export assignment (default export)
    if (ts.isExportAssignment(node)) {
      hasDefaultExport = true;
      if (ts.isIdentifier(node.expression)) {
        exportedNames.add(node.expression.text);
      }
    }
    
    // Check for named exports
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach(element => {
          const exportName = element.name.text;
          exportedNames.add(exportName);
          
          // Check for type exports
          if (exportName.endsWith('Props') || 
              exportName.endsWith('Type') ||
              exportName.endsWith('State')) {
            hasTypeExports = true;
          }
        });
      } else if (!node.exportClause && node.moduleSpecifier) {
        // Re-export all from another module
        const modulePath = resolveModulePath(filePath, node.moduleSpecifier.getText().replace(/['"]/g, ''));
        if (fs.existsSync(modulePath)) {
          const moduleAnalysis = analyzeModuleImportsExports(modulePath, filePath);
          moduleAnalysis.exports.namedExports.forEach(name => exportedNames.add(name));
          if (moduleAnalysis.exports.hasDefaultExport) {
            hasDefaultExport = true;
          }
        }
      }
    }

    // Check for exported variable declarations
    if (ts.isVariableStatement(node) && 
        node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(decl => {
        if (ts.isIdentifier(decl.name)) {
          exportedNames.add(decl.name.text);
        }
      });
    }

    // Check for exported function declarations
    if (ts.isFunctionDeclaration(node) && 
        node.name && 
        node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
      exportedNames.add(node.name.text);
    }

    // Check for displayName
    if (ts.isExpressionStatement(node)) {
      const expr = node.expression;
      if (ts.isBinaryExpression(expr) && 
          ts.isPropertyAccessExpression(expr.left) &&
          expr.left.name.text === 'displayName') {
        hasDisplayName = true;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Check if the component name is exported
  hasNamedExport = exportedNames.has(componentName);

  return {
    hasNamedExport,
    hasDefaultExport,
    hasDisplayName,
    hasTypeExports,
    componentName,
    moduleAnalysis: analyzeModuleImportsExports(filePath, filePath),
    syntaxErrors
  };
}

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const items = await fs.promises.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.promises.stat(fullPath);

    if (stat.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function analyzeFolder(folderPath: string): Promise<AnalysisResult> {
  const files = await getAllFiles(folderPath);
  const result: AnalysisResult = {
    folder: folderPath,
    issues: {
      components: {
        missingNamedExport: [],
        missingDefaultExport: [],
        missingDisplayName: [],
        missingTypeExports: [],
        duplicateExports: [],
        syntaxErrors: []
      },
      modules: {
        missingExports: [],
        duplicateExports: [],
        syntaxErrors: []
      }
    }
  };

  // First pass: collect all exports
  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const analysis = analyzeModuleImportsExports(file, file);
      moduleExports.set(file, analysis.exports.namedExports);
    }
  }

  // Second pass: check imports against exports
  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const analysis = analyzeModuleImportsExports(file, file);
      
      // Check each import against collected exports
      for (const importInfo of analysis.imports) {
        // Skip external dependencies
        if (!isLocalModule(importInfo.source)) {
          continue;
        }

        const importPath = resolveModulePath(file, importInfo.source);
        const availableExports = moduleExports.get(importPath) || [];
        
        for (const imported of importInfo.imports) {
          if (!availableExports.includes(imported.name) && imported.name !== 'default') {
            result.issues.modules.missingExports.push({
              file: importPath,
              missingExport: imported.name,
              importedBy: imported.importedBy
            });
          }
        }
      }
    }
  }

  // Analyze components
  for (const file of files) {
    if (isReactComponent(file)) {
      const analysis = analyzeFile(file);
      
      if (!analysis.hasNamedExport) {
        result.issues.components.missingNamedExport.push(file);
      }
      
      if (!analysis.hasDefaultExport) {
        result.issues.components.missingDefaultExport.push(file);
      }
      
      if (!analysis.hasDisplayName) {
        result.issues.components.missingDisplayName.push(file);
      }
      
      if (!analysis.hasTypeExports) {
        result.issues.components.missingTypeExports.push(file);
      }

      // Check for duplicate exports
      if (analysis.moduleAnalysis.exports.duplicates) {
        const duplicates = analysis.moduleAnalysis.exports.duplicates;
        const issueList = result.issues.components.duplicateExports;

        duplicates.forEach(duplicate => {
          issueList.push({
            file: path.relative(process.cwd(), file),
            ...duplicate
          });
        });
      }

      // Add syntax errors
      if (analysis.syntaxErrors.length > 0) {
        result.issues.components.syntaxErrors.push(...analysis.syntaxErrors.map(error => ({
          file: path.relative(process.cwd(), file),
          ...error
        })));
      }
    } else {
      // Check for duplicate exports in non-component files
      const analysis = analyzeModuleImportsExports(file, file);
      if (analysis.exports.duplicates) {
        const duplicates = analysis.exports.duplicates;
        const issueList = result.issues.modules.duplicateExports;

        duplicates.forEach(duplicate => {
          issueList.push({
            file: path.relative(process.cwd(), file),
            ...duplicate
          });
        });
      }

      // Add syntax errors
      const fileAnalysis = analyzeFile(file);
      if (fileAnalysis.syntaxErrors.length > 0) {
        result.issues.modules.syntaxErrors.push(...fileAnalysis.syntaxErrors.map(error => ({
          file: path.relative(process.cwd(), file),
          ...error
        })));
      }
    }
  }

  return result;
}

async function generateReport(results: AnalysisResult[]): Promise<void> {
  const reportPath = path.join(process.cwd(), 'module-export-fixes.md');
  let report = '# Module Export Analysis - Full Codebase\n\n';
  
  // Add explanation of what we're checking
  report += '## Analysis Criteria\n\n';
  report += '- **Named Exports**: Component must be exported using `export const ComponentName` or `export { ComponentName }`\n';
  report += '- **Default Exports**: Component must have a default export\n';
  report += '- **DisplayName**: Component must have a displayName property set\n';
  report += '- **Type Exports**: Related types (Props, State, etc.) should be exported\n\n';

  // Summary counts
  let totalMissingNamedExport = 0;
  let totalMissingDefaultExport = 0;
  let totalMissingDisplayName = 0;
  let totalMissingTypeExports = 0;
  let totalMissingModuleExports = 0;
  let totalDuplicateExports = 0;
  let totalSyntaxErrors = 0;

  // Generate per-folder analysis
  for (const result of results) {
    if (result.issues.components.missingNamedExport.length === 0 &&
        result.issues.components.missingDefaultExport.length === 0 &&
        result.issues.components.missingDisplayName.length === 0 &&
        result.issues.components.missingTypeExports.length === 0 &&
        result.issues.modules.missingExports.length === 0 &&
        result.issues.components.duplicateExports.length === 0 &&
        result.issues.modules.duplicateExports.length === 0 &&
        result.issues.components.syntaxErrors.length === 0 &&
        result.issues.modules.syntaxErrors.length === 0) {
      continue; // Skip folders with no issues
    }

    report += `## ${result.folder}\n\n`;

    if (result.issues.components.missingNamedExport.length > 0) {
      report += '### Components Missing Named Export\n';
      report += '_These components need to be exported using `export const ComponentName` or `export { ComponentName }`_\n\n';
      result.issues.components.missingNamedExport.forEach(file => {
        report += `- [ ] ${file}\n`;
      });
      report += '\n';
      totalMissingNamedExport += result.issues.components.missingNamedExport.length;
    }

    if (result.issues.components.missingDefaultExport.length > 0) {
      report += '### Components Missing Default Export\n';
      report += '_These components need to add `export default ComponentName`_\n\n';
      result.issues.components.missingDefaultExport.forEach(file => {
        report += `- [ ] ${file}\n`;
      });
      report += '\n';
      totalMissingDefaultExport += result.issues.components.missingDefaultExport.length;
    }

    if (result.issues.components.missingDisplayName.length > 0) {
      report += '### Components Missing DisplayName\n';
      report += '_These components need to set `ComponentName.displayName = "ComponentName"`_\n\n';
      result.issues.components.missingDisplayName.forEach(file => {
        report += `- [ ] ${file}\n`;
      });
      report += '\n';
      totalMissingDisplayName += result.issues.components.missingDisplayName.length;
    }

    if (result.issues.modules.missingExports.length > 0) {
      report += '### Missing Module Exports\n';
      report += '_These modules are missing exports that are being imported by other files_\n\n';
      result.issues.modules.missingExports.forEach(issue => {
        report += `- [ ] ${issue.file}: missing export "${issue.missingExport}" (imported by ${issue.importedBy})\n`;
      });
      report += '\n';
      totalMissingModuleExports += result.issues.modules.missingExports.length;
    }

    if (result.issues.components.duplicateExports.length > 0) {
      report += '### Duplicate Exports in Components\n';
      report += '_These components have duplicate exports that need to be removed_\n\n';
      result.issues.components.duplicateExports.forEach(issue => {
        report += `- [ ] ${issue.file}: duplicate export "${issue.exportName}" at ${issue.locations.join(', ')}\n`;
      });
      report += '\n';
      totalDuplicateExports += result.issues.components.duplicateExports.length;
    }

    if (result.issues.modules.duplicateExports.length > 0) {
      report += '### Duplicate Exports in Modules\n';
      report += '_These modules have duplicate exports that need to be removed_\n\n';
      result.issues.modules.duplicateExports.forEach(issue => {
        report += `- [ ] ${issue.file}: duplicate export "${issue.exportName}" at ${issue.locations.join(', ')}\n`;
      });
      report += '\n';
      totalDuplicateExports += result.issues.modules.duplicateExports.length;
    }

    if (result.issues.components.syntaxErrors.length > 0) {
      report += '### Syntax Errors in Components\n';
      report += '_These components have syntax errors that need to be fixed_\n\n';
      result.issues.components.syntaxErrors.forEach(error => {
        report += `- [ ] ${error.file}:${error.line}:${error.column}: ${error.message}\n`;
      });
      report += '\n';
      totalSyntaxErrors += result.issues.components.syntaxErrors.length;
    }

    if (result.issues.modules.syntaxErrors.length > 0) {
      report += '### Syntax Errors in Modules\n';
      report += '_These modules have syntax errors that need to be fixed_\n\n';
      result.issues.modules.syntaxErrors.forEach(error => {
        report += `- [ ] ${error.file}:${error.line}:${error.column}: ${error.message}\n`;
      });
      report += '\n';
      totalSyntaxErrors += result.issues.modules.syntaxErrors.length;
    }
  }

  // Add summary section with explanations
  report += '## Summary\n\n';
  report += `- Total Components Missing Named Export: ${totalMissingNamedExport}\n`;
  report += `- Total Components Missing Default Export: ${totalMissingDefaultExport}\n`;
  report += `- Total Components Missing DisplayName: ${totalMissingDisplayName}\n`;
  report += `- Total Components Missing Type Exports: ${totalMissingTypeExports}\n`;
  report += `- Total Missing Module Exports: ${totalMissingModuleExports}\n`;
  report += `- Total Duplicate Exports: ${totalDuplicateExports}\n`;
  report += `- Total Syntax Errors: ${totalSyntaxErrors}\n\n`;

  report += '## How to Fix\n\n';
  report += '1. **Named Exports**: Add `export const ComponentName = ...` or `export { ComponentName }`\n';
  report += '2. **Default Export**: Add `export default ComponentName`\n';
  report += '3. **DisplayName**: Add `ComponentName.displayName = "ComponentName"`\n';
  report += '4. **Type Exports**: Export related types/interfaces\n';
  report += '5. **Module Exports**: Ensure all imported symbols are properly exported\n';
  report += '6. **Duplicate Exports**: Remove duplicate exports from components and modules\n';
  report += '7. **Syntax Errors**: Fix missing curly braces and other syntax issues\n';

  await fs.promises.writeFile(reportPath, report);
  console.log(`Report generated at ${reportPath}`);
}

async function main() {
  // Analyze each folder
  const results = await Promise.all(
    FOLDERS_TO_ANALYZE.map(folder => analyzeFolder(folder))
  );

  await generateReport(results);
}

// Run the analysis
main().catch(console.error);
