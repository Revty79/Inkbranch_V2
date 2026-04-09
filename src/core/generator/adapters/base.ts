import type {
  GenerateSceneRequest,
  GeneratorFailureReason
} from "../contracts";
import type { ScenePromptBundle } from "../prompts";

export interface AdapterGenerateSceneInput {
  readonly request: GenerateSceneRequest;
  readonly prompt: ScenePromptBundle;
}

export interface AdapterGenerateSceneSuccessResult {
  readonly status: "success";
  readonly output: unknown;
  readonly metadata?: Record<string, unknown>;
}

export interface AdapterGenerateSceneFailureResult {
  readonly status: "failure";
  readonly reason: GeneratorFailureReason;
  readonly message: string;
  readonly metadata?: Record<string, unknown>;
}

export type AdapterGenerateSceneResult =
  | AdapterGenerateSceneSuccessResult
  | AdapterGenerateSceneFailureResult;

export interface SceneGenerationAdapter {
  readonly adapterId: string;
  generateScene(
    input: AdapterGenerateSceneInput
  ): Promise<AdapterGenerateSceneResult>;
}
