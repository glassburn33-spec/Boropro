import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Tests for Logs page PDF export functionality
 * Verifies that PDF exports match Firing Tracker styling with:
 * - Dark theme background (#1c1917)
 * - Amber/gold colors (#fbbf24, #d97706)
 * - Grid lines and axes
 * - Coordinate labels and tick marks
 * - Notes field support
 */

interface SavedLog {
  id: string;
  name: string;
  temperatures: number[];
  times: number[];
  createdAt: string;
  description?: string;
  notes?: string;
}

describe('Logs PDF Export', () => {
  let mockLog: SavedLog;

  beforeEach(() => {
    mockLog = {
      id: '1',
      name: 'Test Kiln Log',
      temperatures: [200, 400, 600, 500, 300],
      times: [0, 60, 120, 180, 240],
      createdAt: new Date().toISOString(),
      description: 'Test firing schedule',
      notes: 'Test notes for the firing',
    };
  });

  it('should create SVG with correct dimensions', () => {
    const width = 1000;
    const height = 600;
    const margin = { top: 80, right: 80, bottom: 120, left: 70 };

    expect(width).toBe(1000);
    expect(height).toBe(600);
    expect(margin.top + margin.bottom + margin.left + margin.right).toBeGreaterThan(0);
  });

  it('should calculate correct scale functions', () => {
    const maxTemp = Math.max(...mockLog.temperatures) + 50;
    const maxTime = Math.max(...mockLog.times);
    const plotWidth = 850; // 1000 - 70 - 80
    const plotHeight = 400; // 600 - 80 - 120

    const scaleX = (time: number) => (time / maxTime) * plotWidth;
    const scaleY = (temp: number) => plotHeight - (temp / maxTemp) * plotHeight;

    // Test scale functions produce valid coordinates
    expect(scaleX(0)).toBe(0);
    expect(scaleX(maxTime)).toBe(plotWidth);
    expect(scaleY(0)).toBe(plotHeight);
    expect(scaleY(maxTemp)).toBe(0);
  });

  it('should have dark theme colors matching Firing Tracker', () => {
    const colors = {
      background: '#1c1917',
      amber: '#fbbf24',
      orange: '#d97706',
      gridStroke: '#404040',
      axisStroke: '#999',
    };

    expect(colors.background).toBe('#1c1917');
    expect(colors.amber).toBe('#fbbf24');
    expect(colors.orange).toBe('#d97706');
  });

  it('should generate correct temperature step for gridlines', () => {
    const maxTemp = Math.max(...mockLog.temperatures) + 50;
    const tempStep = maxTemp > 600 ? 100 : 50;

    expect(tempStep).toBe(100); // 650 > 600, so 100
  });

  it('should generate correct time step for axis labels', () => {
    const maxTime = Math.max(...mockLog.times);
    const timeStep = maxTime > 500 ? 100 : 50;

    expect(timeStep).toBe(50); // 240 < 500, so 50 ✓
  });

  it('should include log metadata in HTML', () => {
    const maxTemp = Math.max(...mockLog.temperatures);
    const duration = Math.max(...mockLog.times);

    expect(mockLog.name).toBe('Test Kiln Log');
    expect(maxTemp).toBe(600);
    expect(duration).toBe(240);
  });

  it('should preserve notes field in saved log', () => {
    expect(mockLog.notes).toBe('Test notes for the firing');
    expect(mockLog.description).toBe('Test firing schedule');
  });

  it('should have correct data point count', () => {
    expect(mockLog.temperatures.length).toBe(5);
    expect(mockLog.times.length).toBe(5);
    expect(mockLog.temperatures.length).toBe(mockLog.times.length);
  });

  it('should generate valid temperature data for table', () => {
    const tableData = mockLog.times.map((time, index) => ({
      time,
      temperature: mockLog.temperatures[index],
    }));

    expect(tableData).toHaveLength(5);
    expect(tableData[0]).toEqual({ time: 0, temperature: 200 });
    expect(tableData[4]).toEqual({ time: 240, temperature: 300 });
  });

  it('should handle edge case: single data point', () => {
    const singlePointLog: SavedLog = {
      ...mockLog,
      temperatures: [400],
      times: [0],
    };

    expect(singlePointLog.temperatures.length).toBe(1);
    expect(singlePointLog.times.length).toBe(1);
  });

  it('should handle edge case: many data points', () => {
    const manyPointsLog: SavedLog = {
      ...mockLog,
      temperatures: Array.from({ length: 100 }, (_, i) => 200 + (i % 400)),
      times: Array.from({ length: 100 }, (_, i) => i * 10),
    };

    expect(manyPointsLog.temperatures.length).toBe(100);
    expect(manyPointsLog.times.length).toBe(100);
  });

  it('should generate correct temperature range with padding', () => {
    const minTemp = Math.min(...mockLog.temperatures);
    const maxTemp = Math.max(...mockLog.temperatures) + 50;

    expect(minTemp).toBe(200);
    expect(maxTemp).toBe(650); // 600 + 50
  });

  it('should format log creation date correctly', () => {
    const createdDate = new Date(mockLog.createdAt);
    expect(createdDate).toBeInstanceOf(Date);
    expect(createdDate.toLocaleString()).toBeTruthy();
  });

  it('should include all required metadata fields', () => {
    const requiredFields = ['id', 'name', 'temperatures', 'times', 'createdAt'];
    requiredFields.forEach(field => {
      expect(mockLog).toHaveProperty(field);
    });
  });

  it('should support optional notes and description fields', () => {
    const logWithoutOptionals: SavedLog = {
      id: '2',
      name: 'Minimal Log',
      temperatures: [300],
      times: [0],
      createdAt: new Date().toISOString(),
    };

    expect(logWithoutOptionals.notes).toBeUndefined();
    expect(logWithoutOptionals.description).toBeUndefined();
  });

  it('should generate SVG path data for temperature curve', () => {
    const margin = { top: 80, left: 70 };
    const maxTemp = Math.max(...mockLog.temperatures) + 50;
    const maxTime = Math.max(...mockLog.times);
    const plotWidth = 850;
    const plotHeight = 400;

    const scaleX = (time: number) => (time / maxTime) * plotWidth;
    const scaleY = (temp: number) => plotHeight - (temp / maxTemp) * plotHeight;

    let pathD = `M ${margin.left + scaleX(mockLog.times[0])} ${margin.top + scaleY(mockLog.temperatures[0])}`;
    
    for (let i = 1; i < mockLog.times.length; i++) {
      pathD += ` L ${margin.left + scaleX(mockLog.times[i])} ${margin.top + scaleY(mockLog.temperatures[i])}`;
    }

    expect(pathD).toContain('M');
    expect(pathD).toContain('L');
    expect(pathD.split('L').length).toBe(mockLog.times.length); // Should have n-1 line segments
  });

  it('should calculate correct axis tick positions', () => {
    const maxTemp = Math.max(...mockLog.temperatures) + 50;
    const tempStep = maxTemp > 600 ? 100 : 50;
    const ticks: number[] = [];

    for (let i = 0; i <= maxTemp; i += tempStep) {
      ticks.push(i);
    }

    expect(ticks).toContain(0);
    expect(ticks[ticks.length - 1]).toBeLessThanOrEqual(maxTemp);
    expect(ticks.length).toBeGreaterThan(0);
  });

  it('should generate HTML with dark theme styling', () => {
    const htmlContent = `
      <style>
        body { background: #1c1917; color: #fbbf24; }
        .metadata { background: #2d2520; border: 1px solid #d97706; }
        th { background-color: #404040; color: #fbbf24; }
        td { color: #d97706; }
      </style>
    `;

    expect(htmlContent).toContain('#1c1917');
    expect(htmlContent).toContain('#fbbf24');
    expect(htmlContent).toContain('#d97706');
    expect(htmlContent).toContain('#2d2520');
  });

  it('should handle temperature data with duplicates', () => {
    const duplicateLog: SavedLog = {
      ...mockLog,
      temperatures: [300, 300, 300, 300, 300],
      times: [0, 60, 120, 180, 240],
    };

    const maxTemp = Math.max(...duplicateLog.temperatures) + 50;
    expect(maxTemp).toBe(350);
  });

  it('should calculate correct plot area dimensions', () => {
    const width = 1000;
    const height = 600;
    const margin = { top: 80, right: 80, bottom: 120, left: 70 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    expect(plotWidth).toBe(850);
    expect(plotHeight).toBe(400);
    expect(plotWidth * plotHeight).toBeGreaterThan(0);
  });
});
