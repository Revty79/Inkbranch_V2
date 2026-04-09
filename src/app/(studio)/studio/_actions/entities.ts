"use server";

import { redirect } from "next/navigation";

import {
  createCharacter,
  createFaction,
  createLocation,
  createPerspective,
  updateCharacter,
  updateFaction,
  updateLocation,
  updatePerspective
} from "@/data/mutations/authoring";

import {
  optionalText,
  parseJsonObject,
  requireSlug,
  requireText
} from "./form-utils";

export type EntityType =
  | "characters"
  | "locations"
  | "factions"
  | "perspectives";

export async function createEntityAction(
  entityType: EntityType,
  formData: FormData
) {
  const bookVersionId = requireText(formData, "bookVersionId");

  if (entityType === "characters") {
    await createCharacter({
      bookVersionId,
      slug: requireSlug(formData, "slug"),
      name: requireText(formData, "name"),
      summary: optionalText(formData, "summary"),
      status: requireText(formData, "status") as
        | "draft"
        | "active"
        | "archived",
      metadataJson: parseJsonObject(formData, "metadataJson")
    });
  } else if (entityType === "locations") {
    await createLocation({
      bookVersionId,
      slug: requireSlug(formData, "slug"),
      name: requireText(formData, "name"),
      summary: optionalText(formData, "summary"),
      status: requireText(formData, "status") as
        | "draft"
        | "active"
        | "archived",
      metadataJson: parseJsonObject(formData, "metadataJson")
    });
  } else if (entityType === "factions") {
    await createFaction({
      bookVersionId,
      slug: requireSlug(formData, "slug"),
      name: requireText(formData, "name"),
      summary: optionalText(formData, "summary"),
      status: requireText(formData, "status") as
        | "draft"
        | "active"
        | "archived",
      metadataJson: parseJsonObject(formData, "metadataJson")
    });
  } else {
    await createPerspective({
      bookVersionId,
      characterId: requireText(formData, "characterId"),
      slug: requireSlug(formData, "slug"),
      name: requireText(formData, "name"),
      summary: optionalText(formData, "summary"),
      voiceGuide: optionalText(formData, "voiceGuide"),
      knowledgeBaselineJson: parseJsonObject(formData, "knowledgeBaselineJson"),
      eligibilityRulesJson: parseJsonObject(formData, "eligibilityRulesJson"),
      status: requireText(formData, "status") as "draft" | "active" | "archived"
    });
  }

  redirect(`/studio/entities/${entityType}?versionId=${bookVersionId}`);
}

export async function updateEntityAction(
  entityType: EntityType,
  entityId: string,
  formData: FormData
) {
  const bookVersionId = requireText(formData, "bookVersionId");

  if (entityType === "characters") {
    await updateCharacter(entityId, {
      bookVersionId,
      slug: requireSlug(formData, "slug"),
      name: requireText(formData, "name"),
      summary: optionalText(formData, "summary"),
      status: requireText(formData, "status") as
        | "draft"
        | "active"
        | "archived",
      metadataJson: parseJsonObject(formData, "metadataJson")
    });
  } else if (entityType === "locations") {
    await updateLocation(entityId, {
      bookVersionId,
      slug: requireSlug(formData, "slug"),
      name: requireText(formData, "name"),
      summary: optionalText(formData, "summary"),
      status: requireText(formData, "status") as
        | "draft"
        | "active"
        | "archived",
      metadataJson: parseJsonObject(formData, "metadataJson")
    });
  } else if (entityType === "factions") {
    await updateFaction(entityId, {
      bookVersionId,
      slug: requireSlug(formData, "slug"),
      name: requireText(formData, "name"),
      summary: optionalText(formData, "summary"),
      status: requireText(formData, "status") as
        | "draft"
        | "active"
        | "archived",
      metadataJson: parseJsonObject(formData, "metadataJson")
    });
  } else {
    await updatePerspective(entityId, {
      bookVersionId,
      characterId: requireText(formData, "characterId"),
      slug: requireSlug(formData, "slug"),
      name: requireText(formData, "name"),
      summary: optionalText(formData, "summary"),
      voiceGuide: optionalText(formData, "voiceGuide"),
      knowledgeBaselineJson: parseJsonObject(formData, "knowledgeBaselineJson"),
      eligibilityRulesJson: parseJsonObject(formData, "eligibilityRulesJson"),
      status: requireText(formData, "status") as "draft" | "active" | "archived"
    });
  }

  redirect(`/studio/entities/${entityType}?versionId=${bookVersionId}`);
}
