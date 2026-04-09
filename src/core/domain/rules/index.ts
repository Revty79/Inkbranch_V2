import type { ValidationResult } from "../types";

export type DomainRule<TInput> = (input: TInput) => ValidationResult;
