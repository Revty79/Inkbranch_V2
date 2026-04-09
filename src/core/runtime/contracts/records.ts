import type { IsoTimestamp } from "@/core/domain/types";

export interface RuntimeChronicleRecord {
  readonly id: string;
  readonly bookVersionId: string;
  readonly status: "active" | "completed" | "abandoned";
}

export interface RuntimeChronicleStateRecord {
  readonly chronicleId: string;
  readonly currentPerspectiveId: string | null;
  readonly currentSceneInstanceId: string | null;
  readonly progressIndex: number;
  readonly endingLocked: boolean;
  readonly summary: Record<string, unknown>;
  readonly updatedAt: IsoTimestamp;
}

export interface RuntimePerspectiveRunRecord {
  readonly id: string;
  readonly chronicleId: string;
  readonly perspectiveId: string;
  readonly status: "active" | "paused" | "completed";
  readonly entryCount: number;
  readonly knowledgeScore: number;
  readonly lastSceneInstanceId: string | null;
  readonly metadata: Record<string, unknown>;
  readonly updatedAt: IsoTimestamp;
}

export interface RuntimeSceneInstanceRecord {
  readonly id: string;
  readonly chronicleId: string;
  readonly perspectiveRunId: string;
  readonly plannerCycle: number;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly plannerPayload: Record<string, unknown>;
  readonly generatorPayload: Record<string, unknown>;
  readonly status: "planned" | "rendered" | "resolved" | "superseded";
  readonly updatedAt: IsoTimestamp;
}

export interface RuntimeSceneChoiceRecord {
  readonly id: string;
  readonly sceneInstanceId: string;
  readonly choiceKey: string;
  readonly label: string;
  readonly intent: string | null;
  readonly sortOrder: number;
  readonly plannerEffects: Record<string, unknown>;
  readonly isEnabled: boolean;
}

export interface RuntimeChoiceResolutionRecord {
  readonly id: string;
  readonly sceneChoiceId: string;
  readonly chronicleId: string;
  readonly resolutionType:
    | "selected"
    | "skipped"
    | "auto_selected"
    | "rejected";
  readonly resolutionPayload: Record<string, unknown>;
  readonly resolvedAt: IsoTimestamp;
}

export interface RuntimeKnowledgeStateRecord {
  readonly id: string;
  readonly chronicleId: string;
  readonly perspectiveId: string | null;
  readonly knowledgeKey: string;
  readonly knowledgeStatus:
    | "hidden"
    | "discovered"
    | "confirmed"
    | "invalidated";
  readonly sourceSceneInstanceId: string | null;
  readonly metadata: Record<string, unknown>;
}

export interface RuntimeCanonCommitRecord {
  readonly id: string;
  readonly chronicleId: string;
  readonly canonEntryId: string | null;
  readonly commitType: "truth" | "retcon" | "reversal";
  readonly commitKey: string;
  readonly commitValue: Record<string, unknown>;
  readonly sourceEventId: string | null;
}
