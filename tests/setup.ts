import { beforeAll, afterAll, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants for report directories
const REPORTS_DIR = path.join(__dirname, 'reports');
const COVERAGE_DIR = path.join(REPORTS_DIR, 'coverage');
const PERF_DIR = path.join(REPORTS_DIR, 'performance');

// Ensure report directories exist
beforeAll(async () => {
  try {
    await fs.mkdir(REPORTS_DIR, { recursive: true });
    await fs.mkdir(COVERAGE_DIR, { recursive: true });
    await fs.mkdir(PERF_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating report directories:', error);
  }
});

// Clean up test artifacts
afterEach(async () => {
  try {
    // Clean up any temporary files created during tests
    const tempFiles = [
      path.join(COVERAGE_DIR, 'analysis.json'),
      path.join(PERF_DIR, 'analysis.json'),
      path.join(REPORTS_DIR, 'status-report.json')
    ];

    for (const file of tempFiles) {
      try {
        await fs.unlink(file);
      } catch (error) {
        // Ignore errors if file doesn't exist
        if (error.code !== 'ENOENT') {
          console.error(`Error cleaning up ${file}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error in cleanup:', error);
  }
});

// Global test configuration
afterAll(async () => {
  // Any final cleanup or report generation
  try {
    // Ensure we don't leave any temporary files
    await fs.writeFile(
      path.join(REPORTS_DIR, 'test-summary.json'),
      JSON.stringify({
        timestamp: new Date().toISOString(),
        completed: true
      })
    );
  } catch (error) {
    console.error('Error in final cleanup:', error);
  }
}); 