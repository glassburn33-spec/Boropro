/*
Logs Page - View and manage saved kiln logs with localStorage persistence
*/

import { useState, useEffect } from "react";
import { Download, Trash2, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

interface SavedLog {
  id: string;
  name: string;
  temperatures: number[];
  times: number[];
  createdAt: string;
  description?: string;
}

export default function Logs() {
  const [logs, setLogs] = useState<SavedLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<SavedLog | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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

        {logs.length === 0 ? (
          <div className="text-center py-12 border border-stone-700 rounded-lg bg-stone-900/50">
            <p className="text-stone-400 mb-2">No logs saved yet</p>
            <p className="text-stone-500 text-sm">
              Create and save kiln logs from the Firing Tracker to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Logs List */}
            <div className="grid gap-4">
              {logs.map((log) => (
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
                        onClick={() => {
                          setSelectedLog(log);
                          setShowPreview(true);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
                        title="Preview log"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Preview</span>
                      </button>

                      <button
                        onClick={() => handleExportCSV(log)}
                        className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors"
                        title="Export to CSV"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">CSV</span>
                      </button>

                      <button
                        onClick={() => handleExportPDF(log)}
                        className="flex items-center gap-2 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
                        title="Export to PDF"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">PDF</span>
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
        )}
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
    </div>
  );
}

  const handleExportPDF = (log: SavedLog) => {
    try {
      const htmlContent = `
        <html>
          <head>
            <title>${log.name} - Kiln Log</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; background: white; }
              h1 { color: #333; }
              .metadata { margin: 20px 0; color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            <h1>Kiln Log: ${log.name}</h1>
            <div class="metadata">
              <p><strong>Created:</strong> ${new Date(log.createdAt).toLocaleString()}</p>
              <p><strong>Max Temperature:</strong> ${Math.max(...log.temperatures)}°C</p>
              <p><strong>Duration:</strong> ${Math.max(...log.times)} minutes</p>
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
          </body>
        </html>
      `;

      const printWindow = window.open('', '', 'height=600,width=800');
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
