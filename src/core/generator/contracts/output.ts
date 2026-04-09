import type { GeneratorChoiceAvailability } from "./input";

export type GeneratedSceneMode = "generated" | "fallback";

export interface GeneratedChoicePresentationPayload {
  readonly choiceKey: string;
  readonly label: string;
  readonly body?: string;
}

export interface GeneratedScenePresentationPayload {
  readonly prose: string;
  readonly summary?: string;
  readonly choices: GeneratedChoicePresentationPayload[];
  readonly presentationNotes?: string[];
}

export interface GeneratedChoicePresentation {
  readonly choiceId: string;
  readonly choiceKey: string;
  readonly label: string;
  readonly body?: string;
  readonly availability: GeneratorChoiceAvailability;
}

export interface GeneratedScenePresentation {
  readonly mode: GeneratedSceneMode;
  readonly prose: string;
  readonly summary?: string;
  readonly choices: GeneratedChoicePresentation[];
  readonly presentationNotes?: string[];
}

export interface GeneratedSceneOutput {
  readonly requestId: string;
  readonly chronicleId: string;
  readonly sceneInstanceId: string;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly plannerCycle: number;
  readonly presentation: GeneratedScenePresentation;
  readonly metadata?: Record<string, unknown>;
}
