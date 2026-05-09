import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

interface PDFViewerProps {
  pdfId: number;
}

export function PDFViewer({ pdfId }: PDFViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the PDF file from the backend
  const { data: pdfData, isLoading: isQueryLoading, error: queryError } = trpc.pdfLibrary.getPDF.useQuery({ id: pdfId });

  // Load PDF into iframe
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

    try {
      // Create blob from base64
      const binaryString = atob(pdfData.fileBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      if (iframeRef.current) {
        iframeRef.current.src = url;
        setIsLoading(false);
      }

      // Cleanup
      return () => URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to load PDF");
      setIsLoading(false);
      console.error("PDF loading error:", err);
    }
  }, [pdfData, isQueryLoading, queryError]);

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
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-2">Error Loading PDF</p>
          <p className="text-stone-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-stone-800/50 flex items-center justify-center p-4">
      <div className="w-full h-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}
