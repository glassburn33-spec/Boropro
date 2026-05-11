/**
 * localStorage utilities for managing kiln logs and schedules
 */

export interface KilnLog {
  id: string;
  filename: string;
  temperatures: number[];
  times: number[];
  savedAt: number;
  notes?: string;
  results?: string;
  color?: string;
}

const LOGS_KEY = 'kilnLogs';
const FOLDERS_KEY = 'kilnFolders';
const SCHEDULES_IN_FOLDERS_KEY = 'schedulesInFolders';

// Logs Management
export const logsStorage = {
  getAll: (): KilnLog[] => {
    try {
      const data = localStorage.getItem(LOGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading logs from localStorage:', error);
      return [];
    }
  },

  save: (log: KilnLog): void => {
    try {
      const logs = logsStorage.getAll();
      const existingIndex = logs.findIndex(l => l.id === log.id);
      if (existingIndex >= 0) {
        logs[existingIndex] = log;
      } else {
        logs.push(log);
      }
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      notifyLogsUpdated();
    } catch (error) {
      console.error('Error saving log to localStorage:', error);
    }
  },

  delete: (id: string): void => {
    try {
      const logs = logsStorage.getAll();
      const filtered = logs.filter(l => l.id !== id);
      localStorage.setItem(LOGS_KEY, JSON.stringify(filtered));
      notifyLogsUpdated();
    } catch (error) {
      console.error('Error deleting log from localStorage:', error);
    }
  },

  getById: (id: string): KilnLog | null => {
    const logs = logsStorage.getAll();
    return logs.find(l => l.id === id) || null;
  },
};

// Folders Management
export const foldersStorage = {
  getAll: (): string[] => {
    try {
      const data = localStorage.getItem(FOLDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading folders from localStorage:', error);
      return [];
    }
  },

  create: (folderName: string): void => {
    try {
      const folders = foldersStorage.getAll();
      if (!folders.includes(folderName)) {
        folders.push(folderName);
        localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  },

  delete: (folderName: string): void => {
    try {
      const folders = foldersStorage.getAll();
      const filtered = folders.filter(f => f !== folderName);
      localStorage.setItem(FOLDERS_KEY, JSON.stringify(filtered));
      
      // Also remove schedules in this folder
      const schedulesInFolders = schedulesStorage.getAll();
      delete schedulesInFolders[folderName];
      localStorage.setItem(SCHEDULES_IN_FOLDERS_KEY, JSON.stringify(schedulesInFolders));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  },
};

// Schedules in Folders Management
export const schedulesStorage = {
  getAll: (): Record<string, string[]> => {
    try {
      const data = localStorage.getItem(SCHEDULES_IN_FOLDERS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading schedules from localStorage:', error);
      return {};
    }
  },

  addToFolder: (folderName: string, logId: string): void => {
    try {
      const schedules = schedulesStorage.getAll();
      if (!schedules[folderName]) {
        schedules[folderName] = [];
      }
      if (!schedules[folderName].includes(logId)) {
        schedules[folderName].push(logId);
      }
      localStorage.setItem(SCHEDULES_IN_FOLDERS_KEY, JSON.stringify(schedules));
    } catch (error) {
      console.error('Error adding schedule to folder:', error);
    }
  },

  removeFromFolder: (folderName: string, logId: string): void => {
    try {
      const schedules = schedulesStorage.getAll();
      if (schedules[folderName]) {
        schedules[folderName] = schedules[folderName].filter(id => id !== logId);
      }
      localStorage.setItem(SCHEDULES_IN_FOLDERS_KEY, JSON.stringify(schedules));
    } catch (error) {
      console.error('Error removing schedule from folder:', error);
    }
  },

  getSchedulesInFolder: (folderName: string): string[] => {
    const schedules = schedulesStorage.getAll();
    return schedules[folderName] || [];
  },
};

// Notify listeners of updates
function notifyLogsUpdated(): void {
  const event = new CustomEvent('logsUpdated', {
    detail: logsStorage.getAll(),
  });
  window.dispatchEvent(event);
}

// Export notification function for external use
export const notifyUpdate = notifyLogsUpdated;
