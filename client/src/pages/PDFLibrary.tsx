/*
Log Library Page - Manage uploaded kiln schedules and generated PDFs
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useEffect } from "react";
import { FileText, Trash2, Download, Upload, X, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import jsPDF from "jspdf";


interface PDFItem {
  id: number;
  filename: string;
  temperatures: number[];
  times: number[];
  uploadedAt: Date;
  storageKey: string;
  notes?: string;
  results?: string;
  color?: string;
}

export default function LogLibrary() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<PDFItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>('/manus-storage/glasscoloumn_69d60b8f.jfif');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<number[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folders, setFolders] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [schedulesInFolders, setSchedulesInFolders] = useState<Record<string, number[]>>({});
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [selectedFolderForInsert, setSelectedFolderForInsert] = useState<string | null>(null);
  const [schedulesToInsert, setSchedulesToInsert] = useState<Set<number>>(new Set());
  const [expandedFoldersInModal, setExpandedFoldersInModal] = useState<Set<string>>(new Set());
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPDF, setEditingPDF] = useState<PDFItem | null>(null);
  const [editingFilename, setEditingFilename] = useState('');
  const [editingNotes, setEditingNotes] = useState('');
  const [editingResults, setEditingResults] = useState('');
  const [selectedColor, setSelectedColor] = useState('#dc2626');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [viewingNotesPDF, setViewingNotesPDF] = useState<PDFItem | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [viewingLog, setViewingLog] = useState<any | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  
  const colorOptions = [
    { value: '#dc2626', label: 'Red' },
    { value: '#ea580c', label: 'Orange' },
    { value: '#22c55e', label: 'Green' },
    { value: '#3b82f6', label: 'Blue' },
  ];

  // Load logs from localStorage on mount
  useEffect(() => {
    const loadLogs = () => {
      const savedLogs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
      setLogs(savedLogs);
    };

    loadLogs();

    // Listen for logs update events
    const handleLogsUpdate = (event: any) => {
      setLogs(event.detail);
    };

    window.addEventListener('logsUpdated', handleLogsUpdate);
    return () => window.removeEventListener('logsUpdated', handleLogsUpdate);
  }, []);

  // Fetch PDF library from backend
  const { data: library = [], refetch, isLoading } = trpc.pdfLibrary.list.useQuery();
  const uploadMutation = trpc.pdfLibrary.upload.useMutation();
  const saveGeneratedMutation = trpc.pdfLibrary.saveGenerated.useMutation();
  const deleteMutation = trpc.pdfLibrary.delete.useMutation();

  // Convert database records to display format
  const displayLibrary: PDFItem[] = library
    .map((pdf: any) => ({
      id: pdf.id,
      filename: pdf.filename,
      temperatures: pdf.temperatures ? JSON.parse(pdf.temperatures) : [],
      times: pdf.times ? JSON.parse(pdf.times) : [],
      uploadedAt: new Date(pdf.uploadedAt),
      storageKey: pdf.storageKey,
    }))
    .filter(pdf => {
      // Check if this PDF is in any folder
      for (const folderIds of Object.values(schedulesInFolders)) {
        if (folderIds.includes(pdf.id)) {
          return false; // Exclude if in any folder
        }
      }
      return true; // Include if not in any folder
    });
  
  // Keep all PDFs for use in modals and folders
  const allLibrary: PDFItem[] = library.map((pdf: any) => ({
    id: pdf.id,
    filename: pdf.filename,
    temperatures: pdf.temperatures ? JSON.parse(pdf.temperatures) : [],
    times: pdf.times ? JSON.parse(pdf.times) : [],
    uploadedAt: new Date(pdf.uploadedAt),
    storageKey: pdf.storageKey,
  }));

  const processFile = async (file: File) => {
    if (!file.type.includes("pdf")) {
      toast.error("Please select a valid PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryArray = Array.from(uint8Array);
      const binaryString = String.fromCharCode.apply(null, binaryArray as any);
      const fileBase64 = btoa(binaryString);

      await uploadMutation.mutateAsync({
        filename: file.name,
        fileBase64,
      });

      toast.success("PDF uploaded successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to upload PDF:", error);
      toast.error("Failed to upload PDF. Please ensure it is a valid PDF file.");
    } finally {
      setIsUploading(false);
      setIsDragActive(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
    // Reset input
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleOpenPreview = () => {
    setShowPreviewModal(true);
  };

  const handleClosePreview = () => {
    setShowPreviewModal(false);
  };

  const handleToggleComparison = (id: number) => {
    setSelectedForComparison((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleOpenComparison = () => {
    if (selectedForComparison.length < 2) {
      toast.error("Please select at least 2 PDFs to compare.");
      return;
    }
    setShowComparisonModal(true);
  };

  const handleCloseComparison = () => {
    setShowComparisonModal(false);
  };

  const getComparisonData = () => {
    return displayLibrary.filter((pdf) => selectedForComparison.includes(pdf.id));
  };

  const handleExportCSV = () => {
    if (!selectedPDF) return;

    // Create CSV content
    const headers = ["Temperature (°F)", "Time (hours)"];
    const rows: string[][] = [];

    // Get max length to pad rows
    const maxLength = Math.max(selectedPDF.temperatures.length, selectedPDF.times.length);

    for (let i = 0; i < maxLength; i++) {
      const temp = selectedPDF.temperatures[i] ?? "";
      const time = selectedPDF.times[i] ?? "";
      rows.push([temp.toString(), time.toString()]);
    }

    // Create CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedPDF.filename.replace(".pdf", "")}_data.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully!");
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this schedule? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("PDF deleted successfully!");
      if (selectedPDF?.id === id) {
        setSelectedPDF(null);
      }
      refetch();
    } catch (error) {
      console.error("Failed to delete PDF:", error);
      toast.error("Failed to delete PDF.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
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
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-amber-500">
              Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="flex items-center gap-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
                  Log Library
                </h1>
              </div>
              <img src="/manus-storage/glasslogicon_37f25371.png" alt="Glassmaker's Log" className="h-96 w-96 object-contain flex-shrink-0" />
            </div>
          </div>
        </section>



        {/* Library Grid */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Schedule Library</h2>
              <div className="flex gap-2">
                {!selectMode && (
                  <button
                    onClick={() => setShowFolderModal(true)}
                    className="px-4 py-2 rounded-lg border border-green-500 text-green-500 hover:bg-green-500/10 font-mono text-xs font-bold uppercase transition-colors"
                  >
                    + Add Folder
                  </button>
                )}
                {selectMode && (
                  <>
                    {selectedForDeletion.length === 0 ? (
                      <button
                        onClick={() => setSelectedForDeletion(displayLibrary.map(pdf => pdf.id))}
                        className="px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 font-mono text-xs font-bold uppercase transition-colors"
                      >
                        Select All
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedForDeletion([])}
                        className="px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 font-mono text-xs font-bold uppercase transition-colors"
                      >
                        Deselect All
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (selectedForDeletion.length === 0) {
                          alert('No schedules selected');
                          return;
                        }
                        if (confirm(`Are you sure you want to delete ${selectedForDeletion.length} schedule(s)? This action cannot be undone.`)) {
                          selectedForDeletion.forEach(id => {
                            deleteMutation.mutate({ id }, {
                              onSuccess: () => {
                                refetch();
                                setSelectedForDeletion(selectedForDeletion.filter(selectedId => selectedId !== id));
                              }
                            });
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 font-mono text-xs font-bold uppercase transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectedForDeletion([]);
                    setSelectMode(!selectMode);
                  }}
                  className="px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 font-mono text-xs font-bold uppercase transition-colors"
                >
                  {selectMode ? 'Cancel' : 'Select'}
                </button>
              </div>
            </div>
            {isLoading ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <p className="text-stone-400">Loading your library...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Display Folders */}
                {folders.map((folder) => (
                  <div key={folder} className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-left">
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedFolders);
                        if (newExpanded.has(folder)) {
                          newExpanded.delete(folder);
                        } else {
                          newExpanded.add(folder);
                        }
                        setExpandedFolders(newExpanded);
                      }}
                      className="w-full text-left font-mono text-sm font-bold text-green-400 hover:text-green-300 transition-colors"
                    >
                      📁 {folder} ({(schedulesInFolders[folder] || []).length})
                    </button>
                    {expandedFolders.has(folder) && (
                      <div className="mt-2 flex items-center justify-end">
                        <button
                          onClick={() => {
                            setSelectedFolderForInsert(folder);
                            setSchedulesToInsert(new Set());
                            setShowInsertModal(true);
                          }}
                          className="px-3 py-1 rounded border border-green-500 text-green-500 hover:bg-green-500/10 font-mono text-xs font-bold uppercase transition-colors"
                        >
                          Insert
                        </button>
                      </div>
                    )}
                    {expandedFolders.has(folder) && (
                      <div className="mt-3 ml-4 space-y-2">
                        {(schedulesInFolders[folder] || []).length === 0 ? (
                          <p className="text-xs text-stone-400">No schedules in this folder</p>
                        ) : (
                          allLibrary
                            .filter(pdf => (schedulesInFolders[folder] || []).includes(pdf.id))
                            .map(pdf => (
                              <div
                                key={pdf.id}
                                onClick={() => !selectMode && setSelectedPDF(pdf)}
                                className={`rounded-lg border p-3 backdrop-blur-sm text-left transition-all ${selectMode ? 'cursor-default' : 'cursor-pointer'} flex items-center justify-between ${
                                  selectedPDF?.id === pdf.id
                                    ? "border-green-500 bg-green-500/10"
                                    : "border-green-500/30 bg-green-500/5 hover:border-green-500/50"
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {selectMode && (
                                    <input
                                      type="checkbox"
                                      checked={selectedForDeletion.includes(pdf.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        if (selectedForDeletion.includes(pdf.id)) {
                                          setSelectedForDeletion(selectedForDeletion.filter(id => id !== pdf.id));
                                        } else {
                                          setSelectedForDeletion([...selectedForDeletion, pdf.id]);
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-white/30 accent-green-500 cursor-pointer flex-shrink-0"
                                    />
                                  )}
                                  <FileText size={16} className="text-green-500 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-green-400 truncate text-sm">{pdf.filename}</p>
                                    <p className="text-xs text-stone-500">{pdf.uploadedAt.toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(pdf.id);
                                  }}
                                  className="p-1 rounded-lg border border-white/20 hover:border-red-500 text-stone-400 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {/* Display Schedules */}
                {displayLibrary.map((pdf) => (
                  <div
                    key={pdf.id}
                    onClick={() => !selectMode && setSelectedPDF(pdf)}
                    className={`rounded-lg border p-3 backdrop-blur-sm text-left transition-all ${selectMode ? 'cursor-default' : 'cursor-pointer'} flex items-center justify-between ${
                      selectedPDF?.id === pdf.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 bg-white/5 hover:border-amber-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {selectMode && (
                        <input
                          type="checkbox"
                          checked={selectedForDeletion.includes(pdf.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (selectedForDeletion.includes(pdf.id)) {
                              setSelectedForDeletion(selectedForDeletion.filter(id => id !== pdf.id));
                            } else {
                              setSelectedForDeletion([...selectedForDeletion, pdf.id]);
                            }
                          }}
                          className="w-4 h-4 rounded border-white/30 accent-amber-500 cursor-pointer flex-shrink-0"
                        />
                      )}
                      <FileText size={16} className="text-amber-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white truncate text-sm">{pdf.filename}</p>
                        <p className="text-xs text-stone-400">{pdf.uploadedAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                      {pdf.notes ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingNotesPDF(pdf);
                            setShowNotesModal(true);
                          }}
                          className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm font-semibold"
                        >
                          View Notes
                        </button>
                      ) : null}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            const logData = {
                              id: Date.now(),
                              filename: pdf.filename,
                              temperatures: pdf.temperatures,
                              times: pdf.times,
                              savedAt: new Date().toISOString(),
                              notes: pdf.notes || '',
                              results: pdf.results || '',
                            };
                            const existingLogs = JSON.parse(localStorage.getItem('kilnLogs') || '[]');
                            existingLogs.push(logData);
                            localStorage.setItem('kilnLogs', JSON.stringify(existingLogs));
                            window.dispatchEvent(new CustomEvent('logsUpdated', { detail: existingLogs }));
                            toast.success('Log saved successfully!');
                          } catch (error) {
                            console.error('Failed to save log:', error);
                            toast.error('Failed to save log');
                          }
                        }}
                        className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm font-semibold"
                      >
                        Logs
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(pdf.id);
                        }}
                        className="p-1 rounded-lg border border-white/20 hover:border-red-500 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Empty state - only show if no folders and no uncategorized files */}
                {folders.length === 0 && displayLibrary.length === 0 && (
                  <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                    <FileText size={32} className="text-stone-500 mx-auto mb-4" />
                    <p className="text-stone-400">No schedules uploaded yet. Upload a PDF to get started.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Selected PDF Details - Fullscreen Modal */}
        {selectedPDF && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
            <div className="flex-1 overflow-auto bg-stone-950">
              <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                  {/* Close Button */}
                  <div className="mb-8 flex justify-end">
                    <button
                      onClick={() => setSelectedPDF(null)}
                      className="p-2 rounded-lg border border-white/20 hover:border-red-500 text-stone-400 hover:text-red-500 transition-colors"
                      title="Close (Esc)"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  {/* PDF Preview Header */}
                  <div className="mb-8 pb-6 border-b border-white/20">
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-white">KILN LOG RECORD</h3>
                    </div>
                    <div className="text-center mb-2">
                      <p className="text-lg font-bold text-white">{selectedPDF.filename.replace('_klog.pdf', '')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-stone-400">Generated: {new Date().toLocaleString()}</p>
                    </div>
                  </div>

                  {/* PDF Viewer and Image Window */}
                  <div className="mb-8 flex gap-4 flex-col lg:flex-row">
                    <div className="flex-1 w-full">
                    <div className="bg-black rounded-lg border border-white/10 flex items-center justify-end" style={{ height: 'clamp(400px, 60vh, 800px)', overflow: 'hidden', padding: '0', margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#000000' }}>
                      {selectedPDF.storageKey ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%', height: '100%', backgroundColor: '#000000' }}>
                          <iframe
                            src={`/manus-storage/${selectedPDF.storageKey}#zoom=page-fit`}
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              borderRadius: '0.25rem',
                              backgroundColor: '#000000',
                              display: 'block',
                              marginLeft: 'auto',
                              objectFit: 'contain',
                              margin: '0'
                            }}
                            title="PDF Viewer"
                          />
                        </div>
                      ) : (
                        <p className="text-stone-400 text-sm">No PDF file available</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Image Window */}
                  <div className="w-40">
                    <div className="bg-black rounded-lg border border-white/10 flex flex-col items-center justify-center" style={{ height: '600px', overflow: 'hidden', padding: '0', margin: '0' }}>
                      {selectedImage ? (
                        <div className="w-full h-full relative">
                          <img
                            src={selectedImage}
                            alt="Reference"
                            className="w-full h-full object-contain"
                          />
                          <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 bg-stone-800/80 hover:bg-stone-700 text-white p-2 rounded transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full hover:bg-white/5 transition-colors">
                          <Upload size={24} className="text-stone-500 mb-2" />
                          <span className="text-xs text-stone-400 text-center px-2">Click to add image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setSelectedImage(event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
                    <button
                    onClick={() => {
                      if (selectedPDF?.storageKey) {
                        const link = document.createElement('a');
                        link.href = `/manus-storage/${selectedPDF.storageKey}`;
                        link.download = selectedPDF.filename;
                        link.click();
                        toast.success('PDF downloaded successfully!');
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    Export PDF
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Button */}
        {displayLibrary.length > 1 && selectedForComparison.length > 0 && (
          <div className="fixed bottom-8 right-8 z-40">
            <button
              onClick={handleOpenComparison}
              className="px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors shadow-lg flex items-center gap-2"
            >
              <BarChart3 size={16} />
              Compare {selectedForComparison.length}
            </button>
          </div>
        )}

        {/* Comparison Modal */}
        {showComparisonModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="rounded-2xl border border-white/20 bg-stone-900 p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Schedule Comparison</h3>
                <button
                  onClick={handleCloseComparison}
                  className="p-2 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Comparison Chart */}
              <div className="mb-8">
                <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-4">
                  Temperature Profiles Overlay
                </span>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" label={{ value: "Time (hours)", position: "insideBottomRight", offset: -5 }} stroke="rgba(255,255,255,0.5)" />
                      <YAxis label={{ value: "Temperature (°F)", angle: -90, position: "insideLeft" }} stroke="rgba(255,255,255,0.5)" />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} labelStyle={{ color: "#fff" }} />
                      <Legend />
                      {getComparisonData().map((pdf, idx) => {
                        const colors = ["#d97706", "#f59e0b", "#fbbf24", "#fcd34d"];
                        const color = colors[idx % colors.length];
                        return (
                          <Line
                            key={pdf.id}
                            type="monotone"
                            dataKey="temperature"
                            data={pdf.temperatures.map((temp, tidx) => ({
                              time: pdf.times[tidx] || tidx,
                              temperature: temp,
                            }))}
                            stroke={color}
                            name={pdf.filename}
                            dot={false}
                          />
                        );
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Comparison Table */}
              <div>
                <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-4">
                  Schedule Statistics
                </span>
                <div className="grid md:grid-cols-2 gap-4">
                  {getComparisonData().map((pdf) => (
                    <div key={pdf.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <p className="font-bold text-white mb-3 truncate">{pdf.filename}</p>
                      <div className="space-y-2 text-sm text-stone-300">
                        <div className="flex justify-between">
                          <span>Temps:</span>
                          <span className="text-amber-400">{pdf.temperatures.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Min Temp:</span>
                          <span className="text-amber-400">{Math.min(...pdf.temperatures)}°F</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Temp:</span>
                          <span className="text-amber-400">{Math.max(...pdf.temperatures)}°F</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Temp:</span>
                          <span className="text-amber-400">{(pdf.temperatures.reduce((a, b) => a + b, 0) / pdf.temperatures.length).toFixed(0)}°F</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Time:</span>
                          <span className="text-amber-400">{pdf.times.reduce((a, b) => a + b, 0).toFixed(2)}h</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={handleCloseComparison}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 text-white font-mono text-xs font-bold uppercase transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Insert Schedules Modal */}
        {showInsertModal && selectedFolderForInsert && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-stone-900 border border-amber-700/30 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Add Schedules to {selectedFolderForInsert}</h3>
              <p className="text-sm text-stone-400 mb-4">Select schedules to add to this folder:</p>
              
              <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto">
                {/* Folders Section */}
                {folders.filter(folder => folder !== selectedFolderForInsert).map((folder) => (
                  <div key={folder} className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                    <button
                      onClick={() => {
                        const newExpanded = new Set(expandedFoldersInModal);
                        if (newExpanded.has(folder)) {
                          newExpanded.delete(folder);
                        } else {
                          newExpanded.add(folder);
                        }
                        setExpandedFoldersInModal(newExpanded);
                      }}
                      className="w-full text-left font-mono text-sm font-bold text-green-400 hover:text-green-300 transition-colors"
                    >
                      📁 {folder} ({(schedulesInFolders[folder] || []).length})
                    </button>
                    {expandedFoldersInModal.has(folder) && (
                      <div className="mt-2 ml-4 space-y-2">
                        {(schedulesInFolders[folder] || []).length === 0 ? (
                          <p className="text-xs text-stone-400">No schedules in this folder</p>
                        ) : (
                          allLibrary
                            .filter(pdf => {
                              // Show files in this folder
                              const isInThisFolder = (schedulesInFolders[folder] || []).includes(pdf.id);
                              // But hide if already in the selected folder
                              const filesInSelectedFolder = schedulesInFolders[selectedFolderForInsert] || [];
                              return isInThisFolder && !filesInSelectedFolder.includes(pdf.id);
                            })
                            .map(pdf => (
                              <div key={pdf.id} className="flex items-center gap-3 p-2 rounded border border-green-500/30 bg-green-500/5 hover:border-green-500/50 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={schedulesToInsert.has(pdf.id)}
                                  onChange={(e) => {
                                    const newSet = new Set(schedulesToInsert);
                                    if (e.target.checked) {
                                      newSet.add(pdf.id);
                                    } else {
                                      newSet.delete(pdf.id);
                                    }
                                    setSchedulesToInsert(newSet);
                                  }}
                                  className="w-4 h-4 rounded border-white/30 accent-green-500 cursor-pointer flex-shrink-0"
                                />
                                <FileText size={14} className="text-green-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-mono text-xs text-green-400 truncate">{pdf.filename}</p>
                                  <p className="text-xs text-stone-500">{pdf.uploadedAt.toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Uncategorized Files Section */}
                <div className="rounded-lg border border-amber-700/30 bg-amber-700/5 p-3">
                  <div className="space-y-2">
                    {allLibrary
                      .filter(pdf => {
                        // Hide files that are in ANY folder
                        for (const folderIds of Object.values(schedulesInFolders)) {
                          if (folderIds.includes(pdf.id)) {
                            return false; // Hide if in any folder
                          }
                        }
                        return true; // Show only truly uncategorized files
                      })
                      .map(pdf => (
                      <div key={pdf.id} className="flex items-center gap-3 p-3 rounded border border-stone-700 hover:border-amber-500/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={schedulesToInsert.has(pdf.id)}
                          onChange={(e) => {
                            const newSet = new Set(schedulesToInsert);
                            if (e.target.checked) {
                              newSet.add(pdf.id);
                            } else {
                              newSet.delete(pdf.id);
                            }
                            setSchedulesToInsert(newSet);
                          }}
                          className="w-4 h-4 rounded border-white/30 accent-amber-500 cursor-pointer"
                        />
                        <FileText size={16} className="text-amber-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate text-sm">{pdf.filename}</p>
                          <p className="text-xs text-stone-400">{pdf.uploadedAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {displayLibrary.length === 0 && (
                <p className="text-sm text-stone-400 text-center py-4">No schedules available</p>
              )}
              
              {(displayLibrary.length > 0 || Object.values(schedulesInFolders).some(ids => ids.length > 0)) && (
                <div className="mb-4 flex gap-2 justify-start">
                  {schedulesToInsert.size === 0 ? (
                    <button
                      onClick={() => {
                        const availableIds = new Set<number>();
                        displayLibrary.forEach(pdf => availableIds.add(pdf.id));
                        folders.forEach(folder => {
                          if (folder !== selectedFolderForInsert) {
                            (schedulesInFolders[folder] || []).forEach(id => {
                              const filesInSelectedFolder = schedulesInFolders[selectedFolderForInsert] || [];
                              if (!filesInSelectedFolder.includes(id)) {
                                availableIds.add(id);
                              }
                            });
                          }
                        });
                        setSchedulesToInsert(availableIds);
                      }}
                      className="px-4 py-2 rounded border border-amber-500 text-amber-500 hover:bg-amber-500/10 font-mono text-xs font-bold uppercase transition-colors"
                    >
                      Select All
                    </button>
                  ) : (
                    <button
                      onClick={() => setSchedulesToInsert(new Set())}
                      className="px-4 py-2 rounded border border-amber-500 text-amber-500 hover:bg-amber-500/10 font-mono text-xs font-bold uppercase transition-colors"
                    >
                      Deselect All
                    </button>
                  )}
                </div>
              )}
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowInsertModal(false);
                    setSelectedFolderForInsert(null);
                    setSchedulesToInsert(new Set());
                  }}
                  className="px-4 py-2 rounded border border-stone-600 text-stone-400 hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (schedulesToInsert.size > 0) {
                      const currentSchedules = schedulesInFolders[selectedFolderForInsert] || [];
                      const updatedSchedules = [...new Set([...currentSchedules, ...Array.from(schedulesToInsert)])];
                      setSchedulesInFolders({
                        ...schedulesInFolders,
                        [selectedFolderForInsert]: updatedSchedules
                      });
                      toast.success(`Added ${schedulesToInsert.size} schedule(s) to ${selectedFolderForInsert}`);
                      setShowInsertModal(false);
                      setSelectedFolderForInsert(null);
                      setSchedulesToInsert(new Set());
                    } else {
                      toast.error('Please select at least one schedule');
                    }
                  }}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Add to Folder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Folder Creation Modal */}
        {showFolderModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-stone-900 border border-amber-700/30 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Create New Folder</h3>
              <input
                type="text"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 mb-4"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (folderName.trim()) {
                      setFolders([...folders, folderName]);
                      setFolderName('');
                      setShowFolderModal(false);
                      toast.success(`Folder "${folderName}" created`);
                    }
                  }
                }}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setFolderName('');
                    setShowFolderModal(false);
                  }}
                  className="px-4 py-2 rounded border border-stone-600 text-stone-400 hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (folderName.trim()) {
                      setFolders([...folders, folderName]);
                      setFolderName('');
                      setShowFolderModal(false);
                      toast.success(`Folder "${folderName}" created`);
                    } else {
                      toast.error('Please enter a folder name');
                    }
                  }}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit Schedule Modal */}
        {showEditModal && editingPDF && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-white/20 rounded-lg p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Edit Schedule</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-300 mb-2">Filename</label>
                  <input
                    type="text"
                    value={editingFilename}
                    onChange={(e) => setEditingFilename(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-white/20 rounded text-white placeholder-stone-500 focus:outline-none focus:border-blue-500"
                    placeholder="Schedule name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-stone-300 mb-2">Notes</label>
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-white/20 rounded text-white placeholder-stone-500 focus:outline-none focus:border-blue-500 h-24 resize-none"
                    placeholder="Add notes about this schedule"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-stone-300 mb-2">Results</label>
                  <textarea
                    value={editingResults}
                    onChange={(e) => setEditingResults(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-white/20 rounded text-white placeholder-stone-500 focus:outline-none focus:border-blue-500 h-24 resize-none"
                    placeholder="Add results or observations"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-stone-300 mb-3">Color</label>
                  <div className="flex gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color.value
                            ? 'border-white scale-110'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-8 justify-end">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPDF(null);
                    setEditingFilename('');
                    setEditingNotes('');
                    setEditingResults('');
                  }}
                  className="px-4 py-2 rounded border border-white/20 text-stone-300 hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!editingPDF) {
                      toast.error('No PDF selected');
                      return;
                    }
                    
                    try {
                      const jsPDF = (await import('jspdf')).default;
                      const doc = new jsPDF();
                      const pageWidth = doc.internal.pageSize.getWidth();
                      let yPosition = 20;
                      
                      // Add original schedule information
                      doc.setFontSize(14);
                      doc.setTextColor(60, 60, 60);
                      doc.text(`Schedule: ${editingPDF.filename}`, 20, yPosition);
                      yPosition += 10;
                      
                      doc.setFontSize(10);
                      doc.setTextColor(100, 100, 100);
                      doc.text(`Uploaded: ${editingPDF.uploadedAt.toLocaleDateString()}`, 20, yPosition);
                      yPosition += 8;
                      
                      // Add temperatures and times
                      if (editingPDF.temperatures.length > 0) {
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('Temperatures (F):', 20, yPosition);
                        yPosition += 6;
                        doc.setFontSize(9);
                        doc.text(editingPDF.temperatures.join(', '), 25, yPosition);
                        yPosition += 8;
                      }
                      
                      if (editingPDF.times.length > 0) {
                        doc.setFontSize(11);
                        doc.setTextColor(60, 60, 60);
                        doc.text('Times (hours):', 20, yPosition);
                        yPosition += 6;
                        doc.setFontSize(9);
                        doc.text(editingPDF.times.join(', '), 25, yPosition);
                        yPosition += 10;
                      }
                      
                      // Add separator
                      yPosition += 5;
                      doc.setDrawColor(200, 200, 200);
                      doc.line(20, yPosition, pageWidth - 20, yPosition);
                      yPosition += 10;
                      
                      // Add updated information
                      doc.setFontSize(12);
                      doc.setTextColor(40, 40, 40);
                      doc.text('Updated Information', 20, yPosition);
                      yPosition += 8;
                      
                      if (editingFilename) {
                        doc.setFontSize(10);
                        doc.setTextColor(60, 60, 60);
                        doc.text('Updated Name:', 20, yPosition);
                        yPosition += 6;
                        doc.setFontSize(9);
                        doc.text(editingFilename, 25, yPosition);
                        yPosition += 8;
                      }
                      
                      if (editingNotes) {
                        doc.setFontSize(10);
                        doc.setTextColor(60, 60, 60);
                        doc.text('Notes:', 20, yPosition);
                        yPosition += 6;
                        doc.setFontSize(9);
                        const notesLines = doc.splitTextToSize(editingNotes, pageWidth - 40);
                        doc.text(notesLines, 25, yPosition);
                        yPosition += notesLines.length * 4 + 4;
                      }
                      
                      if (editingResults) {
                        doc.setFontSize(10);
                        doc.setTextColor(60, 60, 60);
                        doc.text('Results:', 20, yPosition);
                        yPosition += 6;
                        doc.setFontSize(9);
                        const resultsLines = doc.splitTextToSize(editingResults, pageWidth - 40);
                        doc.text(resultsLines, 25, yPosition);
                      }
                      
                      // Generate PDF and upload
                      const pdfData = doc.output('arraybuffer');
                      const uint8Array = new Uint8Array(pdfData);
                      const binaryArray = Array.from(uint8Array);
                      const binaryString = String.fromCharCode.apply(null, binaryArray as any);
                      const fileBase64 = btoa(binaryString);
                      
                      const newFilename = `${editingFilename || editingPDF.filename}_updated.pdf`;
                      
                      // Use saveGenerated instead of upload to avoid PDF parsing issues
                      await saveGeneratedMutation.mutateAsync({
                        filename: newFilename,
                        fileBase64,
                        temperatures: editingPDF.temperatures || [],
                        times: editingPDF.times || [],
                      });
                      refetch();
                      
                      toast.success('Updated schedule PDF created and saved');
                      setShowEditModal(false);
                      setEditingPDF(null);
                      setEditingFilename('');
                      setEditingNotes('');
                      setEditingResults('');
                    } catch (error) {
                      console.error('Error creating PDF:', error);
                      console.error('Error details:', error instanceof Error ? error.message : String(error));
                      toast.error(`Failed to create PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                  }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Logs Section */}
        <section id="logs" className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-8">Logs</h2>
            <div className="grid gap-6">
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-stone-400 text-sm">No logs saved yet. Create and save a schedule to see it here.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="rounded-lg border border-stone-700 bg-stone-900 p-4 hover:border-amber-500/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-amber-400 mb-2">{log.filename}</h3>
                        <div className="text-xs text-stone-400 space-y-1">
                          <div>Temperature points: <span className="text-amber-300">{log.temperatures.length}</span></div>
                          <div>Duration: <span className="text-amber-300">{log.times[log.times.length - 1] || 0} hours</span></div>
                          <div>Saved: <span className="text-amber-300">{new Date(log.savedAt).toLocaleDateString()}</span></div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setViewingLog(log);
                            setShowViewModal(true);
                          }}
                          className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded transition-colors"
                        >
                          View
                        </button>
                        <button className="px-3 py-2 bg-green-700 hover:bg-green-600 text-white text-xs font-bold rounded transition-colors">
                          Rename
                        </button>
                        <button className="px-3 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded transition-colors">
                          Results
                        </button>
                        <button
                          onClick={() => {
                            try {
                              const doc = new jsPDF();
                              const pageWidth = doc.internal.pageSize.getWidth();
                              const pageHeight = doc.internal.pageSize.getHeight();
                              const margin = 15;
                              let yPosition = margin;

                              // Header with black background
                              doc.setFillColor(0, 0, 0);
                              doc.rect(0, 0, pageWidth, 40, 'F');
                              
                              // Title
                              doc.setTextColor(255, 180, 0);
                              doc.setFontSize(20);
                              doc.text(log.filename, margin, 15);
                              
                              // Subtitle
                              doc.setTextColor(255, 180, 0);
                              doc.setFontSize(10);
                              doc.text(`Saved: ${new Date(log.savedAt).toLocaleDateString()}`, margin, 28);
                              
                              yPosition = 50;

                              // Title Section
                              doc.setTextColor(0, 0, 0);
                              doc.setFontSize(16);
                              doc.setFont('helvetica', 'bold');
                              doc.text('Annealing Schedule Log', margin, yPosition);
                              yPosition += 8;
                              doc.setFontSize(10);
                              doc.setFont('helvetica', 'normal');
                              doc.text('Temperature Profile Report', margin, yPosition);
                              yPosition += 12;

                              // Temperature Profile Chart
                              if (log.temperatures && log.temperatures.length > 0) {
                                doc.setFontSize(12);
                                doc.setFont('helvetica', 'bold');
                                doc.text('Temperature Profile', margin, yPosition);
                                yPosition += 8;

                                // Create a simple chart representation
                                const chartData = log.temperatures.map((temp: number, idx: number) => ({
                                  time: log.times[idx] || idx,
                                  temperature: temp
                                }));

                                // Draw a simple line chart
                                const chartWidth = pageWidth - 2 * margin;
                                const chartHeight = 60;
                                const chartX = margin;
                                const chartY = yPosition;

                                // Chart border
                                doc.setDrawColor(200, 200, 200);
                                doc.rect(chartX, chartY, chartWidth, chartHeight);

                                // Plot points and lines
                                if (chartData.length > 0) {
                                  const maxTemp = Math.max(...chartData.map((d: any) => d.temperature));
                                  const maxTime = Math.max(...chartData.map((d: any) => d.time));
                                  
                                  doc.setDrawColor(220, 38, 38);
                                  doc.setLineWidth(1);
                                  
                                  for (let i = 0; i < chartData.length - 1; i++) {
                                    const x1 = chartX + (chartData[i].time / maxTime) * chartWidth;
                                    const y1 = chartY + chartHeight - (chartData[i].temperature / maxTemp) * chartHeight;
                                    const x2 = chartX + (chartData[i + 1].time / maxTime) * chartWidth;
                                    const y2 = chartY + chartHeight - (chartData[i + 1].temperature / maxTemp) * chartHeight;
                                    doc.line(x1, y1, x2, y2);
                                  }
                                }

                                yPosition += chartHeight + 8;
                              }

                              // Notes Section
                              if (log.notes) {
                                doc.setFontSize(12);
                                doc.setFont('helvetica', 'bold');
                                doc.text('Materials & Notes', margin, yPosition);
                                yPosition += 6;
                                
                                doc.setFontSize(10);
                                doc.setFont('helvetica', 'normal');
                                doc.setTextColor(100, 100, 100);
                                const notesLines = doc.splitTextToSize(log.notes, pageWidth - 2 * margin);
                                doc.text(notesLines, margin, yPosition);
                                yPosition += notesLines.length * 5 + 4;
                              }

                              // Results Section
                              if (log.results) {
                                doc.setTextColor(0, 0, 0);
                                doc.setFontSize(12);
                                doc.setFont('helvetica', 'bold');
                                doc.text('Results & Observations', margin, yPosition);
                                yPosition += 6;
                                
                                doc.setFontSize(10);
                                doc.setFont('helvetica', 'normal');
                                doc.setTextColor(100, 100, 100);
                                const resultsLines = doc.splitTextToSize(log.results, pageWidth - 2 * margin);
                                doc.text(resultsLines, margin, yPosition);
                              }

                              // Download PDF
                              doc.save(`${log.filename}.pdf`);
                              toast.success('PDF exported successfully!');
                            } catch (error) {
                              console.error('Failed to export PDF:', error);
                              toast.error('Failed to export PDF');
                            }
                          }}
                          className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded transition-colors"
                        >
                          Export PDF
                        </button>
                        <button
                          onClick={() => {
                            const confirmed = window.confirm('Are you sure you want to delete this log?');
                            if (!confirmed) return;
                            const updatedLogs = logs.filter(l => l.id !== log.id);
                            localStorage.setItem('kilnLogs', JSON.stringify(updatedLogs));
                            setLogs(updatedLogs);
                            toast.success('Log deleted successfully!');
                          }}
                          className="px-3 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-bold rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        
        {/* View Modal */}
        {showViewModal && viewingLog && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
              <div className="bg-black text-amber-400 p-8 border-b-4 border-amber-400">
                <h1 className="text-3xl font-bold mb-2">{viewingLog.filename}</h1>
                <p className="text-sm text-amber-300">Saved: {new Date(viewingLog.savedAt).toLocaleDateString()}</p>
              </div>
              
              <div className="p-8 space-y-8 bg-white text-black">
                <div className="border-b-2 border-black pb-4">
                  <h2 className="text-2xl font-bold text-black mb-2">Annealing Schedule Log</h2>
                  <p className="text-sm text-gray-600">Temperature Profile Report</p>
                </div>
                {/* Plot */}
                {viewingLog.temperatures && viewingLog.temperatures.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-bold text-black mb-4">Temperature Profile</h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-300">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={viewingLog.temperatures.map((temp: number, idx: number) => ({
                          time: viewingLog.times[idx] || idx,
                          temperature: temp
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="time" stroke="#374151" />
                          <YAxis stroke="#374151" />
                          <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }} />
                          <Legend />
                          <Line type="monotone" dataKey="temperature" stroke="#dc2626" dot={false} strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : null}
                
                {/* Notes */}
                {viewingLog.notes && (
                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">Materials & Notes</h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-300 text-gray-800 whitespace-pre-wrap text-sm">
                      {viewingLog.notes}
                    </div>
                  </div>
                )}
                
                {/* Results */}
                {viewingLog.results && (
                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">Results & Observations</h3>
                    <div className="bg-gray-50 p-4 rounded border border-gray-300 text-gray-800 whitespace-pre-wrap text-sm">
                      {viewingLog.results}
                    </div>
                  </div>
                )}
                
                {/* Footer */}
                <div className="border-t-2 border-black pt-4 text-xs text-gray-600 text-center">
                  <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="bg-gray-100 border-t border-gray-300 p-4 flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors"
                >
                  Print
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Bottom Image */}
        <div className="w-full">
          <img 
            src="/manus-storage/libraryfooter(2)_f250a3c8.png" 
            alt="Glass blowing tools and materials" 
            className="w-full h-auto object-cover"
          />
        </div>
      </main>
    </div>
  );
}
