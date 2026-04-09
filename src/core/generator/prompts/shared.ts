const GENERATOR_BOUNDARY_RULES = [
  "You are a presentation renderer for Inkbranch v2.",
  "The scene structure, reveals, and choice legality are already decided by non-generator systems.",
  "Do not invent canon, continuity changes, runtime effects, reveals, or new choices.",
  "Do not decide what scene comes next.",
  "Return only data that matches the requested JSON response schema."
] as const;

export interface ScenePromptResponseContract {
  readonly schemaName: "inkbranch_scene_render_v1";
  readonly requiredKeys: readonly ["prose", "choices"];
  readonly optionalKeys: readonly ["summary", "presentationNotes"];
}

export interface ScenePromptBundle {
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly responseContract: ScenePromptResponseContract;
}

export function buildGeneratorBoundarySystemPrompt(): string {
  return GENERATOR_BOUNDARY_RULES.join("\n");
}

export function toJsonCodeBlock(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export const SCENE_PROMPT_RESPONSE_CONTRACT: ScenePromptResponseContract = {
  schemaName: "inkbranch_scene_render_v1",
  requiredKeys: ["prose", "choices"],
  optionalKeys: ["summary", "presentationNotes"]
};
