"use server";

import { redirect } from "next/navigation";

import { createWorld, updateWorld } from "@/data/mutations/authoring";

import {
  optionalText,
  parseJsonObject,
  requireSlug,
  requireText
} from "./form-utils";

export async function createWorldAction(formData: FormData) {
  await createWorld({
    slug: requireSlug(formData, "slug"),
    title: requireText(formData, "title"),
    description: optionalText(formData, "description"),
    status: requireText(formData, "status") as "draft" | "active" | "archived",
    metadataJson: parseJsonObject(formData, "metadataJson")
  });

  redirect("/studio/worlds");
}

export async function updateWorldAction(worldId: string, formData: FormData) {
  await updateWorld(worldId, {
    slug: requireSlug(formData, "slug"),
    title: requireText(formData, "title"),
    description: optionalText(formData, "description"),
    status: requireText(formData, "status") as "draft" | "active" | "archived",
    metadataJson: parseJsonObject(formData, "metadataJson")
  });

  redirect(`/studio/worlds/${worldId}`);
}
