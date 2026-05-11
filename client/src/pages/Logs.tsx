/*
Logs Page - View and manage saved kiln logs with localStorage persistence
*/

import { useState, useEffect } from "react";
import { Download, Trash2, Eye, FileText, Eye as EyeIcon, MessageCircle, Palette, ChevronDown, ChevronRight } from "lucide-react";
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
  savedColorCombinations?: Array<{
    id: string;
    glassColor: string;
    annealedResult: {
      mode: 'solid' | 'blend';
      color?: string;
      blendColors?: string[];
    };
  }>;
}

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  logIds: string[];
}

export default function Logs() {
  const [logs, setLogs] = useState<SavedLog[]>([]);
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfPreviewContent, setPDFPreviewContent] = useState<string>("");
  const [showColorWheelModal, setShowColorWheelModal] = useState(false);
  const [colorWheelLog, setColorWheelLog] = useState<SavedLog | null>(null);
  const [selectedSavedCombos, setSelectedSavedCombos] = useState<Set<string>>(new Set());
  const [savedComboSelectionMode, setSavedComboSelectionMode] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [selectedFolderForAddLog, setSelectedFolderForAddLog] = useState<string | null>(null);
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedLogsForAddition, setSelectedLogsForAddition] = useState<Set<string>>(new Set());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Toggle folder expansion
  const toggleFolderExpansion = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

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

  // Helper function to get all log IDs that are in any folder
  const getLogsInFolders = () => {
    const logsInFolders = new Set<string>();
    folders.forEach((folder) => {
      folder.logIds?.forEach((logId) => {
        logsInFolders.add(logId);
      });
    });
    return logsInFolders;
  };

  // Get standalone logs (logs not in any folder)
  const standaloneLogsFiltered = logs.filter((log) => !getLogsInFolders().has(log.id));

  // Get logs for a specific folder
  const getLogsForFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    return folder?.logIds?.map((logId) => logs.find((log) => log.id === logId)).filter(Boolean) || [];
  };

  // Add all selected logs to the current folder
  const handleAddSelectedLogs = () => {
    if (selectedLogsForAddition.size === 0) {
      toast.error("Please select at least one log");
      return;
    }

    if (!selectedFolderForAddLog) {
      toast.error("No folder selected");
      return;
    }

    const updatedFolders = folders.map((folder) => {
      if (folder.id === selectedFolderForAddLog) {
        const existingLogIds = new Set(folder.logIds || []);
        const newLogsToAdd = Array.from(selectedLogsForAddition).filter(
          (logId) => !existingLogIds.has(logId)
        );

        if (newLogsToAdd.length === 0) {
          toast.error("All selected logs already exist in this folder");
          return folder;
        }

        const updatedLogIds = [...(folder.logIds || []), ...newLogsToAdd];
        const duplicateCount = selectedLogsForAddition.size - newLogsToAdd.length;

        if (duplicateCount > 0) {
          toast.success(`Added ${newLogsToAdd.length} log(s) to folder (${duplicateCount} already existed)`);
        } else {
          toast.success(`Added ${newLogsToAdd.length} log(s) to folder`);
        }

        return { ...folder, logIds: updatedLogIds };
      }
      return folder;
    });

    setFolders(updatedFolders);
    localStorage.setItem("kilnFolders", JSON.stringify(updatedFolders));
    setShowAddLogModal(false);
    setSelectedLogsForAddition(new Set());
  };

  // PDF generation and preview functions
  const generatePDFContent = (log: SavedLog): string => {
    const temps = log.temperatures || [];
    const times = log.times || [];
    const maxTemp = Math.max(...temps, 0);
    const maxTime = Math.max(...times, 1);

    let html = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          .info { margin: 20px 0; }
          .graph { margin: 30px 0; }
          svg { border: 1px solid #ccc; }
        </style>
      </head>
      <body>
        <h1>${log.name}</h1>
        <div class="info">
          <p><strong>Created:</strong> ${new Date(log.createdAt).toLocaleDateString()}</p>
          <p><strong>Description:</strong> ${log.description || 'N/A'}</p>
          <p><strong>Notes:</strong> ${log.notes || 'N/A'}</p>
        </div>
        <div class="graph">
          <h2>Temperature Profile</h2>
          <svg width="600" height="400" viewBox="0 0 600 400">
            <rect width="600" height="400" fill="white" stroke="black"/>
            <text x="10" y="20">Temperature (°C)</text>
            <text x="500" y="390">Time (min)</text>
    `;

    if (temps.length > 0) {
      const points = temps
        .map((temp, i) => {
          const x = 50 + (times[i] / maxTime) * 500;
          const y = 350 - (temp / maxTemp) * 300;
          return `${x},${y}`;
        })
        .join(" ");
      html += `<polyline points="${points}" fill="none" stroke="red" stroke-width="2"/>`;
    }

    html += `
          </svg>
        </div>
      </body>
      </html>
    `;
    return html;
  };

  const handlePreviewPDF = (log: SavedLog) => {
    try {
      const htmlContent = generatePDFContent(log);
      setPDFPreviewContent(htmlContent);
      setShowPDFModal(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF preview");
    }
  };

  const handleExportCSV = (log: SavedLog) => {
    try {
      const csvContent = [
        ["Time (min)", "Temperature (°C)"],
        ...(log.times || []).map((time, i) => [time, log.temperatures?.[i] || ""]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${log.name}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-500 mb-6">Kiln Logs</h1>

      {/* Date Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className="px-4 py-2 bg-stone-800 border border-stone-700 rounded text-white"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="px-4 py-2 bg-stone-800 border border-stone-700 rounded text-white"
          placeholder="End Date"
        />
      </div>

      {/* Create Folder Section */}
      <div className="mb-6">
        {!showFolderInput ? (
          <button
            onClick={() => setShowFolderInput(true)}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors"
          >
            Create Folder
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="px-4 py-2 bg-stone-800 border border-stone-700 rounded text-white flex-1"
              onKeyPress={(e) => {
                if (e.key === "Enter" && newFolderName.trim()) {
                  const newFolder: Folder = {
                    id: Date.now().toString(),
                    name: newFolderName,
                    createdAt: new Date(),
                    logIds: [],
                  };
                  setFolders([...folders, newFolder]);
                  localStorage.setItem("kilnFolders", JSON.stringify([...folders, newFolder]));
                  setNewFolderName("");
                  setShowFolderInput(false);
                  toast.success("Folder created");
                }
              }}
            />
            <button
              onClick={() => setShowFolderInput(false)}
              className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Logs and Folders Display */}
      <div className="space-y-4">
        {/* Action Buttons */}
        <div className="flex gap-2">
          {!showCheckboxes ? (
            <button
              onClick={() => setShowCheckboxes(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors text-sm font-medium"
            >
              Select Logs
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowCheckboxes(false);
                  setSelectedLogIds(new Set());
                }}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const allIds = new Set(standaloneLogsFiltered.map(log => log.id));
                  setSelectedLogIds(selectedLogIds.size === allIds.size ? new Set() : allIds);
                }}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors text-sm font-medium"
              >
                {selectedLogIds.size === standaloneLogsFiltered.length && standaloneLogsFiltered.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            </>
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
          {/* Folders with expandable logs */}
          {folders.map((folder) => {
            const isExpanded = expandedFolders.has(folder.id);
            const folderLogs = getLogsForFolder(folder.id);
            return (
              <div key={folder.id} className="border border-purple-600 rounded-lg bg-purple-900/20 overflow-hidden">
                {/* Folder Header */}
                <div className="p-4 hover:bg-purple-900/40 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleFolderExpansion(folder.id)}
                      className="flex items-center justify-center w-6 h-6 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <span className="text-2xl">📁</span>
                    <div>
                      <h3 className="text-white font-semibold">{folder.name}</h3>
                      <p className="text-stone-400 text-xs">{folderLogs.length} log{folderLogs.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedFolderForAddLog(folder.id);
                        setShowAddLogModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors text-sm"
                    >
                      Add Log
                    </button>
                    <button
                      onClick={() => {
                        const updatedFolders = folders.filter(f => f.id !== folder.id);
                        setFolders(updatedFolders);
                        localStorage.setItem('kilnFolders', JSON.stringify(updatedFolders));
                        toast.success(`Folder deleted`);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded Logs List */}
                {isExpanded && folderLogs.length > 0 && (
                  <div className="border-t border-purple-600 bg-purple-900/10 p-4 space-y-2">
                    {folderLogs.map((log) => (
                      <div
                        key={log?.id}
                        className="flex items-center justify-between px-4 py-3 bg-stone-800 hover:bg-stone-700 rounded transition-colors border border-stone-700"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-white">{log?.name}</div>
                          <div className="text-xs text-stone-400">Created: {new Date(log?.createdAt || '').toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreviewPDF(log!)}
                            className="flex items-center gap-1 px-2 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors text-xs"
                            title="Preview PDF"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleExportCSV(log!)}
                            className="flex items-center gap-1 px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded transition-colors text-xs"
                            title="Export CSV"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => {
                              const updatedFolders = folders.map((f) =>
                                f.id === folder.id
                                  ? { ...f, logIds: f.logIds?.filter((id) => id !== log?.id) || [] }
                                  : f
                              );
                              setFolders(updatedFolders);
                              localStorage.setItem('kilnFolders', JSON.stringify(updatedFolders));
                              toast.success('Log removed from folder');
                            }}
                            className="flex items-center gap-1 px-2 py-1 bg-red-700 hover:bg-red-600 text-white rounded transition-colors text-xs"
                            title="Remove from folder"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty Folder Message */}
                {isExpanded && folderLogs.length === 0 && (
                  <div className="border-t border-purple-600 bg-purple-900/10 p-4 text-center text-stone-400 text-sm">
                    No logs in this folder
                  </div>
                )}
              </div>
            );
          })}

          {/* Standalone Logs */}
          {standaloneLogsFiltered.map((log) => (
            <div
              key={log.id}
              className="border border-stone-700 rounded-lg bg-stone-900/50 p-4 hover:bg-stone-900 transition-colors"
            >
              <div className="flex items-start justify-between">
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
                    className="mr-4 w-5 h-5 cursor-pointer"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {log.name}
                  </h3>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handlePreviewPDF(log)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded transition-colors"
                    title="Preview PDF before printing"
                  >
                    <span className="text-sm">Preview PDF</span>
                  </button>

                  <button
                    onClick={() => handleExportCSV(log)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-700 hover:bg-green-600 text-white rounded transition-colors"
                  >
                    <Download size={18} />
                    <span className="text-sm">Export CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      setColorWheelLog(log);
                      setShowColorWheelModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors"
                  >
                    <Palette size={18} />
                    <span className="text-sm">Color Wheel</span>
                  </button>

                  <button
                    onClick={() => {
                      const updatedLogs = logs.filter((l) => l.id !== log.id);
                      setLogs(updatedLogs);
                      localStorage.setItem("kilnLogs", JSON.stringify(updatedLogs));
                      toast.success("Log deleted");
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-red-700 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">PDF Preview</h2>
            <iframe
              srcDoc={pdfPreviewContent}
              className="w-full h-80 border border-stone-700 rounded"
            />
            <button
              onClick={() => setShowPDFModal(false)}
              className="mt-4 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
            >
              Close
            </button>
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
                  {standaloneLogsFiltered.length > 0 && (
                    <>
                      <div className="text-sm font-semibold text-amber-400 mb-2">Standalone Logs</div>
                      {standaloneLogsFiltered.map((log) => (
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
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddLogModal(false)}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelectedLogs}
                disabled={selectedLogsForAddition.size === 0}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-stone-700 disabled:cursor-not-allowed text-white rounded transition-colors font-semibold"
              >
                Add Selected ({selectedLogsForAddition.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Wheel Modal */}
      {showColorWheelModal && colorWheelLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-amber-500 mb-4">Color Wheel - {colorWheelLog.name}</h2>
            
            {/* Saved Color Comparisons */}
            {colorWheelLog.savedColorCombinations && colorWheelLog.savedColorCombinations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-amber-400">Saved Color Comparisons</h3>
                  {!savedComboSelectionMode && (
                    <button
                      onClick={() => setSavedComboSelectionMode(true)}
                      className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded transition-colors text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {colorWheelLog.savedColorCombinations.map((combo) => (
                    <div
                      key={combo.id}
                      className="relative p-3 bg-stone-800 rounded border border-stone-700 hover:border-amber-600 transition-colors"
                    >
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

            {/* Close Button */}
            <div className="flex justify-end gap-2">
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
                  setSavedComboSelectionMode(false);
                  setSelectedSavedCombos(new Set());
                }}
                className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
