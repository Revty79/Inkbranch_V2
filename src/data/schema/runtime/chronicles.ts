import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import { bookVersions } from "../authoring/books";
import { perspectives } from "../authoring/entities";
import {
  chronicleStatusEnum,
  createdAtColumn,
  metadataJsonColumn,
  perspectiveRunStatusEnum,
  updatedAtColumn
} from "../shared";

export const chronicles = pgTable(
  "chronicles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "restrict" }),
    readerId: text("reader_id"),
    status: chronicleStatusEnum("status").notNull().default("active"),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    index("chronicles_book_version_id_idx").on(table.bookVersionId),
    index("chronicles_reader_id_idx").on(table.readerId),
    index("chronicles_status_idx").on(table.status)
  ]
);

export const perspectiveRuns = pgTable(
  "perspective_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chronicleId: uuid("chronicle_id")
      .notNull()
      .references(() => chronicles.id, { onDelete: "cascade" }),
    perspectiveId: uuid("perspective_id")
      .notNull()
      .references(() => perspectives.id, { onDelete: "restrict" }),
    status: perspectiveRunStatusEnum("status").notNull().default("active"),
    entryCount: integer("entry_count").notNull().default(0),
    knowledgeScore: integer("knowledge_score").notNull().default(0),
    lastSceneInstanceId: uuid("last_scene_instance_id"),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("perspective_runs_chronicle_perspective_unique_idx").on(
      table.chronicleId,
      table.perspectiveId
    ),
    index("perspective_runs_chronicle_id_idx").on(table.chronicleId),
    index("perspective_runs_perspective_id_idx").on(table.perspectiveId),
    index("perspective_runs_status_idx").on(table.status)
  ]
);
