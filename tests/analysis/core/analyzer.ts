import { Node, Project, SourceFile, SyntaxKind, Type, CallExpression } from 'ts-morph';
import ts from 'typescript';

export interface ImportInfo {
  path: string;
  imports: Array<{
    name: string;
    alias?: string;
  }>;
}

export interface TypeProperty {
  name: string;
  type: string;
  isOptional: boolean;
}

export interface TypeInfo {
  name: string;
  kind: 'interface' | 'type' | 'enum' | 'class' | 'const';
  isExported: boolean;
  properties?: TypeProperty[];
  type?: string;
}

export interface ExportInfo {
  name: string;
  kind: 'function' | 'type' | 'class' | 'variable' | 'interface';
  isDefault: boolean;
}

export interface HookInfo {
  name: string;
  type: 'built-in' | 'custom';
  dependencies?: string[];
  stateType?: string;
}

export interface StateUpdate {
  source: string;
  target: string;
  updateType: 'set' | 'toggle' | 'merge' | 'reset';
}

export interface StateDefinition {
  name: string;
  type: string;
  initialValue: string;
  updates: StateUpdate[];
}

export interface GlobalStateUsage {
  type: 'redux' | 'context' | 'recoil';
  store: string;
  selectors: string[];
  actions: string[];
}

export interface StateAnalysis {
  localState: StateDefinition[];
  globalState: GlobalStateUsage[];
}

export interface AnalysisResult {
  imports: ImportInfo[];
  types: TypeInfo[];
  dependencies: string[];
  exports: ExportInfo[];
  hooks: HookInfo[];
  state: StateAnalysis;
}

export function analyzeNode(sourceFile: SourceFile): AnalysisResult {
  const result: AnalysisResult = {
    imports: [],
    types: [],
    dependencies: [],
    exports: [],
    hooks: [],
    state: {
      localState: [],
      globalState: []
    }
  };

  // Track unique hooks
  const uniqueHooks = new Set<string>();

  // Analyze imports
  analyzeImports(sourceFile, result);

  // Analyze types
  analyzeTypes(sourceFile, result);

  // Analyze hooks and state
  function visitNode(node: Node) {
    // Handle variable declarations that might contain hooks
    if (Node.isVariableDeclaration(node)) {
      const initializer = node.getInitializer();
      if (initializer && Node.isCallExpression(initializer)) {
        const expression = initializer.getExpression();
        if (Node.isIdentifier(expression)) {
          const name = expression.getText();
          
          // Check for hooks
          if (name.startsWith('use')) {
            const isBuiltIn = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef'].includes(name);
            const stateType = name === 'useState' ? inferStateType(initializer) : undefined;
            const hookKey = `${name}-${isBuiltIn ? 'built-in' : 'custom'}-${stateType || ''}`;
            
            // Only add if we haven't seen this hook type before
            if (!uniqueHooks.has(hookKey)) {
              uniqueHooks.add(hookKey);
              result.hooks.push({
                name,
                type: isBuiltIn ? 'built-in' : 'custom',
                ...(name === 'useState' && {
                  stateType
                }),
                ...(name === 'useEffect' && {
                  dependencies: inferDependencies(initializer)
                }),
                ...(name === 'useCallback' && {
                  dependencies: inferDependencies(initializer)
                })
              });
            }

            // Handle state management
            if (name === 'useState') {
              const bindingPattern = node.getParent()?.getFirstDescendantByKind(SyntaxKind.ArrayBindingPattern);
              if (bindingPattern) {
                const firstElement = bindingPattern.getElements()[0];
                if (Node.isBindingElement(firstElement)) {
                  const nameNode = firstElement.getNameNode();
                  if (Node.isIdentifier(nameNode)) {
                    const stateName = nameNode.getText();
                    result.state.localState.push({
                      name: stateName,
                      type: stateType || 'unknown',
                      initialValue: initializer.getArguments()[0]?.getText() || 'undefined',
                      updates: []
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
    // Handle call expressions that might be hooks or state management
    else if (Node.isCallExpression(node)) {
      const expression = node.getExpression();
      if (Node.isIdentifier(expression)) {
        const name = expression.getText();
        
        // Check for hooks
        if (name.startsWith('use')) {
          const isBuiltIn = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef'].includes(name);
          const stateType = name === 'useState' ? inferStateType(node) : undefined;
          const hookKey = `${name}-${isBuiltIn ? 'built-in' : 'custom'}-${stateType || ''}`;
          
          // Only add if we haven't seen this hook type before
          if (!uniqueHooks.has(hookKey)) {
            uniqueHooks.add(hookKey);
            result.hooks.push({
              name,
              type: isBuiltIn ? 'built-in' : 'custom',
              ...(name === 'useState' && {
                stateType
              }),
              ...(name === 'useEffect' && {
                dependencies: inferDependencies(node)
              }),
              ...(name === 'useCallback' && {
                dependencies: inferDependencies(node)
              })
            });
          }
        }
        
        // Handle Redux selectors
        if (name === 'useSelector' || name === 'useAppSelector') {
          const selectorArg = node.getArguments()[0];
          if (selectorArg && Node.isArrowFunction(selectorArg)) {
            const selectorText = selectorArg.getText();
            const storeMatch = selectorText.match(/state\.(\w+)/);
            if (storeMatch) {
              const store = storeMatch[1];
              const existingStore = result.state.globalState.find(s => s.store === store && s.type === 'redux');
              if (existingStore) {
                if (!existingStore.selectors.includes(selectorText)) {
                  existingStore.selectors.push(selectorText);
                }
              } else {
                result.state.globalState.push({
                  type: 'redux',
                  store,
                  selectors: [selectorText],
                  actions: []
                });
              }
            }
          }
        }
        // Handle Context
        else if (name === 'useUserContext') {
          result.state.globalState.push({
            type: 'context',
            store: 'UserContext',
            selectors: ['useUserContext'],
            actions: []
          });
        }
      }
    }

    // Visit children
    node.forEachChild(visitNode);
  }

  visitNode(sourceFile);

  // Analyze exports
  analyzeExports(sourceFile, result);

  return result;
}

// Helper function to analyze imports
function analyzeImports(sourceFile: SourceFile, result: AnalysisResult) {
  sourceFile.getImportDeclarations().forEach(importDecl => {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    const importInfo: ImportInfo = {
      path: moduleSpecifier,
      imports: []
    };

    // Get named imports
    const namedImports = importDecl.getNamedImports();
    namedImports.forEach(namedImport => {
      importInfo.imports.push({
        name: namedImport.getName(),
        alias: namedImport.getAliasNode()?.getText()
      });
    });

    result.imports.push(importInfo);
    result.dependencies.push(moduleSpecifier);
  });
}

// Helper function to analyze types
function analyzeTypes(sourceFile: SourceFile, result: AnalysisResult) {
  // Define visitNode at the start of analyzeTypes
  function visitNode(node: Node) {
    if (Node.isVariableDeclaration(node)) {
      const initializer = node.getInitializer();
      if (initializer) {
        visitNode(initializer);
      }
    }
  }

  sourceFile.forEachChild(child => {
    if (Node.isInterfaceDeclaration(child)) {
      const properties = child.getProperties().map(prop => ({
        name: prop.getName(),
        type: prop.getTypeNode()?.getText() || 'any',
        isOptional: prop.hasQuestionToken()
      }));

      result.types.push({
        name: child.getName(),
        kind: 'interface',
        isExported: child.isExported(),
        properties
      });
    } else if (Node.isTypeAliasDeclaration(child)) {
      result.types.push({
        name: child.getName(),
        kind: 'type',
        isExported: child.isExported()
      });
    } else if (Node.isEnumDeclaration(child)) {
      result.types.push({
        name: child.getName(),
        kind: 'enum',
        isExported: child.isExported()
      });

      if (child.isExported()) {
        result.exports.push({
          name: child.getName(),
          kind: 'type',
          isDefault: child.isDefaultExport()
        });
      }
    } else if (Node.isClassDeclaration(child)) {
      result.types.push({
        name: child.getName() || '',
        kind: 'class',
        isExported: child.isExported()
      });

      if (child.isExported()) {
        result.exports.push({
          name: child.getName() || '',
          kind: 'class',
          isDefault: child.isDefaultExport()
        });
      }
    } else if (Node.isFunctionDeclaration(child)) {
      if (child.isExported()) {
        result.exports.push({
          name: child.getName() || '',
          kind: 'function',
          isDefault: child.isDefaultExport()
        });
      }
    } else if (Node.isVariableStatement(child)) {
      child.getDeclarationList().getDeclarations().forEach(decl => {
        const name = decl.getName();
        const isExported = child.hasModifier(SyntaxKind.ExportKeyword);
        const isDefault = child.hasModifier(SyntaxKind.DefaultKeyword);
        
        // Handle const assertions
        if (Node.isVariableDeclaration(decl) && decl.getInitializer()?.getKind() === SyntaxKind.AsExpression) {
          const type = decl.getType();
          result.types.push({
            name,
            kind: 'const',
            isExported,
            type: type.getText()
          });
        }

        if (isExported) {
          result.exports.push({
            name,
            kind: 'variable',
            isDefault
          });
        }

        const initializer = decl.getInitializer();
        if (initializer) {
          visitNode(initializer);
        }
      });
    } else if (Node.isExportAssignment(child)) {
      // Handle default exports like: export default PaymentStep
      const expression = child.getExpression();
      if (Node.isIdentifier(expression)) {
        result.exports.push({
          name: expression.getText(),
          kind: 'variable',
          isDefault: true
        });
      }
    }
  });
}

// Helper function to analyze exports
function analyzeExports(sourceFile: SourceFile, result: AnalysisResult): void {
  // Visit variable declarations first
  function visitNode(node: Node) {
    if (Node.isVariableDeclaration(node)) {
      const initializer = node.getInitializer();
      if (initializer) {
        visitNode(initializer);
      }
    }
  }

  sourceFile.getExportDeclarations().forEach(exportDecl => {
    const moduleSpecifier = exportDecl.getModuleSpecifier();
    if (moduleSpecifier) {
      const moduleSpecifierValue = moduleSpecifier.getLiteralValue();
      
      // Add import info
      result.imports.push({
        path: moduleSpecifierValue,
        imports: []
      });
      
      // Add dependency
      if (!result.dependencies.includes(moduleSpecifierValue)) {
        result.dependencies.push(moduleSpecifierValue);
      }

      // Handle re-exports
      if (exportDecl.getNamedExports().length === 0 && !exportDecl.getNamespaceExport()) {
        // This is a default re-export
        result.exports.push({
          name: 'default',
          kind: 'variable' as const,
          isDefault: true
        });
      }
    }
  });

  // Handle other exports
  sourceFile.getExportedDeclarations().forEach((declarations, name) => {
    declarations.forEach(declaration => {
      let kind: ExportInfo['kind'] = 'variable';
      if (Node.isInterfaceDeclaration(declaration)) {
        kind = 'interface';
      } else if (Node.isTypeAliasDeclaration(declaration)) {
        kind = 'type';
      } else if (Node.isClassDeclaration(declaration)) {
        kind = 'class';
      } else if (Node.isFunctionDeclaration(declaration)) {
        kind = 'function';
      }

      result.exports.push({
        name,
        kind,
        isDefault: name === 'default'
      });
    });
  });
}

function inferStateType(node: CallExpression): string | undefined {
  // First try to get explicit type argument
  const typeArgs = node.getTypeArguments();
  if (typeArgs.length > 0) {
    return typeArgs[0].getText();
  }

  // Try to infer from initial value
  const initialValue = node.getArguments()[0];
  if (initialValue) {
    const type = initialValue.getType();
    if (type.isLiteral()) {
      // For literal types (like false), use their base type (boolean)
      return type.getBaseTypeOfLiteralType().getText();
    } else {
      // For other types, use the type directly
      return type.getText();
    }
  }
  return undefined;
}

function inferDependencies(node: CallExpression): string[] {
  const depsArray = node.getArguments()[1];
  if (Node.isArrayLiteralExpression(depsArray)) {
    return depsArray.getElements().map(element => element.getText());
  }
  return [];
} 