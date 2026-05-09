import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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

describe("kilnLog", () => {
  it("should create a kiln log entry", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.kilnLog.create({
      name: "Test Kiln Run",
      description: "2mm solid boro",
      temperatures: [1050, 1100, 1150, 1100, 950],
      times: [0, 1, 2, 3, 4],
      startTime: new Date(),
      notes: "Test run",
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe("Test Kiln Run");
    expect(result?.description).toBe("2mm solid boro");
  });

  it("should list kiln logs for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const logs = await caller.kilnLog.list();
    expect(Array.isArray(logs)).toBe(true);
  });

  it("should get a specific kiln log by id", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const created = await caller.kilnLog.create({
      name: "Get Test Log",
      temperatures: [1050, 1100],
      times: [0, 1],
      startTime: new Date(),
    });

    if (!created?.id) {
      throw new Error("Failed to create test log");
    }

    const retrieved = await caller.kilnLog.get({ id: created.id });
    expect(retrieved).toBeDefined();
    expect(retrieved?.temperatures).toBeDefined();
  });

  it("should update a kiln log entry", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const created = await caller.kilnLog.create({
      name: "Original Name",
      temperatures: [1050, 1100],
      times: [0, 1],
      startTime: new Date(),
    });

    if (!created?.id) {
      throw new Error("Failed to create test log");
    }

    const updated = await caller.kilnLog.update({
      id: created.id,
      notes: "Updated notes",
    });

    expect(updated).toBeDefined();
    expect(updated?.notes).toBe("Updated notes");
  });

  it("should delete a kiln log entry", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const created = await caller.kilnLog.create({
      name: "Delete Test Log",
      temperatures: [1050, 1100],
      times: [0, 1],
      startTime: new Date(),
    });

    if (!created?.id) {
      throw new Error("Failed to create test log");
    }

    const result = await caller.kilnLog.delete({ id: created.id });
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });

  it("should handle temperature and time arrays correctly", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const temperatures = [1000, 1050, 1100, 1150, 1200, 1100, 950, 500];
    const times = [0, 0.5, 1, 1.5, 2, 3, 4, 5];

    const result = await caller.kilnLog.create({
      name: "Complex Temperature Profile",
      temperatures,
      times,
      startTime: new Date(),
    });

    expect(result).toBeDefined();
    expect(result?.temperatures).toBeDefined();
    expect(result?.times).toBeDefined();
  });

  it("should require authentication for kiln log operations", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    } as any);

    try {
      await caller.kilnLog.list();
      expect.fail("Should have thrown authentication error");
    } catch (error: any) {
      expect(error.message).toContain("10001");
    }
  });
});
