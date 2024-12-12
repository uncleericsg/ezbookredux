import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface StateAnalysis {
  contexts: {
    file: string;
    exports: string[];
    stateShape: Record<string, any>;
    reducers: string[];
    actions: string[];
  }[];
  components: {
    file: string;
    stateUsage: {
      hooks: string[];
      contextUsage: string[];
      localState: { name: string; type: string }[];
    };
  }[];
}

function analyzeStateManagement(rootDir: string): StateAnalysis {
  const analysis: StateAnalysis = { contexts: [], components: [] };
  
  function visit(node: ts.Node, sourceFile: ts.SourceFile) {
    if (ts.isVariableDeclaration(node)) {
      // Analyze Context definitions
      if (node.initializer && 
          ts.isCallExpression(node.initializer) &&
          node.initializer.expression.getText() === 'createContext') {
        const contextFile = sourceFile.fileName;
        const contextName = node.name.getText();
        
        analysis.contexts.push({
          file: contextFile,
          exports: [],
          stateShape: {},
          reducers: [],
          actions: []
        });
      }
    }
    
    if (ts.isFunctionDeclaration(node)) {
      // Analyze Reducers and Actions
      const functionName = node.name?.getText();
      if (functionName?.toLowerCase().includes('reducer')) {
        const currentContext = analysis.contexts[analysis.contexts.length - 1];
        if (currentContext) {
          currentContext.reducers.push(functionName);
        }
      }
    }
    
    if (ts.isCallExpression(node)) {
      // Analyze Hook usage
      const hookName = node.expression.getText();
      if (['useState', 'useContext', 'useReducer'].includes(hookName)) {
        const componentFile = sourceFile.fileName;
        let component = analysis.components.find(c => c.file === componentFile);
        if (!component) {
          component = { 
            file: componentFile, 
            stateUsage: { 
              hooks: [], 
              contextUsage: [], 
              localState: [] 
            } 
          };
          analysis.components.push(component);
        }
        component.stateUsage.hooks.push(hookName);
      }
    }
    
    ts.forEachChild(node, n => visit(n, sourceFile));
  }
  
  function analyzeFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    visit(sourceFile, sourceFile);
  }
  
  function walkDir(dir: string) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.match(/\.(tsx?|jsx?)$/)) {
        analyzeFile(filePath);
      }
    });
  }
  
  walkDir(rootDir);
  return analysis;
}

if (require.main === module) {
  const rootDir = path.join(__dirname, '..', 'src');
  const analysis = analyzeStateManagement(rootDir);
  const outputPath = path.join(__dirname, 'state-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
  console.log(`State analysis written to: ${outputPath}`);
}

export { analyzeStateManagement };
