/*
Save Schedule Modal - Appears after creating a new Kiln Log
Offers two options: Export to Computer or Add to PDF Library
*/

import { Download, Save, X } from "lucide-react";
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
      };

      const doc = generateKilnLogPDF(pdfData);

      // Create blob and download
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${kilnLog.name}_kiln_log.pdf`;
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
      };

      const doc = generateKilnLogPDF(pdfData);
      const base64 = pdfToBase64(doc);
      const filename = `${kilnLog.name}_kiln_log.pdf`;

      // Call the parent handler to save to library
      await onAddToLibrary(base64, filename);

      toast.success("Schedule added to PDF Library!");
      onClose();
    } catch (error) {
      console.error("Failed to add to library:", error);
      toast.error("Failed to add to PDF Library");
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

          <Button
            onClick={handleExportToComputer}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-mono text-sm font-bold uppercase flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Export to Computer
          </Button>

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
