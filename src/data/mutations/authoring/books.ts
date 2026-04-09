import "server-only";

import { eq, type InferInsertModel } from "drizzle-orm";

import { db } from "@/data/db";
import {
  mapBookRow,
  mapBookVersionRow,
  type BookRecord,
  type BookVersionRecord
} from "@/data/mappers";
import { books, bookVersions } from "@/data/schema";

export type CreateBookInput = Pick<
  InferInsertModel<typeof books>,
  | "worldId"
  | "slug"
  | "title"
  | "premise"
  | "defaultTone"
  | "status"
  | "metadataJson"
>;

export type CreateBookVersionInput = Pick<
  InferInsertModel<typeof bookVersions>,
  "bookId" | "versionLabel" | "status" | "isActive" | "notes"
>;

export async function createBook(input: CreateBookInput): Promise<BookRecord> {
  const rows = await db.insert(books).values(input).returning();
  return mapBookRow(rows[0]);
}

export async function createBookVersion(
  input: CreateBookVersionInput
): Promise<BookVersionRecord> {
  const rows = await db.insert(bookVersions).values(input).returning();
  return mapBookVersionRow(rows[0]);
}

export type UpdateBookInput = Partial<CreateBookInput>;
export type UpdateBookVersionInput = Partial<CreateBookVersionInput>;

export async function updateBook(
  bookId: string,
  input: UpdateBookInput
): Promise<BookRecord | null> {
  const rows = await db
    .update(books)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(books.id, bookId))
    .returning();

  return rows[0] ? mapBookRow(rows[0]) : null;
}

export async function updateBookVersion(
  versionId: string,
  input: UpdateBookVersionInput
): Promise<BookVersionRecord | null> {
  const rows = await db
    .update(bookVersions)
    .set({
      ...input,
      updatedAt: new Date()
    })
    .where(eq(bookVersions.id, versionId))
    .returning();

  return rows[0] ? mapBookVersionRow(rows[0]) : null;
}
