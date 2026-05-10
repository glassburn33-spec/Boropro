/**
 * Schedule Metadata Types
 * Defines the JSON metadata schema for kiln schedules
 */

export interface ScheduleMetadata {
  name: string;
  description?: string;
  temperatures: number[];
  times: number[];
  startTime: string; // ISO string
  endTime?: string; // ISO string
  notes?: string;
  results?: string;
  color?: string;
  annealingPoint: number;
  strainPoint: number;
  createdAt: string; // ISO string
}

export interface ScheduleFile {
  id: number;
  filename: string;
  storageKey: string;
  uploadedAt: Date;
  isJSON: boolean; // true for JSON metadata, false for PDF
  metadata?: ScheduleMetadata; // Populated when loading JSON files
}
