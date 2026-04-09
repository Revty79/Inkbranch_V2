import type {
  GeneratedChoicePresentation,
  GeneratedChoicePresentationPayload,
  GeneratedScenePresentation,
  GeneratorIssue,
  GeneratorSceneInput
} from "../contracts";

export interface ValidateGeneratedSceneOutputInput {
  readonly sceneInput: GeneratorSceneInput;
  readonly payload: unknown;
}

export interface ValidateGeneratedSceneOutputSuccess {
  readonly ok: true;
  readonly output: GeneratedScenePresentation;
}

export interface ValidateGeneratedSceneOutputFailure {
  readonly ok: false;
  readonly issues: GeneratorIssue[];
}

export type ValidateGeneratedSceneOutputResult =
  | ValidateGeneratedSceneOutputSuccess
  | ValidateGeneratedSceneOutputFailure;

function createIssue(
  code: GeneratorIssue["code"],
  message: string,
  context?: Record<string, unknown>
): GeneratorIssue {
  return {
    code,
    severity: "error",
    message,
    context
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(
  record: Record<string, unknown>,
  key: string
): string | null {
  const value = record[key];
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readOptionalString(
  record: Record<string, unknown>,
  key: string
): string | undefined {
  const value = record[key];
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function readOptionalStringList(
  record: Record<string, unknown>,
  key: string
): string[] | null {
  const value = record[key];
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const normalized = value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return normalized;
}

function parseChoicePayloads(
  sceneInput: GeneratorSceneInput,
  choicesValue: unknown,
  issues: GeneratorIssue[]
): GeneratedChoicePresentation[] {
  if (!Array.isArray(choicesValue)) {
    issues.push(
      createIssue(
        "invalid-output-shape",
        "Generated output must include a `choices` array."
      )
    );
    return [];
  }

  const parsedChoices = choicesValue
    .map((rawChoice) => asRecord(rawChoice))
    .filter((choice): choice is Record<string, unknown> => choice !== null);
  const approvedChoiceMap = new Map(
    sceneInput.choices.map((choice) => [choice.choiceKey, choice])
  );
  const payloadMap = new Map<string, GeneratedChoicePresentationPayload>();

  for (const payload of parsedChoices) {
    const choiceKey = readString(payload, "choiceKey");
    const label = readString(payload, "label");
    const body = readOptionalString(payload, "body");

    if (!choiceKey) {
      issues.push(
        createIssue(
          "invalid-output-shape",
          "Generated choice entry is missing a valid `choiceKey`."
        )
      );
      continue;
    }

    if (!approvedChoiceMap.has(choiceKey)) {
      issues.push(
        createIssue(
          "unexpected-choice",
          `Generated choice key ${choiceKey} is not part of the approved choice set.`,
          { choiceKey }
        )
      );
      continue;
    }

    if (!label) {
      issues.push(
        createIssue(
          "empty-choice-label",
          `Generated label for choice ${choiceKey} is missing or empty.`,
          { choiceKey }
        )
      );
      continue;
    }

    payloadMap.set(choiceKey, {
      choiceKey,
      label,
      body
    });
  }

  const outputChoices: GeneratedChoicePresentation[] = [];

  for (const approved of sceneInput.choices) {
    const payload = payloadMap.get(approved.choiceKey);

    if (!payload) {
      issues.push(
        createIssue(
          "missing-choice",
          `Generated output is missing approved choice ${approved.choiceKey}.`,
          {
            choiceKey: approved.choiceKey
          }
        )
      );
      continue;
    }

    outputChoices.push({
      choiceId: approved.choiceId,
      choiceKey: approved.choiceKey,
      label: payload.label,
      body: payload.body,
      availability: approved.availability
    });
  }

  return outputChoices;
}

export function validateGeneratedSceneOutput(
  input: ValidateGeneratedSceneOutputInput
): ValidateGeneratedSceneOutputResult {
  const outputRecord = asRecord(input.payload);

  if (!outputRecord) {
    return {
      ok: false,
      issues: [
        createIssue(
          "invalid-output-shape",
          "Generated output must be a JSON object."
        )
      ]
    };
  }

  const issues: GeneratorIssue[] = [];
  const prose = readString(outputRecord, "prose");

  if (!prose) {
    issues.push(
      createIssue(
        "missing-prose",
        "Generated output prose is missing or empty."
      )
    );
  }

  const summary = readOptionalString(outputRecord, "summary");
  const notes = readOptionalStringList(outputRecord, "presentationNotes");

  if (notes === null) {
    issues.push(
      createIssue(
        "invalid-output-shape",
        "Generated `presentationNotes` must be an array of strings when provided."
      )
    );
  }

  const parsedChoices = parseChoicePayloads(
    input.sceneInput,
    outputRecord.choices,
    issues
  );

  if (issues.length > 0 || !prose) {
    return {
      ok: false,
      issues
    };
  }

  return {
    ok: true,
    output: {
      mode: "generated",
      prose,
      summary,
      choices: parsedChoices,
      presentationNotes: notes ?? undefined
    }
  };
}
