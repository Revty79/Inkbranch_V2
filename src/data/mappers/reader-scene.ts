import type { SceneChoiceRecord, SceneInstanceRecord } from "./runtime";

export interface ReaderSceneBodyProse {
  readonly mode: "prose";
  readonly prose: string;
}

export interface ReaderSceneBodyFallback {
  readonly mode: "fallback";
  readonly title: string;
  readonly paragraphs: string[];
}

export type ReaderSceneBody = ReaderSceneBodyProse | ReaderSceneBodyFallback;

export interface ReaderSceneChoice {
  readonly choiceId: string;
  readonly label: string;
  readonly intentLabel: string;
  readonly availability: "enabled" | "disabled";
}

export interface ReaderScenePresentation {
  readonly sceneId: string;
  readonly chronicleId: string;
  readonly sceneKind: string;
  readonly sceneGoal: string;
  readonly plannerCycle: number;
  readonly sceneStatus: string;
  readonly perspectiveId: string | null;
  readonly perspectiveName: string | null;
  readonly body: ReaderSceneBody;
  readonly choices: ReaderSceneChoice[];
  readonly meta: {
    readonly progressIndex: number | null;
    readonly endingLocked: boolean | null;
    readonly enabledChoiceCount: number;
    readonly disabledChoiceCount: number;
  };
}

export interface MapRuntimeSceneForReaderInput {
  readonly scene: SceneInstanceRecord;
  readonly choices: SceneChoiceRecord[];
  readonly perspectiveId: string | null;
  readonly perspectiveName: string | null;
  readonly progressIndex: number | null;
  readonly endingLocked: boolean | null;
}

function titleCaseSentence(value: string): string {
  return value
    .split("-")
    .map((part) =>
      part.length > 0 ? `${part[0].toUpperCase()}${part.slice(1)}` : part
    )
    .join(" ");
}

function goalSummary(goal: string): string {
  if (goal === "advance-arc") {
    return "advancing a key story arc";
  }

  if (goal === "surface-reveal") {
    return "bringing hidden truth into view";
  }

  if (goal === "deliver-ending") {
    return "delivering a committed ending trajectory";
  }

  return titleCaseSentence(goal).toLowerCase();
}

function buildFallbackBody(
  input: MapRuntimeSceneForReaderInput
): ReaderSceneBodyFallback {
  const perspectiveLine = input.perspectiveName
    ? `Current perspective: ${input.perspectiveName}.`
    : input.perspectiveId
      ? `Current perspective: ${input.perspectiveId}.`
      : "Perspective context is not yet committed for this scene.";

  return {
    mode: "fallback",
    title: "Scene structure available",
    paragraphs: [
      `This ${titleCaseSentence(input.scene.sceneKind).toLowerCase()} scene is focused on ${goalSummary(input.scene.sceneGoal)}.`,
      perspectiveLine,
      `Choices available: ${input.choices.filter((choice) => choice.isEnabled).length} enabled, ${input.choices.filter((choice) => !choice.isEnabled).length} disabled.`
    ]
  };
}

function buildSceneBody(input: MapRuntimeSceneForReaderInput): ReaderSceneBody {
  const prose = input.scene.renderedProse?.trim() ?? "";

  if (prose.length > 0) {
    return {
      mode: "prose",
      prose
    };
  }

  return buildFallbackBody(input);
}

function mapChoiceIntentLabel(intent: string | null): string {
  if (!intent) {
    return "No explicit intent";
  }

  return titleCaseSentence(intent);
}

export function mapRuntimeSceneForReader(
  input: MapRuntimeSceneForReaderInput
): ReaderScenePresentation {
  const choices: ReaderSceneChoice[] = input.choices.map((choice) => ({
    choiceId: choice.id,
    label: choice.label,
    intentLabel: mapChoiceIntentLabel(choice.intent),
    availability: choice.isEnabled ? "enabled" : "disabled"
  }));
  const enabledChoiceCount = choices.filter(
    (choice) => choice.availability === "enabled"
  ).length;

  return {
    sceneId: input.scene.id,
    chronicleId: input.scene.chronicleId,
    sceneKind: input.scene.sceneKind,
    sceneGoal: input.scene.sceneGoal,
    plannerCycle: input.scene.plannerCycle,
    sceneStatus: input.scene.status,
    perspectiveId: input.perspectiveId,
    perspectiveName: input.perspectiveName,
    body: buildSceneBody(input),
    choices,
    meta: {
      progressIndex: input.progressIndex,
      endingLocked: input.endingLocked,
      enabledChoiceCount,
      disabledChoiceCount: choices.length - enabledChoiceCount
    }
  };
}
