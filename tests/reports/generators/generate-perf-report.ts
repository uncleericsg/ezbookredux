import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REPORTS_DIR = path.join(__dirname, '..')
const PERF_DIR = path.join(REPORTS_DIR, 'performance')

export interface TestResult {
  name: string
  duration: number
  status: 'passed' | 'failed' | 'skipped'
  error?: {
    message: string
    stack?: string
  }
}

export interface TestSuite {
  name: string
  duration: number
  numTotalTests: number
  numPassedTests: number
  numFailedTests: number
  numSkippedTests: number
  testResults: TestResult[]
}

export interface RawTestData {
  duration: number
  numTotalTests: number
  numPassedTests: number
  numFailedTests: number
  numSkippedTests: number
  startTime: number
  endTime: number
  testResults: TestSuite[]
}

export interface PerformanceMetrics {
  mean: number
  median: number
  p95: number
  standardDeviation: number
}

export interface TestSuiteAnalysis {
  name: string
  duration: number
  numPassedTests: number
  numFailedTests: number
  numSkippedTests: number
  averageTestDuration: number
  metrics: PerformanceMetrics
  setupTime?: number
  teardownTime?: number
}

export interface PerformanceRecommendation {
  type: 'test' | 'suite' | 'general'
  name: string
  message: string
  priority: 'high' | 'medium' | 'low'
  impact: string
  suggestion: string
}

export interface PerformanceReport {
  timestamp: string
  summary: {
    totalDuration: number
    totalTests: number
    passedTests: number
    failedTests: number
    skippedTests: number
    averageTestDuration: number
    metrics: PerformanceMetrics
  }
  slowestTests: Array<{
    name: string
    duration: number
    status: string
  }>
  testSuites: TestSuiteAnalysis[]
  recommendations: PerformanceRecommendation[]
}

// Custom error class
class PerformanceError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'PerformanceError'
  }
}

export async function generatePerformanceReport(inputData?: RawTestData): Promise<PerformanceReport> {
  try {
    let rawData: RawTestData

    if (inputData) {
      rawData = inputData
    } else {
      try {
        const data = await fs.readFile(path.join(PERF_DIR, 'test-results.json'), 'utf-8')
        rawData = JSON.parse(data)
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new PerformanceError('Invalid performance data format', error)
        }
        throw new PerformanceError(
          'Failed to read performance data',
          error instanceof Error ? error : new Error(String(error))
        )
      }
    }

    // Generate report
    const report: PerformanceReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalDuration: rawData.duration,
        totalTests: rawData.numTotalTests,
        passedTests: rawData.numPassedTests,
        failedTests: rawData.numFailedTests,
        skippedTests: rawData.numSkippedTests,
        averageTestDuration: rawData.duration / rawData.numTotalTests,
        metrics: calculatePerformanceMetrics(rawData.testResults.flatMap(suite => 
          suite.testResults.map(test => test.duration)
        ))
      },
      slowestTests: extractSlowestTests(rawData),
      testSuites: analyzeTestSuites(rawData),
      recommendations: generatePerformanceRecommendations(rawData)
    }

    // Write report if not using input data
    if (!inputData) {
      await fs.writeFile(
        path.join(PERF_DIR, 'analysis.json'),
        JSON.stringify(report, null, 2)
      )
      console.log('Performance report generated successfully')
    }

    return report
  } catch (error) {
    console.error('Error generating performance report:', error)
    throw error instanceof Error ? error : new Error(String(error))
  }
}

function calculatePerformanceMetrics(durations: number[]): PerformanceMetrics {
  if (durations.length === 0) {
    return {
      mean: 0,
      median: 0,
      p95: 0,
      standardDeviation: 0
    }
  }

  const sorted = [...durations].sort((a, b) => a - b)
  const mean = durations.reduce((a, b) => a + b, 0) / durations.length
  const median = sorted[Math.floor(sorted.length / 2)]
  const p95 = sorted[Math.floor(sorted.length * 0.95)]
  
  const variance = durations.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / durations.length
  const standardDeviation = Math.sqrt(variance)

  return {
    mean,
    median,
    p95,
    standardDeviation
  }
}

function extractSlowestTests(data: RawTestData): Array<{ name: string; duration: number; status: string }> {
  return data.testResults
    .flatMap(suite => suite.testResults)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10)
    .map(test => ({
      name: test.name,
      duration: test.duration,
      status: test.status
    }))
}

function analyzeTestSuites(data: RawTestData): TestSuiteAnalysis[] {
  return data.testResults.map(suite => {
    const testDurations = suite.testResults.map(test => test.duration)
    
    return {
      name: suite.name,
      duration: suite.duration,
      numPassedTests: suite.numPassedTests,
      numFailedTests: suite.numFailedTests,
      numSkippedTests: suite.numSkippedTests,
      averageTestDuration: suite.duration / suite.numTotalTests,
      metrics: calculatePerformanceMetrics(testDurations),
      setupTime: estimateSetupTime(suite),
      teardownTime: estimateTeardownTime(suite)
    }
  })
}

function estimateSetupTime(suite: TestSuite): number {
  const firstTest = suite.testResults[0]
  return firstTest ? firstTest.duration * 0.1 : 0
}

function estimateTeardownTime(suite: TestSuite): number {
  const lastTest = suite.testResults[suite.testResults.length - 1]
  return lastTest ? lastTest.duration * 0.1 : 0
}

function generatePerformanceRecommendations(data: RawTestData): PerformanceRecommendation[] {
  const recommendations: PerformanceRecommendation[] = []
  const SLOW_TEST_THRESHOLD = 1000
  const SLOW_SUITE_THRESHOLD = 5000
  const HIGH_SETUP_TIME_THRESHOLD = 500

  data.testResults.forEach(suite => {
    suite.testResults.forEach(test => {
      if (test.duration > SLOW_TEST_THRESHOLD) {
        recommendations.push({
          type: 'test',
          name: test.name,
          message: `Test is slow (${test.duration}ms)`,
          priority: test.duration > SLOW_TEST_THRESHOLD * 2 ? 'high' : 'medium',
          impact: 'Increases overall test execution time',
          suggestion: 'Consider optimizing assertions, reducing setup complexity, or splitting into smaller tests'
        })
      }
    })

    if (suite.duration > SLOW_SUITE_THRESHOLD) {
      recommendations.push({
        type: 'suite',
        name: suite.name,
        message: `Test suite is slow (${suite.duration}ms)`,
        priority: suite.duration > SLOW_SUITE_THRESHOLD * 2 ? 'high' : 'medium',
        impact: 'Significantly impacts CI/CD pipeline performance',
        suggestion: 'Consider parallelizing tests, optimizing setup/teardown, or splitting into multiple suites'
      })
    }

    const setupTime = estimateSetupTime(suite)
    if (setupTime > HIGH_SETUP_TIME_THRESHOLD) {
      recommendations.push({
        type: 'suite',
        name: suite.name,
        message: `High setup time (${setupTime}ms)`,
        priority: 'medium',
        impact: 'Increases test initialization overhead',
        suggestion: 'Consider using beforeAll instead of beforeEach where possible, or optimizing setup operations'
      })
    }
  })

  if (data.numFailedTests > 0) {
    recommendations.push({
      type: 'general',
      name: 'Test Stability',
      message: `${data.numFailedTests} failed tests detected`,
      priority: 'high',
      impact: 'Reduces confidence in test results',
      suggestion: 'Investigate and fix failing tests before analyzing performance'
    })
  }

  return recommendations
}

// Execute if this is the main module
if (import.meta.url === fileURLToPath(import.meta.url)) {
  generatePerformanceReport()
}