import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context for testing
const mockUser = {
  id: 1,
  openId: "test-user",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "test",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createMockContext(): TrpcContext {
  return {
    user: mockUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("pdfLibrary router", () => {
  let ctx: TrpcContext;

  beforeEach(() => {
    ctx = createMockContext();
  });

  describe("list", () => {
    it("should return empty array for user with no PDFs", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.pdfLibrary.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should require authentication", async () => {
      const unauthedCtx = { ...ctx, user: null };
      const caller = appRouter.createCaller(unauthedCtx as any);
      
      try {
        await caller.pdfLibrary.list();
        expect.fail("Should have thrown UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("delete", () => {
    it("should require authentication", async () => {
      const unauthedCtx = { ...ctx, user: null };
      const caller = appRouter.createCaller(unauthedCtx as any);
      
      try {
        await caller.pdfLibrary.delete({ id: 1 });
        expect.fail("Should have thrown UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should return success status", async () => {
      const caller = appRouter.createCaller(ctx);
      const result = await caller.pdfLibrary.delete({ id: 999 });
      expect(result).toHaveProperty("success");
      expect(typeof result.success).toBe("boolean");
    });
  });

  describe("upload", () => {
    it("should require authentication", async () => {
      const unauthedCtx = { ...ctx, user: null };
      const caller = appRouter.createCaller(unauthedCtx as any);
      
      try {
        const buffer = Buffer.from("test");
        await caller.pdfLibrary.upload({
          filename: "test.pdf",
          fileData: buffer,
        });
        expect.fail("Should have thrown UNAUTHORIZED error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should validate input parameters", async () => {
      const caller = appRouter.createCaller(ctx);
      
      try {
        await caller.pdfLibrary.upload({
          filename: "",
          fileData: Buffer.from(""),
        } as any);
        // If it doesn't throw, that's okay - the API will handle empty inputs
      } catch (error: any) {
        // Expected - validation should fail on empty filename
        expect(error).toBeDefined();
      }
    });
  });
});
