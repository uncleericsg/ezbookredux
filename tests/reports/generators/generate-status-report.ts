import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REPORTS_DIR = path.join(__dirname, '..')

export interface CoverageData {
  [key: string]: {
    s: { [key: string]: number }
    f: { [key: string]: number }
    b: { [key: string]: number[] }
  }
}

export interface CoverageMetrics {
  statements: string
  branches: string
  functions: string
  lines: string
}

export interface PerformanceMetrics {
  totalTests: number
  passedTests: number
  failedTests: number
  skippedTests: number
  averageDuration: number
  p95Duration: number
}

export interface ComponentMetrics {
  coverage: CoverageMetrics
  performance: {
    averageDuration: number
    slowestTest: string
    totalTests: number
  }
  lastUpdated: string
}

export interface Trend {
  date: string
  coverage: CoverageMetrics
  performance: PerformanceMetrics
}

export interface Recommendation {
  type: 'coverage' | 'performance' | 'maintenance'
  priority: 'high' | 'medium' | 'low'
  category: string
  message: string
  impact: string
  action: string
}

export interface StatusReport {
  timestamp: string
  summary: {
    coverage: CoverageMetrics
    performance: PerformanceMetrics
    trends: {
      coverage: Array<{ date: string; value: number }>
      performance: Array<{ date: string; value: number }>
    }
  }
  components: Record<string, ComponentMetrics>
  recommendations: Recommendation[]
  actionItems: Array<{
    id: string
    type: string
    description: string
    priority: string
    status: 'pending' | 'in-progress' | 'completed'
  }>
}

export async function generateStatusReport(
  mockData?: {
    coverage?: CoverageData
    performance?: any
    historical?: Trend[]
  }
): Promise<StatusReport> {
  try {
    // Read coverage data
    let coverageData: CoverageData
    if (mockData?.coverage) {
      coverageData = mockData.coverage
    } else {
      coverageData = JSON.parse(
        await fs.readFile(path.join(REPORTS_DIR, 'coverage/coverage-v8.json'), 'utf8')
      ) as CoverageData
    }

    // Read performance data
    let performanceData: any
    if (mockData?.performance) {
      performanceData = mockData.performance
    } else {
      performanceData = JSON.parse(
        await fs.readFile(path.join(REPORTS_DIR, 'performance/analysis.json'), 'utf8')
      )
    }

    // Read historical data if available
    let historicalData: Trend[] = mockData?.historical || []
    if (!mockData?.historical) {
      try {
        historicalData = JSON.parse(
          await fs.readFile(path.join(REPORTS_DIR, 'trends.json'), 'utf8')
        )
      } catch {
        // No historical data available
      }
    }

    // Generate report
    const report: StatusReport = {
      timestamp: new Date().toISOString(),
      summary: {
        coverage: calculateTotalCoverage(coverageData),
        performance: extractPerformanceMetrics(performanceData),
        trends: analyzeTrends(historicalData)
      },
      components: analyzeComponents(coverageData, performanceData),
      recommendations: generateRecommendations(coverageData, performanceData, historicalData),
      actionItems: generateActionItems(coverageData, performanceData, historicalData)
    }

    // Update historical data
    historicalData.push({
      date: report.timestamp,
      coverage: report.summary.coverage,
      performance: report.summary.performance
    })

    // Keep only last 30 days of data
    historicalData = historicalData.slice(-30)

    // Write reports if not using mock data
    if (!mockData) {
      await Promise.all([
        fs.writeFile(
          path.join(REPORTS_DIR, 'status-report.json'),
          JSON.stringify(report, null, 2)
        ),
        fs.writeFile(
          path.join(REPORTS_DIR, 'trends.json'),
          JSON.stringify(historicalData, null, 2)
        )
      ])
      console.log('Status report generated successfully')
    }

    return report
  } catch (error) {
    console.error('Failed to generate status report:', error)
    throw error instanceof Error ? error : new Error(String(error))
  }
}

function calculateTotalCoverage(coverageData: CoverageData): CoverageMetrics {
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
    lines: ((totals.statements.covered / totals.statements.total) * 100).toFixed(2)
  }
}

function extractPerformanceMetrics(performanceData: any): PerformanceMetrics {
  return {
    totalTests: performanceData.summary.totalTests,
    passedTests: performanceData.summary.passedTests,
    failedTests: performanceData.summary.failedTests,
    skippedTests: performanceData.summary.skippedTests,
    averageDuration: performanceData.summary.averageTestDuration,
    p95Duration: performanceData.summary.metrics.p95
  }
}

function analyzeTrends(historicalData: Trend[]): {
  coverage: Array<{ date: string; value: number }>
  performance: Array<{ date: string; value: number }>
} {
  const trends = {
    coverage: historicalData.map(data => ({
      date: data.date,
      value: parseFloat(data.coverage.statements)
    })),
    performance: historicalData.map(data => ({
      date: data.date,
      value: data.performance.averageDuration
    }))
  }

  // Ensure arrays are initialized even with no historical data
  if (trends.coverage.length === 0) {
    trends.coverage = [{ date: new Date().toISOString(), value: 0 }]
  }
  if (trends.performance.length === 0) {
    trends.performance = [{ date: new Date().toISOString(), value: 0 }]
  }

  return trends
}

function analyzeComponents(coverageData: CoverageData, performanceData: any): Record<string, ComponentMetrics> {
  const components: Record<string, ComponentMetrics> = {}

  // Analyze component coverage
  Object.entries(coverageData).forEach(([filePath, data]) => {
    if (filePath.includes('/components/')) {
      const componentName = path.basename(filePath, path.extname(filePath))
      components[componentName] = {
        coverage: calculateTotalCoverage({ [filePath]: data }),
        performance: {
          averageDuration: 0,
          slowestTest: '',
          totalTests: 0
        },
        lastUpdated: new Date().toISOString()
      }
    }
  })

  // Add performance data
  performanceData.testSuites?.forEach((suite: any) => {
    const componentName = path.basename(suite.name, path.extname(suite.name))
    if (components[componentName]) {
      components[componentName].performance = {
        averageDuration: suite.averageTestDuration,
        slowestTest: suite.slowestTest?.name || '',
        totalTests: suite.numTotalTests
      }
    }
  })

  return components
}

function generateRecommendations(
  coverageData: CoverageData,
  performanceData: any,
  historicalData: Trend[]
): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Coverage recommendations
  const coverage = calculateTotalCoverage(coverageData)
  if (parseFloat(coverage.statements) < 80) {
    recommendations.push({
      type: 'coverage',
      priority: 'high',
      category: 'Test Coverage',
      message: `Overall statement coverage is below target (${coverage.statements}%)`,
      impact: 'Reduced confidence in code changes and increased risk of bugs',
      action: 'Focus on adding tests for uncovered code paths'
    })
  }

  // Performance recommendations
  const performance = extractPerformanceMetrics(performanceData)
  if (performance.averageDuration > 1000) {
    recommendations.push({
      type: 'performance',
      priority: 'medium',
      category: 'Test Performance',
      message: `Average test duration is high (${performance.averageDuration.toFixed(2)}ms)`,
      impact: 'Slower feedback loop and increased CI/CD pipeline time',
      action: 'Optimize slow tests and consider parallelization'
    })
  }

  // Trend-based recommendations
  if (historicalData.length >= 2) {
    const latest = historicalData[historicalData.length - 1]
    const previous = historicalData[historicalData.length - 2]
    
    if (parseFloat(latest.coverage.statements) < parseFloat(previous.coverage.statements)) {
      recommendations.push({
        type: 'maintenance',
        priority: 'high',
        category: 'Test Maintenance',
        message: 'Test coverage is trending downward',
        impact: 'Increasing technical debt and reduced code quality confidence',
        action: 'Review recent changes and add missing test coverage'
      })
    }
  }

  return recommendations
}

function generateActionItems(
  coverageData: CoverageData,
  performanceData: any,
  historicalData: Trend[]
): StatusReport['actionItems'] {
  const actionItems: StatusReport['actionItems'] = []
  const recommendations = generateRecommendations(coverageData, performanceData, historicalData)

  recommendations.forEach((rec, index) => {
    actionItems.push({
      id: `action-${index + 1}`,
      type: rec.type,
      description: `${rec.message} - ${rec.action}`,
      priority: rec.priority,
      status: 'pending'
    })
  })

  return actionItems
}

// Execute if this is the main module
if (import.meta.url === fileURLToPath(import.meta.url)) {
  generateStatusReport()
}