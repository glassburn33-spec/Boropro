import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-pdf-save",
    email: "test-pdf-save@example.com",
    name: "Test User PDF Save",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("kilnLog PDF save to library", () => {
  it("should save generated kiln log PDF to library", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const temperatures = [1050, 1100, 1150, 1100, 950];
    const times = [0, 1, 2, 3, 4];

    // Create a simple PDF in base64 format (minimal PDF)
    const minimalPDF = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 190 %%EOF"
    );

    const result = await caller.pdfLibrary.saveGenerated({
      filename: "test_kiln_log.pdf",
      fileBase64: minimalPDF.toString("base64"),
      temperatures,
      times,
    });

    expect(result.success).toBe(true);
    expect(result.pdf).toBeDefined();
    expect(result.pdf.filename).toBe("test_kiln_log.pdf");
    expect(result.storageUrl).toBeDefined();
  });

  it("should save PDF with correct temperature and time data", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const temperatures = [1000, 1050, 1100];
    const times = [0.5, 1.5, 2.5];

    const minimalPDF = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 190 %%EOF"
    );

    const result = await caller.pdfLibrary.saveGenerated({
      filename: "kiln_log_with_data.pdf",
      fileBase64: minimalPDF.toString("base64"),
      temperatures,
      times,
    });

    expect(result.success).toBe(true);
    const savedTemps = JSON.parse(result.pdf.temperatures);
    const savedTimes = JSON.parse(result.pdf.times);

    expect(savedTemps).toEqual(temperatures);
    expect(savedTimes).toEqual(times);
  });

  it("should handle empty temperature and time arrays", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const minimalPDF = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 190 %%EOF"
    );

    const result = await caller.pdfLibrary.saveGenerated({
      filename: "empty_kiln_log.pdf",
      fileBase64: minimalPDF.toString("base64"),
      temperatures: [],
      times: [],
    });

    expect(result.success).toBe(true);
    const savedTemps = JSON.parse(result.pdf.temperatures);
    const savedTimes = JSON.parse(result.pdf.times);

    expect(savedTemps).toEqual([]);
    expect(savedTimes).toEqual([]);
  });

  it("should generate proper storage key format", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const minimalPDF = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 190 %%EOF"
    );

    const result = await caller.pdfLibrary.saveGenerated({
      filename: "format_test.pdf",
      fileBase64: minimalPDF.toString("base64"),
      temperatures: [1050],
      times: [1],
    });

    expect(result.pdf.storageKey).toBeDefined();
    expect(result.pdf.storageKey).toContain("pdfs");
  });

  it("should require authentication", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    const minimalPDF = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 190 %%EOF"
    );

    try {
      await caller.pdfLibrary.saveGenerated({
        filename: "test.pdf",
        fileBase64: minimalPDF.toString("base64"),
        temperatures: [1050],
        times: [1],
      });
      expect.fail("Should have thrown authentication error");
    } catch (error: any) {
      expect(error.message).toContain("Please login");
    }
  });
});
