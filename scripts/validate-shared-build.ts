import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as ts from 'typescript';

const requiredFiles = [
  'database.d.ts',
  'repository.d.ts',
  'service.d.ts',
  'booking.d.ts',
  'hooks.d.ts'
];

const sharedTypesDir = join(process.cwd(), 'dist', 'shared', 'types');

function validateDeclarationFile(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    
    // Check if the file is a valid declaration file
    if (!sourceFile.isDeclarationFile) {
      console.error(`Invalid declaration file: ${filePath}`);
      return false;
    }

    // Check for syntax errors
    const program = ts.createProgram([filePath], {
      noEmit: true,
      declaration: true,
      emitDeclarationOnly: true
    });
    
    const diagnostics = ts.getPreEmitDiagnostics(program);
    if (diagnostics.length > 0) {
      console.error(`Errors in declaration file ${filePath}:`);
      diagnostics.forEach(diagnostic => {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.error(`  - ${message}`);
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error validating ${filePath}:`, error);
    return false;
  }
}

function validateBuild() {
  console.log('Validating shared types build...');
  
  const missingOrInvalidFiles = requiredFiles.filter(file => {
    const filePath = join(sharedTypesDir, file);
    
    if (!existsSync(filePath)) {
      console.error(`Missing declaration file: ${file}`);
      return true;
    }

    if (!validateDeclarationFile(filePath)) {
      console.error(`Invalid declaration file: ${file}`);
      return true;
    }

    return false;
  });

  if (missingOrInvalidFiles.length > 0) {
    console.error('Build validation failed!');
    console.error('Missing or invalid files:', missingOrInvalidFiles);
    process.exit(1);
  }

  // Verify tsbuildinfo exists
  const tsBuildInfoPath = join(process.cwd(), 'dist', 'shared', '.tsbuildinfo');
  if (!existsSync(tsBuildInfoPath)) {
    console.error('Missing tsbuildinfo file!');
    process.exit(1);
  }

  console.log('Build validation successful!');
}

validateBuild();