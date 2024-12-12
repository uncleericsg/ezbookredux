import * as ts from 'typescript';
import * as fs from 'fs/promises';
import path from 'path';

interface ImportInfo {
  filePath: string;
  imports: {
    source: string;
    specifiers: string[];
  }[];
}

interface VerificationResult {
  invalidImports: {
    filePath: string;
    importPath: string;
    reason: string;
  }[];
  circularDependencies: {
    cycle: string[];
  }[];
  unusedImports: {
    filePath: string;
    importSpecifier: string;
  }[];
}

export class ImportVerifier {
  private projectRoot: string;
  private sourceFiles: Map<string, ImportInfo> = new Map();
  private result: VerificationResult = {
    invalidImports: [],
    circularDependencies: [],
    unusedImports: []
  };

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  public async verify(): Promise<VerificationResult> {
    await this.scanFiles(this.projectRoot);
    this.detectCircularDependencies();
    this.validateImportPaths();
    return this.result;
  }

  private async scanFiles(dir: string): Promise<void> {
    const files = await fs.readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        await this.scanFiles(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        await this.analyzeFile(filePath);
      }
    }
  }

  private async analyzeFile(filePath: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const imports: ImportInfo['imports'] = [];

    sourceFile.statements.forEach(statement => {
      if (ts.isImportDeclaration(statement)) {
        const importPath = (statement.moduleSpecifier as ts.StringLiteral).text;
        const specifiers: string[] = [];

        if (statement.importClause) {
          if (statement.importClause.name) {
            specifiers.push(statement.importClause.name.text);
          }
          
          const namedBindings = statement.importClause.namedBindings;
          if (namedBindings) {
            if (ts.isNamedImports(namedBindings)) {
              namedBindings.elements.forEach(element => {
                specifiers.push(element.name.text);
              });
            }
          }
        }

        imports.push({ source: importPath, specifiers });
      }
    });

    this.sourceFiles.set(filePath, { filePath, imports });
  }

  private validateImportPaths(): void {
    this.sourceFiles.forEach(({ filePath, imports }) => {
      imports.forEach(({ source }) => {
        // Check for relative imports that should be absolute
        if (source.startsWith('../') && !source.startsWith('../node_modules')) {
          this.result.invalidImports.push({
            filePath,
            importPath: source,
            reason: 'Relative import should be converted to absolute import'
          });
        }

        // Check for direct node_modules imports that should go through aliases
        if (!source.startsWith('@') && !source.startsWith('.') && !source.startsWith('/')) {
          this.result.invalidImports.push({
            filePath,
            importPath: source,
            reason: 'Direct node_modules import should use alias'
          });
        }
      });
    });
  }

  private detectCircularDependencies(): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const dfs = (filePath: string, path: string[] = []): void => {
      if (recursionStack.has(filePath)) {
        this.result.circularDependencies.push({
          cycle: [...path.slice(path.indexOf(filePath)), filePath]
        });
        return;
      }

      if (visited.has(filePath)) return;

      visited.add(filePath);
      recursionStack.add(filePath);

      const fileInfo = this.sourceFiles.get(filePath);
      if (fileInfo) {
        fileInfo.imports.forEach(({ source }) => {
          const resolvedPath = this.resolveImportPath(filePath, source);
          if (resolvedPath) {
            dfs(resolvedPath, [...path, filePath]);
          }
        });
      }

      recursionStack.delete(filePath);
    };

    this.sourceFiles.forEach((_, filePath) => {
      if (!visited.has(filePath)) {
        dfs(filePath);
      }
    });
  }

  private resolveImportPath(currentFile: string, importPath: string): string | null {
    if (importPath.startsWith('.')) {
      return path.resolve(path.dirname(currentFile), importPath);
    }
    return null;
  }
}
