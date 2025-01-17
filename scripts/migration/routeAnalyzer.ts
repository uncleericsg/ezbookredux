import * as ts from 'typescript';
import * as fs from 'fs/promises';
import path from 'path';

interface RouteInfo {
  path: string;
  component: string;
  children?: RouteInfo[];
  guards?: string[];
  layout?: string;
}

interface RouteAnalysisResult {
  routes: RouteInfo[];
  components: Set<string>;
  layouts: Set<string>;
  guards: Set<string>;
}

export class RouteAnalyzer {
  private result: RouteAnalysisResult = {
    routes: [],
    components: new Set(),
    layouts: new Set(),
    guards: new Set()
  };

  constructor(private appFile: string) {}

  public async analyze(): Promise<RouteAnalysisResult> {
    const content = await fs.readFile(this.appFile, 'utf-8');
    const sourceFile = ts.createSourceFile(
      this.appFile,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    this.extractRoutes(sourceFile);
    return this.result;
  }

  private extractRoutes(sourceFile: ts.SourceFile): void {
    const visit = (node: ts.Node) => {
      if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
        const elementName = this.getElementName(node);
        
        if (elementName === 'Route') {
          const routeInfo = this.extractRouteInfo(node);
          if (routeInfo) {
            this.result.routes.push(routeInfo);
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
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

  private getAttributeName(name: ts.JsxAttributeName): string {
    if (ts.isIdentifier(name)) {
      return name.text;
    } else if (ts.isJsxNamespacedName(name)) {
      return `${name.namespace.text}:${name.name.text}`;
    }
    return '';
  }

  private extractRouteInfo(node: ts.JsxElement | ts.JsxSelfClosingElement): RouteInfo | null {
    const attributes = ts.isJsxElement(node) ? 
      node.openingElement.attributes.properties : 
      node.attributes.properties;

    let path = '';
    let component = '';
    let layout = '';
    const guards: string[] = [];

    attributes.forEach(attr => {
      if (ts.isJsxAttribute(attr)) {
        const attrName = this.getAttributeName(attr.name);
        const value = attr.initializer;

        if (attrName === 'path' && value && ts.isStringLiteral(value)) {
          path = value.text;
        } else if (attrName === 'component' && value) {
          component = this.extractComponentName(value);
          this.result.components.add(component);
        } else if (attrName === 'layout' && value) {
          layout = this.extractComponentName(value);
          this.result.layouts.add(layout);
        } else if (attrName === 'guard' && value) {
          const guard = this.extractComponentName(value);
          guards.push(guard);
          this.result.guards.add(guard);
        }
      }
    });

    if (!path || !component) return null;

    const routeInfo: RouteInfo = {
      path,
      component,
      guards: guards.length > 0 ? guards : undefined,
      layout: layout || undefined
    };

    if (ts.isJsxElement(node)) {
      const children: RouteInfo[] = [];
      node.children.forEach(child => {
        if (ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child)) {
          const childRoute = this.extractRouteInfo(child);
          if (childRoute) {
            children.push(childRoute);
          }
        }
      });

      if (children.length > 0) {
        routeInfo.children = children;
      }
    }

    return routeInfo;
  }

  private extractComponentName(node: ts.Expression): string {
    if (ts.isIdentifier(node)) {
      return node.text;
    } else if (ts.isPropertyAccessExpression(node)) {
      return `${this.extractComponentName(node.expression)}.${node.name.text}`;
    }
    return '';
  }
}
