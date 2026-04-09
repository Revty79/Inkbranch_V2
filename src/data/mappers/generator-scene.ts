import type {
  GeneratedSceneOutput,
  GeneratorContinuityFactInput,
  GeneratorRevealInput,
  GeneratorSceneConstraintInput,
  GeneratorSceneInput
} from "@/core/generator/contracts";

import type { SceneChoiceRecord, SceneInstanceRecord } from "./runtime";
import type { ReaderScenePresentation } from "./reader-scene";

interface BuildGeneratorSceneInputFromRuntimeInput {
  readonly scene: SceneInstanceRecord;
  readonly choices: SceneChoiceRecord[];
  readonly perspectiveId: string | null;
  readonly perspectiveName: string | null;
  readonly presentation: ReaderScenePresentation;
}

interface ApplyGeneratedOutputToReaderPresentationInput {
  readonly presentation: ReaderScenePresentation;
  readonly generatedOutput: GeneratedSceneOutput;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readBoolean(value: unknown, fallbackValue: boolean): boolean {
  return typeof value === "boolean" ? value : fallbackValue;
}

function toConstraintSource(
  value: unknown
): GeneratorSceneConstraintInput["source"] {
  if (
    value === "authoring" ||
    value === "runtime" ||
    value === "continuity" ||
    value === "pacing" ||
    value === "ending"
  ) {
    return value;
  }

  return "runtime";
}

function toContinuitySource(
  value: unknown
): GeneratorContinuityFactInput["source"] {
  if (
    value === "canon" ||
    value === "runtime" ||
    value === "milestone" ||
    value === "reveal"
  ) {
    return value;
  }

  return "runtime";
}

function parseScenePlanPayload(
  plannerPayload: Record<string, unknown>
): Record<string, unknown> | null {
  const scenePackage = asRecord(plannerPayload.scenePackage);
  if (!scenePackage) {
    return null;
  }

  const scene = asRecord(scenePackage.scene);
  return scene ?? null;
}

function parseSceneConstraints(
  scenePlan: Record<string, unknown> | null
): GeneratorSceneConstraintInput[] {
  if (!scenePlan || !Array.isArray(scenePlan.constraints)) {
    return [];
  }

  return scenePlan.constraints
    .map((entry) => asRecord(entry))
    .filter((entry): entry is Record<string, unknown> => entry !== null)
    .map((entry, index) => ({
      constraintKey:
        readString(entry.constraintKey) ?? `constraint:auto:${index + 1}`,
      description: readString(entry.description) ?? "Unnamed constraint",
      source: toConstraintSource(entry.source),
      required: readBoolean(entry.required, false)
    }));
}

function parseContinuityFacts(
  scenePlan: Record<string, unknown> | null
): GeneratorContinuityFactInput[] {
  if (!scenePlan || !Array.isArray(scenePlan.continuityFacts)) {
    return [];
  }

  return scenePlan.continuityFacts
    .map((entry) => asRecord(entry))
    .filter((entry): entry is Record<string, unknown> => entry !== null)
    .map((entry, index) => ({
      factKey: readString(entry.factKey) ?? `fact:auto:${index + 1}`,
      statement: readString(entry.statement) ?? "Continuity fact",
      source: toContinuitySource(entry.source),
      required: readBoolean(entry.required, false)
    }));
}

function parseApprovedReveals(
  scenePlan: Record<string, unknown> | null
): GeneratorRevealInput[] {
  if (!scenePlan || !Array.isArray(scenePlan.allowedReveals)) {
    return [];
  }

  return scenePlan.allowedReveals
    .map((entry) => asRecord(entry))
    .filter((entry): entry is Record<string, unknown> => entry !== null)
    .map((entry, index) => {
      const revealKey =
        readString(entry.revealKey) ?? `reveal:auto:${index + 1}`;
      const impactHints = Array.isArray(entry.impactHints)
        ? entry.impactHints
            .map((hint) => asRecord(hint))
            .filter((hint): hint is Record<string, unknown> => hint !== null)
            .map((hint) => readString(hint.summary))
            .filter((hint): hint is string => Boolean(hint))
        : [];

      return {
        revealKey,
        summary:
          impactHints.length > 0
            ? impactHints.join(" ")
            : `Approved reveal ${revealKey}.`
      };
    });
}

function toFallbackBody(
  presentation: ReaderScenePresentation
): GeneratorSceneInput["fallbackBody"] {
  if (presentation.body.mode === "fallback") {
    return {
      title: presentation.body.title,
      paragraphs: presentation.body.paragraphs
    };
  }

  return {
    title: "Scene structure available",
    paragraphs: [
      "A structural scene package is available for this chronicle.",
      "Generated prose is unavailable, so fallback rendering should be used."
    ]
  };
}

function toParagraphs(value: string): string[] {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function buildGeneratorSceneInputFromRuntime(
  input: BuildGeneratorSceneInputFromRuntimeInput
): GeneratorSceneInput {
  const scenePlan = parseScenePlanPayload(input.scene.plannerPayload);
  const perspectiveId = input.perspectiveId ?? "unknown-perspective";
  const perspectiveName = input.perspectiveName ?? "Unknown perspective";

  return {
    requestId: `gen:${input.scene.id}:${Date.now()}`,
    chronicleId: input.scene.chronicleId,
    sceneInstanceId: input.scene.id,
    sceneKind: input.scene.sceneKind,
    sceneGoal: input.scene.sceneGoal,
    plannerCycle: input.scene.plannerCycle,
    perspective: {
      perspectiveId,
      perspectiveName
    },
    constraints: parseSceneConstraints(scenePlan),
    continuityFacts: parseContinuityFacts(scenePlan),
    approvedReveals: parseApprovedReveals(scenePlan),
    choices: input.choices.map((choice) => ({
      choiceId: choice.id,
      choiceKey: choice.choiceKey,
      structuralLabel: choice.label,
      intentLabel: choice.intent ?? "No explicit intent",
      availability: choice.isEnabled ? "enabled" : "disabled"
    })),
    fallbackBody: toFallbackBody(input.presentation)
  };
}

export function applyGeneratedOutputToReaderPresentation(
  input: ApplyGeneratedOutputToReaderPresentationInput
): ReaderScenePresentation {
  const generatedChoiceMap = new Map(
    input.generatedOutput.presentation.choices.map((choice) => [
      choice.choiceId,
      choice
    ])
  );
  const remappedChoices = input.presentation.choices.map((choice) => {
    const generatedChoice = generatedChoiceMap.get(choice.choiceId);
    if (!generatedChoice) {
      return choice;
    }

    return {
      ...choice,
      label: generatedChoice.label,
      intentLabel: generatedChoice.body ?? choice.intentLabel
    };
  });

  const remappedBody =
    input.generatedOutput.presentation.mode === "generated"
      ? {
          mode: "prose" as const,
          prose: input.generatedOutput.presentation.prose
        }
      : {
          mode: "fallback" as const,
          title:
            input.generatedOutput.presentation.summary ??
            "Scene structure available",
          paragraphs: [
            ...toParagraphs(input.generatedOutput.presentation.prose),
            ...(input.generatedOutput.presentation.presentationNotes ?? [])
          ]
        };

  return {
    ...input.presentation,
    body: remappedBody,
    choices: remappedChoices
  };
}
