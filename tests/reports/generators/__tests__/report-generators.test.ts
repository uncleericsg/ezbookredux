import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { generateCoverageReport, type CoverageData } from '../generate-coverage-report'
import { generatePerformanceReport, type RawTestData } from '../generate-perf-report'
import { generateStatusReport } from '../generate-status-report'

// Mock fs promises
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    mkdir: vi.fn(),
    access: vi.fn()
  }
}))

// Mock data
const mockCoverageData: CoverageData = {
  'file1.ts': {
    path: 'src/file1.ts',
    statementMap: {
      '1': { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
      '2': { start: { line: 2, column: 0 }, end: { line: 2, column: 10 } }
    },
    fnMap: {
      '1': { name: 'testFn', line: 1 }
    },
    branchMap: {
      '1': {
        line: 1,
        type: 'if',
        locations: [
          { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
          { start: { line: 1, column: 11 }, end: { line: 1, column: 20 } }
        ]
      }
    },
    s: { '1': 1, '2': 0 },
    f: { '1': 1 },
    b: { '1': [1, 0] }
  }
}

const mockPerformanceData: RawTestData = {
  duration: 100,
  numTotalTests: 1,
  numPassedTests: 1,
  numFailedTests: 0,
  numSkippedTests: 0,
  startTime: Date.now(),
  endTime: Date.now() + 100,
  testResults: [
    {
      name: 'Test Suite 1',
      duration: 100,
      numTotalTests: 1,
      numPassedTests: 1,
      numFailedTests: 0,
      numSkippedTests: 0,
      testResults: [
        {
          name: 'test1',
          duration: 100,
          status: 'passed'
        }
      ]
    }
  ]
}

const mockStatusData = {
  coverage: mockCoverageData,
  performance: {
    summary: {
      totalTests: 10,
      passedTests: 9,
      failedTests: 1,
      skippedTests: 0,
      averageTestDuration: 150,
      metrics: { p95: 200 }
    },
    testSuites: [
      {
        name: 'Test Suite 1',
        averageTestDuration: 150,
        numTotalTests: 10
      }
    ]
  },
  historical: [
    {
      date: '2024-01-25T00:00:00.000Z',
      coverage: {
        statements: '85.00',
        branches: '80.00',
        functions: '90.00',
        lines: '85.00'
      },
      performance: {
        totalTests: 10,
        passedTests: 9,
        failedTests: 1,
        skippedTests: 0,
        averageDuration: 100,
        p95Duration: 150
      }
    }
  ]
}

describe('Report Generators', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Coverage Report', () => {
    it('should generate coverage report with correct metrics', async () => {
      const report = await generateCoverageReport(mockCoverageData)
      expect(report).toHaveProperty('summary')
      expect(report.summary).toHaveProperty('statements')
      expect(report.summary).toHaveProperty('branches')
      expect(report.summary).toHaveProperty('functions')
    })

    it('should calculate correct coverage percentages', async () => {
      const report = await generateCoverageReport(mockCoverageData)
      expect(report.summary.statements).toBe('50.00') // 1/2 statements covered
      expect(report.summary.functions).toBe('100.00') // 1/1 functions covered
      expect(report.summary.branches).toBe('50.00') // 1/2 branch conditions covered
    })

    it('should generate recommendations for low coverage', async () => {
      const report = await generateCoverageReport(mockCoverageData)
      expect(report.recommendations).toContainEqual(
        expect.objectContaining({
          type: 'line-coverage',
          message: expect.stringContaining('below')
        })
      )
    })
  })

  describe('Performance Report', () => {
    it('should generate performance report with metrics', async () => {
      const report = await generatePerformanceReport(mockPerformanceData)
      expect(report).toHaveProperty('summary')
      expect(report.summary).toHaveProperty('totalTests')
      expect(report.summary).toHaveProperty('averageTestDuration')
    })

    it('should identify slow tests correctly', async () => {
      const slowTestData: RawTestData = {
        ...mockPerformanceData,
        testResults: [
          {
            name: 'Test Suite 1',
            duration: 5000,
            numTotalTests: 1,
            numPassedTests: 1,
            numFailedTests: 0,
            numSkippedTests: 0,
            testResults: [
              {
                name: 'slowTest',
                duration: 5000,
                status: 'passed'
              }
            ]
          }
        ]
      }
      const report = await generatePerformanceReport(slowTestData)
      expect(report.recommendations).toContainEqual(
        expect.objectContaining({
          type: 'test',
          priority: 'high'
        })
      )
    })
  })

  describe('Status Report', () => {
    it('should generate consolidated status report', async () => {
      const report = await generateStatusReport(mockStatusData)
      expect(report).toHaveProperty('timestamp')
      expect(report).toHaveProperty('summary')
      expect(report).toHaveProperty('recommendations')
    })

    it('should track trends correctly', async () => {
      const report = await generateStatusReport(mockStatusData)
      expect(report.summary).toHaveProperty('trends')
      expect(report.summary.trends).toHaveProperty('coverage')
      expect(report.summary.trends).toHaveProperty('performance')
      expect(report.summary.trends.coverage).toHaveLength(2) // Initial + new data point
    })

    it('should generate actionable recommendations', async () => {
      const report = await generateStatusReport(mockStatusData)
      expect(report.recommendations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.any(String),
            priority: expect.any(String),
            message: expect.any(String),
            action: expect.any(String)
          })
        ])
      )
    })

    it('should handle missing historical data', async () => {
      const dataWithoutHistory = { ...mockStatusData, historical: undefined }
      const report = await generateStatusReport(dataWithoutHistory)
      expect(report.summary.trends.coverage).toHaveLength(1) // Only new data point
      expect(report.summary.trends.performance).toHaveLength(1)
    })
  })
}) 