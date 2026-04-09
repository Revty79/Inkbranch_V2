"use server";

import { redirect } from "next/navigation";

import { createCanonEntry, updateCanonEntry } from "@/data/mutations/authoring";

import {
  optionalText,
  parseJsonObject,
  parseNumber,
  requireText
} from "./form-utils";

function parseTagsJson(rawTags: string | null): Record<string, unknown> {
  if (!rawTags) {
    return { tags: [] };
  }

  const tags = rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return { tags };
}

export async function createCanonEntryAction(formData: FormData) {
  const bookVersionId = requireText(formData, "bookVersionId");

  await createCanonEntry({
    bookVersionId,
    entryType: requireText(formData, "entryType"),
    subjectType: requireText(formData, "subjectType"),
    subjectId: optionalText(formData, "subjectId"),
    canonicalText: requireText(formData, "canonicalText"),
    importance: parseNumber(formData, "importance", 0),
    visibility: requireText(formData, "visibility") as
      | "public"
      | "restricted"
      | "hidden",
    tagsJson: parseTagsJson(optionalText(formData, "tags")),
    metadataJson: parseJsonObject(formData, "metadataJson")
  });

  redirect(`/studio/canon?versionId=${bookVersionId}`);
}

export async function updateCanonEntryAction(
  canonEntryId: string,
  formData: FormData
) {
  const bookVersionId = requireText(formData, "bookVersionId");

  await updateCanonEntry(canonEntryId, {
    bookVersionId,
    entryType: requireText(formData, "entryType"),
    subjectType: requireText(formData, "subjectType"),
    subjectId: optionalText(formData, "subjectId"),
    canonicalText: requireText(formData, "canonicalText"),
    importance: parseNumber(formData, "importance", 0),
    visibility: requireText(formData, "visibility") as
      | "public"
      | "restricted"
      | "hidden",
    tagsJson: parseTagsJson(optionalText(formData, "tags")),
    metadataJson: parseJsonObject(formData, "metadataJson")
  });

  redirect(`/studio/canon?versionId=${bookVersionId}`);
}
