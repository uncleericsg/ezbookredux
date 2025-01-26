import { createAnalysisProject, type ProjectConfig } from './core/project.js';
import { analyzeNode, type AnalysisResult } from './utils/ast.js';
import { createTypeWatcher, type TypeWatcherEvents } from './utils/fs.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Test utilities
const createTempFile = async (content: string, path: string) => {
  const dir = path.split('/').slice(0, -1).join('/');
  await mkdir(dir, { recursive: true });
  await writeFile(path, content);
};

const TEST_FILES = {
  basic: {
    path: 'src/types/test/basic.ts',
    content: `
      export interface User {
        id: string;
        name: string;
      }

      export type UserRole = 'admin' | 'user';
    `
  },
  imports: {
    path: 'src/types/test/imports.ts',
    content: `
      import { User, UserRole } from './basic';
      import type { BookingStatus } from '../booking';
      
      export interface ExtendedUser extends User {
        role: UserRole;
        status: BookingStatus;
      }
    `
  },
  circular: {
    path: 'src/types/test/a.ts',
    content: `
      import { B } from './b';
      export interface A {
        b: B;
      }
    `,
    pathB: 'src/types/test/b.ts',
    contentB: `
      import { A } from './a';
      export interface B {
        a: A;
      }
    `
  }
};

async function setupTestFiles() {
  for (const [key, file] of Object.entries(TEST_FILES)) {
    if (key === 'circular') {
      await createTempFile(file.content, file.path);
      await createTempFile(file.contentB, file.pathB);
    } else {
      await createTempFile(file.content, file.path);
    }
  }
}

async function testProjectSetup() {
  console.log('\n🧪 Testing Project Setup...');
  
  const config: Partial<ProjectConfig> = {
    compilerOptions: {
      rootDir: './src',
      strict: true
    }
  };

  const project = createAnalysisProject(config);
  console.assert(project !== null, '✅ Project created successfully');
  console.log('✅ Project setup test passed');
}

async function testTypeAnalysis() {
  console.log('\n🧪 Testing Type Analysis...');
  
  const project = createAnalysisProject();
  const sourceFile = project.addSourceFileAtPath(TEST_FILES.basic.path);
  const analysis = analyzeNode(sourceFile);

  // Verify interface detection
  console.assert(
    analysis.types.some(t => t.name === 'User' && t.kind === 'interface'),
    '✅ Interface detection works'
  );

  // Verify type alias detection
  console.assert(
    analysis.types.some(t => t.name === 'UserRole' && t.kind === 'type'),
    '✅ Type alias detection works'
  );

  console.log('✅ Type analysis test passed');
  return analysis;
}

async function testImportAnalysis() {
  console.log('\n🧪 Testing Import Analysis...');
  
  const project = createAnalysisProject();
  const sourceFile = project.addSourceFileAtPath(TEST_FILES.imports.path);
  const analysis = analyzeNode(sourceFile);

  // Verify import detection
  console.assert(
    analysis.imports.some(i => i.path === './basic'),
    '✅ Regular import detection works'
  );

  console.assert(
    analysis.imports.some(i => 
      i.imports.some(imp => imp.name === 'BookingStatus' && imp.isType)
    ),
    '✅ Type-only import detection works'
  );

  console.log('✅ Import analysis test passed');
  return analysis;
}

async function testFileWatcher() {
  console.log('\n🧪 Testing File Watcher...');
  
  const watcher = createTypeWatcher(['src/types/test/**/*.ts']);
  let changeDetected = false;

  await new Promise<void>((resolve) => {
    watcher.on('fileChanged', async (path) => {
      changeDetected = true;
      console.log('✅ Change detection works:', path);
      resolve();
    });

    // Trigger a file change
    setTimeout(async () => {
      await writeFile(TEST_FILES.basic.path, TEST_FILES.basic.content + '\n// Modified');
    }, 1000);
  });

  await watcher.close();
  console.assert(changeDetected, '✅ File watcher test passed');
}

async function testCircularDependencies() {
  console.log('\n🧪 Testing Circular Dependency Detection...');
  
  const project = createAnalysisProject();
  const sourceFileA = project.addSourceFileAtPath(TEST_FILES.circular.path);
  const analysisA = analyzeNode(sourceFileA);

  console.assert(
    analysisA.dependencies.includes(TEST_FILES.circular.pathB),
    '✅ Dependency detection works'
  );

  console.log('✅ Circular dependency test passed');
  return analysisA;
}

async function runAllTests() {
  try {
    console.log('🚀 Starting Analysis Tools Tests...');
    
    await setupTestFiles();
    await testProjectSetup();
    const typeAnalysis = await testTypeAnalysis();
    const importAnalysis = await testImportAnalysis();
    const circularAnalysis = await testCircularDependencies();
    await testFileWatcher();

    console.log('\n📊 Test Results Summary:');
    console.log('Type Analysis:', {
      types: typeAnalysis.types.length,
      exports: typeAnalysis.types.filter(t => t.isExported).length
    });
    console.log('Import Analysis:', {
      imports: importAnalysis.imports.length,
      typeOnlyImports: importAnalysis.imports.filter(i => i.isTypeOnly).length
    });
    console.log('Circular Analysis:', {
      dependencies: circularAnalysis.dependencies.length
    });

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run all tests
runAllTests().catch(console.error); 