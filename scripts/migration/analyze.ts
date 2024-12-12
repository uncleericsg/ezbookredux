import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ImportVerifier } from './importVerifier.js';
import { RouteAnalyzer } from './routeAnalyzer.js';
import { DependencyAnalyzer } from './dependencyAnalyzer.js';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateMigrationReport() {
  const projectRoot = path.resolve(__dirname, '../..');
  const outputDir = path.join(projectRoot, 'migration-report');

  // Create output directory if it doesn't exist
  try {
    await fs.access(outputDir);
  } catch {
    await fs.mkdir(outputDir, { recursive: true });
  }

  console.log('Starting migration analysis...');
  console.log('Project root:', projectRoot);

  try {
    // 1. Analyze imports
    console.log('\nAnalyzing imports...');
    const importVerifier = new ImportVerifier(projectRoot);
    const importResults = await importVerifier.verify();
    await fs.writeFile(
      path.join(outputDir, 'import-analysis.json'),
      JSON.stringify(importResults, null, 2)
    );

    // 2. Analyze routes
    console.log('\nAnalyzing routes...');
    const appFile = path.join(projectRoot, 'src', 'App.tsx');
    const routeAnalyzer = new RouteAnalyzer(appFile);
    const routeResults = await routeAnalyzer.analyze();
    await fs.writeFile(
      path.join(outputDir, 'route-analysis.json'),
      JSON.stringify(routeResults, null, 2)
    );

    // 3. Analyze dependencies
    console.log('\nAnalyzing component dependencies...');
    const dependencyAnalyzer = new DependencyAnalyzer(projectRoot);
    const dependencyResults = await dependencyAnalyzer.analyze();
    await fs.writeFile(
      path.join(outputDir, 'dependency-analysis.json'),
      JSON.stringify(dependencyResults, null, 2)
    );

    // Generate summary report
    const summary = {
      invalidImportsCount: importResults.invalidImports.length,
      circularDependenciesCount: importResults.circularDependencies.length,
      routeCount: routeResults.routes.length,
      componentCount: routeResults.components.size,
      sharedDependenciesCount: dependencyResults.sharedDependencies.size,
      contextProvidersCount: dependencyResults.contextProviders.size,
      customHooksCount: dependencyResults.customHooks.size,
      timestamp: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(outputDir, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\nAnalysis complete! Reports generated in migration-report/');
    console.log('\nSummary:');
    console.log('----------------------------------------');
    console.log(`Invalid imports found: ${summary.invalidImportsCount}`);
    console.log(`Circular dependencies found: ${summary.circularDependenciesCount}`);
    console.log(`Total routes: ${summary.routeCount}`);
    console.log(`Total components: ${summary.componentCount}`);
    console.log(`Shared dependencies: ${summary.sharedDependenciesCount}`);
    console.log(`Context providers: ${summary.contextProvidersCount}`);
    console.log(`Custom hooks: ${summary.customHooksCount}`);
  } catch (error) {
    console.error('Error during analysis:', error);
    process.exit(1);
  }
}

// Run the analysis
generateMigrationReport().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
