import { type GuardValidationResult } from "../contracts";
import { validateRevealLegality } from "../rules";

export interface ValidateRevealUsageInput {
  readonly revealKeysToApply: string[];
  readonly allowedRevealKeys: string[];
  readonly blockedRevealKeys: string[];
}

export function validateRevealUsage(
  input: ValidateRevealUsageInput
): GuardValidationResult {
  return validateRevealLegality({
    revealKeysToApply: input.revealKeysToApply,
    allowedRevealKeys: input.allowedRevealKeys,
    blockedRevealKeys: input.blockedRevealKeys
  });
}
