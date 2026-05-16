/*
Logs Page - View and manage saved kiln logs with localStorage persistence
*/

import { useState, useEffect } from "react";
import { Download, Trash2, Eye, FileText, Eye as EyeIcon, MessageCircle, Palette, Menu, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { ColoredGlassJar } from "@/components/ColoredGlassJar";
import jsPDF from 'jspdf';

interface KilnLog {
  id: string;
  name: string;
  timestamp: number;
  data: {
    startTemp: number;
    endTemp: number;
    duration: number;
    notes: string;
    colors: Array<{ name: string; hex: string }>;
  };
  lineColor?: string;
}

export default function Logs() {
  const [logs, setLogs] = useState<KilnLog[]>([]);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [showColorWheelModal, setShowColorWheelModal] = useState(false);
  const [colorWheelLog, setColorWheelLog] = useState<KilnLog | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentsLog, setCommentsLog] = useState<KilnLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('kilnLogs');
    if (stored) {
      try {
        setLogs(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load logs:', e);
      }
    }

    const handleLogsUpdated = (event: any) => {
      setLogs(event.detail);
    };

    window.addEventListener('logsUpdated', handleLogsUpdated);
    return () => window.removeEventListener('logsUpdated', handleLogsUpdated);
  }, []);

  const filteredLogs = logs.filter(log =>
    log.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePreviewPDF = (log: KilnLog) => {
    const content = generatePDFContent(log, tempUnit);
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(content);
      newWindow.document.close();
    }
  };

  const generatePDFContent = (log: KilnLog, unit: 'C' | 'F'): string => {
    const startTemp = unit === 'F' ? (log.data.startTemp * 9/5) + 32 : log.data.startTemp;
    const endTemp = unit === 'F' ? (log.data.endTemp * 9/5) + 32 : log.data.endTemp;
    const tempUnit = unit === 'F' ? '°F' : '°C';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${log.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #e0e0e0; }
          .container { max-width: 800px; margin: 0 auto; background: #2a2a2a; padding: 20px; border-radius: 8px; }
          h1 { color: #fbbf24; border-bottom: 2px solid #fbbf24; padding-bottom: 10px; }
          .section { margin: 20px 0; }
          .section-title { color: #fbbf24; font-weight: bold; margin-top: 15px; }
          .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #444; }
          .label { font-weight: bold; }
          .colors { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
          .color-swatch { width: 40px; height: 40px; border-radius: 4px; border: 1px solid #666; }
          .notes { background: #333; padding: 10px; border-radius: 4px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${log.name}</h1>
          <div class="section">
            <div class="data-row">
              <span class="label">Date:</span>
              <span>${new Date(log.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="data-row">
              <span class="label">Start Temperature:</span>
              <span>${startTemp.toFixed(1)}${tempUnit}</span>
            </div>
            <div class="data-row">
              <span class="label">End Temperature:</span>
              <span>${endTemp.toFixed(1)}${tempUnit}</span>
            </div>
            <div class="data-row">
              <span class="label">Duration:</span>
              <span>${log.data.duration} minutes</span>
            </div>
          </div>
          ${log.data.colors && log.data.colors.length > 0 ? `
            <div class="section">
              <div class="section-title">Glass Colors Used</div>
              <div class="colors">
                ${log.data.colors.map(color => `
                  <div title="${color.name}">
                    <div class="color-swatch" style="background-color: ${color.hex};"></div>
                    <small>${color.name}</small>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          ${log.data.notes ? `
            <div class="section">
              <div class="section-title">Notes</div>
              <div class="notes">${log.data.notes}</div>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  };

  const handleOpenComments = (log: KilnLog) => {
    setCommentsLog(log);
    setShowCommentsModal(true);
  };

  const handleDelete = (logId: string) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      const updatedLogs = logs.filter(l => l.id !== logId);
      setLogs(updatedLogs);
      localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
      window.dispatchEvent(new CustomEvent('logsUpdated', { detail: updatedLogs }));
      toast.success('Log deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-amber-400">Kiln Logs</h1>
          <button
            onClick={() => setShowCheckboxes(!showCheckboxes)}
            className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
          >
            {showCheckboxes ? 'Done Selecting' : 'Select Logs'}
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTempUnit('C')}
            className={`px-4 py-2 rounded transition-colors ${
              tempUnit === 'C'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setTempUnit('F')}
            className={`px-4 py-2 rounded transition-colors ${
              tempUnit === 'F'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
            }`}
          >
            °F
          </button>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="border border-stone-700 rounded-lg bg-stone-900/50 p-4 hover:bg-stone-900 transition-colors"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
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
                    <div className="relative group flex-shrink-0">
                      <button
                        className="flex items-center gap-1 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors text-xs sm:text-sm"
                        title="Log actions"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-stone-800 border border-stone-600 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                        <button
                          onClick={() => handlePreviewPDF(log)}
                          className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors text-sm"
                          title="View log"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            try {
                              const htmlContent = generatePDFContent(log, tempUnit);
                              const iframe = document.createElement('iframe');
                              iframe.style.display = 'none';
                              document.body.appendChild(iframe);
                              iframe.onload = () => {
                                try {
                                  iframe.contentDocument?.write(htmlContent);
                                  iframe.contentDocument?.close();
                                  setTimeout(() => {
                                    const filename = `${log.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
                                    if (typeof (window as any).html2pdf !== 'undefined') {
                                      const element = iframe.contentDocument?.body;
                                      if (element) {
                                        (window as any).html2pdf().set({
                                          margin: 10,
                                          filename: filename,
                                          image: { type: 'jpeg', quality: 0.98 },
                                          html2canvas: { scale: 2 },
                                          jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
                                        }).from(element).save();
                                        toast.success('PDF downloaded successfully!');
                                      }
                                    } else {
                                      iframe.contentWindow?.print();
                                      toast.success('PDF ready to print');
                                    }
                                    setTimeout(() => {
                                      document.body.removeChild(iframe);
                                    }, 1000);
                                  }, 500);
                                } catch (error) {
                                  console.error('Failed to process PDF:', error);
                                  toast.error('Failed to generate PDF');
                                  document.body.removeChild(iframe);
                                }
                              };
                              iframe.src = 'about:blank';
                            } catch (error) {
                              console.error('Failed to generate PDF:', error);
                              toast.error('Failed to generate PDF');
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors text-sm"
                          title="Download log as PDF"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => {
                            setColorWheelLog(log);
                            setShowColorWheelModal(true);
                          }}
                          className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors text-sm"
                          title="View glass colors used"
                        >
                          Colors
                        </button>
                        <button
                          onClick={() => handleOpenComments(log)}
                          className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors text-sm"
                          title="View and edit comments"
                        >
                          Notes
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
                          className="w-full text-left px-4 py-2 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors text-sm"
                          title="Rename log"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-stone-700 hover:text-red-300 transition-colors text-sm"
                          title="Delete log (requires confirmation)"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-400 text-lg">No logs found. Start logging your kiln sessions!</p>
          </div>
        )}
      </div>

      {showColorWheelModal && colorWheelLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-amber-400 mb-4">{colorWheelLog.name} - Colors Used</h2>
            {colorWheelLog.data.colors && colorWheelLog.data.colors.length > 0 ? (
              <div className="space-y-3">
                {colorWheelLog.data.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded border border-stone-600"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-stone-300">{color.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-400">No colors recorded for this log.</p>
            )}
            <button
              onClick={() => setShowColorWheelModal(false)}
              className="mt-6 w-full px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showCommentsModal && commentsLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-amber-400 mb-4">{commentsLog.name} - Notes</h2>
            <p className="text-stone-300 mb-4">{commentsLog.data.notes || 'No notes recorded.'}</p>
            <button
              onClick={() => setShowCommentsModal(false)}
              className="w-full px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
