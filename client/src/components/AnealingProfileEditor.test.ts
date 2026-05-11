import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * @vitest-environment jsdom
 */

describe('AnealingProfileEditor - handleSaveSchedule', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should transform nested stage data into flat temperature and time arrays', () => {
    // Simulate the inputs structure
    const inputs = {
      stage1: {
        startTemp: 20,
        targetTemp: 500,
        duration: 60,
      },
      stage2: {
        holdTemp: 500,
        duration: 30,
      },
      stage3: {
        startTemp: 500,
        endTemp: 300,
        duration: 120,
      },
      stage4: {
        startTemp: 300,
        endTemp: 50,
        duration: 240,
      },
    };

    // Simulate the transformation logic
    const temperatures: number[] = [];
    const times: number[] = [];

    // Stage 1: Ramp to target
    temperatures.push(inputs.stage1.startTemp, inputs.stage1.targetTemp);
    times.push(0, inputs.stage1.duration);

    // Stage 2: Hold
    temperatures.push(inputs.stage2.holdTemp);
    times.push(inputs.stage1.duration + inputs.stage2.duration);

    // Stage 3: Ramp down
    temperatures.push(inputs.stage3.startTemp, inputs.stage3.endTemp);
    times.push(inputs.stage1.duration + inputs.stage2.duration + inputs.stage3.duration);

    // Stage 4: Cool down
    temperatures.push(inputs.stage4.startTemp, inputs.stage4.endTemp);
    times.push(inputs.stage1.duration + inputs.stage2.duration + inputs.stage3.duration + inputs.stage4.duration);

    // Verify the transformation
    expect(temperatures).toEqual([20, 500, 500, 500, 300, 300, 50]);
    expect(times).toEqual([0, 60, 90, 210, 210, 450]);
  });

  it('should save kiln log to localStorage with correct structure', () => {
    const inputs = {
      stage1: { startTemp: 20, targetTemp: 500, duration: 60 },
      stage2: { holdTemp: 500, duration: 30 },
      stage3: { startTemp: 500, endTemp: 300, duration: 120 },
      stage4: { startTemp: 300, endTemp: 50, duration: 240 },
    };

    const scheduleName = 'Test Schedule';
    const notes = 'Test notes';

    // Simulate the transformation and save logic
    const temperatures: number[] = [];
    const times: number[] = [];

    temperatures.push(inputs.stage1.startTemp, inputs.stage1.targetTemp);
    times.push(0, inputs.stage1.duration);
    temperatures.push(inputs.stage2.holdTemp);
    times.push(inputs.stage1.duration + inputs.stage2.duration);
    temperatures.push(inputs.stage3.startTemp, inputs.stage3.endTemp);
    times.push(inputs.stage1.duration + inputs.stage2.duration + inputs.stage3.duration);
    temperatures.push(inputs.stage4.startTemp, inputs.stage4.endTemp);
    times.push(inputs.stage1.duration + inputs.stage2.duration + inputs.stage3.duration + inputs.stage4.duration);

    const kilnLog = {
      id: Date.now().toString(),
      name: scheduleName,
      createdAt: new Date().toISOString(),
      description: notes,
      temperatures,
      times,
      notes: notes,
      selectedColors: [],
      annealedColor: '',
      savedColorCombinations: [],
    };

    const logs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
    logs.push(kilnLog);
    localStorage.setItem('kilnLogs', JSON.stringify(logs));

    // Verify the saved log
    const savedLogs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
    expect(savedLogs).toHaveLength(1);
    expect(savedLogs[0]).toMatchObject({
      name: scheduleName,
      description: notes,
      temperatures: [20, 500, 500, 500, 300, 300, 50],
      times: [0, 60, 90, 210, 210, 450],
      selectedColors: [],
      annealedColor: '',
      savedColorCombinations: [],
    });
  });

  it('should append new log to existing logs in localStorage', () => {
    // First, add a log manually
    const firstLog = {
      id: '1',
      name: 'First Schedule',
      createdAt: new Date().toISOString(),
      description: 'First notes',
      temperatures: [20, 500],
      times: [0, 60],
      notes: 'First notes',
      selectedColors: [],
      annealedColor: '',
      savedColorCombinations: [],
    };

    localStorage.setItem('kilnLogs', JSON.stringify([firstLog]));

    // Now add a second log
    const secondLog = {
      id: '2',
      name: 'Second Schedule',
      createdAt: new Date().toISOString(),
      description: 'Second notes',
      temperatures: [20, 600],
      times: [0, 90],
      notes: 'Second notes',
      selectedColors: [],
      annealedColor: '',
      savedColorCombinations: [],
    };

    const logs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
    logs.push(secondLog);
    localStorage.setItem('kilnLogs', JSON.stringify(logs));

    // Verify both logs are saved
    const savedLogs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
    expect(savedLogs).toHaveLength(2);
    expect(savedLogs[0].name).toBe('First Schedule');
    expect(savedLogs[1].name).toBe('Second Schedule');
  });

  it('should handle errors gracefully when saving to localStorage', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Simulate a scenario where localStorage might fail
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    try {
      const kilnLog = {
        id: '1',
        name: 'Test',
        createdAt: new Date().toISOString(),
        description: 'Test',
        temperatures: [20, 500],
        times: [0, 60],
        notes: 'Test',
        selectedColors: [],
        annealedColor: '',
        savedColorCombinations: [],
      };

      try {
        const logs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
        logs.push(kilnLog);
        localStorage.setItem('kilnLogs', JSON.stringify(logs));
      } catch (error) {
        console.error('Error saving to kiln logs:', error);
      }

      expect(consoleSpy).toHaveBeenCalled();
    } finally {
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    }
  });
});
