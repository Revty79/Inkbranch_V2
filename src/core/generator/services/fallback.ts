import type {
  GeneratedChoicePresentation,
  GeneratedSceneOutput,
  GeneratorFallbackReason,
  GeneratorIssue,
  GeneratorSceneInput
} from "../contracts";

interface CreateFallbackSceneOutputInput {
  readonly sceneInput: GeneratorSceneInput;
  readonly fallbackReason: GeneratorFallbackReason;
  readonly issues?: GeneratorIssue[];
}

function normalizeParagraphs(paragraphs: string[]): string[] {
  const normalized = paragraphs
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return normalized.length > 0
    ? normalized
    : [
        "A structural scene package is available.",
        "Generated prose is currently unavailable, so structural fallback text is shown."
      ];
}

function createFallbackChoices(
  sceneInput: GeneratorSceneInput
): GeneratedChoicePresentation[] {
  return sceneInput.choices.map((choice) => ({
    choiceId: choice.choiceId,
    choiceKey: choice.choiceKey,
    label: choice.structuralLabel,
    body: `Intent: ${choice.intentLabel}.`,
    availability: choice.availability
  }));
}

export function createFallbackSceneOutput(
  input: CreateFallbackSceneOutputInput
): GeneratedSceneOutput {
  const fallbackParagraphs = normalizeParagraphs(
    input.sceneInput.fallbackBody.paragraphs
  );
  const fallbackNotes = [
    `Fallback rendering used: ${input.fallbackReason}.`,
    ...(input.issues ?? []).map((issue) => issue.message)
  ];

  return {
    requestId: input.sceneInput.requestId,
    chronicleId: input.sceneInput.chronicleId,
    sceneInstanceId: input.sceneInput.sceneInstanceId,
    sceneKind: input.sceneInput.sceneKind,
    sceneGoal: input.sceneInput.sceneGoal,
    plannerCycle: input.sceneInput.plannerCycle,
    presentation: {
      mode: "fallback",
      prose: fallbackParagraphs.join("\n\n"),
      summary: input.sceneInput.fallbackBody.title,
      choices: createFallbackChoices(input.sceneInput),
      presentationNotes: fallbackNotes
    },
    metadata: {
      fallbackReason: input.fallbackReason
    }
  };
}
