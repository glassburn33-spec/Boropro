/*
PDF Library Page - Manage uploaded kiln schedules and generated PDFs
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useEffect } from "react";
import { FileText, Trash2, Download, Upload, X, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";


interface PDFItem {
  id: number;
  filename: string;
  temperatures: number[];
  times: number[];
  uploadedAt: Date;
  storageKey: string;
}

export default function PDFLibrary() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<PDFItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>('/manus-storage/glasscoloumn_69d60b8f.jfif');

  // Fetch PDF library from backend
  const { data: library = [], refetch, isLoading } = trpc.pdfLibrary.list.useQuery();
  const uploadMutation = trpc.pdfLibrary.upload.useMutation();
  const deleteMutation = trpc.pdfLibrary.delete.useMutation();

  // Convert database records to display format
  const displayLibrary: PDFItem[] = library.map((pdf: any) => ({
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
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-stone-900/50 backdrop-blur-sm">
        <div className="container max-w-6xl py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">BoroPro</h1>
            <p className="text-xs text-stone-400 font-mono uppercase tracking-widest">PDF Library</p>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="/"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              Home
            </a>
            <a
              href="/calculator"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              Calculator
            </a>
            <a
              href="/flame-char"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              Flame Char
            </a>
            <a
              href="/color-picker"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              Color Database
            </a>
            <a
              href="/firing-tracker"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              Kiln Log
            </a>
            <a
              href="/pdf-library"
              className="text-xs uppercase tracking-wider text-amber-500"
            >
              PDF Library
            </a>
            <a
              href="/references"
              className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors"
            >
              References
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <div className="mb-5 flex items-center gap-2">
              <FileText size={16} className="text-amber-500" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">
                Interactive tool
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
              PDF Schedule Library
            </h1>
            <p className="text-lg leading-8 text-stone-300 max-w-3xl">
              Upload kiln schedules as PDFs to extract temperature and time data. Generate and download custom schedules from the color picker. Build a personal library of schedules for reference and comparison.
            </p>
          </div>
        </section>

        {/* Upload Section */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-8">Upload Schedule PDF</h2>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
                isDragActive
                  ? "border-amber-500 bg-amber-500/20"
                  : "border-white/20 bg-white/5 hover:border-amber-500/50"
              }`}
            >
              <label className="cursor-pointer flex flex-col items-center gap-4">
                <Upload
                  size={32}
                  className={isDragActive ? "text-amber-400" : "text-amber-500"}
                />
                <div>
                  <p className="text-lg font-bold text-white mb-2">Upload a PDF Schedule</p>
                  <p className="text-sm text-stone-400">
                    {isDragActive
                      ? "Drop your PDF here"
                      : "Drag and drop or click to select. We'll extract temperature and time data automatically."}
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Library Grid */}
        <section className="border-b border-white/10 py-16">
          <div className="container max-w-6xl">
            <h2 className="text-2xl font-bold text-white mb-8">Your Schedule Library</h2>
            {isLoading ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <p className="text-stone-400">Loading your library...</p>
              </div>
            ) : displayLibrary.length === 0 ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <FileText size={32} className="text-stone-500 mx-auto mb-4" />
                <p className="text-stone-400">No schedules uploaded yet. Upload a PDF to get started.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {displayLibrary.map((pdf) => (
                  <div
                    key={pdf.id}
                    onClick={() => setSelectedPDF(pdf)}
                    className={`rounded-lg border p-3 backdrop-blur-sm text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedPDF?.id === pdf.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 bg-white/5 hover:border-amber-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedForComparison.includes(pdf.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleComparison(pdf.id);
                        }}
                        className="w-4 h-4 rounded border-white/30 accent-amber-500 cursor-pointer flex-shrink-0"
                      />
                      <FileText size={16} className="text-amber-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white truncate text-sm">{pdf.filename}</p>
                        <p className="text-xs text-stone-400">{pdf.uploadedAt.toLocaleDateString()}</p>
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
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Selected PDF Details */}
        {selectedPDF && (
          <section className="border-b border-white/10 py-16">
            <div className="container max-w-6xl">
              <h2 className="text-2xl font-bold text-white mb-8">Schedule Details</h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
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
                <div className="mb-8 flex gap-4">
                  <div className="flex-1">
                    <div className="bg-black rounded-lg border border-white/10 flex items-center justify-start" style={{ height: '600px', overflow: 'hidden', overflowX: 'hidden', padding: '0', margin: '0', width: '100%' }}>
                      {selectedPDF.storageKey ? (
                        <iframe
                          src={`/manus-storage/${selectedPDF.storageKey}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: '0.5rem',
                            backgroundColor: '#000000'
                          }}
                          title="PDF Viewer"
                        />
                      ) : (
                        <p className="text-stone-400 text-sm">No PDF file available</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Image Window */}
                  <div className="w-36">
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
          </section>
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
      </main>
    </div>
  );
}
