import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { savePDFToLibrary, getPDFLibraryByUserId, deletePDFFromLibrary, createKilnLog, getKilnLogsByUserId, getKilnLogById, updateKilnLog, deleteKilnLog } from "./db";
import { storagePut } from "./storage";

let pdfjsLib: any = null;

// Lazy load PDF.js only when needed
async function getPDFLib() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
  return pdfjsLib;
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // PDF Library router
  pdfLibrary: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getPDFLibraryByUserId(ctx.user.id);
    }),

    upload: protectedProcedure
      .input(
        z.object({
          filename: z.string(),
          fileBase64: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Decode base64 to buffer
          const fileData = Buffer.from(input.fileBase64, 'base64');
          
          // Extract text from PDF
          const pdfLib = await getPDFLib();
          const arrayBuffer = fileData.buffer.slice(
            fileData.byteOffset,
            fileData.byteOffset + fileData.byteLength
          );
          const pdf = await pdfLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
          }

          // Parse temperatures and times
          const temps: number[] = [];
          const times: number[] = [];

          const tempRegex = /(\d{3,4})\s*°?F?/gi;
          let match;
          while ((match = tempRegex.exec(fullText)) !== null) {
            const temp = parseInt(match[1]);
            if (temp > 500 && temp < 2000) {
              temps.push(temp);
            }
          }

          const timeRegex = /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h|minutes?|mins?|m)/gi;
          while ((match = timeRegex.exec(fullText)) !== null) {
            const timeValue = parseFloat(match[1]);
            const isMinutes = match[0].toLowerCase().includes("min") || match[0].toLowerCase().includes("m");
            const hours = isMinutes ? timeValue / 60 : timeValue;
            if (hours > 0 && hours < 24) {
              times.push(parseFloat(hours.toFixed(2)));
            }
          }

          // Upload to storage
          const { key, url } = await storagePut(
            `pdfs/${ctx.user.id}/${input.filename}`,
            fileData,
            "application/pdf"
          );

          // Save to database
          const pdf_record = await savePDFToLibrary(ctx.user.id, {
            filename: input.filename,
            storageKey: key,
            extractedText: fullText,
            temperatures: JSON.stringify(Array.from(new Set(temps))),
            times: JSON.stringify(Array.from(new Set(times))),
          });

          return {
            success: true,
            pdf: pdf_record,
            storageUrl: url,
          };
        } catch (error) {
          console.error("PDF upload error:", error);
          throw error;
        }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const success = await deletePDFFromLibrary(input.id, ctx.user.id);
        return { success };
      }),
  }),

  kilnLog: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getKilnLogsByUserId(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          temperatures: z.array(z.number()),
          times: z.array(z.number()),
          startTime: z.date(),
          endTime: z.date().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const log = await createKilnLog(ctx.user.id, {
          name: input.name,
          description: input.description,
          temperatures: JSON.stringify(input.temperatures),
          times: JSON.stringify(input.times),
          startTime: input.startTime,
          endTime: input.endTime,
          notes: input.notes,
        });
        return log;
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        return await getKilnLogById(input.id, ctx.user.id);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          temperatures: z.array(z.number()).optional(),
          times: z.array(z.number()).optional(),
          startTime: z.date().optional(),
          endTime: z.date().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const updateData: any = {};
        
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.temperatures !== undefined) updateData.temperatures = JSON.stringify(data.temperatures);
        if (data.times !== undefined) updateData.times = JSON.stringify(data.times);
        if (data.startTime !== undefined) updateData.startTime = data.startTime;
        if (data.endTime !== undefined) updateData.endTime = data.endTime;
        if (data.notes !== undefined) updateData.notes = data.notes;
        
        return await updateKilnLog(id, ctx.user.id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const success = await deleteKilnLog(input.id, ctx.user.id);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
