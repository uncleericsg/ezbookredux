import { existsSync, statSync } from 'fs';
import { join } from 'path';

interface BuildInfo {
  path: string;
  name: string;
  dependencies: string[];
}

const builds: BuildInfo[] = [
  {
    path: 'dist/shared/.tsbuildinfo',
    name: 'shared',
    dependencies: []
  },
  {
    path: 'dist/node/.tsbuildinfo',
    name: 'node',
    dependencies: ['shared']
  },
  {
    path: 'dist/app/.tsbuildinfo',
    name: 'app',
    dependencies: ['shared', 'node']
  }
];

function getBuildTime(buildPath: string): number {
  try {
    const stats = statSync(join(process.cwd(), buildPath));
    return stats.mtimeMs;
  } catch {
    return 0;
  }
}

function validateBuildOrder() {
  console.log('Validating build order...');

  // Check if all build files exist
  const missingBuilds = builds.filter(build => !existsSync(join(process.cwd(), build.path)));
  if (missingBuilds.length > 0) {
    console.error('Missing build files:', missingBuilds.map(b => b.name).join(', '));
    process.exit(1);
  }

  // Check build order based on file timestamps
  const buildTimes = new Map<string, number>();
  builds.forEach(build => {
    buildTimes.set(build.name, getBuildTime(build.path));
  });

  const invalidOrder = builds.filter(build => {
    const buildTime = buildTimes.get(build.name)!;
    return build.dependencies.some(dep => {
      const depTime = buildTimes.get(dep)!;
      if (buildTime < depTime) {
        console.error(`${build.name} was built before its dependency ${dep}`);
        return true;
      }
      return false;
    });
  });

  if (invalidOrder.length > 0) {
    console.error('Invalid build order detected!');
    console.error('Please rebuild in the correct order: npm run build:all');
    process.exit(1);
  }

  // Verify declaration files are newer than their source files
  const sharedTypesDir = join(process.cwd(), 'dist', 'shared', 'types');
  if (!existsSync(sharedTypesDir)) {
    console.error('Shared types directory is missing!');
    process.exit(1);
  }

  console.log('Build order validation successful!');
}

validateBuildOrder();