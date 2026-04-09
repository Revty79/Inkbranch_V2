import type {
  ArcMilestone,
  AuthoringSnapshot,
  EndingRule,
  PacingRule,
  Perspective,
  RevealRule
} from "./authoring";
import type {
  ChronicleStateProjection,
  KnowledgeStateEntry,
  PerspectiveRun,
  RuntimeConstraint
} from "./runtime";
import type {
  EntityId,
  IsoTimestamp,
  MetadataRecord,
  OpaqueKey,
  SortOrder
} from "./primitives";

export type SceneKind =
  | "setup"
  | "development"
  | "revelation"
  | "consequence"
  | "ending";
export type SceneGoal =
  | "advance-arc"
  | "surface-tension"
  | "deliver-reveal"
  | "resolve-choice"
  | "close-loop";
export type EligibilityStatus = "eligible" | "blocked" | "satisfied";

export interface RevealEligibility {
  readonly revealRuleId: EntityId;
  readonly status: EligibilityStatus;
  readonly reason?: string;
}

export interface EndingEligibility {
  readonly endingRuleId: EntityId;
  readonly status: EligibilityStatus;
  readonly reason?: string;
}

export interface PlannedChoice {
  readonly choiceKey: OpaqueKey;
  readonly label: string;
  readonly summary: string;
  readonly sortOrder: SortOrder;
  readonly consequenceHint?: string;
  readonly metadata?: MetadataRecord;
}

export interface DecisionPackage {
  readonly choices: PlannedChoice[];
  readonly defaultChoiceKey?: OpaqueKey;
  readonly rationale: string;
}

export interface ScenePlan {
  readonly sceneId: EntityId;
  readonly chronicleId: EntityId;
  readonly perspectiveId: EntityId;
  readonly sceneKind: SceneKind;
  readonly sceneGoal: SceneGoal;
  readonly activeMilestoneIds: EntityId[];
  readonly revealEligibility: RevealEligibility[];
  readonly endingEligibility: EndingEligibility[];
  readonly constraints: RuntimeConstraint[];
  readonly decisionPackage: DecisionPackage;
  readonly plannedAt: IsoTimestamp;
  readonly metadata?: MetadataRecord;
}

export interface PlanningRuntimeSnapshot {
  readonly activeRun: PerspectiveRun | null;
  readonly projection: ChronicleStateProjection | null;
  readonly discoveredKnowledge: KnowledgeStateEntry[];
}

export interface PlanningContext {
  readonly chronicleId: EntityId;
  readonly authoredTruth: AuthoringSnapshot;
  readonly activePerspective: Perspective;
  readonly relevantMilestones: ArcMilestone[];
  readonly relevantRevealRules: RevealRule[];
  readonly relevantPacingRules: PacingRule[];
  readonly relevantEndingRules: EndingRule[];
  readonly runtime: PlanningRuntimeSnapshot;
  readonly requestedAt: IsoTimestamp;
}
