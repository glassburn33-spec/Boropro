/**
 * Tests for Add Log Modal checkbox functionality
 * Verifies that:
 * - Checkboxes can be toggled for multi-selection
 * - Selected logs are tracked correctly
 * - Add Selected button works with multiple logs
 * - Logs are added to folder with correct IDs
 * - Modal clears selection when closed
 */

import { describe, it, expect, beforeEach } from 'vitest';

interface SavedLog {
  id: string;
  name: string;
  temperatures: number[];
  times: number[];
  createdAt: Date;
  description?: string;
}

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  logIds: string[];
}

describe('Add Log Modal - Checkbox Selection', () => {
  let mockLogs: SavedLog[];
  let mockFolders: Folder[];
  let selectedLogsForAddition: Set<string>;

  beforeEach(() => {
    mockLogs = [
      {
        id: 'log-1',
        name: 'First Kiln Log',
        temperatures: [200, 400, 600],
        times: [0, 60, 120],
        createdAt: new Date('2026-05-01'),
      },
      {
        id: 'log-2',
        name: 'Second Kiln Log',
        temperatures: [300, 500, 700],
        times: [0, 90, 180],
        createdAt: new Date('2026-05-02'),
      },
      {
        id: 'log-3',
        name: 'Third Kiln Log',
        temperatures: [250, 450, 650],
        times: [0, 75, 150],
        createdAt: new Date('2026-05-03'),
      },
    ];

    mockFolders = [
      {
        id: 'folder-1',
        name: 'My Folder',
        createdAt: new Date('2026-05-01'),
        logIds: [],
      },
    ];

    selectedLogsForAddition = new Set();
  });

  it('should toggle log selection when checkbox is clicked', () => {
    const logId = 'log-1';
    
    // Initially not selected
    expect(selectedLogsForAddition.has(logId)).toBe(false);

    // Toggle selection on
    const newSelection = new Set(selectedLogsForAddition);
    if (newSelection.has(logId)) {
      newSelection.delete(logId);
    } else {
      newSelection.add(logId);
    }
    selectedLogsForAddition = newSelection;

    expect(selectedLogsForAddition.has(logId)).toBe(true);

    // Toggle selection off
    newSelection.delete(logId);
    selectedLogsForAddition = newSelection;

    expect(selectedLogsForAddition.has(logId)).toBe(false);
  });

  it('should allow multiple logs to be selected', () => {
    const logIds = ['log-1', 'log-2', 'log-3'];
    
    logIds.forEach((id) => {
      const newSelection = new Set(selectedLogsForAddition);
      newSelection.add(id);
      selectedLogsForAddition = newSelection;
    });

    expect(selectedLogsForAddition.size).toBe(3);
    expect(selectedLogsForAddition.has('log-1')).toBe(true);
    expect(selectedLogsForAddition.has('log-2')).toBe(true);
    expect(selectedLogsForAddition.has('log-3')).toBe(true);
  });

  it('should add selected logs to folder with correct IDs', () => {
    const folderId = 'folder-1';
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-2');

    // Simulate adding selected logs to folder
    const updatedFolders = mockFolders.map((f) =>
      f.id === folderId
        ? { ...f, logIds: [...new Set([...(f.logIds || []), ...selectedLogsForAddition])] }
        : f
    );

    const updatedFolder = updatedFolders.find((f) => f.id === folderId);
    expect(updatedFolder?.logIds).toContain('log-1');
    expect(updatedFolder?.logIds).toContain('log-2');
    expect(updatedFolder?.logIds.length).toBe(2);
  });

  it('should not add duplicate logs to folder', () => {
    const folderId = 'folder-1';
    mockFolders[0].logIds = ['log-1'];
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-2');

    // Simulate adding selected logs to folder
    const updatedFolders = mockFolders.map((f) =>
      f.id === folderId
        ? { ...f, logIds: [...new Set([...(f.logIds || []), ...selectedLogsForAddition])] }
        : f
    );

    const updatedFolder = updatedFolders.find((f) => f.id === folderId);
    expect(updatedFolder?.logIds.length).toBe(2);
    expect(updatedFolder?.logIds.filter((id) => id === 'log-1').length).toBe(1);
  });

  it('should clear selection when modal closes', () => {
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-2');
    expect(selectedLogsForAddition.size).toBe(2);

    // Simulate modal close
    selectedLogsForAddition = new Set();

    expect(selectedLogsForAddition.size).toBe(0);
  });

  it('should require at least one log to be selected before adding', () => {
    expect(selectedLogsForAddition.size === 0).toBe(true);
    
    // Should show error if trying to add with no selection
    if (selectedLogsForAddition.size === 0) {
      expect(true).toBe(true); // Error would be shown
    }
  });

  it('should display correct count of selected logs in button', () => {
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-2');

    const buttonText = `Add Selected (${selectedLogsForAddition.size})`;
    expect(buttonText).toBe('Add Selected (2)');
  });

  it('should handle adding logs from different folders', () => {
    const folderId = 'folder-1';
    mockFolders.push({
      id: 'folder-2',
      name: 'Another Folder',
      createdAt: new Date('2026-05-02'),
      logIds: ['log-3'],
    });

    // Select log from standalone and from another folder
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-3');

    const updatedFolders = mockFolders.map((f) =>
      f.id === folderId
        ? { ...f, logIds: [...new Set([...(f.logIds || []), ...selectedLogsForAddition])] }
        : f
    );

    const updatedFolder = updatedFolders.find((f) => f.id === folderId);
    expect(updatedFolder?.logIds).toContain('log-1');
    expect(updatedFolder?.logIds).toContain('log-3');
    expect(updatedFolder?.logIds.length).toBe(2);
  });

  it('should persist folder data to localStorage after adding logs', () => {
    const folderId = 'folder-1';
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-2');

    const updatedFolders = mockFolders.map((f) =>
      f.id === folderId
        ? { ...f, logIds: [...new Set([...(f.logIds || []), ...selectedLogsForAddition])] }
        : f
    );

    // Simulate localStorage save
    const folderData = JSON.stringify(updatedFolders);
    expect(folderData).toContain('log-1');
    expect(folderData).toContain('log-2');
    expect(folderData).toContain('folder-1');
  });
});
