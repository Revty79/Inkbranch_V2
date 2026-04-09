import type {
  GeneratorContinuityFactInput,
  GeneratorRevealInput,
  GeneratorSceneConstraintInput,
  GeneratorSceneInput
} from "../contracts";

import { buildChoicePromptSection } from "./choices";
import {
  buildGeneratorBoundarySystemPrompt,
  SCENE_PROMPT_RESPONSE_CONTRACT,
  type ScenePromptBundle,
  toJsonCodeBlock
} from "./shared";

interface SceneConstraintPromptShape {
  readonly constraintKey: string;
  readonly description: string;
  readonly source: string;
  readonly required: boolean;
}

interface ContinuityFactPromptShape {
  readonly factKey: string;
  readonly statement: string;
  readonly source: string;
  readonly required: boolean;
}

interface RevealPromptShape {
  readonly revealKey: string;
  readonly summary: string;
  readonly presentationHint?: string;
}

function toConstraintPromptShape(
  constraint: GeneratorSceneConstraintInput
): SceneConstraintPromptShape {
  return {
    constraintKey: constraint.constraintKey,
    description: constraint.description,
    source: constraint.source,
    required: constraint.required
  };
}

function toContinuityFactPromptShape(
  fact: GeneratorContinuityFactInput
): ContinuityFactPromptShape {
  return {
    factKey: fact.factKey,
    statement: fact.statement,
    source: fact.source,
    required: fact.required
  };
}

function toRevealPromptShape(reveal: GeneratorRevealInput): RevealPromptShape {
  return {
    revealKey: reveal.revealKey,
    summary: reveal.summary,
    presentationHint: reveal.presentationHint
  };
}

export function buildScenePromptBundle(input: GeneratorSceneInput): ScenePromptBundle {
  const promptSceneShape = {
    requestId: input.requestId,
    chronicleId: input.chronicleId,
    sceneInstanceId: input.sceneInstanceId,
    sceneKind: input.sceneKind,
    sceneGoal: input.sceneGoal,
    plannerCycle: input.plannerCycle,
    perspective: {
      perspectiveId: input.perspective.perspectiveId,
      perspectiveName: input.perspective.perspectiveName,
      characterName: input.perspective.characterName,
      voiceGuide: input.perspective.voiceGuide
    },
    constraints: input.constraints.map(toConstraintPromptShape),
    continuityFacts: input.continuityFacts.map(toContinuityFactPromptShape),
    approvedReveals: input.approvedReveals.map(toRevealPromptShape),
    tone: input.tone
      ? {
          toneKey: input.tone.toneKey,
          toneDescription: input.tone.toneDescription
        }
      : undefined
  };
  const responseShapeDescription = {
    prose: "string, required",
    summary: "string, optional",
    choices: [
      {
        choiceKey: "string, required and must match an approved choice key",
        label: "string, required",
        body: "string, optional"
      }
    ],
    presentationNotes: ["string, optional"]
  };

  const userPromptSections = [
    "Render this already-approved scene package into reader-safe presentation text.",
    "The generator role is presentation-only. Structural legality is already decided.",
    "",
    "Approved scene input:",
    toJsonCodeBlock(promptSceneShape),
    "",
    buildChoicePromptSection(input.choices),
    "",
    "Structural fallback body for emergencies (do not copy unless generation is impossible):",
    toJsonCodeBlock(input.fallbackBody),
    "",
    "Response JSON schema contract:",
    toJsonCodeBlock(responseShapeDescription)
  ];

  return {
    systemPrompt: buildGeneratorBoundarySystemPrompt(),
    userPrompt: userPromptSections.join("\n"),
    responseContract: SCENE_PROMPT_RESPONSE_CONTRACT
  };
}
