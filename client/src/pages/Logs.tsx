/*
Logs Page - View and manage saved kiln logs with localStorage persistence
*/

import { useState, useEffect } from "react";
import { Download, Trash2, Eye, FileText, Eye as EyeIcon, MessageCircle, Palette, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { ColoredGlassJar } from "@/components/ColoredGlassJar";
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

// Load html2pdf globally
if (typeof window !== 'undefined') {
  (window as any).html2pdf = html2pdf;
}

function getColorNameFromHex(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let hue = 0;
  if (max === min) {
    hue = 0;
  } else if (max === rNorm) {
    hue = ((gNorm - bNorm) / (max - min)) * 60;
    if (hue < 0) hue += 360;
  } else if (max === gNorm) {
    hue = ((bNorm - rNorm) / (max - min)) * 60 + 120;
  } else {
    hue = ((rNorm - gNorm) / (max - min)) * 60 + 240;
  }
  if (hue >= 0 && hue < 15) return 'Red';
  if (hue >= 15 && hue < 45) return 'Orange';
  if (hue >= 45 && hue < 65) return 'Yellow';
  if (hue >= 65 && hue < 150) return 'Green';
  if (hue >= 150 && hue < 200) return 'Cyan';
  if (hue >= 200 && hue < 260) return 'Blue';
  if (hue >= 260 && hue < 290) return 'Purple';
  if (hue >= 290 && hue < 330) return 'Magenta';
  return 'Red';
}

interface SavedLog {
  id: string;
  name: string;
  description?: string;
  temperatures: number[];
  times: number[];
  createdAt: Date;
  lineColor?: string;
  notes?: string;
  selectedColors?: string[];
  annealedColors?: Array<{ id: string; color: string; mode: 'solid' | 'blend'; blendColors?: string[] }>;
  annealedColor?: string;
  colorNames?: { [hex: string]: string };
  savedColorCombinations?: Array<{ id: string; glassColor: string; annealedResult: { id: string; color: string; mode: 'solid' | 'blend'; blendColors?: string[] }; savedAt: Date }>;
}


interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  logIds: string[];
}

export default function Logs() {
  const [logs, setLogs] = useState<SavedLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<SavedLog | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [pdfPreviewContent, setPDFPreviewContent] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsLog, setCommentsLog] = useState<SavedLog | null>(null);
  const [editingComments, setEditingComments] = useState<string>("");
  const [showColorWheelModal, setShowColorWheelModal] = useState(false);
  const [colorWheelLog, setColorWheelLog] = useState<SavedLog | null>(null);
  const [selectedAnnealedColor, setSelectedAnnealedColor] = useState<string | null>(null);
  const [tempAnnealedColor, setTempAnnealedColor] = useState<string>("");
  const [selectedGlassColor, setSelectedGlassColor] = useState<string | null>(null);
  const [blendMode, setBlendMode] = useState<'solid' | 'blend'>('solid');
  const [blendColors, setBlendColors] = useState<string[]>([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameColorHex, setRenameColorHex] = useState<string>("");
  const [renamingColorName, setRenamingColorName] = useState<string>("");
  const [customColorNames, setCustomColorNames] = useState<{ [hex: string]: string }>({});
  const [showRenameButtons, setShowRenameButtons] = useState(false);
  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#ff0000");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedAnnealedIds, setSelectedAnnealedIds] = useState<Set<string>>(new Set());
  const [selectedGlassColors, setSelectedGlassColors] = useState<Set<number>>(new Set());
  const [showColorCheckboxes, setShowColorCheckboxes] = useState(false);
  const [colorSelectionMode, setColorSelectionMode] = useState(false);
  const [selectedAnnealedResultForComparison, setSelectedAnnealedResultForComparison] = useState<{ id: string; color: string; mode: 'solid' | 'blend'; blendColors?: string[] } | null>(null);
  const [savedComboSelectionMode, setSavedComboSelectionMode] = useState(false);
  const [selectedSavedCombos, setSelectedSavedCombos] = useState<Set<string>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [selectedFolderForAddLog, setSelectedFolderForAddLog] = useState<string | null>(null);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedLogsForAddition, setSelectedLogsForAddition] = useState<Set<string>>(new Set());
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  // Load logs and folders from localStorage on mount
  useEffect(() => {
    const loadLogs = () => {
      try {
        const storedFolders = localStorage.getItem("kilnFolders");
        if (storedFolders) {
          setFolders(JSON.parse(storedFolders));
        }
        const storedLogs = localStorage.getItem("kilnLogs");
        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs);
          setLogs(parsedLogs);
        }
      } catch (error) {
        console.error("Error loading logs:", error);
        toast.error("Failed to load logs");
      }
    };

    loadLogs();
  }, []);

  // Clear selected logs when modal closes
  useEffect(() => {
    if (!showAddLogModal) {
      setSelectedLogsForAddition(new Set());
    }
  }, [showAddLogModal]);

  // Filter logs by date range
  const filteredLogs = logs.filter((log) => {
    if (!filterStartDate && !filterEndDate) return true;
    const logDate = new Date(log.createdAt).toISOString().split('T')[0];
    if (filterStartDate && logDate < filterStartDate) return false;
    if (filterEndDate && logDate > filterEndDate) return false;
    return true;
  });

  // Toggle log selection for addition
  const toggleLogSelection = (logId: string) => {
    const newSelection = new Set(selectedLogsForAddition);
    if (newSelection.has(logId)) {
      newSelection.delete(logId);
    } else {
      newSelection.add(logId);
    }
    setSelectedLogsForAddition(newSelection);
  };

  // Add all selected logs to the current folder
  const handleAddSelectedLogs = () => {
    if (selectedLogsForAddition.size === 0) {
      toast.error("Please select at least one log");
      return;
    }
    try {
      const updatedFolders = folders.map((f) =>
        f.id === selectedFolderForAddLog
          ? { ...f, logIds: [...new Set([...(f.logIds || []), ...selectedLogsForAddition])] }
          : f
      );
      setFolders(updatedFolders);
      localStorage.setItem('kilnFolders', JSON.stringify(updatedFolders));
      toast.success(`Added ${selectedLogsForAddition.size} log(s) to folder`);
      setShowAddLogModal(false);
      setSelectedLogsForAddition(new Set());
    } catch (error) {
      console.error("Error adding logs:", error);
      toast.error("Failed to add logs");
    }
  };

  const handleExportCSV = (log: SavedLog) => {
    try {
      // Create CSV content
      const headers = ["Time (min)", "Temperature (°C)"];
      const rows = log.times.map((time, index) => [
        time,
        log.temperatures[index],
      ]);

      const csvContent = [
        `Log: ${log.name}`,
        `Created: ${new Date(log.createdAt).toLocaleString()}`,
        "",
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${log.name}_kiln_log.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export CSV");
    }
  };

  const handleOpenComments = (log: SavedLog) => {
    setCommentsLog(log);
    setEditingComments(log.notes || "");
    setShowCommentsModal(true);
  };

  const handleSaveComments = () => {
    if (!commentsLog) return;
    try {
      const updatedLogs = logs.map((log) =>
        log.id === commentsLog.id ? { ...log, notes: editingComments } : log
      );
      setLogs(updatedLogs);
      localStorage.setItem("kilnLogs", JSON.stringify(updatedLogs));
      toast.success("Comments saved");
      setShowCommentsModal(false);
      setCommentsLog(null);
      setEditingComments("");
    } catch (error) {
      console.error("Save comments error:", error);
      toast.error("Failed to save comments");
    }
  };

  const handleSaveAnnealedColor = () => {
    try {
      if (!colorWheelLog) {
        toast.error('No log selected');
        return;
      }
      if (!tempAnnealedColor && blendMode !== 'blend') {
        toast.error('Please select an annealed color');
        return;
      }
      if (blendMode === 'blend' && (!blendColors || blendColors.length < 3)) {
        toast.error('Please select all three colors for blend mode');
        return;
      }
      const newAnnealedResult = {
        id: `annealed-${Date.now()}`,
        color: tempAnnealedColor,
        mode: blendMode,
        blendColors: blendMode === 'blend' ? blendColors : undefined,
      };
      const existingResults = colorWheelLog.annealedColors || [];
      const updatedLogs = logs.map((log) =>
        log.id === colorWheelLog.id 
          ? { 
              ...log, 
              annealedColors: [...existingResults, newAnnealedResult],
              annealedColor: tempAnnealedColor 
            } 
          : log
      );
      setLogs(updatedLogs);
      localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
      setColorWheelLog({ 
        ...colorWheelLog, 
        annealedColors: [...existingResults, newAnnealedResult],
        annealedColor: tempAnnealedColor 
      });
      toast.success('Annealed color saved');
    } catch (error) {
      console.error('Save annealed color error:', error);
      toast.error('Failed to save annealed color');
    }
  };

  const handleSaveColorName = () => {
    if (renameColorHex && renamingColorName) {
      const newNames = { ...customColorNames, [renameColorHex]: renamingColorName };
      setCustomColorNames(newNames);
      if (colorWheelLog) {
        const updatedLogs = logs.map((log) =>
          log.id === colorWheelLog.id ? { ...log, colorNames: newNames } : log
        );
        setLogs(updatedLogs);
        localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
        setColorWheelLog({
          ...colorWheelLog,
          colorNames: newNames,
        });
      }
      setShowRenameModal(false);
      setRenameColorHex("");
      setRenamingColorName("");
      toast.success('Color renamed successfully');
    }
  };

  const handleAddColor = () => {
    if (!newColorHex.trim()) {
      toast.error('Please select a color');
      return;
    }
    
    if (!colorWheelLog) return;
    
    const newColor = newColorHex;
    
    // Check for duplicates in selectedColors (glass colors)
    if (colorWheelLog.selectedColors?.includes(newColor)) {
      toast.error('This color is already in the glass color list');
      return;
    }
    
    // Check for duplicates in saved annealed results
    if (colorWheelLog.annealedColors?.some(result => result.color === newColor)) {
      toast.error('This color is already in the annealed results list');
      return;
    }
    const newNames = { ...customColorNames };
    if (newColorName.trim()) {
      newNames[newColor] = newColorName;
    }
    
    const updatedLog = {
      ...colorWheelLog,
      selectedColors: [...(colorWheelLog.selectedColors || []), newColor],
      colorNames: newNames
    };
    
    const updatedLogs = logs.map((log) =>
      log.id === colorWheelLog.id ? updatedLog : log
    );
    setLogs(updatedLogs);
    localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
    setColorWheelLog(updatedLog);
    setCustomColorNames(newNames);
    
    setShowAddColorModal(false);
    setNewColorName('');
    setNewColorHex('#ff0000');
    toast.success('Color added successfully');
  };

  const handleDelete = (logId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this log? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      const updatedLogs = logs.filter((log) => log.id !== logId);
      setLogs(updatedLogs);
      localStorage.setItem("kilnLogs", JSON.stringify(updatedLogs));
      toast.success("Log deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete log");
    }
  };

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete all logs? This cannot be undone.")) {
      try {
        setLogs([]);
        localStorage.removeItem("kilnLogs");
        toast.success("All logs deleted");
      } catch (error) {
        console.error("Delete all error:", error);
        toast.error("Failed to delete all logs");
      }
    }
  };

  const generatePDFContent = (log: SavedLog, unit: 'C' | 'F' = 'C'): string => {
    // Convert temperatures if Fahrenheit is selected
    const convertTemp = (celsius: number) => unit === 'F' ? Math.round((celsius * 9/5) + 32) : celsius;
    const convertedTemps = log.temperatures.map(convertTemp);
    const convertedMinTemp = Math.min(...convertedTemps);
    const convertedMaxTemp = Math.max(...convertedTemps) + 50;
    // Generate SVG chart matching Firing Tracker plot styling
    const minTemp = convertedMinTemp;
    const maxTemp = convertedMaxTemp;
    const maxTime = Math.max(...log.times);
    
    // SVG dimensions and margins matching Firing Tracker
    const width = 1400;
    const height = 700;
    const margin = { top: 100, right: 100, bottom: 140, left: 180 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Scale functions
    const scaleX = (time: number) => (time / maxTime) * plotWidth;
    const scaleY = (temp: number) => plotHeight - (temp / maxTemp) * plotHeight;

    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('style', 'background-color: #1c1917;');

    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', width.toString());
    bg.setAttribute('height', height.toString());
    bg.setAttribute('fill', '#1c1917');
    svg.appendChild(bg);

    // Gridlines
    const tempStep = maxTemp > 600 ? 100 : 50;
    for (let temp = 0; temp <= maxTemp; temp += tempStep) {
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

    // Temperature curve path
    let pathD = `M ${margin.left + scaleX(log.times[0])} ${margin.top + scaleY(convertedTemps[0])}`;
    for (let i = 1; i < log.times.length; i++) {
      pathD += ` L ${margin.left + scaleX(log.times[i])} ${margin.top + scaleY(convertedTemps[i])}`;
    }

    // Temperature curve
    const curve = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    curve.setAttribute('d', pathD);
    curve.setAttribute('stroke', '#fbbf24');
    curve.setAttribute('stroke-width', '3');
    curve.setAttribute('fill', 'none');
    svg.appendChild(curve);

    // Data points
    log.times.forEach((time, idx) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', (margin.left + scaleX(time)).toString());
      circle.setAttribute('cy', (margin.top + scaleY(convertedTemps[idx])).toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#fbbf24');
      svg.appendChild(circle);
    });

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

    // Y-axis ticks and labels
    for (let i = 0; i <= maxTemp; i += tempStep) {
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', (margin.left - 5).toString());
      tick.setAttribute('y1', (margin.top + scaleY(i)).toString());
      tick.setAttribute('x2', margin.left.toString());
      tick.setAttribute('y2', (margin.top + scaleY(i)).toString());
      tick.setAttribute('stroke', '#999');
      tick.setAttribute('stroke-width', '1');
      svg.appendChild(tick);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (margin.left - 40).toString());
      label.setAttribute('y', (margin.top + scaleY(i) + 12).toString());
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('fill', '#fbbf24');
      label.setAttribute('font-size', '33');
      label.textContent = `${i}°${unit}`;
      svg.appendChild(label);
    }

    // X-axis ticks and labels
    const timeStep = maxTime > 500 ? 100 : 50;
    for (let time = 0; time <= maxTime; time += timeStep) {
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', (margin.left + scaleX(time)).toString());
      tick.setAttribute('y1', (margin.top + plotHeight).toString());
      tick.setAttribute('x2', (margin.left + scaleX(time)).toString());
      tick.setAttribute('y2', (margin.top + plotHeight + 5).toString());
      tick.setAttribute('stroke', '#999');
      tick.setAttribute('stroke-width', '1');
      svg.appendChild(tick);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (margin.left + scaleX(time)).toString());
      label.setAttribute('y', (margin.top + plotHeight + 20).toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', '#fbbf24');
      label.setAttribute('font-size', '33');
      label.textContent = `${time} min`;
      svg.appendChild(label);
    }

    // Axis labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', (margin.left + plotWidth / 2).toString());
    xLabel.setAttribute('y', (height - 20).toString());
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('fill', '#fbbf24');
    xLabel.setAttribute('font-size', '28');
    xLabel.textContent = 'Time →';
    svg.appendChild(xLabel);

    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', '15');
    yLabel.setAttribute('y', (margin.top + plotHeight / 2).toString());
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', '#fbbf24');
    yLabel.setAttribute('font-size', '26');
    yLabel.setAttribute('transform', `rotate(-90 15 ${margin.top + plotHeight / 2})`);
    yLabel.textContent = `Temp (°${unit})`;
    svg.appendChild(yLabel);

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width / 2).toString());
    title.setAttribute('y', '40');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#fbbf24');
    title.setAttribute('font-size', '60');
    title.setAttribute('font-weight', 'bold');
    title.textContent = log.name;
    svg.appendChild(title);

    // Convert SVG to data URL
    const svgString = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const htmlContent = `
        <html>
          <head>
            <title>${log.name} - Kiln Log</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; background: #1c1917; color: #fbbf24; }
              .container { max-width: 900px; margin: 0 auto; padding: 20px; }
              h1 { color: #fbbf24; text-align: center; margin-bottom: 10px; }
              .metadata { background: #2d2520; border: 1px solid #d97706; border-radius: 4px; padding: 15px; margin: 20px 0; }
              .metadata p { margin: 8px 0; color: #d97706; }
              .chart-container { margin: 30px 0; text-align: center; background: #1c1917; padding: 20px; border: 1px solid #d97706; border-radius: 4px; }
              .chart-container img { max-width: 100%; height: auto; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #2d2520; }
              th { background-color: #404040; color: #fbbf24; padding: 12px; text-align: left; border: 1px solid #d97706; font-weight: bold; }
              td { border: 1px solid #404040; padding: 12px; text-align: left; color: #d97706; }
              tr:nth-child(even) { background-color: #1c1917; }
              .notes { background: #2d2520; border: 1px solid #d97706; border-radius: 4px; padding: 15px; margin-top: 20px; }
              .notes h3 { color: #fbbf24; margin-top: 0; }
              .notes p { color: #d97706; white-space: pre-wrap; word-wrap: break-word; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Kiln Log: ${log.name}</h1>
              <div class="metadata">
                <p><strong>Created:</strong> ${new Date(log.createdAt).toLocaleDateString()}</p>
                <p><strong>Max Temperature:</strong> ${Math.max(...convertedTemps)}°${unit}</p>
                <p><strong>Duration:</strong> ${Math.max(...log.times)} minutes</p>
                <p><strong>Data Points:</strong> ${log.temperatures.length}</p>
              </div>
              <div class="chart-container">
                <h2 style="color: #fbbf24; margin-top: 0;">Temperature Profile</h2>
                <img src="${svgUrl}" alt="Temperature Profile Chart" />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Time (min)</th>
                    <th>Temperature (°${unit})</th>
                  </tr>
                </thead>
                <tbody>
                  ${log.times.map((time, index) => `
                  <tr>
                    <td>${time}</td>
                    <td>${convertedTemps[index]}°${unit}</td>
                  </tr>
                  `).join('')}
                </tbody>
              </table>
              ${log.savedColorCombinations && log.savedColorCombinations.length > 0 ? `
                <div class="notes">
                  <h3>Saved Color Combinations</h3>
                  <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
                    ${log.savedColorCombinations.map((combo) => `
                      <div style="border: 1px solid #d97706; border-radius: 4px; padding: 12px; background-color: #292524; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 12px; padding: 8px; background-color: #1c1917; border-radius: 3px; margin-bottom: 6px;">
                          <div style="text-align: center;">
                            <div style="font-size: 10px; color: #a3a3a3; margin-bottom: 3px;">Glass</div>
                            <div style="width: 25px; height: 25px; background-color: ${combo.glassColor}; border: 1px solid #d97706; border-radius: 2px;"></div>
                          </div>
                          <div style="color: #fbbf24; font-weight: bold; font-size: 12px;">→</div>
                          <div style="text-align: center;">
                            <div style="font-size: 10px; color: #a3a3a3; margin-bottom: 3px;">${combo.annealedResult.mode === 'blend' ? 'Blend' : 'Solid'}</div>
                            ${combo.annealedResult.mode === 'blend' ? `
                              <div style="width: 25px; height: 25px; background: linear-gradient(135deg, ${combo.annealedResult.blendColors?.[0] || '#ffffff'} 0%, ${combo.annealedResult.blendColors?.[1] || '#ffffff'} 50%, ${combo.annealedResult.blendColors?.[2] || '#ffffff'} 100%); border: 1px solid #d97706; border-radius: 2px;"></div>
                            ` : `
                              <div style="width: 25px; height: 25px; background-color: ${combo.annealedResult.color}; border: 1px solid #d97706; border-radius: 2px;"></div>
                            `}
                          </div>
                          <div style="flex: 1; margin-left: 8px;">
                            <p style="margin: 0; color: #fbbf24; font-size: 10px;"><strong>Input:</strong> ${getColorNameFromHex(combo.glassColor)}</p>
                            <p style="margin: 0; color: #d97706; font-size: 10px;"><strong>Output:</strong> ${combo.annealedResult.mode === 'blend' ? 'Blend Mix' : getColorNameFromHex(combo.annealedResult.color)}</p>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              ${log.notes ? `
                <div class="notes">
                  <h3>Comments & Notes</h3>
                  <p style="white-space: pre-wrap; color: #d1d5db; line-height: 1.6;">${log.notes}</p>
                </div>
              ` : ''}
              <div class="footer">
                <p>Generated by BoroPro - Borosilicate Kiln Research Platform</p>
              </div>
            </div>
          </body>
        </html>
      `;

    return htmlContent;
  };

  const handlePreviewPDF = (log: SavedLog) => {
    try {
      const htmlContent = generatePDFContent(log, tempUnit);
      setPDFPreviewContent(htmlContent);
      setShowPDFPreview(true);
      toast.success('PDF preview opened');
    } catch (error) {
      console.error('PDF preview error:', error);
      toast.error('Failed to generate PDF preview');
    }
  };

  const handleExportPDF = (log: SavedLog) => {
    try {
      const htmlContent = generatePDFContent(log, tempUnit);
      const printWindow = window.open('', '', 'height=800,width=1000');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        toast.success('PDF ready to print');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleUploadPDF = async (log: SavedLog) => {
    try {
      // Use colorWheelLog if it's the same log (when called from modal), otherwise use the passed log
      const logToUse = colorWheelLog && colorWheelLog.name === log.name ? colorWheelLog : log;
      const htmlContent = generatePDFContent(logToUse, tempUnit);
      
      // Convert HTML to blob
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Create a temporary link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${log.name}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF upload error:', error);
      toast.error('Failed to download PDF');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-3 md:py-4 px-3 md:px-0">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-16 md:h-24 w-16 md:w-24 object-contain" />
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=25&length=25&width=25" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Reheat Calc
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Editor
            </a>
            <a href="/logs" className="text-xs uppercase tracking-wider text-amber-500">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-stone-800 rounded transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-amber-400" />
            ) : (
              <Menu className="w-6 h-6 text-amber-400" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-2 px-4 py-3 bg-stone-800 border-t border-amber-700/30 max-h-[calc(100vh-120px)] overflow-y-auto">
            <a
              href="/color-picker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Color
            </a>
            <a
              href="/flame-simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Flame Char
            </a>
            <a
              href="/calculator?kilnTemp=565&roomTemp=25&shape=cylinder&thickness=4&radius=25&length=25&width=25"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Reheat Calc
            </a>
            <a
              href="/firing-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Kiln Editor
            </a>
            <a
              href="/logs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-500/40 hover:bg-amber-500/50 text-amber-300 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              Log
            </a>
            <a
              href="/references"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 bg-amber-700/30 hover:bg-amber-700/50 text-amber-400 hover:text-orange-400 rounded transition text-center font-medium uppercase text-xs tracking-wider"
            >
              References
            </a>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-8 md:py-16 px-4 md:px-0">
          <div className="container">
            <h1 className="text-2xl md:text-5xl font-bold text-yellow-400 mb-2 break-words">Logs</h1>
          </div>
        </section>

        {/* Header Image */}
        <section className="border-b border-white/10 py-8 px-4 md:px-0">
          <div className="container">
            <img
              src="/manus-storage/glasslogicon_44f4be74.png"
              alt="Glassmaker's Log"
              className="w-full max-w-4xl rounded-xl border border-stone-700 shadow-lg mx-auto"
            />
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Date Range Filter Removed */}

          {filteredLogs.length === 0 && logs.length > 0 ? (
          <div className="text-center py-12 border border-stone-700 rounded-lg bg-stone-900/50">
            <p className="text-stone-400 mb-2">No logs found in date range</p>
            <p className="text-stone-500 text-sm">
              Try adjusting your filter dates
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 border border-stone-700 rounded-lg bg-stone-900/50">
            <p className="text-stone-400 mb-2">No logs saved yet</p>
            <p className="text-stone-500 text-sm">
              Create and save kiln logs from the Firing Tracker to see them here
            </p>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {/* Temperature Unit Toggle */}
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium text-sm"
              >
                Temperature: °{tempUnit} {tempUnit === 'C' ? '→ °F' : '→ °C'}
              </button>
            </div>

            {/* Logs List Header */}
            <div className="flex items-center justify-end gap-4 mb-4">
              <button
                onClick={() => {
                  setShowCheckboxes(!showCheckboxes);
                  if (showCheckboxes) {
                    setSelectedLogIds(new Set());
                  }
                }}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors text-sm font-medium"
              >
                {showCheckboxes ? 'Done' : 'Select'}
              </button>
              {showCheckboxes && (
                <button
                  onClick={() => {
                    if (selectedLogIds.size === filteredLogs.length) {
                      setSelectedLogIds(new Set());
                    } else {
                      const allIds = new Set(filteredLogs.map(log => log.id));
                      setSelectedLogIds(allIds);
                    }
                  }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors text-sm font-medium"
                >
                  {selectedLogIds.size === filteredLogs.length && filteredLogs.length > 0 ? 'Deselect All' : 'Select All'}
                </button>
              )}
              {showCheckboxes && selectedLogIds.size > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${selectedLogIds.size} log(s)? This action cannot be undone.`)) {
                      const updatedLogs = logs.filter(log => !selectedLogIds.has(log.id));
                      setLogs(updatedLogs);
                      localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
                      setSelectedLogIds(new Set());
                      setShowCheckboxes(false);
                      toast.success(`Deleted ${selectedLogIds.size} log(s)`);
                      window.dispatchEvent(new CustomEvent('logsUpdated', { detail: updatedLogs }));
                    }
                  }}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors text-sm font-medium"
                >
                  Delete ({selectedLogIds.size})
                </button>
              )}
            </div>
            {/* Logs List */}
            <div className="grid gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="border border-purple-600 rounded-lg bg-purple-900/20 p-4 hover:bg-purple-900/40 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📁</span>
                    <div>
                      <h3 className="text-white font-semibold">{folder.name}</h3>
                      <p className="text-stone-400 text-xs">Folder</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFolderForAddLog(folder.id);
                        setShowAddLogModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      <span className="text-sm">Add Log</span>
                    </button>
                    <button
                      onClick={() => {
                        const updatedFolders = folders.filter(f => f.id !== folder.id);
                        setFolders(updatedFolders);
                        localStorage.setItem('kilnFolders', JSON.stringify(updatedFolders));
                        toast.success(`Folder deleted`);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-stone-700 rounded-lg bg-stone-900/50 p-4 hover:bg-stone-900 transition-colors"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {showCheckboxes && (
                          <input
                            type="checkbox"
                            checked={selectedLogIds.has(log.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedLogIds);
                              if (e.target.checked) {
                                newSelected.add(log.id);
                              } else {
                                newSelected.delete(log.id);
                              }
                              setSelectedLogIds(newSelected);
                            }}
                            className="w-5 h-5 cursor-pointer flex-shrink-0 mt-1"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-white break-words">
                            {log.name}
                          </h3>
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors text-xs sm:text-sm flex-shrink-0"
                        title="Edit log"
                      >
                        <span>{expandedLogId === log.id ? 'Hide' : 'Edit'}</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {expandedLogId === log.id && (
                        <>
                          <button
                            onClick={() => handlePreviewPDF(log)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors text-xs sm:text-sm"
                            title="View log"
                          >
                            <span>View</span>
                          </button>



                          <button
                            onClick={() => {
                              setColorWheelLog(log);
                              setShowColorWheelModal(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors text-xs sm:text-sm"
                            title="View glass colors used"
                          >
                            <span>Colors</span>
                          </button>

                          <button
                            onClick={() => handleOpenComments(log)}
                            className="flex items-center gap-2 px-3 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors text-xs sm:text-sm"
                            title="View and edit comments"
                          >
                            <span>Notes</span>
                          </button>

                          <button
                            onClick={() => {
                              const newName = prompt('Enter new log name:', log.name);
                              if (newName && newName.trim()) {
                                const updatedLogs = logs.map(l => 
                                  l.id === log.id ? { ...l, name: newName.trim() } : l
                                );
                                setLogs(updatedLogs);
                                localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
                                window.dispatchEvent(new CustomEvent('logsUpdated', { detail: updatedLogs }));
                                toast.success('Log renamed successfully!');
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors text-xs sm:text-sm"
                            title="Rename log"
                          >
                            <span>Rename</span>
                          </button>

                          <button
                            onClick={() => {
                              try {
                                // Create a clean HTML element without app styles to avoid OKLCH color parsing issues
                                const element = document.createElement('div');
                                element.innerHTML = generatePDFContent(log);
                                
                                // Remove all inherited styles and set clean inline styles
                                element.style.cssText = `
                                  padding: 20px;
                                  background-color: white;
                                  color: black;
                                  font-family: Arial, sans-serif;
                                  margin: 0;
                                `;
                                
                                // Recursively clean styles from all child elements
                                const cleanStyles = (el: HTMLElement) => {
                                  el.style.cssText = el.getAttribute('style') || '';
                                  Array.from(el.children).forEach(child => {
                                    if (child instanceof HTMLElement) {
                                      cleanStyles(child);
                                    }
                                  });
                                };
                                cleanStyles(element);
                                
                                const opt = {
                                  margin: 10,
                                  filename: `${log.name}-${new Date().toISOString().split('T')[0]}.pdf`,
                                  image: { type: 'png' as const, quality: 0.98 },
                                  html2canvas: { 
                                    scale: 2, 
                                    backgroundColor: '#ffffff',
                                    useCORS: true,
                                    allowTaint: true
                                  },
                                  jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' }
                                };
                                
                                (html2pdf() as any)
                                  .set(opt)
                                  .from(element)
                                  .save()
                                  .catch((err: any) => {
                                    console.error('html2pdf error:', err);
                                    toast.error('PDF generation failed: ' + (err?.message || 'Unknown error'));
                                  });
                                toast.success('PDF downloaded successfully');
                              } catch (error) {
                                console.error('PDF generation error:', error);
                                toast.error('Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded transition-colors text-xs sm:text-sm"
                            title="Save log as PDF"
                          >
                            <span>Save PDF</span>
                          </button>

                          <button
                            onClick={() => handleDelete(log.id)}
                            className="flex items-center gap-2 px-3 py-2 bg-red-900/50 hover:bg-red-900 text-red-300 rounded transition-colors"
                            title="Delete log (requires confirmation)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </div>
        ) : null}
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && selectedLog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedLog.name}</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-stone-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-stone-300">
              {selectedLog.description && (
                <div>
                  <p className="text-sm text-stone-500">Description</p>
                  <p>{selectedLog.description}</p>
                </div>
              )}

              {selectedLog.notes && (
                <div>
                  <p className="text-sm text-stone-500">Notes</p>
                  <p className="whitespace-pre-wrap">{selectedLog.notes}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-stone-500">Created</p>
                <p>{new Date(selectedLog.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Temperature Profile (°C)</p>
                <p className="font-mono text-sm bg-stone-800 p-2 rounded overflow-x-auto">
                  {selectedLog.temperatures.join(", ")}
                </p>
              </div>

              <div>
                <p className="text-sm text-stone-500">Time Points (minutes)</p>
                <p className="font-mono text-sm bg-stone-800 p-2 rounded overflow-x-auto">
                  {selectedLog.times.join(", ")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-stone-800 p-3 rounded">
                  <p className="text-stone-500">Max Temperature</p>
                  <p className="text-lg font-semibold text-amber-400">
                    {Math.max(...selectedLog.temperatures)}°C
                  </p>
                </div>
                <div className="bg-stone-800 p-3 rounded">
                  <p className="text-stone-500">Total Duration</p>
                  <p className="text-lg font-semibold text-amber-400">
                    {Math.max(...selectedLog.times)} min
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-700 flex gap-2">
                <button
                  onClick={() => {
                    handleExportCSV(selectedLog);
                    setShowPreview(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors flex-1 justify-center"
                >
                  <Download className="w-4 h-4" />
                  Export to CSV
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPDFPreview && pdfPreviewContent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2">
          <div className="bg-stone-900 border border-stone-700 rounded-lg w-[95vw] h-[95vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-stone-700 sticky top-0 bg-stone-900">
              <h2 className="text-xl font-bold text-amber-400">PDF Preview</h2>
              <button
                onClick={() => setShowPDFPreview(false)}
                className="text-stone-400 hover:text-white text-2xl"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-hidden bg-stone-800">
              <iframe
                srcDoc={pdfPreviewContent}
                className="w-full h-full border-none"
                title="PDF Preview"
                style={{ display: 'block' }}
              />
            </div>

            {/* Footer with Actions */}
            <div className="flex gap-2 p-4 border-t border-stone-700 bg-stone-900">
              <button
                onClick={async () => {
                  if (selectedLog && pdfPreviewContent) {
                    try {
                      const element = document.createElement('div');
                      element.innerHTML = pdfPreviewContent;
                      element.style.padding = '20px';
                      element.style.backgroundColor = 'white';
                      element.style.color = 'black';
                      
                      const opt = {
                        margin: 10,
                        filename: `${selectedLog.name}-${new Date().toISOString().split('T')[0]}.pdf`,
                        image: { type: 'png' as const, quality: 0.98 },
                        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
                        jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' }
                      };
                      
                      await html2pdf().set(opt).from(element).save();
                      toast.success('PDF downloaded successfully');
                    } catch (error) {
                      console.error('PDF generation error:', error);
                      toast.error('Failed to generate PDF');
                    }
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex-1 justify-center"
              >
                <FileText className="w-4 h-4" />
                Save PDF
              </button>
              <button
                onClick={() => setShowPDFPreview(false)}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showCommentsModal && commentsLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 max-w-2xl w-full shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-amber-400">Comments - {commentsLog.name}</h2>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-stone-400 hover:text-stone-300 transition text-2xl"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Comments Textarea */}
            <div className="mb-6">
              <label className="block text-sm text-stone-300 mb-2">Notes & Comments</label>
              <textarea
                value={editingComments}
                onChange={(e) => setEditingComments(e.target.value)}
                className="w-full h-48 bg-stone-800 border border-stone-600 rounded px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Add your comments and notes here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCommentsModal(false)}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveComments}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors font-semibold"
              >
                Save Comments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Wheel Modal */}
      {showColorWheelModal && colorWheelLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 max-w-2xl w-full shadow-xl max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-purple-400">Glass Colors - {colorWheelLog.name}</h2>
              <button
                onClick={() => setShowColorWheelModal(false)}
                className="text-stone-400 hover:text-stone-300 transition text-2xl"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Colors Display */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-lg font-bold text-amber-500">Select Glass Color to Compare</h3>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowAddColorModal(true)}
                    className="px-3 py-1 text-sm bg-green-700 hover:bg-green-600 text-white rounded transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setColorSelectionMode(!colorSelectionMode);
                      setSelectedGlassColors(new Set());
                    }}
                    className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    {colorSelectionMode ? 'Cancel' : 'Select'}
                  </button>
                </div>
                {colorSelectionMode && selectedGlassColors.size > 0 && (
                  <button
                    onClick={() => {
                      const updatedColors = colorWheelLog.selectedColors?.filter(
                        (_, index) => !selectedGlassColors.has(index)
                      );
                      const updatedLog = { ...colorWheelLog, selectedColors: updatedColors };
                      const logs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
                      const updatedLogs = logs.map((log: SavedLog) =>
                        log.name === colorWheelLog.name ? updatedLog : log
                      );
                      localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
                      setColorWheelLog(updatedLog);
                      setColorSelectionMode(false);
                      setSelectedGlassColors(new Set());
                    }}
                    className="px-3 py-1 text-sm bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    Delete Selected ({selectedGlassColors.size})
                  </button>
                )}
                {!colorSelectionMode && (
                  <button
                    onClick={() => setShowRenameButtons(!showRenameButtons)}
                    className="px-3 py-1 text-sm bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors"
                  >
                    {showRenameButtons ? 'Hide Rename' : 'Rename'}
                  </button>
                )}
              </div>
              {colorWheelLog.selectedColors && colorWheelLog.selectedColors.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2 border border-stone-700 rounded-lg">
                  {colorWheelLog.selectedColors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative">
                      {colorSelectionMode && (
                        <input
                          type="checkbox"
                          checked={selectedGlassColors.has(index)}
                          onChange={(e) => {
                            const newSelected = new Set<number>();
                            if (e.target.checked) {
                              newSelected.add(index);
                            }
                            setSelectedGlassColors(newSelected);
                          }}
                          className="absolute top-1 left-1 w-5 h-5 cursor-pointer z-10"
                        />
                      )}
                      <button
                        onClick={() => {
                          if (colorSelectionMode) {
                            // In delete mode, only one selection at a time
                            const newSelected = new Set<number>();
                            if (!selectedGlassColors.has(index)) {
                              newSelected.add(index);
                            }
                            setSelectedGlassColors(newSelected);
                          } else {
                            setSelectedGlassColor(color);
                          }
                        }}
                        className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all mb-2 ${
                          colorSelectionMode && selectedGlassColors.has(index)
                            ? 'border-blue-500 ring-2 ring-blue-400 scale-110 bg-stone-700'
                            : selectedGlassColor === color
                            ? 'border-amber-500 ring-2 ring-amber-400 scale-110 bg-stone-800'
                            : 'border-stone-600 hover:border-stone-500 bg-stone-800'
                        } cursor-pointer`}
                      >
                        <ColoredGlassJar color={color} size={60} />
                      </button>
                    </div>
                      <p className="text-xs text-amber-500 text-center font-semibold">{customColorNames?.[color] || getColorNameFromHex(color)}</p>
                      {showRenameButtons && (
                        <button
                          onClick={() => {
                            setRenameColorHex(color);
                            setRenamingColorName(customColorNames?.[color] || getColorNameFromHex(color));
                            setShowRenameModal(true);
                          }}
                          className="mt-1 text-xs px-2 py-1 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded transition-colors"
                        >
                          Rename
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400 text-center py-8">No glass colors recorded for this log</p>
              )}
            </div>

            {/* Annealed Color Selector */}
            <div className="mb-6 border-t border-stone-700 pt-6">
              <h3 className="text-lg font-bold text-amber-500 mb-4">Annealed Result Color</h3>
              
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setBlendMode('solid')}
                  className={`flex-1 px-3 py-2 rounded font-semibold transition-colors ${
                    blendMode === 'solid'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  Solid Color
                </button>
                <button
                  onClick={() => setBlendMode('blend')}
                  className={`flex-1 px-3 py-2 rounded font-semibold transition-colors ${
                    blendMode === 'blend'
                      ? 'bg-purple-600 text-white'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  Color Strike
                </button>
              </div>

              {/* Solid Color Mode */}
              {blendMode === 'solid' && (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-stone-300 mb-2">Select annealed color:</label>
                    <input
                      type="color"
                      value={tempAnnealedColor || colorWheelLog?.annealedColor || '#ffffff'}
                      onChange={(e) => setTempAnnealedColor(e.target.value)}
                      className="w-full h-12 rounded border-2 border-stone-600 cursor-pointer"
                    />
                  </div>
                  <div className="w-16 h-16 rounded-lg border-2 border-amber-600 flex items-center justify-center bg-stone-800">
                    <ColoredGlassJar color={tempAnnealedColor || colorWheelLog?.annealedColor || '#ffffff'} size={60} />
                  </div>
                </div>
              )}

              {/* Blend Color Mode */}
              {blendMode === 'blend' && (
                <div className="space-y-3">
                  <p className="text-sm text-stone-400">Select up to 3 colors to blend:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((index) => (
                      <div key={index}>
                        <label className="block text-xs text-stone-400 mb-1">Color {index + 1}</label>
                        <input
                          type="color"
                          value={blendColors[index] || '#ffffff'}
                          onChange={(e) => {
                            const newColors = [...blendColors];
                            newColors[index] = e.target.value;
                            setBlendColors(newColors);
                          }}
                          className="w-full h-10 rounded border-2 border-stone-600 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-12 rounded border-2 border-purple-600" style={{
                      background: `linear-gradient(135deg, ${blendColors[0] || '#ffffff'} 0%, ${blendColors[1] || '#ffffff'} 50%, ${blendColors[2] || '#ffffff'} 100%)`
                    }}>
                    </div>
                    <div className="text-sm text-stone-400">Preview</div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveAnnealedColor}
                className="mt-4 w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors font-semibold"
              >
                Save Annealed Color
              </button>
            </div>

            {/* Annealed Color History */}
            {colorWheelLog?.annealedColors && colorWheelLog.annealedColors.length > 0 && (
              <div className="mb-6 border-t border-stone-700 pt-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-bold text-purple-400">Saved Annealed Results</h3>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setDeleteMode(!deleteMode);
                        setSelectedAnnealedIds(new Set());
                      }}
                      className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      {deleteMode ? 'Cancel' : 'Select'}
                    </button>
                    {deleteMode && (
                      <button
                        onClick={() => {
                          if (selectedAnnealedIds.size > 0) {
                            const updatedColors = colorWheelLog.annealedColors?.filter(
                              (result) => !selectedAnnealedIds.has(result.id)
                            );
                            const updatedLog = { ...colorWheelLog, annealedColors: updatedColors };
                            const logs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
                            const updatedLogs = logs.map((log: SavedLog) =>
                              log.name === colorWheelLog.name ? updatedLog : log
                            );
                            localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
                            setColorWheelLog(updatedLog);
                            setSelectedAnnealedIds(new Set());
                            setDeleteMode(false);
                            // Clear the comparison if the deleted result was selected
                            if (selectedAnnealedResultForComparison && selectedAnnealedIds.has(selectedAnnealedResultForComparison.id)) {
                              setSelectedAnnealedResultForComparison(null);
                            }
                          }
                        }}
                        className="px-3 py-1 text-sm bg-red-700 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
                        disabled={selectedAnnealedIds.size === 0}
                      >
                        Delete Selected
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {colorWheelLog.annealedColors.map((result) => (
                    <div key={result.id} className="relative">
                      {deleteMode && (
                        <input
                          type="checkbox"
                          checked={selectedAnnealedIds.has(result.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedAnnealedIds);
                            if (e.target.checked) {
                              newSelected.add(result.id);
                            } else {
                              newSelected.delete(result.id);
                            }
                            setSelectedAnnealedIds(newSelected);
                          }}
                          className="absolute top-1 left-1 w-5 h-5 cursor-pointer z-10"
                        />
                      )}
                      <button
                        onClick={() => {
                          if (deleteMode) {
                            const newSelected = new Set(selectedAnnealedIds);
                            if (!selectedAnnealedIds.has(result.id)) {
                              newSelected.add(result.id);
                            } else {
                              newSelected.delete(result.id);
                            }
                            setSelectedAnnealedIds(newSelected);
                          } else {
                            setTempAnnealedColor(result.color);
                            setSelectedAnnealedResultForComparison(result);
                          }
                        }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedAnnealedResultForComparison?.id === result.id && !deleteMode
                          ? 'border-purple-500 ring-2 ring-purple-400'
                          : 'border-stone-600 hover:border-stone-500'
                      } bg-stone-800`}
                    >
                      <div className="w-12 h-12 rounded mb-2 flex items-center justify-center" style={{ backgroundColor: result.color }}>
                        {result.mode === 'blend' ? (
                          <div className="w-full h-full rounded" style={{
                            background: `linear-gradient(135deg, ${result.blendColors?.[0] || '#ffffff'} 0%, ${result.blendColors?.[1] || '#ffffff'} 50%, ${result.blendColors?.[2] || '#ffffff'} 100%)`
                          }} />
                        ) : (
                          <ColoredGlassJar color={result.color} size={40} />
                        )}
                      </div>
                      <div className="text-xs text-stone-400 text-center">{result.mode === 'blend' ? 'Blend' : 'Solid'}</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comparison Section */}
            {(tempAnnealedColor || colorWheelLog?.annealedColor || selectedAnnealedResultForComparison) && selectedGlassColor && (
              <div className="mb-6 border-t border-stone-700 pt-6 max-h-96 overflow-y-auto">
                <h3 className="text-lg font-bold text-purple-400 mb-4">Color Comparison</h3>
                <div className="flex items-center justify-center gap-8 p-6 bg-stone-800 rounded">
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-stone-400 mb-2">Selected Glass Color</div>
                    <div className="w-20 h-20 rounded-lg border-2 border-stone-600 flex items-center justify-center mb-2" style={{ backgroundColor: selectedGlassColor }}>
                      <ColoredGlassJar color={selectedGlassColor} size={60} />
                    </div>
                    <p className="text-xs text-amber-500 font-semibold text-center">{getColorNameFromHex(selectedGlassColor)}</p>
                  </div>
                  <div className="text-amber-500 font-bold text-3xl">→</div>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-stone-400 mb-2">Annealed Result</div>
                    {selectedAnnealedResultForComparison?.mode === 'blend' ? (
                      <div className="w-20 h-20 rounded-lg border-2 border-purple-600 flex items-center justify-center mb-2" style={{
                        background: selectedAnnealedResultForComparison?.mode === 'blend'
                          ? `linear-gradient(135deg, ${selectedAnnealedResultForComparison.blendColors?.[0] || '#ffffff'} 0%, ${selectedAnnealedResultForComparison.blendColors?.[1] || '#ffffff'} 50%, ${selectedAnnealedResultForComparison.blendColors?.[2] || '#ffffff'} 100%)`
                          : `linear-gradient(135deg, ${blendColors[0] || '#ffffff'} 0%, ${blendColors[1] || '#ffffff'} 50%, ${blendColors[2] || '#ffffff'} 100%)`
                      }}>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-amber-600 flex items-center justify-center mb-2" style={{ backgroundColor: selectedAnnealedResultForComparison?.color || tempAnnealedColor || colorWheelLog?.annealedColor || '#ffffff' }}>
                        <ColoredGlassJar color={selectedAnnealedResultForComparison?.color || tempAnnealedColor || colorWheelLog?.annealedColor || '#ffffff'} size={60} />
                      </div>
                    )}
                    <p className="text-xs text-amber-500 font-semibold text-center">
                      {selectedAnnealedResultForComparison?.mode === 'blend'
                        ? 'Blend Mix'
                        : 'Solid'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Color Combination Button - Requires both glass color and saved annealed result */}
            {selectedGlassColor && selectedAnnealedResultForComparison && (
              <button
                onClick={() => {
                  if (!colorWheelLog) return;
                  
                  const combination = {
                    id: `combo-${Date.now()}`,
                    glassColor: selectedGlassColor || '',
                    annealedResult: selectedAnnealedResultForComparison || { id: '', color: tempAnnealedColor || colorWheelLog?.annealedColor || '#ffffff', mode: 'solid' as const },
                    savedAt: new Date()
                  };
                  
                  const updatedLog = {
                    ...colorWheelLog,
                    savedColorCombinations: [...(colorWheelLog.savedColorCombinations || []), combination]
                  };
                  
                  const logs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
                  const updatedLogs = logs.map((log: SavedLog) =>
                    log.name === colorWheelLog.name ? updatedLog : log
                  );
                  localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
                  setColorWheelLog(updatedLog);
                  
                  toast.success('Color combination saved!');
                }}
                className="w-full mt-4 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded transition-colors font-semibold"
              >
                Save Color Combination
              </button>
            )}


            {/* Rename Color Modal */}
            {showRenameModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-stone-900 border-2 border-amber-700 rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-bold text-amber-500 mb-4">Rename Color</h3>
                  <div className="mb-4">
                    <label className="block text-sm text-stone-300 mb-2">New name for color:</label>
                    <input
                      type="text"
                      value={renamingColorName}
                      onChange={(e) => setRenamingColorName(e.target.value)}
                      placeholder="Enter color name"
                      className="w-full px-3 py-2 bg-stone-800 border-2 border-stone-600 rounded text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowRenameModal(false)}
                      className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveColorName}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors font-semibold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Color Comparisons Section */}
            {colorWheelLog && colorWheelLog.savedColorCombinations && colorWheelLog.savedColorCombinations.length > 0 && (
              <div className="mt-6 border-t border-stone-700 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-amber-500">Saved Color Comparisons ({colorWheelLog.savedColorCombinations.length})</h3>
                  <button
                    onClick={() => setSavedComboSelectionMode(!savedComboSelectionMode)}
                    className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors font-semibold"
                  >
                    {savedComboSelectionMode ? 'Cancel' : 'Select'}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {colorWheelLog.savedColorCombinations.map((combo, idx) => (
                    <div key={combo.id} className="bg-stone-800 border border-amber-700/50 rounded-lg p-3 flex flex-col items-center gap-2 relative">
                      {savedComboSelectionMode && (
                        <input
                          type="checkbox"
                          checked={selectedSavedCombos.has(combo.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedSavedCombos);
                            if (e.target.checked) {
                              newSelected.add(combo.id);
                            } else {
                              newSelected.delete(combo.id);
                            }
                            setSelectedSavedCombos(newSelected);
                          }}
                          className="absolute top-2 left-2 w-4 h-4 cursor-pointer"
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <div className="text-xs text-stone-400 mb-1">Glass</div>
                          <div
                            className="w-8 h-8 rounded border border-amber-600"
                            style={{ backgroundColor: combo.glassColor }}
                          />
                        </div>
                        <div className="text-amber-400 font-bold">→</div>
                        <div className="text-center">
                          <div className="text-xs text-stone-400 mb-1">{combo.annealedResult.mode === 'blend' ? 'Blend' : 'Solid'}</div>
                          {combo.annealedResult.mode === 'blend' ? (
                            <div
                              className="w-8 h-8 rounded border border-amber-600"
                              style={{
                                background: `linear-gradient(135deg, ${combo.annealedResult.blendColors?.[0] || '#ffffff'} 0%, ${combo.annealedResult.blendColors?.[1] || '#ffffff'} 50%, ${combo.annealedResult.blendColors?.[2] || '#ffffff'} 100%)`
                              }}
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded border border-amber-600"
                              style={{ backgroundColor: combo.annealedResult.color }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {savedComboSelectionMode && selectedSavedCombos.size > 0 && (
                  <button
                    onClick={() => {
                      const updatedCombinations = colorWheelLog.savedColorCombinations?.filter((c) => !selectedSavedCombos.has(c.id)) || [];
                      const updatedLog = { ...colorWheelLog, savedColorCombinations: updatedCombinations };
                      const logs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
                      const updatedLogs = logs.map((log: SavedLog) =>
                        log.name === colorWheelLog.name ? updatedLog : log
                      );
                      localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
                      setColorWheelLog(updatedLog);
                      setSelectedSavedCombos(new Set());
                      
                      try {
                        const htmlContent = generatePDFContent(updatedLog);
                        setPDFPreviewContent(htmlContent);
                      } catch (error) {
                        console.error('PDF refresh error:', error);
                      }
                      
                      toast.success('Combinations deleted');
                    }}
                    className="mt-3 w-full px-3 py-2 text-sm bg-red-700 hover:bg-red-600 text-white rounded transition-colors font-semibold"
                  >
                    Delete Selected ({selectedSavedCombos.size})
                  </button>
                )}
              </div>
            )}

            {/* Done and Close Buttons */}
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-stone-700">
              <button
                onClick={() => {
                  // Save all color comparisons from the Saved Color Comparisons section
                  if (colorWheelLog) {
                    try {
                      // Update the log with current savedColorCombinations
                      const updatedLog = { ...colorWheelLog };
                      const logs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
                      const updatedLogs = logs.map((log: SavedLog) =>
                        log.name === colorWheelLog.name ? updatedLog : log
                      );
                      localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
                      // Update the logs state to reflect the changes
                      setLogs(updatedLogs);
                      
                      const comboCount = colorWheelLog.savedColorCombinations?.length || 0;
                      if (comboCount > 0) {
                        toast.success(`Saved ${comboCount} color comparison(s) to kiln log`);
                      } else {
                        toast.info('No color comparisons to save');
                      }
                    } catch (error) {
                      console.error('Failed to save color comparisons:', error);
                      toast.error('Failed to save color comparisons');
                    }
                  }
                  setShowColorWheelModal(false);
                }}
                className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded transition-colors font-semibold whitespace-nowrap"
              >
                Done
              </button>
              <button
                onClick={() => setShowColorWheelModal(false)}
                className="px-6 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Color Modal */}
      {showAddColorModal && colorWheelLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-stone-900 border-2 border-green-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-green-500 mb-4">Add New Color</h3>
            <div className="mb-4">
              <label className="block text-sm text-stone-300 mb-2">Color Picker:</label>
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-full h-12 rounded cursor-pointer border-2 border-stone-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-stone-300 mb-2">Color Name:</label>
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Enter color name (optional)"
                className="w-full px-3 py-2 bg-stone-800 border-2 border-stone-600 rounded text-stone-100 placeholder-stone-500 focus:outline-none focus:border-green-600"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddColorModal(false)}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddColor}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors font-semibold"
              >
                Add Color
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Log Modal */}
      {showAddLogModal && selectedFolderForAddLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">Select Logs to Add</h2>
            <div className="space-y-2 mb-6">
              {logs.length === 0 && folders.length === 0 ? (
                <p className="text-stone-400">No logs or folders available</p>
              ) : (
                <>
                  {/* Display standalone logs */}
                  {logs.length > 0 && (
                    <>
                      <div className="text-sm font-semibold text-amber-400 mb-2">Standalone Logs</div>
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center gap-3 px-4 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded transition-colors border border-stone-700 hover:border-amber-600 cursor-pointer"
                          onClick={() => toggleLogSelection(log.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedLogsForAddition.has(log.id)}
                            onChange={() => toggleLogSelection(log.id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="font-semibold">{log.name}</div>
                            <div className="text-xs text-stone-400">Created: {new Date(log.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {/* Display logs from other folders */}
                  {folders.length > 0 && (
                    <>
                      <div className="text-sm font-semibold text-amber-400 mb-2 mt-4">Logs in Folders</div>
                      {folders.map((folder) => (
                        folder.id !== selectedFolderForAddLog && folder.logIds && folder.logIds.length > 0 && (
                          <div key={folder.id} className="border border-stone-700 rounded p-3 bg-stone-800">
                            <div className="text-sm font-semibold text-purple-400 mb-2">📁 {folder.name}</div>
                            <div className="space-y-2">
                              {folder.logIds.map((logId) => {
                                const log = logs.find((l) => l.id === logId);
                                return log ? (
                                  <div
                                    key={logId}
                                    className="flex items-center gap-3 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors border border-stone-600 hover:border-amber-600 text-sm cursor-pointer"
                                    onClick={() => toggleLogSelection(log.id)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedLogsForAddition.has(log.id)}
                                      onChange={() => toggleLogSelection(log.id)}
                                      className="w-4 h-4 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                      <div className="font-semibold">{log.name}</div>
                                      <div className="text-xs text-stone-400">Created: {new Date(log.createdAt).toLocaleDateString()}</div>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddSelectedLogs}
                disabled={selectedLogsForAddition.size === 0}
                className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-600 disabled:cursor-not-allowed text-white rounded transition-colors font-semibold"
              >
                Add Selected ({selectedLogsForAddition.size})
              </button>
              <button
                onClick={() => setShowAddLogModal(false)}
                className="flex-1 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Footer Image */}
      <div className="mt-16 mb-8 flex justify-center">
        <img src="/manus-storage/libraryfooter(2)_d1998909.png" alt="Glass Art Footer" className="w-full max-w-4xl object-contain" />
      </div>
    </div>
  );
}
