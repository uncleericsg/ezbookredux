import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REPORTS_DIR = path.join(__dirname, '..')
const COVERAGE_DIR = path.join(REPORTS_DIR, 'coverage')

export interface CoverageData {
  [key: string]: {
    path: string
    statementMap: Record<string, { start: { line: number; column: number }; end: { line: number; column: number } }>
    fnMap: Record<string, { name: string; line: number }>
    branchMap: Record<string, { line: number; type: string; locations: Array<{ start: { line: number; column: number }; end: { line: number; column: number } }> }>
    s: Record<string, number>
    f: Record<string, number>
    b: Record<string, number[]>
  }
}

export interface CoverageSummary {
  statements: string
  branches: string
  functions: string
  lines: string
}

export interface ComponentCoverage {
  statements: string
  branches: string
  functions: string
  lines: string
  uncoveredLines: number[]
}

export interface CoverageRecommendation {
  file: string
  type: 'line-coverage' | 'function-coverage' | 'branch-coverage'
  message: string
}

export interface CoverageReport {
  timestamp: string
  summary: CoverageSummary
  components: Record<string, ComponentCoverage>
  uncoveredLines: Record<string, number[]>
  recommendations: CoverageRecommendation[]
}

// Custom error classes
class CoverageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'CoverageError'
  }
}

class FileAccessError extends Error {
  constructor(message: string, public path: string, public cause?: Error) {
    super(message)
    this.name = 'FileAccessError'
  }
}

export async function generateCoverageReport(inputData?: CoverageData): Promise<CoverageReport> {
  try {
    let coverageData: CoverageData

    if (inputData) {
      coverageData = inputData
    } else {
      // Validate directory exists
      try {
        await fs.access(COVERAGE_DIR)
      } catch (error) {
        throw new FileAccessError(
          'Coverage directory does not exist',
          COVERAGE_DIR,
          error as Error
        )
      }

      // Read coverage data
      try {
        const rawData = await fs.readFile(
          path.join(COVERAGE_DIR, 'coverage-v8.json'),
          'utf-8'
        )
        coverageData = JSON.parse(rawData)
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new CoverageError('Invalid coverage data format', error)
        }
        throw new FileAccessError(
          'Failed to read coverage data',
          path.join(COVERAGE_DIR, 'coverage-v8.json'),
          error as Error
        )
      }
    }

    // Generate report
    const report: CoverageReport = {
      timestamp: new Date().toISOString(),
      summary: calculateCoverageSummary(coverageData),
      components: analyzeCoverageByComponent(coverageData),
      uncoveredLines: findUncoveredLines(coverageData),
      recommendations: generateCoverageRecommendations(coverageData)
    }

    // Write report if not using input data
    if (!inputData) {
      await fs.writeFile(
        path.join(COVERAGE_DIR, 'analysis.json'),
        JSON.stringify(report, null, 2)
      )
      console.log('Coverage report generated successfully')
    }

    return report
  } catch (error) {
    console.error('Error generating coverage report:', error)
    throw error
  }
}

function calculateCoverageSummary(coverageData: CoverageData): CoverageSummary {
  const totals = {
    statements: { total: 0, covered: 0 },
    branches: { total: 0, covered: 0 },
    functions: { total: 0, covered: 0 }
  }

  Object.values(coverageData).forEach(file => {
    // Statements
    Object.values(file.s).forEach(count => {
      totals.statements.total++
      if (count > 0) totals.statements.covered++
    })

    // Functions
    Object.values(file.f).forEach(count => {
      totals.functions.total++
      if (count > 0) totals.functions.covered++
    })

    // Branches
    Object.values(file.b).forEach(counts => {
      counts.forEach(count => {
        totals.branches.total++
        if (count > 0) totals.branches.covered++
      })
    })
  })

  return {
    statements: ((totals.statements.covered / totals.statements.total) * 100).toFixed(2),
    branches: ((totals.branches.covered / totals.branches.total) * 100).toFixed(2),
    functions: ((totals.functions.covered / totals.functions.total) * 100).toFixed(2),
    lines: ((totals.statements.covered / totals.statements.total) * 100).toFixed(2) // Lines are equivalent to statements in v8
  }
}

function analyzeCoverageByComponent(coverageData: CoverageData): Record<string, ComponentCoverage> {
  const components: Record<string, ComponentCoverage> = {}

  Object.entries(coverageData).forEach(([filePath, data]) => {
    if (filePath.includes('/components/')) {
      const componentName = path.basename(filePath, path.extname(filePath))
      
      const totals = {
        statements: { total: 0, covered: 0 },
        branches: { total: 0, covered: 0 },
        functions: { total: 0, covered: 0 }
      }

      // Calculate totals
      Object.values(data.s).forEach(count => {
        totals.statements.total++
        if (count > 0) totals.statements.covered++
      })

      Object.values(data.f).forEach(count => {
        totals.functions.total++
        if (count > 0) totals.functions.covered++
      })

      Object.values(data.b).forEach(counts => {
        counts.forEach(count => {
          totals.branches.total++
          if (count > 0) totals.branches.covered++
        })
      })

      // Find uncovered lines
      const uncoveredLines = Object.entries(data.s)
        .filter(([, count]) => count === 0)
        .map(([id]) => data.statementMap[id].start.line)
        .sort((a, b) => a - b)

      components[componentName] = {
        statements: ((totals.statements.covered / totals.statements.total) * 100).toFixed(2),
        branches: ((totals.branches.covered / totals.branches.total) * 100).toFixed(2),
        functions: ((totals.functions.covered / totals.functions.total) * 100).toFixed(2),
        lines: ((totals.statements.covered / totals.statements.total) * 100).toFixed(2),
        uncoveredLines
      }
    }
  })

  return components
}

function findUncoveredLines(coverageData: CoverageData): Record<string, number[]> {
  const uncovered: Record<string, number[]> = {}

  Object.entries(coverageData).forEach(([filePath, data]) => {
    const uncoveredLines = Object.entries(data.s)
      .filter(([, count]) => count === 0)
      .map(([id]) => data.statementMap[id].start.line)
      .sort((a, b) => a - b)

    if (uncoveredLines.length > 0) {
      uncovered[filePath] = uncoveredLines
    }
  })

  return uncovered
}

function generateCoverageRecommendations(coverageData: CoverageData): CoverageRecommendation[] {
  const recommendations: CoverageRecommendation[] = []
  const COVERAGE_THRESHOLD = 80

  Object.entries(coverageData).forEach(([filePath, data]) => {
    const totals = {
      statements: { total: 0, covered: 0 },
      branches: { total: 0, covered: 0 },
      functions: { total: 0, covered: 0 }
    }

    // Calculate totals
    Object.values(data.s).forEach(count => {
      totals.statements.total++
      if (count > 0) totals.statements.covered++
    })

    Object.values(data.f).forEach(count => {
      totals.functions.total++
      if (count > 0) totals.functions.covered++
    })

    Object.values(data.b).forEach(counts => {
      counts.forEach(count => {
        totals.branches.total++
        if (count > 0) totals.branches.covered++
      })
    })

    const coverage = {
      lines: (totals.statements.covered / totals.statements.total) * 100,
      functions: (totals.functions.covered / totals.functions.total) * 100,
      branches: (totals.branches.covered / totals.branches.total) * 100
    }

    if (coverage.lines < COVERAGE_THRESHOLD) {
      recommendations.push({
        file: filePath,
        type: 'line-coverage',
        message: `Line coverage is below ${COVERAGE_THRESHOLD}% (${coverage.lines.toFixed(2)}%)`
      })
    }

    if (coverage.functions < COVERAGE_THRESHOLD) {
      recommendations.push({
        file: filePath,
        type: 'function-coverage',
        message: `Function coverage is below ${COVERAGE_THRESHOLD}% (${coverage.functions.toFixed(2)}%)`
      })
    }

    if (coverage.branches < COVERAGE_THRESHOLD) {
      recommendations.push({
        file: filePath,
        type: 'branch-coverage',
        message: `Branch coverage is below ${COVERAGE_THRESHOLD}% (${coverage.branches.toFixed(2)}%)`
      })
    }
  })

  return recommendations
}

// Execute if this is the main module
if (import.meta.url === fileURLToPath(import.meta.url)) {
  generateCoverageReport()
}