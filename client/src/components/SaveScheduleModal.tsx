/*
Save Schedule Modal - Appears after creating a new Kiln Log
Offers two options: Export to Computer or Add to PDF Library
*/

import { Download, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateKilnLogPDF, pdfToBase64 } from "@/lib/pdfUtils";
import type { KilnLogPDFData } from "@/lib/pdfUtils";
import { toast } from "sonner";

// Helper function to generate temperature plot SVG
function generateTemperaturePlotSVG(
  temperatures: number[],
  times: number[],
  scheduleName: string,
  refLines: { annealingPoint: number; strainPoint: number }
): SVGSVGElement {
  const width = 1000;
  const height = 600;
  const margin = { top: 80, right: 80, bottom: 120, left: 70 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const plotData = temperatures.map((temp, idx) => ({
    time: times[idx] || 0,
    temp: temp,
  }));

  if (plotData.length === 0) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('style', 'background-color: #1c1917;');
    return svg;
  }

  const maxTemp = Math.max(...temperatures) + 50;
  const maxTime = Math.max(...times);

  const scaleX = (time: number) => (time / maxTime) * plotWidth;
  const scaleY = (temp: number) => plotHeight - (temp / maxTemp) * plotHeight;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('style', 'background-color: #1c1917;');

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', width.toString());
  bg.setAttribute('height', height.toString());
  bg.setAttribute('fill', '#1c1917');
  svg.appendChild(bg);

  // Gridlines
  for (let temp = 0; temp <= Math.ceil(maxTemp / 100) * 100; temp += 100) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', margin.left.toString());
    line.setAttribute('y1', (margin.top + scaleY(temp)).toString());
    line.setAttribute('x2', (margin.left + plotWidth).toString());
    line.setAttribute('y2', (margin.top + scaleY(temp)).toString());
    line.setAttribute('stroke', '#404040');
    line.setAttribute('stroke-dasharray', '4');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  }

  // Reference lines
  const annealingLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  annealingLine.setAttribute('x1', margin.left.toString());
  annealingLine.setAttribute('y1', (margin.top + scaleY(refLines.annealingPoint)).toString());
  annealingLine.setAttribute('x2', (margin.left + plotWidth).toString());
  annealingLine.setAttribute('y2', (margin.top + scaleY(refLines.annealingPoint)).toString());
  annealingLine.setAttribute('stroke', '#60a5fa');
  annealingLine.setAttribute('stroke-dasharray', '4');
  annealingLine.setAttribute('stroke-width', '2');
  svg.appendChild(annealingLine);

  const strainLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  strainLine.setAttribute('x1', margin.left.toString());
  strainLine.setAttribute('y1', (margin.top + scaleY(refLines.strainPoint)).toString());
  strainLine.setAttribute('x2', (margin.left + plotWidth).toString());
  strainLine.setAttribute('y2', (margin.top + scaleY(refLines.strainPoint)).toString());
  strainLine.setAttribute('stroke', '#60a5fa');
  strainLine.setAttribute('stroke-dasharray', '4');
  strainLine.setAttribute('stroke-width', '2');
  svg.appendChild(strainLine);

  // Temperature curve
  let pathD = `M ${margin.left + scaleX(plotData[0].time)} ${margin.top + scaleY(plotData[0].temp)}`;
  for (let i = 1; i < plotData.length; i++) {
    pathD += ` L ${margin.left + scaleX(plotData[i].time)} ${margin.top + scaleY(plotData[i].temp)}`;
  }

  const curve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  curve.setAttribute('d', pathD);
  curve.setAttribute('stroke', '#fbbf24');
  curve.setAttribute('stroke-width', '3');
  curve.setAttribute('fill', 'none');
  svg.appendChild(curve);

  // Axes
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', margin.left.toString());
  xAxis.setAttribute('y1', (margin.top + plotHeight).toString());
  xAxis.setAttribute('x2', (margin.left + plotWidth).toString());
  xAxis.setAttribute('y2', (margin.top + plotHeight).toString());
  xAxis.setAttribute('stroke', '#999');
  xAxis.setAttribute('stroke-width', '2');
  svg.appendChild(xAxis);

  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', margin.left.toString());
  yAxis.setAttribute('y1', margin.top.toString());
  yAxis.setAttribute('x2', margin.left.toString());
  yAxis.setAttribute('y2', (margin.top + plotHeight).toString());
  yAxis.setAttribute('stroke', '#999');
  yAxis.setAttribute('stroke-width', '2');
  svg.appendChild(yAxis);

  // Title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', (width / 2).toString());
  title.setAttribute('y', '30');
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('fill', '#fbbf24');
  title.setAttribute('font-size', '20');
  title.setAttribute('font-weight', 'bold');
  title.textContent = scheduleName;
  svg.appendChild(title);

  return svg;
}

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
    results?: string;
    color?: string;
  };
  onClose: () => void;
  onAddToLibrary: (base64: string, filename: string, metadata?: { notes?: string; results?: string; color?: string }) => Promise<void>;
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

  const handleExportSVGToLibrary = async () => {
    try {
      // Generate SVG plot
      const svg = generateTemperaturePlotSVG(
        kilnLog.temperatures,
        kilnLog.times,
        kilnLog.name,
        { annealingPoint: 565, strainPoint: 510 }
      );

      // Convert SVG to string
      const svgString = new XMLSerializer().serializeToString(svg);
      const base64 = btoa(svgString);
      const filename = `${kilnLog.name}_plot.svg`;

      // Call the parent handler to save to library
      await onAddToLibrary(base64, filename, {
        notes: kilnLog.notes,
        results: kilnLog.results,
        color: kilnLog.color,
      });

      toast.success("SVG plot added to PDF Library!");
      onClose();
    } catch (error) {
      console.error("Failed to add SVG to library:", error);
      toast.error("Failed to add SVG to PDF Library");
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
      const filename = `${kilnLog.name}_klog.pdf`;

      // Call the parent handler to save to library with metadata
      await onAddToLibrary(base64, filename, {
        notes: kilnLog.notes,
        results: kilnLog.results,
        color: kilnLog.color,
      });

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
            onClick={handleExportSVGToLibrary}
            disabled={isAddingToLibrary}
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-stone-600 text-white font-mono text-sm font-bold uppercase flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {isAddingToLibrary ? "Adding SVG..." : "Add SVG Plot to Library"}
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
