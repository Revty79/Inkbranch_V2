import type {
  CanonCommitResult,
  RuntimeCanonCommitEffect,
  RuntimeCanonCommitRecord,
  RuntimeCommitStore
} from "@/core/runtime/contracts";

export interface CanonCommitUpdateInput {
  readonly chronicleId: string;
  readonly sourceEventId: string;
  readonly effects: RuntimeCanonCommitEffect[];
}

export async function applyCanonCommits(
  store: RuntimeCommitStore,
  input: CanonCommitUpdateInput
): Promise<CanonCommitResult> {
  const commits: RuntimeCanonCommitRecord[] = [];

  for (const effect of input.effects) {
    const commit = await store.createCanonCommit({
      chronicleId: input.chronicleId,
      canonEntryId: effect.canonEntryId ?? null,
      commitType: effect.commitType,
      commitKey: effect.commitKey,
      commitValue: effect.commitValue,
      sourceEventId: input.sourceEventId
    });

    commits.push(commit);
  }

  return {
    commits
  };
}
