import { Node, Project, ProjectOptions, ts } from 'ts-morph';
import * as path from 'path';

export interface AnalysisProjectConfig {
  tsConfigFilePath?: string;
  compilerOptions?: ProjectOptions['compilerOptions'];
}

export function createAnalysisProject(config: AnalysisProjectConfig = {}): Project {
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    jsx: ts.JsxEmit.ReactJSX,
    baseUrl: '.',
    paths: {
      '*': ['src/*']
    }
  };

  const project = new Project({
    compilerOptions,
    skipAddingFilesFromTsConfig: true,
    useInMemoryFileSystem: true
  });

  return project;
}

export const addSourceFiles = (project: Project, patterns: string[]) => {
  return project.addSourceFilesAtPaths(patterns);
};

export const getSourceFile = (project: Project, filePath: string) => {
  return project.addSourceFileAtPath(filePath);
};

export const validateProject = async (project: Project) => {
  const diagnostics = project.getPreEmitDiagnostics();
  return {
    hasErrors: diagnostics.length > 0,
    errors: diagnostics.map(diagnostic => ({
      message: diagnostic.getMessageText(),
      file: diagnostic.getSourceFile()?.getFilePath(),
      line: diagnostic.getLineNumber(),
      category: diagnostic.getCategory()
    }))
  };
}; 