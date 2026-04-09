"use server";

import { redirect } from "next/navigation";

import {
  createBookVersion,
  updateBookVersion
} from "@/data/mutations/authoring";

import { optionalText, parseBoolean, requireText } from "./form-utils";

export async function createBookVersionAction(formData: FormData) {
  await createBookVersion({
    bookId: requireText(formData, "bookId"),
    versionLabel: requireText(formData, "versionLabel"),
    status: requireText(formData, "status") as
      | "draft"
      | "test"
      | "published"
      | "archived",
    isActive: parseBoolean(formData, "isActive"),
    notes: optionalText(formData, "notes")
  });

  redirect("/studio/versions");
}

export async function updateBookVersionAction(
  versionId: string,
  formData: FormData
) {
  await updateBookVersion(versionId, {
    bookId: requireText(formData, "bookId"),
    versionLabel: requireText(formData, "versionLabel"),
    status: requireText(formData, "status") as
      | "draft"
      | "test"
      | "published"
      | "archived",
    isActive: parseBoolean(formData, "isActive"),
    notes: optionalText(formData, "notes")
  });

  redirect(`/studio/versions/${versionId}`);
}
