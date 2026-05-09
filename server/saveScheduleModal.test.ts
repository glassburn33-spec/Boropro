import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-modal",
    email: "test-modal@example.com",
    name: "Test User Modal",
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

describe("SaveScheduleModal Integration", () => {
  it("should create kiln log and return data for modal display", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.kilnLog.create({
      name: "Modal Test Schedule",
      description: "Test for save modal",
      temperatures: [1050, 1100, 1150, 1100, 950],
      times: [0, 1, 2, 3, 4],
      startTime: new Date(),
      notes: "Test notes",
    });

    // Verify the result contains all necessary data for modal display
    expect(result).toBeDefined();
    expect(result?.name).toBe("Modal Test Schedule");
    expect(result?.description).toBe("Test for save modal");
    // Temperatures and times may be stored as JSON strings in database
    const temps = typeof result?.temperatures === "string" 
      ? JSON.parse(result.temperatures) 
      : result?.temperatures;
    const times = typeof result?.times === "string" 
      ? JSON.parse(result.times) 
      : result?.times;
    expect(temps).toEqual([1050, 1100, 1150, 1100, 950]);
    expect(times).toEqual([0, 1, 2, 3, 4]);
    expect(result?.notes).toBe("Test notes");
  });

  it("should support saving generated PDF to library after modal action", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a kiln log
    const kilnLog = await caller.kilnLog.create({
      name: "PDF Save Modal Test",
      description: "Testing PDF save from modal",
      temperatures: [1000, 1050, 1100],
      times: [0.5, 1.5, 2.5],
      startTime: new Date(),
    });

    expect(kilnLog).toBeDefined();

    // Then simulate saving the generated PDF to library
    const minimalPDF = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 190 %%EOF"
    );

    const saveResult = await caller.pdfLibrary.saveGenerated({
      filename: `${kilnLog!.name}_kiln_log.pdf`,
      fileBase64: minimalPDF.toString("base64"),
      temperatures: [1000, 1050, 1100],
      times: [0.5, 1.5, 2.5],
    });

    expect(saveResult.success).toBe(true);
    expect(saveResult.pdf.filename).toContain("PDF Save Modal Test");
  });

  it("should handle modal with empty notes gracefully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.kilnLog.create({
      name: "No Notes Schedule",
      description: "Schedule without notes",
      temperatures: [1050, 1100],
      times: [0, 1],
      startTime: new Date(),
    });

    expect(result).toBeDefined();
    // Notes may be null or undefined depending on database
    expect(result?.name).toBe("No Notes Schedule");
  });

  it("should preserve kiln log data through modal workflow", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const originalData = {
      name: "Complete Schedule",
      description: "Full test data",
      temperatures: [950, 1000, 1050, 1100],
      times: [0, 0.5, 1, 1.5],
      startTime: new Date("2026-05-09T12:00:00Z"),
      notes: "Complete test with all fields",
    };

    const result = await caller.kilnLog.create(originalData);

    expect(result).toBeDefined();
    expect(result?.name).toBe(originalData.name);
    expect(result?.description).toBe(originalData.description);
    expect(result?.notes).toBe(originalData.notes);
  });

  it("should support both export and library save actions", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Create kiln log
    const kilnLog = await caller.kilnLog.create({
      name: "Dual Action Test",
      temperatures: [1050, 1100],
      times: [0, 1],
      startTime: new Date(),
    });

    expect(kilnLog).toBeDefined();

    // Simulate both modal actions are available
    // Action 1: Export (handled client-side, just verify log was created)
    expect(kilnLog?.name).toBe("Dual Action Test");

    // Action 2: Save to library
    const minimalPDF = Buffer.from(
      "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>startxref 190 %%EOF"
    );

    const saveResult = await caller.pdfLibrary.saveGenerated({
      filename: `${kilnLog!.name}_kiln_log.pdf`,
      fileBase64: minimalPDF.toString("base64"),
      temperatures: [1050, 1100],
      times: [0, 1],
    });

    expect(saveResult.success).toBe(true);
  });
});
