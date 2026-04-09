import type {
  KnowledgeUpdateResult,
  RuntimeCommitStore,
  RuntimeKnowledgeEffect,
  RuntimeKnowledgeStateRecord
} from "@/core/runtime/contracts";

export interface KnowledgeUpdateInput {
  readonly chronicleId: string;
  readonly perspectiveId: string;
  readonly sourceSceneInstanceId: string;
  readonly effects: RuntimeKnowledgeEffect[];
}

export async function applyKnowledgeUpdates(
  store: RuntimeCommitStore,
  input: KnowledgeUpdateInput
): Promise<KnowledgeUpdateResult> {
  const updatedEntries: RuntimeKnowledgeStateRecord[] = [];

  for (const effect of input.effects) {
    const updatedEntry = await store.upsertKnowledgeEntry({
      chronicleId: input.chronicleId,
      perspectiveId: input.perspectiveId,
      knowledgeKey: effect.knowledgeKey,
      knowledgeStatus: effect.knowledgeStatus,
      sourceSceneInstanceId: input.sourceSceneInstanceId,
      metadata: {
        summary: effect.summary,
        sourceEffectKey: effect.sourceEffectKey
      }
    });

    updatedEntries.push(updatedEntry);
  }

  return {
    updatedEntries,
    discoveredKeys: updatedEntries.map((entry) => entry.knowledgeKey)
  };
}
