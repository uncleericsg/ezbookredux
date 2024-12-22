import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Project, SyntaxKind, Node } from 'ts-morph';
import chalk from 'chalk';

interface FixTracking {
  lastScan: string;
  fixes: {
    reactImports: FixCategory;
    duplicateIdentifiers: FixCategory;
    multipleImports: FixCategory;
  };
  verification: {
    eslint: VerificationStatus;
    prettier: VerificationStatus;
  };
}

interface FixCategory {
  status: 'pending' | 'in-progress' | 'completed';
  totalFiles: number;
  fixedFiles: string[];
  remainingFiles: string[];
  errors: string[];
}

interface VerificationStatus {
  status: 'pending' | 'in-progress' | 'completed';
  lastRun: string;
  errors: string[];
}

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

function updateTrackingFile(tracking: FixTracking) {
  writeFileSync(
    join(__dirname, 'fix-tracking.json'),
    JSON.stringify(tracking, null, 2)
  );
}

function loadTrackingFile(): FixTracking {
  return JSON.parse(
    readFileSync(join(__dirname, 'fix-tracking.json'), 'utf-8')
  );
}

async function fixReactImports(sourceFile: any) {
  const reactImports = sourceFile
    .getImportDeclarations()
    .filter((imp: any) => imp.getModuleSpecifierValue() === 'react');

  if (reactImports.length <= 1) return false;

  // Collect all named imports
  const namedImports = new Set<string>();
  reactImports.forEach((imp: any) => {
    imp.getNamedImports().forEach((named: any) => {
      namedImports.add(named.getName());
    });
  });

  // Remove all React imports
  reactImports.forEach((imp: any) => imp.remove());

  // Add single React import with all named imports
  if (namedImports.size > 0) {
    sourceFile.addImportDeclaration({
      moduleSpecifier: 'react',
      namedImports: Array.from(namedImports).map(name => ({
        name,
      })),
    });
  }

  return true;
}

async function fixDuplicateIdentifiers(sourceFile: any) {
  let fixed = false;
  const identifiers = new Map<string, Node[]>();

  // Collect all identifiers
  sourceFile.forEachDescendant((node: Node) => {
    if (
      node.getKind() === SyntaxKind.Identifier &&
      node.getParent()?.getKind() === SyntaxKind.VariableDeclaration
    ) {
      const name = node.getText();
      const existing = identifiers.get(name) || [];
      identifiers.set(name, [...existing, node]);
    }
  });

  // Fix duplicates
  for (const [name, nodes] of identifiers) {
    if (nodes.length > 1) {
      // Keep first declaration, remove others
      nodes.slice(1).forEach(node => {
        node.getParent()?.remove();
      });
      fixed = true;
    }
  }

  return fixed;
}

async function fixMultipleImports(sourceFile: any) {
  const importsByModule = new Map<string, any[]>();
  let fixed = false;

  // Group imports by module
  sourceFile.getImportDeclarations().forEach((imp: any) => {
    const module = imp.getModuleSpecifierValue();
    const existing = importsByModule.get(module) || [];
    importsByModule.set(module, [...existing, imp]);
  });

  // Merge imports from same module
  for (const [module, imports] of importsByModule) {
    if (imports.length <= 1) continue;

    const namedImports = new Set<string>();
    imports.forEach((imp: any) => {
      imp.getNamedImports().forEach((named: any) => {
        namedImports.add(named.getName());
      });
    });

    // Remove all imports for this module
    imports.forEach((imp: any) => imp.remove());

    // Add single import with all named imports
    if (namedImports.size > 0) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: module,
        namedImports: Array.from(namedImports).map(name => ({
          name,
        })),
      });
      fixed = true;
    }
  }

  return fixed;
}

async function main() {
  const tracking = loadTrackingFile();
  const sourceFiles = project.getSourceFiles();
  let fixCount = 0;

  console.log(chalk.blue('Starting fixes...'));

  for (const sourceFile of sourceFiles) {
    const filePath = sourceFile.getFilePath();
    console.log(chalk.gray(`Processing ${filePath}`));

    try {
      // Fix React imports
      if (await fixReactImports(sourceFile)) {
        tracking.fixes.reactImports.fixedFiles.push(filePath);
        console.log(chalk.green('  ✓ Fixed React imports'));
        fixCount++;
      }

      // Fix duplicate identifiers
      if (await fixDuplicateIdentifiers(sourceFile)) {
        tracking.fixes.duplicateIdentifiers.fixedFiles.push(filePath);
        console.log(chalk.green('  ✓ Fixed duplicate identifiers'));
        fixCount++;
      }

      // Fix multiple imports
      if (await fixMultipleImports(sourceFile)) {
        tracking.fixes.multipleImports.fixedFiles.push(filePath);
        console.log(chalk.green('  ✓ Fixed multiple imports'));
        fixCount++;
      }

      // Save changes if any fixes were applied
      if (fixCount > 0) {
        await sourceFile.save();
      }
    } catch (error) {
      console.error(chalk.red(`Error processing ${filePath}:`), error);
      tracking.fixes.reactImports.errors.push(filePath);
    }
  }

  // Update tracking
  tracking.lastScan = new Date().toISOString();
  updateTrackingFile(tracking);

  console.log(chalk.blue('\nFix summary:'));
  console.log(chalk.green(`Total files fixed: ${fixCount}`));
  console.log(chalk.yellow(`Errors encountered: ${tracking.fixes.reactImports.errors.length}`));
}

main().catch(console.error);
