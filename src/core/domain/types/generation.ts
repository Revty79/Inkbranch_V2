import type { DecisionPackage, ScenePlan } from "./planning";
import type {
  EntityId,
  IsoTimestamp,
  MetadataRecord,
  OpaqueKey
} from "./primitives";

export interface GeneratorSceneInput {
  readonly scenePlan: ScenePlan;
  readonly styleGuide?: string;
}

export interface GeneratorChoiceInput {
  readonly choiceKey: OpaqueKey;
  readonly label: string;
  readonly intentSummary: string;
}

export interface GeneratorInputEnvelope {
  readonly requestId: EntityId;
  readonly chronicleId: EntityId;
  readonly scene: GeneratorSceneInput;
  readonly decisionPackage: DecisionPackage;
  readonly requestedAt: IsoTimestamp;
}

export interface GeneratedChoiceText {
  readonly choiceKey: OpaqueKey;
  readonly label: string;
  readonly body: string;
}

export interface GeneratedSceneResult {
  readonly prose: string;
  readonly choices: GeneratedChoiceText[];
  readonly warnings: string[];
  readonly metadata?: MetadataRecord;
}

export type GeneratorFailureReason =
  | "provider-unavailable"
  | "validation-failed"
  | "timeout"
  | "unknown";

export type GeneratorOutputEnvelope =
  | {
      readonly ok: true;
      readonly generatedAt: IsoTimestamp;
      readonly fallbackUsed: boolean;
      readonly result: GeneratedSceneResult;
    }
  | {
      readonly ok: false;
      readonly generatedAt: IsoTimestamp;
      readonly reason: GeneratorFailureReason;
      readonly message: string;
      readonly fallback: GeneratedSceneResult | null;
    };
