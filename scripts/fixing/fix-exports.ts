import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ts from 'typescript';
import chalk from 'chalk';
import { diff } from 'jest-diff';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ComponentAnalysis {
  hasNamedExport: boolean;
  hasDefaultExport: boolean;
  hasDisplayName: boolean;
  hasTypeExports: boolean;
  hasPropsInterface: boolean;
  isPascalCase: boolean;
  componentName: string;
  sourceFile: ts.SourceFile;
  originalContent: string;
}

function analyzeComponent(filePath: string): ComponentAnalysis {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const componentName = path.basename(filePath, path.extname(filePath));
  let hasNamedExport = false;
  let hasDefaultExport = false;
  let hasDisplayName = false;
  let hasTypeExports = false;
  let hasPropsInterface = false;
  let isPascalCase = /^[A-Z][a-zA-Z]+$/.test(componentName);

  function visit(node: ts.Node) {
    if (ts.isExportAssignment(node)) {
      hasDefaultExport = true;
    }
    
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        node.exportClause.elements.forEach(element => {
          if (element.name.text === componentName) {
            hasNamedExport = true;
          }
          if (element.name.text.endsWith('Props') || 
              element.name.text.endsWith('Type') ||
              element.name.text.endsWith('State')) {
            hasTypeExports = true;
          }
        });
      }
    }

    // Check for Props interface
    if (ts.isInterfaceDeclaration(node)) {
      if (node.name.text === `${componentName}Props`) {
        hasPropsInterface = true;
      }
    }

    // Check for inline named exports like 'export const X'
    if (ts.isVariableStatement(node) && 
        node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(decl => {
        if (decl.name.getText() === componentName) {
          hasNamedExport = true;
        }
      });
    }

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

  return {
    hasNamedExport,
    hasDefaultExport,
    hasDisplayName,
    hasTypeExports,
    hasPropsInterface,
    isPascalCase,
    componentName,
    sourceFile,
    originalContent: content
  };
}

function generateFixedContent(analysis: ComponentAnalysis): { fixedContent: string; changes: string[] } {
  const changes: string[] = [];
  let lines = analysis.originalContent.split('\n');

  const componentName = analysis.componentName;

  // Remove default exports
  let fixedContent = analysis.originalContent.replace(/export default \w+;?/g, '');
  changes.push('- export default ...');

  // Get the component declaration
  const componentMatch = fixedContent.match(
    new RegExp(`(export\\s+)?const\\s+${componentName}\\s*[:=]\\s*(?:React\\.)?FC<.*?>\\s*=`)
  );

  if (!componentMatch) {
    console.warn(`Could not find component declaration for ${componentName}`);
    return { fixedContent, changes };
  }

  // Add displayName after the component definition
  const componentEndMatch = fixedContent.match(/};?\s*$/m);
  if (componentEndMatch) {
    const displayNameStatement = `\n\n${componentName}.displayName = '${componentName}';`;
    fixedContent = fixedContent.replace(
      /};?\s*$/m,
      `};\n${displayNameStatement}`
    );
    changes.push(`+ ${componentName}.displayName = '${componentName}';`);
  }

  // Find all type declarations at the top level
  const typeDeclarations = fixedContent.match(/export\s+(interface|type|enum)\s+\w+/g) || [];
  const typeNames = typeDeclarations.map(decl => decl.split(/\s+/).pop());

  // Create export statement
  const exportsArray = [componentName, ...typeNames].filter(Boolean);
  const exportStatement = `\nexport { ${exportsArray.join(', ')} };`;

  // Add export statement at the end
  fixedContent = fixedContent.replace(/export\s*{[^}]*};?\s*$/m, '');
  fixedContent += exportStatement;
  changes.push(`+ export { ${exportsArray.join(', ')} };`);

  return { fixedContent, changes };
}

async function confirmChange(
  filePath: string, 
  originalContent: string, 
  newContent: string,
  autoApply = false
): Promise<boolean> {
  console.log(chalk.blue(`\nProposed changes for ${path.basename(filePath)}:`));
  console.log(diff(originalContent, newContent, {
    expand: false,
    contextLines: 3,
    aAnnotation: 'Original',
    bAnnotation: 'Fixed'
  }));

  if (autoApply) {
    return true;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(chalk.yellow('\nApply these changes? (y/n): '), (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

async function fixComponent(filePath: string, autoApply: boolean = true): Promise<void> {
  console.log(chalk.blue(`\nAnalyzing ${path.basename(filePath)}...`));

  const analysis = analyzeComponent(filePath);
  
  if (analysis.hasNamedExport && 
      analysis.hasDisplayName && 
      analysis.hasPropsInterface && 
      analysis.isPascalCase &&
      !analysis.hasDefaultExport) {
    console.log(chalk.green('✓ Component exports are already correct'));
    return;
  }

  const { fixedContent, changes } = generateFixedContent(analysis);
  
  if (await confirmChange(filePath, analysis.originalContent, fixedContent, autoApply)) {
    // Create backup
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, analysis.originalContent);
    
    // Write changes
    fs.writeFileSync(filePath, fixedContent);
    console.log(chalk.green('✓ Changes applied successfully'));
    console.log(chalk.gray(`  Backup created at ${path.basename(backupPath)}`));
  } else {
    console.log(chalk.yellow('⚠ Changes skipped'));
  }
}

async function main() {
  // If called directly from command line
  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    if (process.argv.length < 3) {
      console.log('Usage: npm run fix-exports <file-path> [--yes]');
      console.error('Please provide a file path');
      process.exit(1);
    }

    const filePath = process.argv[2];
    const autoApply = process.argv.includes('--yes');
    await fixComponent(filePath, autoApply);
  }
}

// Export the fixComponent function
export { fixComponent };

// Only run main if this is the main module
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}
