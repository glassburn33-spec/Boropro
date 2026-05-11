/*
Save Schedule Modal - Appears after creating a new Kiln Log
Offers two options: Export to Computer or Add to PDF Library
*/

import { Download, Save, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateKilnLogPDF, pdfToBase64 } from "@/lib/pdfUtils";
import type { KilnLogPDFData } from "@/lib/pdfUtils";
import { toast } from "sonner";

interface SaveScheduleModalProps {
  isOpen: boolean;
  kilnLog: {
    id: number;
    name: string;
    description?: string;
    temperatures: number[];
    times: number[];
    startTime: Date;
    endTime?: Date;
    notes?: string;
    lineColor?: string;
  };
  onClose: () => void;
  onAddToLibrary: (base64: string, filename: string) => Promise<void>;
  isAddingToLibrary?: boolean;
}

export function SaveScheduleModal({
  isOpen,
  kilnLog,
  onClose,
  onAddToLibrary,
  isAddingToLibrary = false,
}: SaveScheduleModalProps) {
  if (!isOpen) return null;

  const handleExportToComputer = () => {
    try {
      // Generate PDF
      const pdfData: KilnLogPDFData = {
        name: kilnLog.name,
        description: kilnLog.description,
        temperatures: kilnLog.temperatures,
        times: kilnLog.times,
        startTime: kilnLog.startTime,
        endTime: kilnLog.endTime,
        notes: kilnLog.notes,
        lineColor: kilnLog.lineColor,
      };

      const doc = generateKilnLogPDF(pdfData);

      // Create blob and download
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${kilnLog.name}_klog.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF exported to computer!");
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export PDF");
    }
  };

  const handleAddToLibrary = async () => {
    try {
      // Generate PDF
      const pdfData: KilnLogPDFData = {
        name: kilnLog.name,
        description: kilnLog.description,
        temperatures: kilnLog.temperatures,
        times: kilnLog.times,
        startTime: kilnLog.startTime,
        endTime: kilnLog.endTime,
        notes: kilnLog.notes,
        lineColor: kilnLog.lineColor,
      };

      const doc = generateKilnLogPDF(pdfData);
      const base64 = pdfToBase64(doc);
      const filename = `${kilnLog.name}_klog.pdf`;

      // Call the parent handler to save to library
      await onAddToLibrary(base64, filename);

      toast.success("Schedule added to PDF Library!");
      onClose();
    } catch (error) {
      console.error("Failed to add to library:", error);
      toast.error("Failed to add to PDF Library");
    }
  };

  const handleSaveToLogs = () => {
    try {
      // Create JSON data structure for logs
      const logData = {
        id: Date.now(),
        filename: kilnLog.name,
        name: kilnLog.name,
        description: kilnLog.description,
        temperatures: kilnLog.temperatures,
        times: kilnLog.times,
        startTime: kilnLog.startTime.toISOString(),
        endTime: kilnLog.endTime?.toISOString() || null,
        notes: kilnLog.notes,
        savedAt: new Date().toISOString(),
      };

      // Get existing logs from localStorage
      const existingLogs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
      
      // Add new log
      existingLogs.push(logData);
      
      // Save back to localStorage
      localStorage.setItem('kilnLogs', JSON.stringify(existingLogs));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('logsUpdated', { detail: existingLogs }));

      toast.success("Log saved successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to save log:", error);
      toast.error("Failed to save log");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-amber-400">Schedule Saved</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-300 transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-stone-300 text-sm mb-2">
            <span className="font-semibold">{kilnLog.name}</span>
          </p>
          {kilnLog.description && (
            <p className="text-stone-400 text-xs">{kilnLog.description}</p>
          )}
          <div className="mt-3 pt-3 border-t border-stone-700 text-xs text-stone-400">
            <div>
              Temperature points: <span className="text-amber-300">{kilnLog.temperatures.length}</span>
            </div>
            <div>
              Total duration: <span className="text-amber-300">{kilnLog.times[kilnLog.times.length - 1] || 0} hours</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleAddToLibrary}
            disabled={isAddingToLibrary}
            className="w-full bg-green-700 hover:bg-green-600 disabled:bg-stone-600 text-white font-mono text-sm font-bold uppercase flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {isAddingToLibrary ? "Adding to Library..." : "Add to PDF Library"}
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleExportToComputer}
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-mono text-sm font-bold uppercase flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export
            </Button>

            <Button
              onClick={handleSaveToLogs}
              className="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-mono text-sm font-bold uppercase flex items-center justify-center gap-2"
            >
              <BookOpen size={16} />
              Logs
            </Button>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full text-stone-300 border-stone-600 hover:bg-stone-800"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
