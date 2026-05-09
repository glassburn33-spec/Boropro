import { describe, expect, it } from "vitest";
import { generateAnealingSchedulePDF, pdfToBase64 } from "./pdfUtils";
import type { AnealingSchedulePDFData } from "./pdfUtils";

describe("pdfUtils", () => {
  describe("generateAnealingSchedulePDF", () => {
    it("should generate a PDF with basic schedule data", () => {
      const pdfData: AnealingSchedulePDFData = {
        name: "Test Schedule",
        timestamp: "2026-05-09T22:00:00Z",
        stage1: { startTemp: 20, targetTemp: 565, duration: 60 },
        stage2: { holdTemp: 565, duration: 15 },
        stage3: { startTemp: 565, endTemp: 300, duration: 180 },
        stage4: { startTemp: 300, endTemp: 20, duration: 240 },
        annealingPoint: 565,
        strainPoint: 515,
        notes: "Test notes",
        results: "Test results",
        plotImage: undefined,
      };

      const pdf = generateAnealingSchedulePDF(pdfData);
      expect(pdf).toBeDefined();
      expect(pdf.internal.pageSize).toBeDefined();
    });

    it("should include plot image when provided", () => {
      // Create a minimal PNG image (1x1 transparent pixel)
      const pngData =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const pdfData: AnealingSchedulePDFData = {
        name: "Test Schedule with Plot",
        timestamp: "2026-05-09T22:00:00Z",
        stage1: { startTemp: 20, targetTemp: 565, duration: 60 },
        stage2: { holdTemp: 565, duration: 15 },
        stage3: { startTemp: 565, endTemp: 300, duration: 180 },
        stage4: { startTemp: 300, endTemp: 20, duration: 240 },
        annealingPoint: 565,
        strainPoint: 515,
        notes: "Test notes with plot",
        results: "Test results with plot",
        plotImage: pngData,
      };

      const pdf = generateAnealingSchedulePDF(pdfData);
      expect(pdf).toBeDefined();

      // Get the PDF content to verify image is embedded
      const pdfOutput = pdf.output("arraybuffer");
      expect(pdfOutput).toBeDefined();
      expect(pdfOutput.byteLength).toBeGreaterThan(0);

      // PDF with image should be larger than PDF without image
      const pdfDataWithoutImage: AnealingSchedulePDFData = {
        ...pdfData,
        plotImage: undefined,
      };
      const pdfWithout = generateAnealingSchedulePDF(pdfDataWithoutImage);
      const pdfWithoutOutput = pdfWithout.output("arraybuffer");

      expect(pdfOutput.byteLength).toBeGreaterThan(
        pdfWithoutOutput.byteLength
      );
    });

    it("should handle missing plot image gracefully", () => {
      const pdfData: AnealingSchedulePDFData = {
        name: "Test Schedule",
        timestamp: "2026-05-09T22:00:00Z",
        stage1: { startTemp: 20, targetTemp: 565, duration: 60 },
        stage2: { holdTemp: 565, duration: 15 },
        stage3: { startTemp: 565, endTemp: 300, duration: 180 },
        stage4: { startTemp: 300, endTemp: 20, duration: 240 },
        annealingPoint: 565,
        strainPoint: 515,
        notes: "",
        results: "",
        plotImage: undefined,
      };

      const pdf = generateAnealingSchedulePDF(pdfData);
      expect(pdf).toBeDefined();

      const pdfOutput = pdf.output("arraybuffer");
      expect(pdfOutput.byteLength).toBeGreaterThan(0);
    });

    it("should convert PDF to base64 correctly", () => {
      const pdfData: AnealingSchedulePDFData = {
        name: "Test Schedule",
        timestamp: "2026-05-09T22:00:00Z",
        stage1: { startTemp: 20, targetTemp: 565, duration: 60 },
        stage2: { holdTemp: 565, duration: 15 },
        stage3: { startTemp: 565, endTemp: 300, duration: 180 },
        stage4: { startTemp: 300, endTemp: 20, duration: 240 },
        annealingPoint: 565,
        strainPoint: 515,
        notes: "Test notes",
        results: "Test results",
        plotImage: undefined,
      };

      const pdf = generateAnealingSchedulePDF(pdfData);
      const base64 = pdfToBase64(pdf);

      expect(typeof base64).toBe("string");
      expect(base64.length).toBeGreaterThan(0);

      // Base64 string should only contain valid base64 characters
      expect(/^[A-Za-z0-9+/=]*$/.test(base64)).toBe(true);
    });
  });
});
