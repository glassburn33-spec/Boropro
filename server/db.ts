import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, pdfLibrary, InsertPDFLibrary, PDFLibrary, kilnLog, InsertKilnLog, KilnLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// PDF Library queries
export async function savePDFToLibrary(userId: number, data: Omit<InsertPDFLibrary, 'userId'>): Promise<PDFLibrary | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save PDF: database not available");
    return null;
  }

  try {
    const result = await db.insert(pdfLibrary).values({
      ...data,
      userId,
    });
    
    // Fetch and return the inserted record
    const inserted = await db.select().from(pdfLibrary).where(eq(pdfLibrary.id, result[0].insertId as number)).limit(1);
    return inserted.length > 0 ? inserted[0] : null;
  } catch (error) {
    console.error("[Database] Failed to save PDF:", error);
    throw error;
  }
}

export async function getPDFLibraryByUserId(userId: number): Promise<PDFLibrary[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get PDFs: database not available");
    return [];
  }

  try {
    return await db.select().from(pdfLibrary).where(eq(pdfLibrary.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get PDFs:", error);
    return [];
  }
}

export async function getPDFById(id: number, userId: number): Promise<PDFLibrary | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get PDF: database not available");
    return null;
  }

  try {
    const result = await db.select().from(pdfLibrary).where(
      eq(pdfLibrary.id, id) && eq(pdfLibrary.userId, userId)
    ).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get PDF:", error);
    return null;
  }
}

export async function deletePDFFromLibrary(id: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete PDF: database not available");
    return false;
  }

  try {
    await db.delete(pdfLibrary).where(
      eq(pdfLibrary.id, id) && eq(pdfLibrary.userId, userId)
    );
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete PDF:", error);
    return false;
  }
}

// Kiln Log queries
export async function createKilnLog(userId: number, data: Omit<InsertKilnLog, 'userId'>): Promise<KilnLog | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create kiln log: database not available");
    return null;
  }

  try {
    const result = await db.insert(kilnLog).values({
      ...data,
      userId,
    });
    
    const inserted = await db.select().from(kilnLog).where(eq(kilnLog.id, result[0].insertId as number)).limit(1);
    return inserted.length > 0 ? inserted[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create kiln log:", error);
    throw error;
  }
}

export async function getKilnLogsByUserId(userId: number): Promise<KilnLog[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get kiln logs: database not available");
    return [];
  }

  try {
    return await db.select().from(kilnLog).where(eq(kilnLog.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get kiln logs:", error);
    return [];
  }
}

export async function getKilnLogById(id: number, userId: number): Promise<KilnLog | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get kiln log: database not available");
    return null;
  }

  try {
    const result = await db.select().from(kilnLog).where(
      eq(kilnLog.id, id) && eq(kilnLog.userId, userId)
    ).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get kiln log:", error);
    return null;
  }
}

export async function updateKilnLog(id: number, userId: number, data: Partial<Omit<InsertKilnLog, 'userId'>>): Promise<KilnLog | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update kiln log: database not available");
    return null;
  }

  try {
    await db.update(kilnLog).set({
      ...data,
      updatedAt: new Date(),
    }).where(
      eq(kilnLog.id, id) && eq(kilnLog.userId, userId)
    );
    
    return await getKilnLogById(id, userId);
  } catch (error) {
    console.error("[Database] Failed to update kiln log:", error);
    throw error;
  }
}

export async function deleteKilnLog(id: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete kiln log: database not available");
    return false;
  }

  try {
    await db.delete(kilnLog).where(
      eq(kilnLog.id, id) && eq(kilnLog.userId, userId)
    );
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete kiln log:", error);
    return false;
  }
}

// TODO: add feature queries here as your schema grows.
