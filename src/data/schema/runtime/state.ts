import {
  boolean,
  index,
  integer,
  pgTable,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import { canonEntries } from "../authoring/canon";
import { perspectives } from "../authoring/entities";
import { chronicles } from "./chronicles";
import { eventLog } from "./events";
import { sceneInstances } from "./scenes";
import {
  canonCommitTypeEnum,
  createdAtColumn,
  knowledgeStatusEnum,
  metadataJsonColumn,
  objectJsonColumn,
  updatedAtColumn
} from "../shared";

export const chronicleStates = pgTable(
  "chronicle_states",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chronicleId: uuid("chronicle_id")
      .notNull()
      .references(() => chronicles.id, { onDelete: "cascade" }),
    currentPerspectiveId: uuid("current_perspective_id").references(
      () => perspectives.id,
      { onDelete: "set null" }
    ),
    currentSceneInstanceId: uuid("current_scene_instance_id").references(
      () => sceneInstances.id,
      { onDelete: "set null" }
    ),
    progressIndex: integer("progress_index").notNull().default(0),
    endingLocked: boolean("ending_locked").notNull().default(false),
    summaryJson: objectJsonColumn("summary_json"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("chronicle_states_chronicle_unique_idx").on(table.chronicleId),
    index("chronicle_states_current_perspective_idx").on(
      table.currentPerspectiveId
    ),
    index("chronicle_states_current_scene_idx").on(table.currentSceneInstanceId)
  ]
);

export const knowledgeState = pgTable(
  "knowledge_state",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chronicleId: uuid("chronicle_id")
      .notNull()
      .references(() => chronicles.id, { onDelete: "cascade" }),
    perspectiveId: uuid("perspective_id").references(() => perspectives.id, {
      onDelete: "set null"
    }),
    knowledgeKey: varchar("knowledge_key", { length: 120 }).notNull(),
    knowledgeStatus: knowledgeStatusEnum("knowledge_status")
      .notNull()
      .default("discovered"),
    sourceSceneInstanceId: uuid("source_scene_instance_id").references(
      () => sceneInstances.id,
      { onDelete: "set null" }
    ),
    metadataJson: metadataJsonColumn(),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("knowledge_state_chronicle_perspective_key_unique_idx").on(
      table.chronicleId,
      table.perspectiveId,
      table.knowledgeKey
    ),
    index("knowledge_state_chronicle_id_idx").on(table.chronicleId),
    index("knowledge_state_perspective_id_idx").on(table.perspectiveId),
    index("knowledge_state_status_idx").on(table.knowledgeStatus)
  ]
);

export const canonCommits = pgTable(
  "canon_commits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chronicleId: uuid("chronicle_id")
      .notNull()
      .references(() => chronicles.id, { onDelete: "cascade" }),
    canonEntryId: uuid("canon_entry_id").references(() => canonEntries.id, {
      onDelete: "set null"
    }),
    commitType: canonCommitTypeEnum("commit_type").notNull().default("truth"),
    commitKey: varchar("commit_key", { length: 120 }).notNull(),
    commitValueJson: objectJsonColumn("commit_value_json"),
    sourceEventId: uuid("source_event_id").references(() => eventLog.id, {
      onDelete: "set null"
    }),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    index("canon_commits_chronicle_id_idx").on(table.chronicleId),
    index("canon_commits_commit_lookup_idx").on(
      table.commitType,
      table.commitKey
    ),
    index("canon_commits_source_event_id_idx").on(table.sourceEventId)
  ]
);
