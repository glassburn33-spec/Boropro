import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import * as pdfjsLib from "pdfjs-dist";

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfId: number;
}

export function PDFViewer({ pdfId }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pdfDocRef = useRef<any>(null);

  // Fetch the PDF file from the backend
  const { data: pdfData, isLoading: isQueryLoading, error: queryError } = trpc.pdfLibrary.getPDF.useQuery({ id: pdfId });

  // Load and render PDF
  useEffect(() => {
    // Check for query errors
    if (queryError) {
      setError(`Failed to fetch PDF: ${queryError.message}`);
      setIsLoading(false);
      return;
    }

    // If query is still loading, don't proceed
    if (isQueryLoading) {
      return;
    }

    if (!pdfData?.fileBase64) {
      setError('No PDF data available');
      setIsLoading(false);
      return;
    }

    const loadPDF = async () => {
      try {
        // Convert base64 to blob
        const binaryString = atob(pdfData.fileBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise as any;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load PDF");
        setIsLoading(false);
        console.error("PDF loading error:", err);
      }
    };

    loadPDF();
  }, [pdfData, isQueryLoading, queryError]);

  // Render current page
  useEffect(() => {
    if (!pdfDocRef.current || !canvasRef.current || !containerRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDocRef.current!.getPage(currentPage);
        const canvas = canvasRef.current!;
        const container = containerRef.current!;

        // Get container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Get PDF page dimensions
        const viewport = page.getViewport({ scale: 1 });
        const pageWidth = viewport.width;
        const pageHeight = viewport.height;
        const pageAspectRatio = pageWidth / pageHeight;

        // Calculate scale to fit page proportionally in container
        const containerAspectRatio = containerWidth / containerHeight;
        let scale = 1;

        if (pageAspectRatio > containerAspectRatio) {
          // Page is wider - fit to container width
          scale = containerWidth / pageWidth;
        } else {
          // Page is taller - fit to container height
          scale = containerHeight / pageHeight;
        }

        // Ensure scale doesn't exceed reasonable bounds
        scale = Math.min(scale, 3);
        scale = Math.max(scale, 0.5);

        // Get scaled viewport
        const scaledViewport = page.getViewport({ scale });

        // Set canvas dimensions
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        // Render page to canvas
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not get canvas context");

        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;
      } catch (err) {
        console.error("Error rendering PDF page:", err);
      }
    };

    renderPage();
  }, [currentPage, pdfDocRef.current]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (pdfDocRef.current) {
        setCurrentPage((prev) => prev); // Trigger re-render
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading || isQueryLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-stone-800/50">
        <div className="text-center">
          <p className="text-stone-400 mb-2">Loading PDF...</p>
          {isQueryLoading && <p className="text-stone-500 text-sm">Fetching from server...</p>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-stone-800/50">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex flex-col items-center justify-center bg-stone-800/50 overflow-auto"
    >
      <div className="flex items-center justify-center flex-1 w-full p-4">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full shadow-lg rounded"
          style={{ objectFit: "contain" }}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-4 p-4 bg-stone-900 border-t border-stone-700 w-full justify-center">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white rounded text-sm"
          >
            Previous
          </button>
          <span className="text-stone-300 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white rounded text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
