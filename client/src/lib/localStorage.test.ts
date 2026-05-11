import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { logsStorage, foldersStorage, schedulesStorage, type KilnLog } from './localStorage';

describe('localStorage utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('logsStorage', () => {
    it('should save and retrieve logs', () => {
      const log: KilnLog = {
        id: '1',
        filename: 'test.pdf',
        temperatures: [100, 200, 300],
        times: [0, 1, 2],
        savedAt: Date.now(),
        notes: 'Test log',
        results: 'Good',
        color: '#dc2626',
      };

      logsStorage.save(log);
      const retrieved = logsStorage.getById('1');

      expect(retrieved).toEqual(log);
    });

    it('should get all logs', () => {
      const log1: KilnLog = {
        id: '1',
        filename: 'test1.pdf',
        temperatures: [100],
        times: [0],
        savedAt: Date.now(),
      };

      const log2: KilnLog = {
        id: '2',
        filename: 'test2.pdf',
        temperatures: [200],
        times: [1],
        savedAt: Date.now(),
      };

      logsStorage.save(log1);
      logsStorage.save(log2);

      const all = logsStorage.getAll();
      expect(all).toHaveLength(2);
      expect(all[0].id).toBe('1');
      expect(all[1].id).toBe('2');
    });

    it('should delete logs', () => {
      const log: KilnLog = {
        id: '1',
        filename: 'test.pdf',
        temperatures: [100],
        times: [0],
        savedAt: Date.now(),
      };

      logsStorage.save(log);
      expect(logsStorage.getAll()).toHaveLength(1);

      logsStorage.delete('1');
      expect(logsStorage.getAll()).toHaveLength(0);
    });

    it('should update existing logs', () => {
      const log: KilnLog = {
        id: '1',
        filename: 'test.pdf',
        temperatures: [100],
        times: [0],
        savedAt: Date.now(),
        notes: 'Original',
      };

      logsStorage.save(log);

      const updated: KilnLog = {
        ...log,
        notes: 'Updated',
      };

      logsStorage.save(updated);
      const retrieved = logsStorage.getById('1');

      expect(retrieved?.notes).toBe('Updated');
      expect(logsStorage.getAll()).toHaveLength(1);
    });
  });

  describe('foldersStorage', () => {
    it('should create and retrieve folders', () => {
      foldersStorage.create('Test Folder');
      const folders = foldersStorage.getAll();

      expect(folders).toContain('Test Folder');
    });

    it('should not create duplicate folders', () => {
      foldersStorage.create('Test Folder');
      foldersStorage.create('Test Folder');

      const folders = foldersStorage.getAll();
      expect(folders.filter(f => f === 'Test Folder')).toHaveLength(1);
    });

    it('should delete folders', () => {
      foldersStorage.create('Test Folder');
      expect(foldersStorage.getAll()).toContain('Test Folder');

      foldersStorage.delete('Test Folder');
      expect(foldersStorage.getAll()).not.toContain('Test Folder');
    });
  });

  describe('schedulesStorage', () => {
    it('should add schedules to folders', () => {
      schedulesStorage.addToFolder('Folder1', 'schedule1');
      const schedules = schedulesStorage.getSchedulesInFolder('Folder1');

      expect(schedules).toContain('schedule1');
    });

    it('should not add duplicate schedules', () => {
      schedulesStorage.addToFolder('Folder1', 'schedule1');
      schedulesStorage.addToFolder('Folder1', 'schedule1');

      const schedules = schedulesStorage.getSchedulesInFolder('Folder1');
      expect(schedules.filter(s => s === 'schedule1')).toHaveLength(1);
    });

    it('should remove schedules from folders', () => {
      schedulesStorage.addToFolder('Folder1', 'schedule1');
      expect(schedulesStorage.getSchedulesInFolder('Folder1')).toContain('schedule1');

      schedulesStorage.removeFromFolder('Folder1', 'schedule1');
      expect(schedulesStorage.getSchedulesInFolder('Folder1')).not.toContain('schedule1');
    });

    it('should get all schedules in folders', () => {
      schedulesStorage.addToFolder('Folder1', 'schedule1');
      schedulesStorage.addToFolder('Folder1', 'schedule2');
      schedulesStorage.addToFolder('Folder2', 'schedule3');

      const all = schedulesStorage.getAll();
      expect(all['Folder1']).toHaveLength(2);
      expect(all['Folder2']).toHaveLength(1);
    });
  });
});
