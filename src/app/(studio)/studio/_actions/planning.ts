"use server";

import { redirect } from "next/navigation";

import {
  createArcMilestone,
  createEndingRule,
  createPacingRule,
  createRevealRule,
  updateArcMilestone,
  updateEndingRule,
  updatePacingRule,
  updateRevealRule
} from "@/data/mutations/authoring";

import {
  optionalText,
  parseBoolean,
  parseJsonObject,
  parseNullableNumber,
  parseNumber,
  requireKey,
  requireText
} from "./form-utils";

export type PlanningType = "milestones" | "reveals" | "pacing" | "endings";

export async function createPlanningRuleAction(
  planningType: PlanningType,
  formData: FormData
) {
  const bookVersionId = requireText(formData, "bookVersionId");

  if (planningType === "milestones") {
    await createArcMilestone({
      bookVersionId,
      arcKey: requireKey(formData, "arcKey"),
      milestoneKey: requireKey(formData, "milestoneKey"),
      title: requireText(formData, "title"),
      description: optionalText(formData, "description"),
      priority: parseNumber(formData, "priority", 0),
      required: parseBoolean(formData, "required"),
      sequenceHint: parseNullableNumber(formData, "sequenceHint"),
      eligibilityRulesJson: parseJsonObject(formData, "eligibilityRulesJson"),
      completionRulesJson: parseJsonObject(formData, "completionRulesJson")
    });
  } else if (planningType === "reveals") {
    await createRevealRule({
      bookVersionId,
      revealKey: requireKey(formData, "revealKey"),
      subjectType: requireText(formData, "subjectType"),
      subjectId: optionalText(formData, "subjectId"),
      gatingRulesJson: parseJsonObject(formData, "gatingRulesJson"),
      exposureEffectsJson: parseJsonObject(formData, "exposureEffectsJson")
    });
  } else if (planningType === "pacing") {
    await createPacingRule({
      bookVersionId,
      scope: requireText(formData, "scope"),
      ruleType: requireText(formData, "ruleType"),
      ruleConfigJson: parseJsonObject(formData, "ruleConfigJson")
    });
  } else {
    await createEndingRule({
      bookVersionId,
      endingKey: requireKey(formData, "endingKey"),
      title: requireText(formData, "title"),
      endingType: requireText(formData, "endingType"),
      eligibilityRulesJson: parseJsonObject(formData, "eligibilityRulesJson"),
      priorityRulesJson: parseJsonObject(formData, "priorityRulesJson"),
      resolutionTemplateJson: parseJsonObject(
        formData,
        "resolutionTemplateJson"
      )
    });
  }

  redirect(`/studio/planning/${planningType}?versionId=${bookVersionId}`);
}

export async function updatePlanningRuleAction(
  planningType: PlanningType,
  ruleId: string,
  formData: FormData
) {
  const bookVersionId = requireText(formData, "bookVersionId");

  if (planningType === "milestones") {
    await updateArcMilestone(ruleId, {
      bookVersionId,
      arcKey: requireKey(formData, "arcKey"),
      milestoneKey: requireKey(formData, "milestoneKey"),
      title: requireText(formData, "title"),
      description: optionalText(formData, "description"),
      priority: parseNumber(formData, "priority", 0),
      required: parseBoolean(formData, "required"),
      sequenceHint: parseNullableNumber(formData, "sequenceHint"),
      eligibilityRulesJson: parseJsonObject(formData, "eligibilityRulesJson"),
      completionRulesJson: parseJsonObject(formData, "completionRulesJson")
    });
  } else if (planningType === "reveals") {
    await updateRevealRule(ruleId, {
      bookVersionId,
      revealKey: requireKey(formData, "revealKey"),
      subjectType: requireText(formData, "subjectType"),
      subjectId: optionalText(formData, "subjectId"),
      gatingRulesJson: parseJsonObject(formData, "gatingRulesJson"),
      exposureEffectsJson: parseJsonObject(formData, "exposureEffectsJson")
    });
  } else if (planningType === "pacing") {
    await updatePacingRule(ruleId, {
      bookVersionId,
      scope: requireText(formData, "scope"),
      ruleType: requireText(formData, "ruleType"),
      ruleConfigJson: parseJsonObject(formData, "ruleConfigJson")
    });
  } else {
    await updateEndingRule(ruleId, {
      bookVersionId,
      endingKey: requireKey(formData, "endingKey"),
      title: requireText(formData, "title"),
      endingType: requireText(formData, "endingType"),
      eligibilityRulesJson: parseJsonObject(formData, "eligibilityRulesJson"),
      priorityRulesJson: parseJsonObject(formData, "priorityRulesJson"),
      resolutionTemplateJson: parseJsonObject(
        formData,
        "resolutionTemplateJson"
      )
    });
  }

  redirect(`/studio/planning/${planningType}?versionId=${bookVersionId}`);
}
