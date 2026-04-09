import type { IsoTimestamp } from "@/core/domain/types";

export const RUNTIME_COMMIT_EVENT_TYPES = [
  "scene_instantiated",
  "scene_choices_created",
  "choice_resolved",
  "knowledge_state_updated",
  "canon_commit_created",
  "chronicle_state_refreshed",
  "perspective_run_updated"
] as const;

export type RuntimeCommitEventType =
  (typeof RUNTIME_COMMIT_EVENT_TYPES)[number];

export interface RuntimeCommitEventInput {
  readonly chronicleId: string;
  readonly eventType: RuntimeCommitEventType;
  readonly eventTs?: IsoTimestamp;
  readonly causedByType?: string;
  readonly causedById?: string;
  readonly payload: Record<string, unknown>;
}

export interface RuntimeCommitEventRecord {
  readonly id: string;
  readonly chronicleId: string;
  readonly eventType: string;
  readonly eventTs: IsoTimestamp;
  readonly causedByType: string | null;
  readonly causedById: string | null;
  readonly payload: Record<string, unknown>;
}
