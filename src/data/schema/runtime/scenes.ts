import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import { perspectiveRuns, chronicles } from "./chronicles";
import {
  createdAtColumn,
  objectJsonColumn,
  resolutionTypeEnum,
  sceneInstanceStatusEnum,
  updatedAtColumn
} from "../shared";

export const sceneInstances = pgTable(
  "scene_instances",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chronicleId: uuid("chronicle_id")
      .notNull()
      .references(() => chronicles.id, { onDelete: "cascade" }),
    perspectiveRunId: uuid("perspective_run_id")
      .notNull()
      .references(() => perspectiveRuns.id, { onDelete: "cascade" }),
    plannerCycle: integer("planner_cycle").notNull(),
    sceneKind: varchar("scene_kind", { length: 80 }).notNull(),
    sceneGoal: varchar("scene_goal", { length: 120 }).notNull(),
    plannerPayloadJson: objectJsonColumn("planner_payload_json"),
    generatorPayloadJson: objectJsonColumn("generator_payload_json"),
    renderedProse: text("rendered_prose"),
    status: sceneInstanceStatusEnum("status").notNull().default("planned"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("scene_instances_chronicle_cycle_unique_idx").on(
      table.chronicleId,
      table.plannerCycle
    ),
    index("scene_instances_chronicle_id_idx").on(table.chronicleId),
    index("scene_instances_perspective_run_id_idx").on(table.perspectiveRunId),
    index("scene_instances_status_idx").on(table.status)
  ]
);

export const sceneChoices = pgTable(
  "scene_choices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sceneInstanceId: uuid("scene_instance_id")
      .notNull()
      .references(() => sceneInstances.id, { onDelete: "cascade" }),
    choiceKey: varchar("choice_key", { length: 120 }).notNull(),
    label: varchar("label", { length: 255 }).notNull(),
    intent: text("intent"),
    sortOrder: integer("sort_order").notNull().default(0),
    plannerEffectsJson: objectJsonColumn("planner_effects_json"),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("scene_choices_scene_choice_key_unique_idx").on(
      table.sceneInstanceId,
      table.choiceKey
    ),
    index("scene_choices_scene_instance_id_idx").on(table.sceneInstanceId),
    index("scene_choices_sort_order_idx").on(table.sortOrder)
  ]
);

export const choiceResolutions = pgTable(
  "choice_resolutions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sceneChoiceId: uuid("scene_choice_id")
      .notNull()
      .references(() => sceneChoices.id, { onDelete: "cascade" }),
    chronicleId: uuid("chronicle_id")
      .notNull()
      .references(() => chronicles.id, { onDelete: "cascade" }),
    resolutionType: resolutionTypeEnum("resolution_type")
      .notNull()
      .default("selected"),
    resolutionPayloadJson: objectJsonColumn("resolution_payload_json"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: createdAtColumn()
  },
  (table) => [
    uniqueIndex("choice_resolutions_scene_choice_unique_idx").on(
      table.sceneChoiceId
    ),
    index("choice_resolutions_chronicle_id_idx").on(table.chronicleId),
    index("choice_resolutions_resolution_type_idx").on(table.resolutionType),
    index("choice_resolutions_resolved_at_idx").on(table.resolvedAt)
  ]
);
