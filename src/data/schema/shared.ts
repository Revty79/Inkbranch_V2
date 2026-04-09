import { sql } from "drizzle-orm";
import { jsonb, pgEnum, timestamp, uuid } from "drizzle-orm/pg-core";

export type JsonObject = Record<string, unknown>;

export const lifecycleStatusEnum = pgEnum("lifecycle_status", [
  "draft",
  "active",
  "archived"
]);
export const bookVersionStatusEnum = pgEnum("book_version_status", [
  "draft",
  "test",
  "published",
  "archived"
]);
export const canonVisibilityEnum = pgEnum("canon_visibility", [
  "public",
  "restricted",
  "hidden"
]);
export const chronicleStatusEnum = pgEnum("chronicle_status", [
  "active",
  "completed",
  "abandoned"
]);
export const perspectiveRunStatusEnum = pgEnum("perspective_run_status", [
  "active",
  "paused",
  "completed"
]);
export const sceneInstanceStatusEnum = pgEnum("scene_instance_status", [
  "planned",
  "rendered",
  "resolved",
  "superseded"
]);
export const resolutionTypeEnum = pgEnum("resolution_type", [
  "selected",
  "skipped",
  "auto_selected",
  "rejected"
]);
export const knowledgeStatusEnum = pgEnum("knowledge_status", [
  "hidden",
  "discovered",
  "confirmed",
  "invalidated"
]);
export const canonCommitTypeEnum = pgEnum("canon_commit_type", [
  "truth",
  "retcon",
  "reversal"
]);

export function createdAtColumn(columnName = "created_at") {
  return timestamp(columnName, { withTimezone: true }).notNull().defaultNow();
}

export function updatedAtColumn(columnName = "updated_at") {
  return timestamp(columnName, { withTimezone: true }).notNull().defaultNow();
}

export function idColumn() {
  return uuid("id").defaultRandom().primaryKey();
}

export function metadataJsonColumn(columnName = "metadata_json") {
  return jsonb(columnName)
    .$type<JsonObject>()
    .notNull()
    .default(sql`'{}'::jsonb`);
}

export function objectJsonColumn(columnName: string) {
  return jsonb(columnName)
    .$type<JsonObject>()
    .notNull()
    .default(sql`'{}'::jsonb`);
}
