import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

interface PDFViewerProps {
  pdfId: number;
}

export function PDFViewer({ pdfId }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the PDF file from the backend
  const { data: pdfData } = trpc.pdfLibrary.getPDF.useQuery({ id: pdfId });

  useEffect(() => {
    if (pdfData?.fileBase64) {
      try {
        // Convert base64 to blob
        const binaryString = atob(pdfData.fileBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load PDF");
        setIsLoading(false);
        console.error("PDF loading error:", err);
      }
    }
  }, [pdfData]);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-stone-800/50">
        <p className="text-stone-400">Loading PDF...</p>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-stone-800/50">
        <p className="text-red-400">{error || "Failed to load PDF"}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-800/50">
      <iframe
        src={pdfUrl}
        className="w-full h-96 border-0 rounded"
        title="PDF Viewer"
      />
    </div>
  );
}
