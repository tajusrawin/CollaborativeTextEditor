import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("Untitled Document"),
  content: jsonb("content").notNull().default({}),
  lastModified: timestamp("last_modified").defaultNow().notNull(),
  ownerId: text("owner_id").notNull(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  content: true,
  ownerId: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Document content structure
export const documentContentSchema = z.object({
  blocks: z.array(z.object({
    id: z.string(),
    type: z.enum(['paragraph', 'heading', 'list', 'table', 'image', 'divider']),
    content: z.any(),
    formatting: z.object({
      fontSize: z.number().optional(),
      fontFamily: z.string().optional(),
      bold: z.boolean().optional(),
      italic: z.boolean().optional(),
      underline: z.boolean().optional(),
      strikethrough: z.boolean().optional(),
      color: z.string().optional(),
      backgroundColor: z.string().optional(),
      alignment: z.enum(['left', 'center', 'right', 'justify']).optional(),
    }).optional(),
  })),
  settings: z.object({
    paperSize: z.enum(['A4', 'A3', 'A5', 'Letter', 'Legal']).default('A4'),
    orientation: z.enum(['portrait', 'landscape']).default('portrait'),
    defaultFont: z.string().default('Georgia'),
    lineSpacing: z.number().default(1.15),
    margins: z.object({
      top: z.number().default(1),
      bottom: z.number().default(1),
      left: z.number().default(1),
      right: z.number().default(1),
    }),
  }),
});

export type DocumentContent = z.infer<typeof documentContentSchema>;
