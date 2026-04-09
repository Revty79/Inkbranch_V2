import type { GuardValidationResult } from "./result";

export interface GuardedValidation<TInput = unknown> {
  validate(input: TInput): GuardValidationResult;
}
