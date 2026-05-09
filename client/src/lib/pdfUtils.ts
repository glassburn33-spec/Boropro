import * as pdfjsLib from "pdfjs-dist";
import jsPDF from "jspdf";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedScheduleData {
  filename: string;
  uploadDate: string;
  extractedText: string;
  temperatures: number[];
  times: number[];
  notes: string;
}

export interface SchedulePDFData {
  title: string;
  colors: string[];
  annealTemp: number;
  strainTemp: number;
  coolingRate: number;
  warnings: string[];
  rationale: string;
  generatedDate: string;
}

/**
 * Extract text content from an uploaded PDF file
 */
export async function extractPDFText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText;
}

/**
 * Parse extracted text to find temperature and time values
 */
export function parseScheduleData(text: string): { temps: number[]; times: number[] } {
  const temps: number[] = [];
  const times: number[] = [];

  // Look for temperature patterns (e.g., "1050°F", "1050 F", "1050")
  const tempRegex = /(\d{3,4})\s*°?F?/gi;
  let match;
  while ((match = tempRegex.exec(text)) !== null) {
    const temp = parseInt(match[1]);
    if (temp > 500 && temp < 2000) {
      // Reasonable kiln temperature range
      temps.push(temp);
    }
  }

  // Look for time patterns (e.g., "2 hours", "30 minutes", "2h", "30m")
  const timeRegex = /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h|minutes?|mins?|m)/gi;
  while ((match = timeRegex.exec(text)) !== null) {
    const timeValue = parseFloat(match[1]);
    // Convert to hours if in minutes
    const isMinutes = match[0].toLowerCase().includes("min") || match[0].toLowerCase().includes("m");
    const hours = isMinutes ? timeValue / 60 : timeValue;
    if (hours > 0 && hours < 24) {
      times.push(parseFloat(hours.toFixed(2)));
    }
  }

  return { temps: Array.from(new Set(temps)), times: Array.from(new Set(times)) };
}

/**
 * Generate a PDF schedule from schedule data
 */
export function generateSchedulePDF(data: SchedulePDFData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("BOROSILICATE KILN SCHEDULE", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;

  // Title
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(data.title, pageWidth / 2, yPosition, { align: "center" });

  yPosition += 12;

  // Generated date
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${data.generatedDate}`, pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;

  // Schedule parameters box
  doc.setDrawColor(150, 150, 150);
  doc.rect(15, yPosition - 8, pageWidth - 30, 35);

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text("SCHEDULE PARAMETERS", 20, yPosition);

  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const colWidth = (pageWidth - 30) / 2;
  doc.text(`Anneal Temperature: ${data.annealTemp}°F`, 20, yPosition);
  doc.text(`Strain Temperature: ${data.strainTemp}°F`, 20 + colWidth, yPosition);

  yPosition += 7;
  doc.text(`Cooling Rate: ${data.coolingRate}°F/hour`, 20, yPosition);

  yPosition += 15;

  // Colors used
  if (data.colors.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("COLORS USED", 20, yPosition);

    yPosition += 7;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const colorText = data.colors.join(", ");
    const colorLines = doc.splitTextToSize(colorText, pageWidth - 40);
    doc.text(colorLines, 20, yPosition);

    yPosition += colorLines.length * 5 + 5;
  }

  // Warnings
  if (data.warnings.length > 0) {
    doc.setDrawColor(255, 165, 0);
    doc.setFillColor(255, 250, 205);
    doc.rect(15, yPosition - 8, pageWidth - 30, data.warnings.length * 6 + 10, "FD");

    doc.setFontSize(11);
    doc.setTextColor(255, 100, 0);
    doc.text("⚠ WARNINGS", 20, yPosition);

    yPosition += 7;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    data.warnings.forEach((warning) => {
      const warningLines = doc.splitTextToSize(`• ${warning}`, pageWidth - 40);
      doc.text(warningLines, 20, yPosition);
      yPosition += warningLines.length * 5;
    });

    yPosition += 5;
  }

  // Rationale
  if (data.rationale) {
    yPosition += 5;

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("RATIONALE", 20, yPosition);

    yPosition += 7;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const rationaleLines = doc.splitTextToSize(data.rationale, pageWidth - 40);
    doc.text(rationaleLines, 20, yPosition);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Generated by Borosilicate Kiln Research Platform",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  return doc;
}

/**
 * Download a PDF file
 */
export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename);
}

/**
 * Store uploaded PDF metadata in localStorage
 */
export interface StoredPDFMetadata {
  id: string;
  filename: string;
  uploadDate: string;
  extractedText: string;
  temperatures: number[];
  times: number[];
}

const PDF_STORAGE_KEY = "boro_kiln_pdf_library";

export function savePDFMetadata(metadata: Omit<StoredPDFMetadata, "id">): string {
  const id = Date.now().toString();
  const stored = localStorage.getItem(PDF_STORAGE_KEY);
  const library: StoredPDFMetadata[] = stored ? JSON.parse(stored) : [];

  const newEntry: StoredPDFMetadata = { ...metadata, id };
  library.push(newEntry);

  localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify(library));
  return id;
}

export function getPDFLibrary(): StoredPDFMetadata[] {
  const stored = localStorage.getItem(PDF_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deletePDFMetadata(id: string): void {
  const stored = localStorage.getItem(PDF_STORAGE_KEY);
  if (!stored) return;

  const library: StoredPDFMetadata[] = JSON.parse(stored);
  const filtered = library.filter((item) => item.id !== id);

  localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Generate a PDF from Kiln Log data
 */
export interface KilnLogPDFData {
  name: string;
  description?: string;
  temperatures: number[];
  times: number[];
  startTime: Date;
  endTime?: Date;
  notes?: string;
}

export function generateKilnLogPDF(data: KilnLogPDFData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("KILN LOG RECORD", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;

  // Log name
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(data.name, pageWidth / 2, yPosition, { align: "center" });

  yPosition += 12;

  // Generated date
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;

  // Log info box
  doc.setDrawColor(150, 150, 150);
  doc.rect(15, yPosition - 8, pageWidth - 30, 35);

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text("LOG INFORMATION", 20, yPosition);

  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  const colWidth = (pageWidth - 30) / 2;
  doc.text(`Start Time: ${data.startTime.toLocaleString()}`, 20, yPosition);
  if (data.endTime) {
    doc.text(`End Time: ${data.endTime.toLocaleString()}`, 20 + colWidth, yPosition);
  }

  yPosition += 15;

  // Description
  if (data.description) {
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("DESCRIPTION", 20, yPosition);

    yPosition += 7;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const descLines = doc.splitTextToSize(data.description, pageWidth - 40);
    doc.text(descLines, 20, yPosition);

    yPosition += descLines.length * 5 + 5;
  }

  // Temperature data
  if (data.temperatures.length > 0) {
    yPosition += 5;

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("TEMPERATURE SCHEDULE", 20, yPosition);

    yPosition += 7;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    // Create table-like structure
    const tempColWidth = (pageWidth - 40) / 2;
    doc.text("Temperature (°F)", 20, yPosition);
    doc.text("Time (hours)", 20 + tempColWidth, yPosition);

    yPosition += 5;

    // Draw data rows
    const maxRows = Math.max(data.temperatures.length, data.times.length);
    for (let i = 0; i < maxRows; i++) {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      const temp = data.temperatures[i] !== undefined ? data.temperatures[i].toString() : "";
      const time = data.times[i] !== undefined ? data.times[i].toString() : "";

      doc.text(temp, 20, yPosition);
      doc.text(time, 20 + tempColWidth, yPosition);

      yPosition += 5;
    }

    yPosition += 5;
  }

  // Notes
  if (data.notes) {
    yPosition += 5;

    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text("NOTES", 20, yPosition);

    yPosition += 7;

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const noteLines = doc.splitTextToSize(data.notes, pageWidth - 40);
    doc.text(noteLines, 20, yPosition);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Generated by BoroPro - Borosilicate Kiln Research Platform",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  return doc;
}

/**
 * Generate a custom PDF from annealing schedule data (matching Export PDF format)
 * This is used by both Export PDF button and Save to PDF Library button
 */
export interface AnealingSchedulePDFData {
  name: string;
  timestamp: string;
  stage1: { startTemp: number; targetTemp: number; duration: number };
  stage2: { holdTemp: number; duration: number };
  stage3: { startTemp: number; endTemp: number; duration: number };
  stage4: { startTemp: number; endTemp: number; duration: number };
  annealingPoint: number;
  strainPoint: number;
  notes?: string;
  results?: string;
  plotImage?: string; // Base64 encoded PNG image
}

export function generateAnealingSchedulePDF(data: AnealingSchedulePDFData): jsPDF {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 10;

  // Add black background to entire page
  pdf.setFillColor(0, 0, 0);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Set text color to yellow for all text
  pdf.setTextColor(255, 187, 36);

  // Add title
  pdf.setFontSize(16);
  (pdf as any).setFont(undefined, 'bold');
  pdf.text(data.name, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Add timestamp
  pdf.setFontSize(10);
  (pdf as any).setFont(undefined, 'normal');
  pdf.text(`Saved: ${data.timestamp}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  // Add separator line in yellow
  pdf.setDrawColor(255, 187, 36);
  pdf.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 5;

  // Add plot image if provided
  if (data.plotImage) {
    try {
      const imgWidth = pageWidth - 20;
      const imgHeight = 100; // Fixed height for plot

      // Add plot image to PDF
      if (yPosition + imgHeight > pageHeight - 20) {
        pdf.addPage();
        // Add black background to new page
        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        yPosition = 10;
      }
      pdf.addImage(data.plotImage, 'PNG', 10, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 8;
    } catch (error) {
      console.error('Error adding plot image:', error);
      // Continue without plot if image fails
    }
  }

  // Add separator before profile data
  if (yPosition + 30 > pageHeight - 10) {
    pdf.addPage();
    // Add black background to new page
    pdf.setFillColor(0, 0, 0);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    yPosition = 10;
  }
  pdf.setDrawColor(255, 187, 36);
  pdf.line(10, yPosition, pageWidth - 10, yPosition);
  yPosition += 5;

  // Add profile data
  pdf.setTextColor(255, 187, 36);
  pdf.setFontSize(12);
  (pdf as any).setFont(undefined, 'bold');
  pdf.text('Profile Configuration:', 10, yPosition);
  yPosition += 6;

  pdf.setFontSize(10);
  (pdf as any).setFont(undefined, 'normal');
  const profileData = [
    `Stage 1: ${data.stage1.startTemp}°C → ${data.stage1.targetTemp}°C (${data.stage1.duration} min)`,
    `Stage 2: Hold ${data.stage2.holdTemp}°C (${data.stage2.duration} min)`,
    `Stage 3: ${data.stage3.startTemp}°C → ${data.stage3.endTemp}°C (${data.stage3.duration} min)`,
    `Stage 4: ${data.stage4.startTemp}°C → ${data.stage4.endTemp}°C (${data.stage4.duration} min)`,
    `Annealing Point: ${data.annealingPoint}°C`,
    `Strain Point: ${data.strainPoint}°C`,
  ];
  profileData.forEach(line => {
    pdf.text(line, 10, yPosition);
    yPosition += 5;
  });
  yPosition += 3;

  // Add materials & notes
  if (data.notes) {
    if (yPosition + 30 > pageHeight - 10) {
      pdf.addPage();
      // Add black background to new page
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      yPosition = 10;
    }

    pdf.setTextColor(255, 187, 36);
    pdf.setFontSize(12);
    (pdf as any).setFont(undefined, 'bold');
    pdf.text('Materials & Notes:', 10, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    (pdf as any).setFont(undefined, 'normal');
    const notesLines = (pdf as any).splitTextToSize(data.notes, pageWidth - 20);
    (pdf as any).text(notesLines, 10, yPosition);
    yPosition += notesLines.length * 5 + 5;
  }

  // Add results
  if (data.results) {
    if (yPosition + 30 > pageHeight - 10) {
      pdf.addPage();
      // Add black background to new page
      pdf.setFillColor(0, 0, 0);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      yPosition = 10;
    }

    pdf.setTextColor(255, 187, 36);
    pdf.setFontSize(12);
    (pdf as any).setFont(undefined, 'bold');
    pdf.text('Results & Observations:', 10, yPosition);
    yPosition += 6;

    pdf.setFontSize(10);
    (pdf as any).setFont(undefined, 'normal');
    const resultsLines = (pdf as any).splitTextToSize(data.results, pageWidth - 20);
    (pdf as any).text(resultsLines, 10, yPosition);
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    "Generated by BoroPro - Borosilicate Kiln Research Platform",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  return pdf;
}

/**
 * Convert jsPDF to base64 string for transmission
 */
export function pdfToBase64(doc: jsPDF): string {
  const pdfData = doc.output("arraybuffer");
  const bytes = new Uint8Array(pdfData);
  
  // Use the most reliable method: convert to base64 directly from Uint8Array
  // This avoids all issues with String.fromCharCode and btoa
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
