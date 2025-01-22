import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

function readTsConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${configPath}:`, error);
    process.exit(1);
  }
}

function validateReferences(configPath, visited = new Set(), stack = new Set()) {
  const absolutePath = path.resolve(rootDir, configPath);
  
  if (stack.has(absolutePath)) {
    console.error('Circular dependency detected:', Array.from(stack).join(' -> '));
    process.exit(1);
  }

  if (visited.has(absolutePath)) {
    return;
  }

  visited.add(absolutePath);
  stack.add(absolutePath);

  const config = readTsConfig(absolutePath);
  const references = config.references || [];

  for (const ref of references) {
    const refPath = path.resolve(path.dirname(absolutePath), ref.path);
    validateReferences(refPath, visited, stack);
  }

  stack.delete(absolutePath);
}

function validateBuildOrder() {
  console.log('Validating TypeScript project references and build order...');

  // Check if all required tsconfig files exist
  const requiredConfigs = [
    'tsconfig.shared.json',
    'tsconfig.node.json',
    'tsconfig.json'
  ];

  for (const config of requiredConfigs) {
    if (!fs.existsSync(path.join(rootDir, config))) {
      console.error(`Missing required config: ${config}`);
      process.exit(1);
    }
  }

  // Validate references starting from main tsconfig
  validateReferences('tsconfig.json');

  // Validate path aliases
  const mainConfig = readTsConfig(path.join(rootDir, 'tsconfig.json'));
  const paths = mainConfig.compilerOptions?.paths || {};

  // Check for overlapping path aliases
  const aliasMap = new Map();
  for (const [alias, targets] of Object.entries(paths)) {
    for (const target of targets) {
      const normalizedTarget = path.normalize(target);
      if (aliasMap.has(normalizedTarget)) {
        console.warn(`Warning: Path alias overlap detected:
          ${alias} -> ${target}
          ${aliasMap.get(normalizedTarget)} -> ${target}`);
      }
      aliasMap.set(normalizedTarget, alias);
    }
  }

  // Validate type roots
  const typeRoots = mainConfig.compilerOptions?.typeRoots || [];
  for (const typeRoot of typeRoots) {
    const absoluteTypeRoot = path.resolve(rootDir, typeRoot);
    if (!fs.existsSync(absoluteTypeRoot)) {
      console.warn(`Warning: Type root does not exist: ${typeRoot}`);
    }
  }

  console.log('Build order validation complete!');
  console.log('No circular dependencies found.');
  console.log('Project references are valid.');
}

validateBuildOrder();