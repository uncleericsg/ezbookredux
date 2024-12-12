import * as ts from 'typescript';
import * as fs from 'fs/promises';
import path from 'path';

interface ComponentDependency {
  name: string;
  imports: string[];
  hooks: string[];
  contexts: string[];
  props: {
    name: string;
    type: string;
  }[];
  children: string[];
}

interface DependencyGraph {
  components: Map<string, ComponentDependency>;
  sharedDependencies: Set<string>;
  contextProviders: Set<string>;
  customHooks: Set<string>;
}

export class DependencyAnalyzer {
  private graph: DependencyGraph = {
    components: new Map(),
    sharedDependencies: new Set(),
    contextProviders: new Set(),
    customHooks: new Set()
  };

  constructor(private projectRoot: string) {}

  public async analyze(): Promise<DependencyGraph> {
    await this.scanComponents(this.projectRoot);
    this.identifySharedDependencies();
    return this.graph;
  }

  private async scanComponents(dir: string): Promise<void> {
    const files = await fs.readdir(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        await this.scanComponents(filePath);
      } else if (file.endsWith('.tsx')) {
        await this.analyzeComponent(filePath);
      }
    }
  }

  private async analyzeComponent(filePath: string): Promise<void> {
    const sourceFile = ts.createSourceFile(
      filePath,
      await fs.readFile(filePath, 'utf-8'),
      ts.ScriptTarget.Latest,
      true
    );

    const componentName = path.basename(filePath, '.tsx');
    const dependency: ComponentDependency = {
      name: componentName,
      imports: [],
      hooks: [],
      contexts: [],
      props: [],
      children: []
    };

    const visit = (node: ts.Node) => {
      // Analyze imports
      if (ts.isImportDeclaration(node)) {
        const importPath = (node.moduleSpecifier as ts.StringLiteral).text;
        dependency.imports.push(importPath);
      }

      // Analyze hooks usage
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
        const hookName = node.expression.text;
        if (hookName.startsWith('use')) {
          dependency.hooks.push(hookName);
          if (!hookName.match(/^use[A-Z]/)) { // Custom hooks
            this.graph.customHooks.add(hookName);
          }
        }
      }

      // Analyze context usage
      if (ts.isPropertyAccessExpression(node)) {
        const text = node.getText();
        if (text.includes('useContext')) {
          const contextName = node.name.text;
          dependency.contexts.push(contextName);
          this.graph.contextProviders.add(contextName);
        }
      }

      // Analyze props interface/type
      if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
        node.members.forEach(member => {
          if (ts.isPropertySignature(member) && member.type) {
            dependency.props.push({
              name: (member.name as ts.Identifier).text,
              type: member.type.getText()
            });
          }
        });
      }

      // Analyze JSX children
      if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
        const elementName = this.getElementName(node);
        if (elementName && elementName[0].toUpperCase() === elementName[0]) {
          dependency.children.push(elementName);
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    this.graph.components.set(componentName, dependency);
  }

  private getElementName(node: ts.JsxElement | ts.JsxSelfClosingElement): string {
    if (ts.isJsxElement(node)) {
      const tagName = node.openingElement.tagName;
      return ts.isIdentifier(tagName) ? tagName.text : '';
    } else {
      const tagName = node.tagName;
      return ts.isIdentifier(tagName) ? tagName.text : '';
    }
  }

  private identifySharedDependencies(): void {
    const dependencyCounts = new Map<string, number>();

    // Count occurrences of each dependency
    this.graph.components.forEach(component => {
      component.imports.forEach(imp => {
        const count = dependencyCounts.get(imp) || 0;
        dependencyCounts.set(imp, count + 1);
      });
    });

    // Identify shared dependencies (used by more than one component)
    dependencyCounts.forEach((count, dependency) => {
      if (count > 1) {
        this.graph.sharedDependencies.add(dependency);
      }
    });
  }
}
