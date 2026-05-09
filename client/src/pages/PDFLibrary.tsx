/*
PDF Library Page - Manage uploaded kiln schedules and generated PDFs
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useEffect } from "react";
import { FileText, Trash2, Download, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PDFItem {
  id: number;
  filename: string;
  temperatures: number[];
  times: number[];
  uploadedAt: Date;
}

export default function PDFLibrary() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<PDFItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

    const filename = selectedPDF.filename.replace(".pdf", ".csv");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Downloaded ${filename}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("PDF deleted successfully!");
      setSelectedPDF(null);
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
            <img
              src="/manus-storage/boroprologoicon_47146e54.png"
              alt="BoroPrologo"
              className="h-24 w-24 object-contain"
            />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/flame-simulator"
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
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.parentElement?.querySelector("input");
                    input?.click();
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors disabled:opacity-50"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Select PDF"}
                </button>
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
              <div className="grid md:grid-cols-2 gap-6">
                {displayLibrary.map((pdf) => (
                  <button
                    key={pdf.id}
                    onClick={() => setSelectedPDF(pdf)}
                    className={`rounded-2xl border p-6 backdrop-blur-sm text-left transition-all ${
                      selectedPDF?.id === pdf.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 bg-white/5 hover:border-amber-500/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-amber-500" />
                        <div>
                          <p className="font-mono text-xs font-bold uppercase text-amber-500">
                            Schedule
                          </p>
                          <p className="font-bold text-white truncate">{pdf.filename}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(pdf.id);
                        }}
                        className="p-2 rounded-lg border border-white/20 hover:border-red-500 text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">
                          Uploaded
                        </span>
                        <span className="text-stone-300">
                          {pdf.uploadedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">
                          Extracted Data
                        </span>
                        <span className="text-stone-300">
                          {pdf.temperatures.length} temps, {pdf.times.length} times
                        </span>
                      </div>
                    </div>
                  </button>
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
                <div className="mb-6">
                  <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">
                    Filename
                  </span>
                  <p className="text-lg font-bold text-white">{selectedPDF.filename}</p>
                </div>

                <div className="flex justify-end mb-6">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase transition-colors"
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">
                      Extracted Temperatures (°F)
                    </span>
                    <div className="space-y-2">
                      {selectedPDF.temperatures.length > 0 ? (
                        selectedPDF.temperatures.map((temp, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-mono text-sm"
                          >
                            {temp}°F
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-400 text-sm">No temperatures extracted</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">
                      Extracted Times (hours)
                    </span>
                    <div className="space-y-2">
                      {selectedPDF.times.length > 0 ? (
                        selectedPDF.times.map((time, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-mono text-sm"
                          >
                            {time}h
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-400 text-sm">No times extracted</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
