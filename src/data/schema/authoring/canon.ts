import {
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import {
  canonVisibilityEnum,
  createdAtColumn,
  metadataJsonColumn,
  objectJsonColumn,
  updatedAtColumn
} from "../shared";
import { bookVersions } from "./books";

export const canonEntries = pgTable(
  "canon_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    entryType: varchar("entry_type", { length: 80 }).notNull(),
    subjectType: varchar("subject_type", { length: 80 }).notNull(),
    subjectId: uuid("subject_id"),
    canonicalText: text("canonical_text").notNull(),
    importance: integer("importance").notNull().default(0),
    visibility: canonVisibilityEnum("visibility").notNull().default("public"),
    tagsJson: objectJsonColumn("tags_json"),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    index("canon_entries_book_version_id_idx").on(table.bookVersionId),
    index("canon_entries_entry_type_idx").on(table.entryType),
    index("canon_entries_subject_type_idx").on(table.subjectType),
    index("canon_entries_importance_idx").on(table.importance),
    uniqueIndex("canon_entries_version_entry_subject_unique_idx").on(
      table.bookVersionId,
      table.entryType,
      table.subjectType,
      table.subjectId
    )
  ]
);
