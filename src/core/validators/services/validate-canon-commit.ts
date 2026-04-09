import type {
  RuntimeCanonCommitEffect,
  RuntimeCanonCommitRecord
} from "@/core/runtime/contracts";

import type { GuardValidationResult } from "../contracts";
import { validateCanonCommitEffects } from "../rules";

export interface ValidateCanonCommitEffectsInput {
  readonly effects: RuntimeCanonCommitEffect[];
  readonly existingCommits: RuntimeCanonCommitRecord[];
}

export function validateCanonCommitEffectsInput(
  input: ValidateCanonCommitEffectsInput
): GuardValidationResult {
  return validateCanonCommitEffects({
    effects: input.effects,
    existingCommits: input.existingCommits
  });
}
