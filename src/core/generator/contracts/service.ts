import type { GeneratorSceneInput } from "./input";
import type { GeneratorResult } from "./result";

export interface GenerateSceneRequest {
  readonly input: GeneratorSceneInput;
  readonly options?: {
    readonly generationEnabled?: boolean;
    readonly timeoutMs?: number;
    readonly metadata?: Record<string, unknown>;
  };
}

export type GenerateSceneResponse = GeneratorResult;

export interface SceneGenerator {
  generateScene(request: GenerateSceneRequest): Promise<GenerateSceneResponse>;
}

export type GeneratorService = SceneGenerator;
