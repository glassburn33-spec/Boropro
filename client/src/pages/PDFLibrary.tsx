/*
PDF Library Page - Manage uploaded kiln schedules and generated PDFs
Scientific neo-brutalist design with furnace-lab aesthetics.
*/

import { useState, useEffect } from "react";
import { FileText, Upload, Download, Trash2, Plus } from "lucide-react";
import {
  extractPDFText,
  parseScheduleData,
  savePDFMetadata,
  getPDFLibrary,
  deletePDFMetadata,
  StoredPDFMetadata,
} from "@/lib/pdfUtils";

export default function PDFLibrary() {
  const [library, setLibrary] = useState<StoredPDFMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<StoredPDFMetadata | null>(null);

  // Load library from localStorage
  useEffect(() => {
    const stored = getPDFLibrary();
    setLibrary(stored);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const extractedText = await extractPDFText(file);
      const { temps, times } = parseScheduleData(extractedText);

      const id = savePDFMetadata({
        filename: file.name,
        uploadDate: new Date().toLocaleDateString(),
        extractedText,
        temperatures: temps,
        times,
      });

      const updated = getPDFLibrary();
      setLibrary(updated);

      // Reset input
      if (event.target) {
        event.target.value = "";
      }
    } catch (error) {
      console.error("Failed to upload PDF:", error);
      alert("Failed to upload PDF. Please ensure it is a valid PDF file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    deletePDFMetadata(id);
    const updated = getPDFLibrary();
    setLibrary(updated);
    setSelectedPDF(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-950/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-amber-500 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-500">◆</span>
            </div>
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">BORO KILN TOOLS</span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
            <a href="/flame-simulator" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Flame Simulator
            </a>
            <a href="/color-picker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Color Picker
            </a>
            <a href="/firing-tracker" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              Firing Tracker
            </a>
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-amber-500">
              PDF Library
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
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-500">Interactive tool</span>
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
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center hover:border-amber-500/50 transition-colors">
              <label className="cursor-pointer flex flex-col items-center gap-4">
                <Upload size={32} className="text-amber-500" />
                <div>
                  <p className="text-lg font-bold text-white mb-2">Upload a PDF Schedule</p>
                  <p className="text-sm text-stone-400">
                    Drag and drop or click to select. We'll extract temperature and time data automatically.
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
            {library.length === 0 ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 p-12 text-center">
                <FileText size={32} className="text-stone-500 mx-auto mb-4" />
                <p className="text-stone-400">No schedules uploaded yet. Upload a PDF to get started.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {library.map((pdf) => (
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
                          <p className="font-mono text-xs font-bold uppercase text-amber-500">Schedule</p>
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
                        <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">Uploaded</span>
                        <span className="text-stone-300">{pdf.uploadDate}</span>
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-1">Extracted Data</span>
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
                  <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-2">Filename</span>
                  <p className="text-lg font-bold text-white">{selectedPDF.filename}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">Extracted Temperatures (°F)</span>
                    <div className="space-y-2">
                      {selectedPDF.temperatures.length > 0 ? (
                        selectedPDF.temperatures.map((temp, idx) => (
                          <div key={idx} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-mono text-sm">
                            {temp}°F
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-400 text-sm">No temperatures extracted</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">Extracted Times (hours)</span>
                    <div className="space-y-2">
                      {selectedPDF.times.length > 0 ? (
                        selectedPDF.times.map((time, idx) => (
                          <div key={idx} className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-mono text-sm">
                            {time}h
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-400 text-sm">No times extracted</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <span className="font-mono text-xs font-bold uppercase text-amber-500 block mb-3">Extracted Text Preview</span>
                  <div className="bg-black/30 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <p className="text-xs text-stone-300 font-mono whitespace-pre-wrap break-words">
                      {selectedPDF.extractedText.substring(0, 500)}
                      {selectedPDF.extractedText.length > 500 && "..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Info Section */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8">
              <div className="flex gap-4">
                <FileText size={24} className="text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-500 mb-3">
                    How to use this library
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-300">
                    Upload kiln schedule PDFs from your kiln manufacturer or previous firings. The system automatically extracts temperature and time data for comparison. You can also generate custom PDFs from the Color Picker tool and download them here for reference. Build a personal database of successful schedules and track what works best for your kiln and glass combinations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-stone-950/50 py-8">
        <div className="container max-w-6xl">
          <p className="text-xs text-stone-500 text-center">
            PDF Library Tool · Part of the Borosilicate Kiln Research Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
