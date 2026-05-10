/*
Log Library Page - Manage uploaded kiln schedules and generated PDFs
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
  temperatures: string | null;
  times: string | null;
  uploadedAt: Date;
  storageKey: string;
  fileUrl?: string;
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

  // Fetch PDF library from backend
  const { data: library = [], refetch, isLoading } = trpc.pdfLibrary.list.useQuery();
  const uploadMutation = trpc.pdfLibrary.upload.useMutation();
  const saveGeneratedMutation = trpc.pdfLibrary.saveGenerated.useMutation();
  const deleteMutation = trpc.pdfLibrary.delete.useMutation();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileData = event.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(fileData);
        const binaryArray = Array.from(uint8Array);
        const binaryString = String.fromCharCode.apply(null, binaryArray as any);
        const fileBase64 = btoa(binaryString);

        await uploadMutation.mutateAsync({
          filename: file.name,
          fileBase64,
        });

        toast.success('PDF uploaded successfully!');
        refetch();
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('PDF upload error:', error);
      toast.error('Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSelectPDF = (pdf: PDFItem) => {
    setSelectedPDF(selectedPDF?.id === pdf.id ? null : pdf);
  };

  const handleSelectForComparison = (id: number) => {
    setSelectedForComparison((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectForDeletion = (id: number) => {
    setSelectedForDeletion((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedForDeletion.length === 0) {
      toast.error('No PDFs selected for deletion');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedForDeletion.length} schedule(s)? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      for (const id of selectedForDeletion) {
        await deleteMutation.mutateAsync({ id });
      }
      toast.success('PDFs deleted successfully!');
      setSelectedForDeletion([]);
      setSelectMode(false);
      refetch();
    } catch (error) {
      console.error('Failed to delete PDFs:', error);
      toast.error('Failed to delete PDFs');
    }
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) {
      toast.error('Please select at least 2 PDFs to compare');
      return;
    }
    setShowComparisonModal(true);
  };

  const handleExportCSV = () => {
    if (!selectedPDF) {
      toast.error('Please select a PDF first');
      return;
    }

    const csvContent = [
      ['Metric', 'Value'],
      ['Filename', selectedPDF.filename],
      ['Uploaded Date', selectedPDF.uploadedAt.toLocaleDateString()],
      ['Temperatures (°F)', selectedPDF.temperatures || ''],
      ['Times (hours)', selectedPDF.times || ''],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedPDF.filename.replace(".pdf", "")}_data.csv`);
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
            <a href="/pdf-library" className="text-xs uppercase tracking-wider text-amber-500 transition-colors">
              Kiln Log
            </a>
            <a href="/references" className="text-xs uppercase tracking-wider text-stone-400 hover:text-amber-500 transition-colors">
              References
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-12">
        {/* Section Title */}
        <div className="flex items-center gap-4 mb-12">
          <FileText className="w-8 h-8 text-amber-500" />
          <h1 className="text-4xl font-bold">Log Library</h1>
        </div>

        {/* Upload Section */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-12 text-center mb-12 transition-all ${
            isDragActive
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-stone-700 hover:border-stone-600'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-stone-400" />
          <p className="text-lg mb-2">Drag and drop your PDF here</p>
          <p className="text-sm text-stone-400 mb-4">or</p>
          <label className="inline-block">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              disabled={isUploading}
              className="hidden"
            />
            <span className="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded cursor-pointer transition-colors inline-block">
              {isUploading ? 'Uploading...' : 'Select File'}
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSelectMode(!selectMode)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded font-semibold transition-colors"
          >
            {selectMode ? 'Done Selecting' : 'Select'}
          </button>
          {selectMode && selectedForDeletion.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-semibold transition-colors"
            >
              Delete Selected ({selectedForDeletion.length})
            </button>
          )}
          {!selectMode && selectedForComparison.length >= 2 && (
            <button
              onClick={handleCompare}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-semibold transition-colors"
            >
              Compare ({selectedForComparison.length})
            </button>
          )}
          {!selectMode && selectedPDF && (
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded font-semibold transition-colors"
            >
              Export CSV
            </button>
          )}
        </div>

        {/* PDF List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-stone-400">Loading your library...</p>
          </div>
        ) : library.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-400">No PDFs uploaded yet. Start by uploading a kiln schedule!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {library.map((pdf) => (
              <div
                key={pdf.id}
                className={`border border-stone-700 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPDF?.id === pdf.id ? 'bg-stone-800 border-amber-500' : 'hover:bg-stone-900'
                }`}
                onClick={() => !selectMode && handleSelectPDF(pdf)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {selectMode && (
                      <input
                        type="checkbox"
                        checked={selectedForDeletion.includes(pdf.id)}
                        onChange={() => handleSelectForDeletion(pdf.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5"
                      />
                    )}
                    {!selectMode && (
                      <input
                        type="checkbox"
                        checked={selectedForComparison.includes(pdf.id)}
                        onChange={() => handleSelectForComparison(pdf.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{pdf.filename}</p>
                      <p className="text-sm text-stone-400">{pdf.uploadedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPDF(pdf);
                        setEditingFilename(pdf.filename);
                        setEditingNotes('');
                        setEditingResults('');
                        setShowEditModal(true);
                      }}
                      className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pdf.id);
                      }}
                      className="p-1 hover:bg-red-700/20 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                    console.log('Save Changes clicked', { editingPDF, editingFilename, editingNotes, editingResults });
                    toast.message('Saving updated schedule...');
                    if (!editingPDF) {
                      toast.error('No PDF selected');
                      return;
                    }
                    
                    try {
                      const jsPDF = (await import('jspdf')).default;
                      
                      // Create a new PDF page with the appended information
                      const newDoc = new jsPDF();
                      const pageWidth = newDoc.internal.pageSize.getWidth();
                      let yPosition = 20;
                      
                      // Add header indicating this is an update to the original
                      newDoc.setFontSize(14);
                      newDoc.setTextColor(60, 60, 60);
                      newDoc.text('SCHEDULE UPDATE', 20, yPosition);
                      yPosition += 10;
                      
                      // Add original document reference
                      newDoc.setFontSize(10);
                      newDoc.setTextColor(100, 100, 100);
                      newDoc.text(`Original Document: ${editingPDF.filename}`, 20, yPosition);
                      yPosition += 6;
                      newDoc.text(`Original Upload Date: ${editingPDF.uploadedAt.toLocaleDateString()}`, 20, yPosition);
                      yPosition += 10;
                      
                      // Add separator
                      newDoc.setDrawColor(150, 150, 150);
                      newDoc.line(20, yPosition, pageWidth - 20, yPosition);
                      yPosition += 10;
                      
                      // Add updated information section
                      newDoc.setFontSize(12);
                      newDoc.setTextColor(40, 40, 40);
                      newDoc.text('Updated Information', 20, yPosition);
                      yPosition += 10;
                      
                      if (editingFilename) {
                        newDoc.setFontSize(10);
                        newDoc.setTextColor(60, 60, 60);
                        newDoc.text('Updated Name:', 20, yPosition);
                        yPosition += 6;
                        newDoc.setFontSize(9);
                        newDoc.text(editingFilename, 25, yPosition);
                        yPosition += 8;
                      }
                      
                      if (editingNotes) {
                        newDoc.setFontSize(10);
                        newDoc.setTextColor(60, 60, 60);
                        newDoc.text('Notes:', 20, yPosition);
                        yPosition += 6;
                        newDoc.setFontSize(9);
                        const notesLines = newDoc.splitTextToSize(editingNotes, pageWidth - 40);
                        newDoc.text(notesLines, 25, yPosition);
                        yPosition += notesLines.length * 4 + 4;
                      }
                      
                      if (editingResults) {
                        newDoc.setFontSize(10);
                        newDoc.setTextColor(60, 60, 60);
                        newDoc.text('Results:', 20, yPosition);
                        yPosition += 6;
                        newDoc.setFontSize(9);
                        const resultsLines = newDoc.splitTextToSize(editingResults, pageWidth - 40);
                        newDoc.text(resultsLines, 25, yPosition);
                      }
                      
                      // Generate PDF and upload
                      const pdfData = newDoc.output('arraybuffer');
                      const uint8Array = new Uint8Array(pdfData);
                      const binaryArray = Array.from(uint8Array);
                      const binaryString = String.fromCharCode.apply(null, binaryArray as any);
                      const fileBase64 = btoa(binaryString);
                      
                      // Keep the original filename if not changed, otherwise use the updated name
                      const newFilename = editingFilename ? `${editingFilename}_update.pdf` : `${editingPDF.filename.replace('.pdf', '')}_update.pdf`;
                      
                      // Use saveGenerated to save the updated PDF
                      const temps = editingPDF.temperatures 
                        ? (typeof editingPDF.temperatures === 'string' 
                          ? editingPDF.temperatures.split(',').map(t => parseFloat(t.trim())).filter(t => !isNaN(t))
                          : editingPDF.temperatures)
                        : [];
                      const times = editingPDF.times
                        ? (typeof editingPDF.times === 'string'
                          ? editingPDF.times.split(',').map(t => parseFloat(t.trim())).filter(t => !isNaN(t))
                          : editingPDF.times)
                        : [];
                      
                      await saveGeneratedMutation.mutateAsync({
                        filename: newFilename,
                        fileBase64,
                        temperatures: temps,
                        times: times,
                      });
                      refetch();
                      
                      toast.success('Schedule update saved. Original PDF preserved, update notes appended.');
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
