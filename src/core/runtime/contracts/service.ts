import type {
  InstantiateSceneInput,
  InstantiateSceneResult,
  ResolveChoiceInput,
  ResolveChoiceResult
} from "./pipeline";

export interface RuntimeCommitPipelineService {
  instantiateScene(
    input: InstantiateSceneInput
  ): Promise<InstantiateSceneResult>;
  resolveChoice(input: ResolveChoiceInput): Promise<ResolveChoiceResult>;
}
