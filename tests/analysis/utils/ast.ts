import { type Node, type SourceFile, SyntaxKind } from 'ts-morph';

export interface ImportInfo {
  path: string;
  isTypeOnly: boolean;
  imports: {
    name: string;
    alias?: string;
    isType: boolean;
  }[];
}

export interface TypeInfo {
  name: string;
  kind: string;
  location: {
    file: string;
    line: number;
    column: number;
  };
  isExported: boolean;
}

export interface AnalysisResult {
  imports: ImportInfo[];
  types: TypeInfo[];
  dependencies: string[];
}

export const extractImports = (sourceFile: SourceFile): ImportInfo[] => {
  const imports = sourceFile.getImportDeclarations();
  
  return imports.map(importDecl => ({
    path: importDecl.getModuleSpecifierValue(),
    isTypeOnly: importDecl.isTypeOnly(),
    imports: importDecl.getNamedImports().map(named => ({
      name: named.getName(),
      alias: named.getAliasNode()?.getText(),
      isType: named.isTypeOnly()
    }))
  }));
};

export const extractTypes = (sourceFile: SourceFile): TypeInfo[] => {
  const types: TypeInfo[] = [];
  
  // Interface declarations
  sourceFile.getInterfaces().forEach(interfaceDecl => {
    types.push({
      name: interfaceDecl.getName(),
      kind: 'interface',
      location: {
        file: sourceFile.getFilePath(),
        line: interfaceDecl.getStartLineNumber(),
        column: interfaceDecl.getStartLinePos()
      },
      isExported: interfaceDecl.isExported()
    });
  });

  // Type alias declarations
  sourceFile.getTypeAliases().forEach(typeAlias => {
    types.push({
      name: typeAlias.getName(),
      kind: 'type',
      location: {
        file: sourceFile.getFilePath(),
        line: typeAlias.getStartLineNumber(),
        column: typeAlias.getStartLinePos()
      },
      isExported: typeAlias.isExported()
    });
  });

  return types;
};

export const extractDependencies = (sourceFile: SourceFile): string[] => {
  const dependencies = new Set<string>();
  
  // Add import dependencies
  sourceFile.getImportDeclarations().forEach(importDecl => {
    dependencies.add(importDecl.getModuleSpecifierValue());
  });

  // Add type reference dependencies
  sourceFile.getDescendantsOfKind(SyntaxKind.TypeReference).forEach(typeRef => {
    const symbol = typeRef.getType().getSymbol();
    if (symbol) {
      const declarations = symbol.getDeclarations();
      declarations.forEach(decl => {
        const sourceFile = decl.getSourceFile();
        dependencies.add(sourceFile.getFilePath());
      });
    }
  });

  return Array.from(dependencies);
};

export const analyzeNode = (node: Node): AnalysisResult => {
  const sourceFile = node.getSourceFile();
  
  return {
    imports: extractImports(sourceFile),
    types: extractTypes(sourceFile),
    dependencies: extractDependencies(sourceFile)
  };
}; 