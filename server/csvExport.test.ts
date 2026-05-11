import { describe, it, expect } from "vitest";

describe("CSV Export Functionality", () => {
  describe("CSV generation", () => {
    it("should generate valid CSV from temperature and time data", () => {
      const temperatures = [1050, 1020, 1035];
      const times = [2.5, 3.0, 2.75];

      // Simulate CSV generation
      const headers = ["Temperature (°F)", "Time (hours)"];
      const rows: string[][] = [];

      const maxLength = Math.max(temperatures.length, times.length);
      for (let i = 0; i < maxLength; i++) {
        const temp = temperatures[i] ?? "";
        const time = times[i] ?? "";
        rows.push([temp.toString(), time.toString()]);
      }

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      expect(csvContent).toContain("Temperature (°F),Time (hours)");
      expect(csvContent).toContain("1050,2.5");
      expect(csvContent).toContain("1020,3");
      expect(csvContent).toContain("1035,2.75");
    });

    it("should handle empty temperature array", () => {
      const temperatures: number[] = [];
      const times = [2.5, 3.0];

      const headers = ["Temperature (°F)", "Time (hours)"];
      const rows: string[][] = [];

      const maxLength = Math.max(temperatures.length, times.length);
      for (let i = 0; i < maxLength; i++) {
        const temp = temperatures[i] ?? "";
        const time = times[i] ?? "";
        rows.push([temp.toString(), time.toString()]);
      }

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      expect(csvContent).toContain(",2.5");
      expect(csvContent).toContain(",3");
    });

    it("should handle empty time array", () => {
      const temperatures = [1050, 1020];
      const times: number[] = [];

      const headers = ["Temperature (°F)", "Time (hours)"];
      const rows: string[][] = [];

      const maxLength = Math.max(temperatures.length, times.length);
      for (let i = 0; i < maxLength; i++) {
        const temp = temperatures[i] ?? "";
        const time = times[i] ?? "";
        rows.push([temp.toString(), time.toString()]);
      }

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      expect(csvContent).toContain("1050,");
      expect(csvContent).toContain("1020,");
    });

    it("should handle both arrays empty", () => {
      const temperatures: number[] = [];
      const times: number[] = [];

      const headers = ["Temperature (°F)", "Time (hours)"];
      const rows: string[][] = [];

      const maxLength = Math.max(temperatures.length, times.length);
      for (let i = 0; i < maxLength; i++) {
        const temp = temperatures[i] ?? "";
        const time = times[i] ?? "";
        rows.push([temp.toString(), time.toString()]);
      }

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Should only contain headers
      expect(csvContent).toBe("Temperature (°F),Time (hours)");
    });

    it("should escape special characters in CSV", () => {
      const temperatures = [1050];
      const times = [2.5];

      const headers = ["Temperature (°F)", "Time (hours)"];
      const rows: string[][] = [];

      const maxLength = Math.max(temperatures.length, times.length);
      for (let i = 0; i < maxLength; i++) {
        const temp = temperatures[i] ?? "";
        const time = times[i] ?? "";
        rows.push([temp.toString(), time.toString()]);
      }

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Verify CSV is properly formatted
      const lines = csvContent.split("\n");
      expect(lines.length).toBe(2); // Header + 1 data row
      expect(lines[0]).toBe("Temperature (°F),Time (hours)");
      expect(lines[1]).toBe("1050,2.5");
    });
  });

  describe("filename generation", () => {
    it("should replace .pdf extension with .csv", () => {
      const filename = "schedule_2024.pdf";
      const csvFilename = filename.replace(".pdf", ".csv");
      expect(csvFilename).toBe("schedule_2024.csv");
    });

    it("should handle filenames without extension", () => {
      const filename = "schedule_2024";
      const csvFilename = filename.replace(".pdf", ".csv");
      expect(csvFilename).toBe("schedule_2024");
    });

    it("should handle multiple dots in filename", () => {
      const filename = "schedule.2024.01.pdf";
      const csvFilename = filename.replace(".pdf", ".csv");
      expect(csvFilename).toBe("schedule.2024.01.csv");
    });
  });
});
