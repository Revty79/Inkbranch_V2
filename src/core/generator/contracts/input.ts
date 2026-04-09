export type GeneratorChoiceAvailability = "enabled" | "disabled";

export type GeneratorConstraintSource =
  | "authoring"
  | "runtime"
  | "continuity"
  | "pacing"
  | "ending";

export type GeneratorContinuitySource =
  | "canon"
  | "runtime"
  | "milestone"
  | "reveal";

export interface GeneratorPerspectiveInput {
  readonly perspectiveId: string;
  readonly perspectiveName: string;
  readonly characterName?: string;
  readonly voiceGuide?: string;
}

export interface GeneratorSceneConstraintInput {
  readonly constraintKey: string;
  readonly description: string;
  readonly source: GeneratorConstraintSource;
  readonly required: boolean;
}

export interface GeneratorContinuityFactInput {
  readonly factKey: string;
  readonly statement: string;
  readonly source: GeneratorContinuitySource;
  readonly required: boolean;
}

export interface GeneratorRevealInput {
  readonly revealKey: string;
  readonly summary: string;
  readonly presentationHint?: string;
}

export interface GeneratorChoiceInput {
  readonly choiceId: string;
  readonly choiceKey: string;
  readonly structuralLabel: string;
  readonly intentLabel: string;
  readonly availability: GeneratorChoiceAvailability;
}

export interface GeneratorToneInput {
  readonly toneKey: string;
  readonly toneDescription: string;
}

export interface GeneratorFallbackBodyInput {
  readonly title: string;
  readonly paragraphs: string[];
}

export interface GeneratorSceneInput {
  readonly requestId: string;
  readonly chronicleId: string;
  readonly sceneInstanceId: string;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly plannerCycle: number;
  readonly perspective: GeneratorPerspectiveInput;
  readonly constraints: GeneratorSceneConstraintInput[];
  readonly continuityFacts: GeneratorContinuityFactInput[];
  readonly approvedReveals: GeneratorRevealInput[];
  readonly choices: GeneratorChoiceInput[];
  readonly fallbackBody: GeneratorFallbackBodyInput;
  readonly tone?: GeneratorToneInput;
  readonly metadata?: Record<string, unknown>;
}
