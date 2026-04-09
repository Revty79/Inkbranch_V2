import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

import { createdAtColumn, objectJsonColumn, updatedAtColumn } from "../shared";
import { bookVersions } from "./books";

export const arcMilestones = pgTable(
  "arc_milestones",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    arcKey: varchar("arc_key", { length: 120 }).notNull(),
    milestoneKey: varchar("milestone_key", { length: 120 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    priority: integer("priority").notNull().default(0),
    required: boolean("required").notNull().default(false),
    sequenceHint: integer("sequence_hint"),
    eligibilityRulesJson: objectJsonColumn("eligibility_rules_json"),
    completionRulesJson: objectJsonColumn("completion_rules_json"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("arc_milestones_version_arc_milestone_unique_idx").on(
      table.bookVersionId,
      table.arcKey,
      table.milestoneKey
    ),
    index("arc_milestones_book_version_id_idx").on(table.bookVersionId),
    index("arc_milestones_arc_key_idx").on(table.arcKey),
    index("arc_milestones_milestone_key_idx").on(table.milestoneKey)
  ]
);

export const revealRules = pgTable(
  "reveal_rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    revealKey: varchar("reveal_key", { length: 120 }).notNull(),
    subjectType: varchar("subject_type", { length: 80 }).notNull(),
    subjectId: uuid("subject_id"),
    gatingRulesJson: objectJsonColumn("gating_rules_json"),
    exposureEffectsJson: objectJsonColumn("exposure_effects_json"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("reveal_rules_version_reveal_key_unique_idx").on(
      table.bookVersionId,
      table.revealKey
    ),
    index("reveal_rules_book_version_id_idx").on(table.bookVersionId),
    index("reveal_rules_reveal_key_idx").on(table.revealKey),
    index("reveal_rules_subject_lookup_idx").on(
      table.subjectType,
      table.subjectId
    )
  ]
);

export const pacingRules = pgTable(
  "pacing_rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    scope: varchar("scope", { length: 80 }).notNull(),
    ruleType: varchar("rule_type", { length: 80 }).notNull(),
    ruleConfigJson: objectJsonColumn("rule_config_json"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    index("pacing_rules_book_version_id_idx").on(table.bookVersionId),
    index("pacing_rules_scope_idx").on(table.scope),
    index("pacing_rules_rule_type_idx").on(table.ruleType)
  ]
);

export const endingRules = pgTable(
  "ending_rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookVersionId: uuid("book_version_id")
      .notNull()
      .references(() => bookVersions.id, { onDelete: "cascade" }),
    endingKey: varchar("ending_key", { length: 120 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    endingType: varchar("ending_type", { length: 80 }).notNull(),
    eligibilityRulesJson: objectJsonColumn("eligibility_rules_json"),
    priorityRulesJson: objectJsonColumn("priority_rules_json"),
    resolutionTemplateJson: objectJsonColumn("resolution_template_json"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn()
  },
  (table) => [
    uniqueIndex("ending_rules_version_ending_key_unique_idx").on(
      table.bookVersionId,
      table.endingKey
    ),
    index("ending_rules_book_version_id_idx").on(table.bookVersionId),
    index("ending_rules_ending_type_idx").on(table.endingType)
  ]
);
