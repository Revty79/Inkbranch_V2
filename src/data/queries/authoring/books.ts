import "server-only";

import { and, asc, eq } from "drizzle-orm";

import {
  mapBookRow,
  mapBookVersionRow,
  type BookRecord,
  type BookVersionRecord
} from "@/data/mappers";
import { db } from "@/data/db";
import { books, bookVersions } from "@/data/schema";

export async function getBookById(bookId: string): Promise<BookRecord | null> {
  const row = await db
    .select()
    .from(books)
    .where(eq(books.id, bookId))
    .limit(1);
  return row[0] ? mapBookRow(row[0]) : null;
}

export async function getBookBySlug(
  worldId: string,
  slug: string
): Promise<BookRecord | null> {
  const row = await db
    .select()
    .from(books)
    .where(and(eq(books.worldId, worldId), eq(books.slug, slug)))
    .limit(1);

  return row[0] ? mapBookRow(row[0]) : null;
}

export async function getActiveBookVersionByBookId(
  bookId: string
): Promise<BookVersionRecord | null> {
  const row = await db
    .select()
    .from(bookVersions)
    .where(
      and(eq(bookVersions.bookId, bookId), eq(bookVersions.isActive, true))
    )
    .limit(1);

  return row[0] ? mapBookVersionRow(row[0]) : null;
}

export async function getBookVersionById(
  versionId: string
): Promise<BookVersionRecord | null> {
  const row = await db
    .select()
    .from(bookVersions)
    .where(eq(bookVersions.id, versionId))
    .limit(1);

  return row[0] ? mapBookVersionRow(row[0]) : null;
}

export async function listBooks(): Promise<BookRecord[]> {
  const rows = await db.select().from(books).orderBy(asc(books.title));
  return rows.map(mapBookRow);
}

export async function listBookVersions(): Promise<BookVersionRecord[]> {
  const rows = await db
    .select()
    .from(bookVersions)
    .orderBy(asc(bookVersions.bookId), asc(bookVersions.versionLabel));
  return rows.map(mapBookVersionRow);
}
