import type {
  GeneratorDiagnostics,
  GeneratorFailureReason,
  GeneratorFallbackReason
} from "./issues";
import type { GeneratedSceneOutput } from "./output";

export interface GeneratorSuccessResult {
  readonly status: "success";
  readonly output: GeneratedSceneOutput;
  readonly diagnostics: GeneratorDiagnostics;
}

export interface GeneratorFailureResult {
  readonly status: "failure";
  readonly reason: GeneratorFailureReason;
  readonly diagnostics: GeneratorDiagnostics;
}

export interface GeneratorFallbackResult {
  readonly status: "fallback";
  readonly fallbackReason: GeneratorFallbackReason;
  readonly output: GeneratedSceneOutput;
  readonly diagnostics: GeneratorDiagnostics;
}

export type GeneratorResult =
  | GeneratorSuccessResult
  | GeneratorFailureResult
  | GeneratorFallbackResult;
