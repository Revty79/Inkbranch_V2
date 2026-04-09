import type { GuardDomain, GuardIssue } from "./issues";

export interface GuardValidationResult {
  readonly ok: boolean;
  readonly domain: GuardDomain;
  readonly checkedAt: string;
  readonly issues: GuardIssue[];
}

export function createGuardResult(
  domain: GuardDomain,
  issues: GuardIssue[]
): GuardValidationResult {
  return {
    ok: issues.every((issue) => !issue.blocking),
    domain,
    checkedAt: new Date().toISOString(),
    issues
  };
}

export function mergeGuardResults(
  domain: GuardDomain,
  results: GuardValidationResult[]
): GuardValidationResult {
  return createGuardResult(
    domain,
    results.flatMap((result) => result.issues)
  );
}
