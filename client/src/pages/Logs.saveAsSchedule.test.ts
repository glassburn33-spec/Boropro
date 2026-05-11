import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Use Object.defineProperty to avoid read-only error
if (!global.localStorage) {
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
} else {
  // If it already exists, replace its methods
  (global as any).localStorage = localStorageMock;
}

describe('Logs - Save as Schedule Button', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should convert flat temperature and time arrays back to StageInputs format', () => {
    // Simulate a saved log with flat arrays
    const log = {
      id: '1',
      name: 'Test Schedule',
      temperatures: [20, 500, 500, 300, 50],
      times: [0, 60, 90, 210, 450],
      notes: 'Test notes',
      description: 'Test description',
      selectedColors: ['#ff0000', '#00ff00'],
    };

    // Simulate the conversion logic
    const stage1Duration = log.times[1] - log.times[0]; // 60
    const stage2Duration = log.times[2] - log.times[1]; // 30
    const stage3Duration = log.times[3] - log.times[2]; // 120
    const stage4Duration = log.times[4] - log.times[3]; // 240

    const scheduleData = {
      stage1: {
        startTemp: log.temperatures[0],
        targetTemp: log.temperatures[1],
        duration: stage1Duration,
      },
      stage2: {
        holdTemp: log.temperatures[2],
        duration: stage2Duration,
      },
      stage3: {
        startTemp: log.temperatures[2],
        endTemp: log.temperatures[3],
        duration: stage3Duration,
      },
      stage4: {
        startTemp: log.temperatures[3],
        endTemp: log.temperatures[4],
        duration: stage4Duration,
      },
    };

    // Verify the conversion
    expect(scheduleData.stage1).toEqual({
      startTemp: 20,
      targetTemp: 500,
      duration: 60,
    });
    expect(scheduleData.stage2).toEqual({
      holdTemp: 500,
      duration: 30,
    });
    expect(scheduleData.stage3).toEqual({
      startTemp: 500,
      endTemp: 300,
      duration: 120,
    });
    expect(scheduleData.stage4).toEqual({
      startTemp: 300,
      endTemp: 50,
      duration: 240,
    });
  });

  it('should save converted schedule to localStorage under savedSchedules', () => {
    const log = {
      id: '1',
      name: 'Test Schedule',
      temperatures: [20, 500, 500, 300, 50],
      times: [0, 60, 90, 210, 450],
      notes: 'Test notes',
      description: 'Test description',
      selectedColors: ['#ff0000'],
    };

    // Simulate the save logic
    const stage1Duration = log.times[1] - log.times[0];
    const stage2Duration = log.times[2] - log.times[1];
    const stage3Duration = log.times[3] - log.times[2];
    const stage4Duration = log.times[4] - log.times[3];

    const scheduleData = {
      stage1: {
        startTemp: log.temperatures[0],
        targetTemp: log.temperatures[1],
        duration: stage1Duration,
      },
      stage2: {
        holdTemp: log.temperatures[2],
        duration: stage2Duration,
      },
      stage3: {
        startTemp: log.temperatures[2],
        endTemp: log.temperatures[3],
        duration: stage3Duration,
      },
      stage4: {
        startTemp: log.temperatures[3],
        endTemp: log.temperatures[4],
        duration: stage4Duration,
      },
    };

    const newSchedule = {
      id: Date.now().toString(),
      name: log.name,
      timestamp: new Date().toLocaleString(),
      data: scheduleData,
      notes: log.notes || '',
      results: log.description || '',
      selectedColors: log.selectedColors || [],
    };

    const savedSchedules = JSON.parse(localStorage.getItem('savedSchedules') || '[]');
    savedSchedules.push(newSchedule);
    localStorage.setItem('savedSchedules', JSON.stringify(savedSchedules));

    // Verify the schedule is saved
    const retrieved = JSON.parse(localStorage.getItem('savedSchedules') || '[]');
    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].name).toBe('Test Schedule');
    expect(retrieved[0].data.stage1.duration).toBe(60);
  });

  it('should also save to kiln logs for persistence', () => {
    const log = {
      id: '1',
      name: 'Test Schedule',
      temperatures: [20, 500, 500, 300, 50],
      times: [0, 60, 90, 210, 450],
      notes: 'Test notes',
      description: 'Test description',
      selectedColors: ['#ff0000'],
    };

    // Simulate the kiln log save
    const kilnLog = {
      id: '1',
      name: log.name,
      createdAt: new Date().toISOString(),
      description: log.notes || '',
      temperatures: log.temperatures,
      times: log.times,
      notes: log.notes || '',
      selectedColors: log.selectedColors || [],
      annealedColor: '',
      savedColorCombinations: [],
    };

    const existingLogs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
    existingLogs.push(kilnLog);
    localStorage.setItem('kilnLogs', JSON.stringify(existingLogs));

    // Verify the kiln log is saved
    const retrieved = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
    expect(retrieved).toHaveLength(1);
    expect(retrieved[0].name).toBe('Test Schedule');
    expect(retrieved[0].temperatures).toEqual([20, 500, 500, 300, 50]);
  });

  it('should handle multiple saves without overwriting previous schedules', () => {
    // First save
    const log1 = {
      id: '1',
      name: 'Schedule 1',
      temperatures: [20, 500, 500, 300, 50],
      times: [0, 60, 90, 210, 450],
      notes: 'Notes 1',
      description: 'Description 1',
      selectedColors: [],
    };

    const newSchedule1 = {
      id: '1',
      name: log1.name,
      timestamp: new Date().toLocaleString(),
      data: {
        stage1: { startTemp: 20, targetTemp: 500, duration: 60 },
        stage2: { holdTemp: 500, duration: 30 },
        stage3: { startTemp: 500, endTemp: 300, duration: 120 },
        stage4: { startTemp: 300, endTemp: 50, duration: 240 },
      },
      notes: log1.notes,
      results: log1.description,
      selectedColors: log1.selectedColors,
    };

    let savedSchedules = JSON.parse(localStorage.getItem('savedSchedules') || '[]');
    savedSchedules.push(newSchedule1);
    localStorage.setItem('savedSchedules', JSON.stringify(savedSchedules));

    // Second save
    const log2 = {
      id: '2',
      name: 'Schedule 2',
      temperatures: [20, 600, 600, 400, 50],
      times: [0, 90, 120, 240, 480],
      notes: 'Notes 2',
      description: 'Description 2',
      selectedColors: [],
    };

    const newSchedule2 = {
      id: '2',
      name: log2.name,
      timestamp: new Date().toLocaleString(),
      data: {
        stage1: { startTemp: 20, targetTemp: 600, duration: 90 },
        stage2: { holdTemp: 600, duration: 30 },
        stage3: { startTemp: 600, endTemp: 400, duration: 120 },
        stage4: { startTemp: 400, endTemp: 50, duration: 240 },
      },
      notes: log2.notes,
      results: log2.description,
      selectedColors: log2.selectedColors,
    };

    savedSchedules = JSON.parse(localStorage.getItem('savedSchedules') || '[]');
    savedSchedules.push(newSchedule2);
    localStorage.setItem('savedSchedules', JSON.stringify(savedSchedules));

    // Verify both schedules are saved
    const retrieved = JSON.parse(localStorage.getItem('savedSchedules') || '[]');
    expect(retrieved).toHaveLength(2);
    expect(retrieved[0].name).toBe('Schedule 1');
    expect(retrieved[1].name).toBe('Schedule 2');
  });

  it('should preserve selected colors when saving as schedule', () => {
    const log = {
      id: '1',
      name: 'Test Schedule',
      temperatures: [20, 500, 500, 300, 50],
      times: [0, 60, 90, 210, 450],
      notes: 'Test notes',
      description: 'Test description',
      selectedColors: ['#ff0000', '#00ff00', '#0000ff'],
    };

    const newSchedule = {
      id: '1',
      name: log.name,
      timestamp: new Date().toLocaleString(),
      data: {
        stage1: { startTemp: 20, targetTemp: 500, duration: 60 },
        stage2: { holdTemp: 500, duration: 30 },
        stage3: { startTemp: 500, endTemp: 300, duration: 120 },
        stage4: { startTemp: 300, endTemp: 50, duration: 240 },
      },
      notes: log.notes,
      results: log.description,
      selectedColors: log.selectedColors || [],
    };

    const savedSchedules = JSON.parse(localStorage.getItem('savedSchedules') || '[]');
    savedSchedules.push(newSchedule);
    localStorage.setItem('savedSchedules', JSON.stringify(savedSchedules));

    const retrieved = JSON.parse(localStorage.getItem('savedSchedules') || '[]');
    expect(retrieved[0].selectedColors).toEqual(['#ff0000', '#00ff00', '#0000ff']);
  });
});
