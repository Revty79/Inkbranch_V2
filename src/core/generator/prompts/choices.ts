import type { GeneratorChoiceInput } from "../contracts";

import { toJsonCodeBlock } from "./shared";

interface ChoicePromptShape {
  readonly choiceKey: string;
  readonly structuralLabel: string;
  readonly intentLabel: string;
  readonly availability: "enabled" | "disabled";
}

function toChoicePromptShape(choice: GeneratorChoiceInput): ChoicePromptShape {
  return {
    choiceKey: choice.choiceKey,
    structuralLabel: choice.structuralLabel,
    intentLabel: choice.intentLabel,
    availability: choice.availability
  };
}

export function buildChoicePromptSection(choices: GeneratorChoiceInput[]): string {
  const promptPayload = choices.map(toChoicePromptShape);

  return [
    "Approved choices (do not add, remove, or rename choice keys):",
    toJsonCodeBlock(promptPayload),
    "For each choice, return a polished `label` and optional `body` while preserving the provided `choiceKey`."
  ].join("\n");
}
