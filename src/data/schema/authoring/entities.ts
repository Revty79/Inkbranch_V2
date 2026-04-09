import {
  index,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import {
  createdAtColumn,
  lifecycleStatusEnum,
  metadataJsonColumn,
  objectJsonColumn,
  updatedAtColumn
} from "../shared";
import { bookVersions } from "./books";

export const characters = pgTable(
  "characters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    summary: text("summary"),
    status: lifecycleStatusEnum("status").notNull().default("draft"),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("characters_version_slug_unique_idx").on(
      table.bookVersionId,
      table.slug
    ),
    index("characters_book_version_id_idx").on(table.bookVersionId),
    index("characters_status_idx").on(table.status)
  ]
);

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    summary: text("summary"),
    status: lifecycleStatusEnum("status").notNull().default("draft"),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("locations_version_slug_unique_idx").on(
      table.bookVersionId,
      table.slug
    ),
    index("locations_book_version_id_idx").on(table.bookVersionId),
    index("locations_status_idx").on(table.status)
  ]
);

export const factions = pgTable(
  "factions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    summary: text("summary"),
    status: lifecycleStatusEnum("status").notNull().default("draft"),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("factions_version_slug_unique_idx").on(
      table.bookVersionId,
      table.slug
    ),
    index("factions_book_version_id_idx").on(table.bookVersionId),
    index("factions_status_idx").on(table.status)
  ]
);

export const perspectives = pgTable(
  "perspectives",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    characterId: uuid("character_id")
      .notNull()
      .references(() => characters.id, { onDelete: "restrict" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    summary: text("summary"),
    voiceGuide: text("voice_guide"),
    knowledgeBaselineJson: objectJsonColumn("knowledge_baseline_json"),
    eligibilityRulesJson: objectJsonColumn("eligibility_rules_json"),
    status: lifecycleStatusEnum("status").notNull().default("draft"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("perspectives_version_slug_unique_idx").on(
      table.bookVersionId,
      table.slug
    ),
    index("perspectives_book_version_id_idx").on(table.bookVersionId),
    index("perspectives_character_id_idx").on(table.characterId),
    index("perspectives_status_idx").on(table.status)
  ]
);
