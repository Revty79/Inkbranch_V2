import type { ChoiceEffectHint } from "@/core/planner/contracts";

export type RuntimeKnowledgeStatus =
  | "hidden"
  | "discovered"
  | "confirmed"
  | "invalidated";

export type RuntimeCanonCommitType = "truth" | "retcon" | "reversal";

export interface RuntimeKnowledgeEffect {
  readonly knowledgeKey: string;
  readonly knowledgeStatus: RuntimeKnowledgeStatus;
  readonly summary: string;
  readonly sourceEffectKey: string;
}

export interface RuntimeCanonCommitEffect {
  readonly commitType: RuntimeCanonCommitType;
  readonly commitKey: string;
  readonly commitValue: Record<string, unknown>;
  readonly sourceEffectKey: string;
  readonly canonEntryId?: string;
}

export interface RuntimeProjectionHints {
  readonly progressDelta: number;
  readonly endingLocked: boolean;
  readonly completedMilestoneKeys: string[];
  readonly revealedKeys: string[];
}

export interface RuntimeResolvedEffects {
  readonly knowledgeEffects: RuntimeKnowledgeEffect[];
  readonly canonCommitEffects: RuntimeCanonCommitEffect[];
  readonly projectionHints: RuntimeProjectionHints;
}

function normalizeMilestoneKey(effect: ChoiceEffectHint): string {
  const prefix = "effect:milestone:";

  if (effect.effectKey.startsWith(prefix)) {
    return effect.effectKey.slice(prefix.length);
  }

  return effect.relatedMilestoneId ?? effect.effectKey;
}

function normalizeRevealKey(effect: ChoiceEffectHint): string {
  return effect.relatedRevealRuleId ?? effect.effectKey;
}

function normalizeEndingKey(effect: ChoiceEffectHint): string {
  return effect.relatedEndingRuleId ?? effect.effectKey;
}

export function mapChoiceEffects(
  effects: ChoiceEffectHint[] | undefined
): RuntimeResolvedEffects {
  const knowledgeEffects: RuntimeKnowledgeEffect[] = [];
  const canonCommitEffects: RuntimeCanonCommitEffect[] = [];
  const completedMilestoneKeys: string[] = [];
  const revealedKeys: string[] = [];
  let endingLocked = false;

  for (const effect of effects ?? []) {
    if (effect.effectType === "milestone") {
      const milestoneKey = normalizeMilestoneKey(effect);

      completedMilestoneKeys.push(milestoneKey);
      canonCommitEffects.push({
        commitType: "truth",
        commitKey: `milestone:${milestoneKey}`,
        commitValue: {
          milestoneId: effect.relatedMilestoneId ?? null,
          summary: effect.summary
        },
        sourceEffectKey: effect.effectKey
      });

      continue;
    }

    if (effect.effectType === "reveal") {
      const revealKey = normalizeRevealKey(effect);
      const knowledgeKey = `reveal:${revealKey}`;

      revealedKeys.push(revealKey);
      knowledgeEffects.push({
        knowledgeKey,
        knowledgeStatus: "discovered",
        summary: effect.summary,
        sourceEffectKey: effect.effectKey
      });
      canonCommitEffects.push({
        commitType: "truth",
        commitKey: `reveal:${revealKey}`,
        commitValue: {
          revealRuleId: effect.relatedRevealRuleId ?? null,
          summary: effect.summary
        },
        sourceEffectKey: effect.effectKey
      });

      continue;
    }

    if (effect.effectType === "knowledge") {
      knowledgeEffects.push({
        knowledgeKey: effect.effectKey,
        knowledgeStatus: "confirmed",
        summary: effect.summary,
        sourceEffectKey: effect.effectKey
      });
      continue;
    }

    if (effect.effectType === "ending") {
      const endingKey = normalizeEndingKey(effect);

      endingLocked = true;
      canonCommitEffects.push({
        commitType: "truth",
        commitKey: `ending:${endingKey}`,
        commitValue: {
          endingRuleId: effect.relatedEndingRuleId ?? null,
          summary: effect.summary
        },
        sourceEffectKey: effect.effectKey
      });
    }
  }

  return {
    knowledgeEffects,
    canonCommitEffects,
    projectionHints: {
      progressDelta: 1,
      endingLocked,
      completedMilestoneKeys,
      revealedKeys
    }
  };
}
