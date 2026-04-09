import {
  boolean,
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import {
  bookVersionStatusEnum,
  createdAtColumn,
  lifecycleStatusEnum,
  metadataJsonColumn,
  updatedAtColumn
} from "../shared";
import { worlds } from "./worlds";

export const books = pgTable(
  "books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    worldId: uuid("world_id")
      .notNull()
      .references(() => worlds.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    premise: text("premise"),
    defaultTone: varchar("default_tone", { length: 80 }),
    status: lifecycleStatusEnum("status").notNull().default("draft"),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("books_world_slug_unique_idx").on(table.worldId, table.slug),
    index("books_world_id_idx").on(table.worldId),
    index("books_status_idx").on(table.status)
  ]
);

export const bookVersions = pgTable(
  "book_versions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    versionLabel: varchar("version_label", { length: 80 }).notNull(),
    status: bookVersionStatusEnum("status").notNull().default("draft"),
    isActive: boolean("is_active").notNull().default(false),
    notes: text("notes"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("book_versions_book_label_unique_idx").on(
      table.bookId,
      table.versionLabel
    ),
    index("book_versions_book_id_idx").on(table.bookId),
    index("book_versions_status_idx").on(table.status),
    index("book_versions_is_active_idx").on(table.isActive)
  ]
);
