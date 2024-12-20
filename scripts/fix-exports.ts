import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

interface FixOptions {
  addNamedExport?: boolean;
  addDefaultExport?: boolean;
  addDisplayName?: boolean;
  addTypeExport?: boolean;
}

function fixFile(filePath: string, options: FixOptions): void {
  const sourceFile = ts.createSourceFile(
    filePath,
    fs.readFileSync(filePath, 'utf-8'),
    ts.ScriptTarget.Latest,
    true
  );

  let componentName = path.basename(filePath).replace(/\.tsx?$/, '');
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Add displayName if missing
  if (options.addDisplayName && !fileContent.includes(`${componentName}.displayName`)) {
    fileContent += `\n${componentName}.displayName = '${componentName}';\n`;
    modified = true;
  }

  // Add named export if missing
  if (options.addNamedExport && !fileContent.includes(`export { ${componentName} }`)) {
    fileContent += `\nexport { ${componentName} };\n`;
    modified = true;
  }

  // Add default export if missing
  if (options.addDefaultExport && !fileContent.includes(`export default ${componentName}`)) {
    fileContent += `\nexport default ${componentName};\n`;
    modified = true;
  }

  // Add type export if missing
  if (options.addTypeExport && !fileContent.includes(`export type { ${componentName}Props }`)) {
    // Insert at the top of the file
    fileContent = `export type { ${componentName}Props };\n${fileContent}`;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, fileContent);
    console.log(`Fixed issues in ${filePath}`);
  }
}

function fixDirectory(dirPath: string): void {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixDirectory(fullPath);
    } else if (
      stat.isFile() &&
      (file.endsWith('.tsx') || file.endsWith('.ts')) &&
      !file.endsWith('.test.tsx') &&
      !file.endsWith('.test.ts')
    ) {
      // Analyze file first
      const sourceFile = ts.createSourceFile(
        fullPath,
        fs.readFileSync(fullPath, 'utf-8'),
        ts.ScriptTarget.Latest,
        true
      );

      const options: FixOptions = {
        addDisplayName: !fs.readFileSync(fullPath, 'utf-8').includes('displayName'),
        addNamedExport: !fs.readFileSync(fullPath, 'utf-8').includes('export {'),
        addDefaultExport: !fs.readFileSync(fullPath, 'utf-8').includes('export default'),
        addTypeExport: !fs.readFileSync(fullPath, 'utf-8').includes('export type')
      };

      fixFile(fullPath, options);
    }
  }
}

// Main execution
const componentsDir = path.join(process.cwd(), 'src/components');
console.log('Starting export fixes...');
fixDirectory(componentsDir);
console.log('Finished fixing exports.');
