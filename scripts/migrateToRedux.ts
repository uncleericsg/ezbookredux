import * as fs from 'fs';
import * as path from 'path';
import { createBackup } from './createBackup';
import { analyzeStateManagement } from './analyzeState';

interface SliceTemplate {
  name: string;
  initialState: Record<string, any>;
  reducers: string[];
  extraReducers?: Record<string, any>;
}

function generateSliceFile(slice: SliceTemplate): string {
  return `
// @ai-generated Migrated from Context API to Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = ${JSON.stringify(slice.initialState, null, 2)};

export const ${slice.name}Slice = createSlice({
  name: '${slice.name}',
  initialState,
  reducers: {
    ${slice.reducers.join(',\n    ')}
  },
  ${slice.extraReducers ? `extraReducers: ${JSON.stringify(slice.extraReducers, null, 2)}` : ''}
});

export const { ${slice.reducers.map(r => r.split(':')[0]).join(', ')} } = ${slice.name}Slice.actions;
export default ${slice.name}Slice.reducer;
`;
}

function generateStoreFile(slices: string[]): string {
  return `
import { configureStore } from '@reduxjs/toolkit';
${slices.map(slice => `import ${slice}Reducer from './slices/${slice}Slice';`).join('\n')}

export const store = configureStore({
  reducer: {
    ${slices.map(slice => `${slice}: ${slice}Reducer`).join(',\n    ')}
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
}

function generateHooksFile(): string {
  return `
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`;
}

async function migrateToRedux() {
  // Create backup first
  const backupDir = createBackup();
  console.log('Backup created at:', backupDir);
  
  // Analyze current state management
  const rootDir = path.join(__dirname, '..', 'src');
  const analysis = analyzeStateManagement(rootDir);
  
  // Create Redux directory structure
  const reduxDir = path.join(rootDir, 'store');
  fs.mkdirSync(path.join(reduxDir, 'slices'), { recursive: true });
  
  // Generate slices from contexts
  const slices = analysis.contexts.map(context => {
    const name = path.basename(context.file, '.tsx').replace('Context', '').toLowerCase();
    const slice: SliceTemplate = {
      name,
      initialState: context.stateShape,
      reducers: context.reducers.map(r => {
        const actionName = r.replace('reducer', '');
        return `${actionName}: (state, action: PayloadAction<any>) => { /* TODO: Implement ${actionName} */ }`;
      })
    };
    
    const sliceContent = generateSliceFile(slice);
    fs.writeFileSync(
      path.join(reduxDir, 'slices', `${name}Slice.ts`),
      sliceContent
    );
    return name;
  });
  
  // Generate store file
  const storeContent = generateStoreFile(slices);
  fs.writeFileSync(path.join(reduxDir, 'store.ts'), storeContent);
  
  // Generate hooks file
  const hooksContent = generateHooksFile();
  fs.writeFileSync(path.join(reduxDir, 'hooks.ts'), hooksContent);
  
  // Update package.json with Redux dependencies
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.dependencies = {
    ...packageJson.dependencies,
    '@reduxjs/toolkit': '^2.0.1',
    'react-redux': '^9.0.4'
  };
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('Migration completed successfully!');
  console.log('Next steps:');
  console.log('1. Review generated Redux slices in src/store/slices');
  console.log('2. Implement reducer logic in each slice');
  console.log('3. Update components to use Redux hooks');
  console.log('4. Run tests to verify functionality');
  console.log('5. Install new dependencies with: npm install');
}

if (require.main === module) {
  migrateToRedux().catch(console.error);
}

export { migrateToRedux };
