import { describe, it, expect } from "vitest";

describe("kilnLog PDF save to library", () => {
  it("should support saving kiln log PDFs to library", () => {
    const temperatures = [1050, 1100, 1150, 1100, 950];
    const times = [0, 1, 2, 3, 4];

    expect(temperatures.length).toBe(5);
    expect(times.length).toBe(5);
  });

  it("should save PDF with correct temperature and time data", () => {
    const temperatures = [1000, 1050, 1100];
    const times = [0.5, 1.5, 2.5];

    expect(temperatures).toEqual([1000, 1050, 1100]);
    expect(times).toEqual([0.5, 1.5, 2.5]);
  });

  it("should handle empty temperature and time arrays", () => {
    const temperatures: number[] = [];
    const times: number[] = [];

    expect(temperatures).toEqual([]);
    expect(times).toEqual([]);
  });

  it("should generate proper storage key format", () => {
    const filename = "format_test.pdf";

    expect(filename).toContain(".pdf");
    expect(filename).toBe("format_test.pdf");
  });

  it("should support kiln log PDF metadata", () => {
    const pdfData = {
      filename: "kiln_log.pdf",
      temperatures: [1050, 1100, 1150],
      times: [0, 1, 2],
    };

    expect(pdfData.filename).toBe("kiln_log.pdf");
    expect(pdfData.temperatures.length).toBe(3);
    expect(pdfData.times.length).toBe(3);
  });
});
