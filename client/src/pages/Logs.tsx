/*
Logs Page - View and manage saved kiln logs with localStorage persistence
*/

import { useState, useEffect } from "react";
import { Download, Trash2, Eye, FileText, Eye as EyeIcon, MessageCircle, Palette } from "lucide-react";
import { toast } from "sonner";
import { ColoredGlassJar } from "@/components/ColoredGlassJar";

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
  const [deleteMode, setDeleteMode] = useState(false);
  const [annealedSelectionMode, setAnnealedSelectionMode] = useState(false);
  const [selectedAnnealedIds, setSelectedAnnealedIds] = useState<Set<string>>(new Set());
  const [selectedGlassColors, setSelectedGlassColors] = useState<Set<string>>(new Set());
  const [showColorCheckboxes, setShowColorCheckboxes] = useState(false);
  const [colorSelectionMode, setColorSelectionMode] = useState(false);

  // Load logs from localStorage on mount
  useEffect(() => {
    const loadLogs = () => {
      try {
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

  // Filter logs by date range
  const filteredLogs = logs.filter((log) => {
    if (!filterStartDate && !filterEndDate) return true;
    const logDate = new Date(log.createdAt).toISOString().split('T')[0];
    if (filterStartDate && logDate < filterStartDate) return false;
    if (filterEndDate && logDate > filterEndDate) return false;
    return true;
  });

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
      if (!colorWheelLog || !tempAnnealedColor) {
        toast.error('Please select an annealed color');
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

  const handleDelete = (logId: string) => {
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

  const generatePDFContent = (log: SavedLog): string => {
    // Generate SVG chart matching Firing Tracker plot styling
    const minTemp = Math.min(...log.temperatures);
    const maxTemp = Math.max(...log.temperatures) + 50; // Add padding like Firing Tracker
    const maxTime = Math.max(...log.times);
    
    // SVG dimensions and margins matching Firing Tracker
    const width = 1000;
    const height = 600;
    const margin = { top: 80, right: 80, bottom: 120, left: 70 };
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
    let pathD = `M ${margin.left + scaleX(log.times[0])} ${margin.top + scaleY(log.temperatures[0])}`;
    for (let i = 1; i < log.times.length; i++) {
      pathD += ` L ${margin.left + scaleX(log.times[i])} ${margin.top + scaleY(log.temperatures[i])}`;
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
      circle.setAttribute('cy', (margin.top + scaleY(log.temperatures[idx])).toString());
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
      label.setAttribute('x', (margin.left - 15).toString());
      label.setAttribute('y', (margin.top + scaleY(i) + 4).toString());
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('fill', '#999');
      label.setAttribute('font-size', '11');
      label.textContent = `${i}°C`;
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
      label.setAttribute('fill', '#999');
      label.setAttribute('font-size', '11');
      label.textContent = `${time} min`;
      svg.appendChild(label);
    }

    // Axis labels
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', (margin.left + plotWidth / 2).toString());
    xLabel.setAttribute('y', (height - 20).toString());
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('fill', '#999');
    xLabel.setAttribute('font-size', '14');
    xLabel.textContent = 'Time →';
    svg.appendChild(xLabel);

    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('x', '15');
    yLabel.setAttribute('y', (margin.top + plotHeight / 2).toString());
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', '#999');
    yLabel.setAttribute('font-size', '13');
    yLabel.setAttribute('transform', `rotate(-90 15 ${margin.top + plotHeight / 2})`);
    yLabel.textContent = 'Temp (°C)';
    svg.appendChild(yLabel);

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', (width / 2).toString());
    title.setAttribute('y', '40');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('fill', '#fbbf24');
    title.setAttribute('font-size', '20');
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
                <p><strong>Created:</strong> ${new Date(log.createdAt).toLocaleString()}</p>
                <p><strong>Max Temperature:</strong> ${Math.max(...log.temperatures)}°C</p>
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
                    <th>Temperature (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  ${log.times.map((time, index) => `
                    <tr>
                      <td>${time}</td>
                      <td>${log.temperatures[index]}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              ${log.description ? `
                <div class="notes">
                  <h3>Description</h3>
                  <p>${log.description}</p>
                </div>
              ` : ''}
              ${log.notes ? `
                <div class="notes">
                  <h3>Notes</h3>
                  <p>${log.notes}</p>
                </div>
              ` : ''}
              ${log.selectedColors && log.selectedColors.length > 0 ? `
                <div class="notes">
                  <h3>Glass Colors Used</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
                    ${log.selectedColors.map((color) => `
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 40px; height: 40px; background-color: ${color}; border: 2px solid #d97706; border-radius: 4px;"></div>
                        <div>
                          <p style="margin: 0; color: #fbbf24; font-weight: bold;">${getColorNameFromHex(color)}</p>
                          <p style="margin: 0; color: #d97706; font-size: 12px;">${color}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              ${log.annealedColors && log.annealedColors.length > 0 && log.selectedColors && log.selectedColors.length > 0 ? `
                <div class="notes">
                  <h3>Color Transformation Results</h3>
                  <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
                    ${log.annealedColors.map((result) => `
                      <div style="border: 1px solid #d97706; border-radius: 4px; padding: 12px; background-color: #292524; margin-bottom: 8px;">
                        <div style="color: #fbbf24; font-size: 12px; font-weight: bold; margin-bottom: 8px;">Saved Result: ${result.mode === 'blend' ? 'Blend' : 'Solid'}</div>
                        ${log.selectedColors?.map((color, index) => `
                          <div style="display: flex; align-items: center; gap: 12px; padding: 8px; background-color: #1c1917; border-radius: 3px; margin-bottom: 6px;">
                            <div style="text-align: center;">
                              <div style="font-size: 10px; color: #a3a3a3; margin-bottom: 3px;">Glass ${index + 1}</div>
                              <div style="width: 25px; height: 25px; background-color: ${color}; border: 1px solid #d97706; border-radius: 2px;"></div>
                            </div>
                            <div style="color: #fbbf24; font-weight: bold; font-size: 12px;">→</div>
                            <div style="text-align: center;">
                              <div style="font-size: 10px; color: #a3a3a3; margin-bottom: 3px;">Result</div>
                              ${result.mode === 'blend' ? `
                                <div style="width: 25px; height: 25px; background: linear-gradient(90deg, ${result.blendColors?.[0] || '#ffffff'} 0%, ${result.blendColors?.[1] || '#ffffff'} 50%, ${result.blendColors?.[2] || '#ffffff'} 100%); border: 1px solid #d97706; border-radius: 2px;"></div>
                              ` : `
                                <div style="width: 25px; height: 25px; background-color: ${result.color}; border: 1px solid #d97706; border-radius: 2px;"></div>
                              `}
                            </div>
                            <div style="flex: 1; margin-left: 8px;">
                              <p style="margin: 0; color: #fbbf24; font-size: 10px;"><strong>Input:</strong> ${getColorNameFromHex(color)}</p>
                              <p style="margin: 0; color: #d97706; font-size: 10px;"><strong>Output:</strong> ${result.mode === 'blend' ? 'Blend' : getColorNameFromHex(result.color)}</p>
                            </div>
                          </div>
                        `).join('')}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : log.annealedColor && log.selectedColors && log.selectedColors.length > 0 ? `
                <div class="notes">
                  <h3>Color Transformation Results</h3>
                  <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
                    ${log.selectedColors.map((color, index) => `
                      <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background-color: #292524; border-radius: 4px;">
                        <div style="text-align: center;">
                          <div style="font-size: 11px; color: #a3a3a3; margin-bottom: 4px;">Glass ${index + 1}</div>
                          <div style="width: 30px; height: 30px; background-color: ${color}; border: 2px solid #d97706; border-radius: 3px;"></div>
                        </div>
                        <div style="color: #fbbf24; font-weight: bold; font-size: 14px;">→</div>
                        <div style="text-align: center;">
                          <div style="font-size: 11px; color: #a3a3a3; margin-bottom: 4px;">Annealed</div>
                          <div style="width: 30px; height: 30px; background-color: ${log.annealedColor}; border: 2px solid #d97706; border-radius: 3px;"></div>
                        </div>
                        <div style="flex: 1; margin-left: 8px;">
                          <p style="margin: 0; color: #fbbf24; font-size: 11px;"><strong>Input:</strong> ${getColorNameFromHex(color)} (${color})</p>
                          <p style="margin: 0; color: #fbbf24; font-size: 11px;"><strong>Output:</strong> ${log.annealedColor ? getColorNameFromHex(log.annealedColor) : 'Unknown'} (${log.annealedColor})</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
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
      const htmlContent = generatePDFContent(log);
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
      const htmlContent = generatePDFContent(log);
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
      const htmlContent = generatePDFContent(log);
      
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
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/manus-storage/boroprologoicon_47146e54.png" alt="BoroPrologo" className="h-24 w-24 object-contain" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Char
            </a>
            <a href="/calculator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Reheat Calc
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Kiln Log
            </a>
            <a href="/logs" className="text-xs uppercase tracking-wider text-amber-500">
              Logs
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Kiln Logs</h1>
          <p className="text-stone-400">
            View and manage your saved kiln firing logs. Export data for analysis and documentation.
          </p>
        </div>

        {/* Date Range Filter */}
        {logs.length > 0 && (
          <div className="mb-8 p-4 bg-stone-900/50 border border-stone-700 rounded-lg">
            <h2 className="text-sm font-semibold text-amber-400 mb-4">Filter by Date Range</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs text-stone-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-600 rounded text-white text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-stone-400 mb-2">End Date</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-600 rounded text-white text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterStartDate("");
                    setFilterEndDate("");
                  }}
                  className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Showing {filteredLogs.length} of {logs.length} logs
            </p>
          </div>
        )}

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
            {/* Logs List */}
            <div className="grid gap-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-stone-700 rounded-lg bg-stone-900/50 p-4 hover:bg-stone-900 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {log.name}
                      </h3>
                      {log.description && (
                        <p className="text-sm text-stone-400 mb-2">
                          {log.description}
                        </p>
                      )}
                      <p className="text-xs text-stone-500">
                        Created: {new Date(log.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        {log.temperatures.length} data points • Max temp:{" "}
                        {Math.max(...log.temperatures)}°C
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handlePreviewPDF(log)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                        title="Preview PDF before printing"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Preview PDF</span>
                      </button>

                      <button
                        onClick={() => handleUploadPDF(log)}
                        style={{
                          backgroundColor: log.lineColor || '#15803d',
                          borderColor: log.lineColor || '#15803d',
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-white rounded transition-colors hover:opacity-80"
                        title="Download PDF file"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Upload PDF</span>
                      </button>

                      <button
                        onClick={() => {
                          setColorWheelLog(log);
                          setShowColorWheelModal(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors"
                        title="View glass colors used"
                      >
                        <Palette className="w-4 h-4" />
                        <span className="text-sm">Colors</span>
                      </button>

                      <button
                        onClick={() => handleOpenComments(log)}
                        className="flex items-center gap-2 px-3 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors"
                        title="View and edit comments"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Comments</span>
                      </button>

                      <button
                        onClick={() => handleDelete(log.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-900/50 hover:bg-red-900 text-red-300 rounded transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-stone-700">
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-900/50 hover:bg-red-900 text-red-300 rounded transition-colors text-sm font-semibold"
              >
                Delete All Logs
              </button>
            </div>
          </div>
        ) : null}
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
                onClick={() => {
                  const printWindow = window.open('', '', 'height=800,width=1000');
                  if (printWindow) {
                    printWindow.document.write(pdfPreviewContent);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors flex-1 justify-center"
              >
                <FileText className="w-4 h-4" />
                Print PDF
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
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 max-w-2xl w-full shadow-xl">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-amber-500">Select Glass Color to Compare</h3>
                <button
                  onClick={() => {
                    setColorSelectionMode(!colorSelectionMode);
                    setSelectedGlassColors(new Set());
                  }}
                  className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                >
                  {colorSelectionMode ? 'Cancel' : 'Select Multiple'}
                </button>
                {colorSelectionMode && selectedGlassColors.size > 0 && (
                  <button
                    onClick={() => {
                      const updatedColors = colorWheelLog.selectedColors?.filter(
                        (color) => !selectedGlassColors.has(color)
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
                <button
                  onClick={() => setShowRenameButtons(!showRenameButtons)}
                  className="px-3 py-1 text-sm bg-amber-700 hover:bg-amber-600 text-white rounded transition-colors"
                >
                  {showRenameButtons ? 'Hide Rename' : 'Rename'}
                </button>
              </div>
              {colorWheelLog.selectedColors && colorWheelLog.selectedColors.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {colorWheelLog.selectedColors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative">
                      {colorSelectionMode && (
                        <input
                          type="checkbox"
                          checked={selectedGlassColors.has(color)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedGlassColors);
                            if (e.target.checked) {
                              newSelected.add(color);
                            } else {
                              newSelected.delete(color);
                            }
                            setSelectedGlassColors(newSelected);
                          }}
                          className="absolute top-1 left-1 w-5 h-5 cursor-pointer z-10"
                        />
                      )}
                      <button
                        onClick={() => {
                          if (colorSelectionMode) {
                            const newSelected = new Set(selectedGlassColors);
                            if (newSelected.has(color)) {
                              newSelected.delete(color);
                            } else {
                              newSelected.add(color);
                            }
                            setSelectedGlassColors(newSelected);
                          } else {
                            setSelectedGlassColor(color);
                          }
                        }}
                        className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all mb-2 ${
                          colorSelectionMode && selectedGlassColors.has(color)
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
                  Blend (Up to 3)
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
                      background: `linear-gradient(90deg, ${blendColors[0] || '#ffffff'} 0%, ${blendColors[1] || '#ffffff'} 50%, ${blendColors[2] || '#ffffff'} 100%)`
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-400">Saved Annealed Results</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAnnealedSelectionMode(!annealedSelectionMode);
                        setSelectedAnnealedIds(new Set());
                      }}
                      className="px-3 py-1 text-sm bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      {annealedSelectionMode ? 'Cancel' : 'Select Multiple'}
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
                          }
                        }}
                        className="px-3 py-1 text-sm bg-red-700 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
                        disabled={selectedAnnealedIds.size === 0}
                      >
                        Delete Selected
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setDeleteMode(!deleteMode);
                        setSelectedAnnealedIds(new Set());
                      }}
                      className="px-3 py-1 text-sm bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      {deleteMode ? 'Cancel' : 'Delete'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {colorWheelLog.annealedColors.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        if (annealedSelectionMode) {
                          const newSelected = new Set(selectedAnnealedIds);
                          if (newSelected.has(result.id)) {
                            newSelected.delete(result.id);
                          } else {
                            newSelected.add(result.id);
                          }
                          setSelectedAnnealedIds(newSelected);
                        } else {
                          setTempAnnealedColor(result.color);
                        }
                      }}
                      className={`p-3 rounded-lg border-2 transition-all relative ${
                        annealedSelectionMode && selectedAnnealedIds.has(result.id)
                          ? 'border-blue-500 ring-2 ring-blue-400 bg-stone-700'
                          : tempAnnealedColor === result.color
                          ? 'border-purple-500 ring-2 ring-purple-400 bg-stone-800'
                          : 'border-stone-600 hover:border-stone-500 bg-stone-800'
                      }`}
                    >
                      {annealedSelectionMode && (
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
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <div className="w-12 h-12 rounded mb-2 flex items-center justify-center" style={{ backgroundColor: result.color }}>
                        {result.mode === 'blend' ? (
                          <div className="w-full h-full rounded" style={{
                            background: `linear-gradient(90deg, ${result.blendColors?.[0] || '#ffffff'} 0%, ${result.blendColors?.[1] || '#ffffff'} 50%, ${result.blendColors?.[2] || '#ffffff'} 100%)`
                          }} />
                        ) : (
                          <ColoredGlassJar color={result.color} size={40} />
                        )}
                      </div>
                      <div className="text-xs text-stone-400 text-center">{result.mode === 'blend' ? 'Blend' : 'Solid'}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comparison Section */}
            {(tempAnnealedColor || colorWheelLog?.annealedColor) && selectedGlassColor && (
              <div className="mb-6 border-t border-stone-700 pt-6">
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
                    {blendMode === 'solid' ? (
                      <div className="w-20 h-20 rounded-lg border-2 border-amber-600 flex items-center justify-center mb-2" style={{ backgroundColor: tempAnnealedColor || colorWheelLog?.annealedColor || '#ffffff' }}>
                        <ColoredGlassJar color={tempAnnealedColor || colorWheelLog?.annealedColor || '#ffffff'} size={60} />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-purple-600 flex items-center justify-center mb-2" style={{
                        background: `linear-gradient(90deg, ${blendColors[0] || '#ffffff'} 0%, ${blendColors[1] || '#ffffff'} 50%, ${blendColors[2] || '#ffffff'} 100%)`
                      }}>
                      </div>
                    )}
                    <p className="text-xs text-amber-500 font-semibold text-center">
                      {blendMode === 'solid' 
                        ? getColorNameFromHex(tempAnnealedColor || colorWheelLog?.annealedColor || '#ffffff')
                        : 'Blend Mix'}
                    </p>
                  </div>
                </div>
              </div>
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

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowColorWheelModal(false)}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
