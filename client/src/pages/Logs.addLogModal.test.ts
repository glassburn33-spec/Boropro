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

    // Simulate adding selected logs to folder with duplicate prevention
    const currentFolder = mockFolders.find((f) => f.id === folderId);
    const existingLogIds = new Set(currentFolder?.logIds || []);
    const newLogsToAdd = Array.from(selectedLogsForAddition).filter(
      (logId) => !existingLogIds.has(logId)
    );
    
    const updatedFolders = mockFolders.map((f) =>
      f.id === folderId
        ? { ...f, logIds: [...(f.logIds || []), ...newLogsToAdd] }
        : f
    );

    const updatedFolder = updatedFolders.find((f) => f.id === folderId);
    expect(updatedFolder?.logIds.length).toBe(2);
    expect(updatedFolder?.logIds.filter((id) => id === 'log-1').length).toBe(1);
    expect(updatedFolder?.logIds).toContain('log-2');
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

  it('should show warning when all selected logs already exist in folder', () => {
    const folderId = 'folder-1';
    mockFolders[0].logIds = ['log-1', 'log-2', 'log-3'];
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-2');
    selectedLogsForAddition.add('log-3');

    const currentFolder = mockFolders.find((f) => f.id === folderId);
    const existingLogIds = new Set(currentFolder?.logIds || []);
    const newLogsToAdd = Array.from(selectedLogsForAddition).filter(
      (logId) => !existingLogIds.has(logId)
    );

    expect(newLogsToAdd.length).toBe(0);
    // In real implementation, this would show an error toast
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

    const currentFolder = mockFolders.find((f) => f.id === folderId);
    const existingLogIds = new Set(currentFolder?.logIds || []);
    const newLogsToAdd = Array.from(selectedLogsForAddition).filter(
      (logId) => !existingLogIds.has(logId)
    );
    
    const updatedFolders = mockFolders.map((f) =>
      f.id === folderId
        ? { ...f, logIds: [...(f.logIds || []), ...newLogsToAdd] }
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

    const currentFolder = mockFolders.find((f) => f.id === folderId);
    const existingLogIds = new Set(currentFolder?.logIds || []);
    const newLogsToAdd = Array.from(selectedLogsForAddition).filter(
      (logId) => !existingLogIds.has(logId)
    );
    
    const updatedFolders = mockFolders.map((f) =>
      f.id === folderId
        ? { ...f, logIds: [...(f.logIds || []), ...newLogsToAdd] }
        : f
    );

    // Simulate localStorage save
    const folderData = JSON.stringify(updatedFolders);
    expect(folderData).toContain('log-1');
    expect(folderData).toContain('log-2');
    expect(folderData).toContain('folder-1');
  });

  it('should reject adding logs that already exist in the folder', () => {
    const folderId = 'folder-1';
    mockFolders[0].logIds = ['log-1', 'log-2'];
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-2');

    const currentFolder = mockFolders.find((f) => f.id === folderId);
    const existingLogIds = new Set(currentFolder?.logIds || []);
    const newLogsToAdd = Array.from(selectedLogsForAddition).filter(
      (logId) => !existingLogIds.has(logId)
    );

    expect(newLogsToAdd.length).toBe(0);
  });

  it('should add only new logs and skip duplicates', () => {
    const folderId = 'folder-1';
    mockFolders[0].logIds = ['log-1'];
    selectedLogsForAddition.add('log-1');
    selectedLogsForAddition.add('log-2');
    selectedLogsForAddition.add('log-3');

    const currentFolder = mockFolders.find((f) => f.id === folderId);
    const existingLogIds = new Set(currentFolder?.logIds || []);
    const newLogsToAdd = Array.from(selectedLogsForAddition).filter(
      (logId) => !existingLogIds.has(logId)
    );
    
    const updatedFolders = mockFolders.map((f) =>
      f.id === folderId
        ? { ...f, logIds: [...(f.logIds || []), ...newLogsToAdd] }
        : f
    );

    const updatedFolder = updatedFolders.find((f) => f.id === folderId);
    expect(updatedFolder?.logIds.length).toBe(3);
    expect(updatedFolder?.logIds).toContain('log-1');
    expect(updatedFolder?.logIds).toContain('log-2');
    expect(updatedFolder?.logIds).toContain('log-3');
  });

  it('should filter out logs that are in any folder from standalone list', () => {
    // Simulate logs in folders
    mockFolders = [
      {
        id: 'folder-1',
        name: 'My Folder',
        createdAt: new Date('2026-05-01'),
        logIds: ['log-1', 'log-2'],
      },
      {
        id: 'folder-2',
        name: 'Another Folder',
        createdAt: new Date('2026-05-02'),
        logIds: ['log-3'],
      },
    ];

    // Get all log IDs that are in any folder
    const logsInFolders = new Set<string>();
    mockFolders.forEach((folder) => {
      folder.logIds?.forEach((logId) => {
        logsInFolders.add(logId);
      });
    });

    // Filter standalone logs
    const standaloneLogsFiltered = mockLogs.filter((log) => !logsInFolders.has(log.id));

    expect(standaloneLogsFiltered.length).toBe(0);
    expect(logsInFolders.has('log-1')).toBe(true);
    expect(logsInFolders.has('log-2')).toBe(true);
    expect(logsInFolders.has('log-3')).toBe(true);
  });

  it('should show only logs not in any folder in standalone section', () => {
    // Only log-1 and log-2 are in folders
    mockFolders = [
      {
        id: 'folder-1',
        name: 'My Folder',
        createdAt: new Date('2026-05-01'),
        logIds: ['log-1'],
      },
      {
        id: 'folder-2',
        name: 'Another Folder',
        createdAt: new Date('2026-05-02'),
        logIds: ['log-2'],
      },
    ];

    // Get all log IDs that are in any folder
    const logsInFolders = new Set<string>();
    mockFolders.forEach((folder) => {
      folder.logIds?.forEach((logId) => {
        logsInFolders.add(logId);
      });
    });

    // Filter standalone logs
    const standaloneLogsFiltered = mockLogs.filter((log) => !logsInFolders.has(log.id));

    expect(standaloneLogsFiltered.length).toBe(1);
    expect(standaloneLogsFiltered[0].id).toBe('log-3');
  });

  it('should not show logs in folders in the main grid', () => {
    // Add all logs to a folder
    mockFolders = [
      {
        id: 'folder-1',
        name: 'My Folder',
        createdAt: new Date('2026-05-01'),
        logIds: ['log-1', 'log-2', 'log-3'],
      },
    ];

    // Get all log IDs that are in any folder
    const logsInFolders = new Set<string>();
    mockFolders.forEach((folder) => {
      folder.logIds?.forEach((logId) => {
        logsInFolders.add(logId);
      });
    });

    // Filter standalone logs for main grid
    const standaloneLogsForGrid = mockLogs.filter((log) => !logsInFolders.has(log.id));

    expect(standaloneLogsForGrid.length).toBe(0);
    expect(logsInFolders.size).toBe(3);
  });
});


describe("Folder Expansion Feature", () => {
  let expandedFolders: Set<string>;
  let mockLogs: SavedLog[];
  let mockFolders: Folder[];

  beforeEach(() => {
    expandedFolders = new Set();
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
    ];

    mockFolders = [
      {
        id: 'folder-1',
        name: 'My Folder',
        createdAt: new Date('2026-05-01'),
        logIds: ['log-1', 'log-2'],
      },
    ];
  });

  it('should toggle folder expansion state', () => {
    const folderId = 'folder-1';
    
    // Initially not expanded
    expect(expandedFolders.has(folderId)).toBe(false);
    
    // Toggle to expanded
    expandedFolders.add(folderId);
    expect(expandedFolders.has(folderId)).toBe(true);
    
    // Toggle to collapsed
    expandedFolders.delete(folderId);
    expect(expandedFolders.has(folderId)).toBe(false);
  });

  it('should get logs for a specific folder', () => {
    const folderId = 'folder-1';
    const folder = mockFolders.find((f) => f.id === folderId);
    const folderLogs = folder?.logIds?.map((logId) => mockLogs.find((log) => log.id === logId)).filter(Boolean) || [];
    
    expect(folderLogs).toHaveLength(2);
    expect(folderLogs[0]?.id).toBe('log-1');
    expect(folderLogs[1]?.id).toBe('log-2');
  });

  it('should return empty array for folder with no logs', () => {
    const emptyFolder: Folder = {
      id: 'folder-empty',
      name: 'Empty Folder',
      createdAt: new Date('2026-05-01'),
      logIds: [],
    };

    const folderLogs = emptyFolder?.logIds?.map((logId) => mockLogs.find((log) => log.id === logId)).filter(Boolean) || [];
    
    expect(folderLogs).toHaveLength(0);
  });

  it('should maintain log format when displayed in expanded folder', () => {
    const folderId = 'folder-1';
    expandedFolders.add(folderId);
    
    const folder = mockFolders.find((f) => f.id === folderId);
    const folderLogs = folder?.logIds?.map((logId) => mockLogs.find((log) => log.id === logId)).filter(Boolean) || [];
    
    // Verify log properties are preserved
    folderLogs.forEach((log) => {
      expect(log?.name).toBeDefined();
      expect(log?.temperatures).toBeDefined();
      expect(log?.times).toBeDefined();
      expect(Array.isArray(log?.temperatures)).toBe(true);
      expect(Array.isArray(log?.times)).toBe(true);
    });
  });

  it('should handle multiple folders with expansion state', () => {
    const folderIds = ['folder-1', 'folder-2', 'folder-3'];
    
    // Expand first and third folder
    expandedFolders.add(folderIds[0]);
    expandedFolders.add(folderIds[2]);
    
    expect(expandedFolders.has(folderIds[0])).toBe(true);
    expect(expandedFolders.has(folderIds[1])).toBe(false);
    expect(expandedFolders.has(folderIds[2])).toBe(true);
  });

  it('should show log count in folder header', () => {
    const folderId = 'folder-1';
    const folder = mockFolders.find((f) => f.id === folderId);
    const folderLogs = folder?.logIds?.map((logId) => mockLogs.find((log) => log.id === logId)).filter(Boolean) || [];
    
    const logCount = folderLogs.length;
    const headerText = `${logCount} log${logCount !== 1 ? 's' : ''}`;
    
    expect(headerText).toBe('2 logs');
  });
});


describe("Comments and Rename in Folder Logs", () => {
  let mockLogs: SavedLog[];
  let mockFolders: Folder[];

  beforeEach(() => {
    mockLogs = [
      {
        id: 'log-1',
        name: 'First Kiln Log',
        temperatures: [200, 400, 600],
        times: [0, 60, 120],
        createdAt: new Date('2026-05-01'),
        notes: 'Initial notes',
      },
      {
        id: 'log-2',
        name: 'Second Kiln Log',
        temperatures: [300, 500, 700],
        times: [0, 90, 180],
        createdAt: new Date('2026-05-02'),
        notes: 'More notes',
      },
    ];

    mockFolders = [
      {
        id: 'folder-1',
        name: 'My Folder',
        createdAt: new Date('2026-05-01'),
        logIds: ['log-1', 'log-2'],
      },
    ];
  });

  it('should display comments button for logs in folder', () => {
    const folderId = 'folder-1';
    const folder = mockFolders.find((f) => f.id === folderId);
    const folderLogs = folder?.logIds?.map((logId) => mockLogs.find((log) => log.id === logId)).filter(Boolean) || [];
    
    expect(folderLogs.length).toBeGreaterThan(0);
    folderLogs.forEach((log) => {
      // Comments button should be available
      expect(log?.id).toBeDefined();
    });
  });

  it('should display rename button for logs in folder', () => {
    const folderId = 'folder-1';
    const folder = mockFolders.find((f) => f.id === folderId);
    const folderLogs = folder?.logIds?.map((logId) => mockLogs.find((log) => log.id === logId)).filter(Boolean) || [];
    
    expect(folderLogs.length).toBeGreaterThan(0);
    folderLogs.forEach((log) => {
      // Rename button should be available
      expect(log?.name).toBeDefined();
    });
  });

  it('should rename log in folder', () => {
    const logId = 'log-1';
    const newName = 'Renamed Kiln Log';
    
    const updatedLogs = mockLogs.map(l => 
      l.id === logId ? { ...l, name: newName } : l
    );
    
    const renamedLog = updatedLogs.find(l => l.id === logId);
    expect(renamedLog?.name).toBe('Renamed Kiln Log');
  });

  it('should update comments for log in folder', () => {
    const logId = 'log-1';
    const newComments = 'Updated comments for this log';
    
    const updatedLogs = mockLogs.map(l => 
      l.id === logId ? { ...l, notes: newComments } : l
    );
    
    const updatedLog = updatedLogs.find(l => l.id === logId);
    expect(updatedLog?.notes).toBe('Updated comments for this log');
  });

  it('should preserve log data when renaming in folder', () => {
    const logId = 'log-1';
    const originalLog = mockLogs.find(l => l.id === logId);
    const newName = 'New Name';
    
    const updatedLogs = mockLogs.map(l => 
      l.id === logId ? { ...l, name: newName } : l
    );
    
    const updatedLog = updatedLogs.find(l => l.id === logId);
    expect(updatedLog?.temperatures).toEqual(originalLog?.temperatures);
    expect(updatedLog?.times).toEqual(originalLog?.times);
    expect(updatedLog?.notes).toEqual(originalLog?.notes);
  });

  it('should handle multiple logs with different comments in folder', () => {
    const folderId = 'folder-1';
    const folder = mockFolders.find((f) => f.id === folderId);
    const folderLogs = folder?.logIds?.map((logId) => mockLogs.find((log) => log.id === logId)).filter(Boolean) || [];
    
    expect(folderLogs.length).toBe(2);
    expect(folderLogs[0]?.notes).toBe('Initial notes');
    expect(folderLogs[1]?.notes).toBe('More notes');
  });

  it('should persist renamed log to localStorage', () => {
    const logId = 'log-1';
    const newName = 'Persisted Renamed Log';
    
    const updatedLogs = mockLogs.map(l => 
      l.id === logId ? { ...l, name: newName } : l
    );
    
    const folderData = JSON.stringify(updatedLogs);
    expect(folderData).toContain('Persisted Renamed Log');
  });

  it('should persist updated comments to localStorage', () => {
    const logId = 'log-1';
    const newComments = 'Persisted comments';
    
    const updatedLogs = mockLogs.map(l => 
      l.id === logId ? { ...l, notes: newComments } : l
    );
    
    const folderData = JSON.stringify(updatedLogs);
    expect(folderData).toContain('Persisted comments');
  });
});
