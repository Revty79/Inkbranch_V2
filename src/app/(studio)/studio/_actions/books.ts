"use server";

import { redirect } from "next/navigation";

import { createBook, updateBook } from "@/data/mutations/authoring";

import {
  optionalText,
  parseJsonObject,
  requireSlug,
  requireText
} from "./form-utils";

export async function createBookAction(formData: FormData) {
  await createBook({
    worldId: requireText(formData, "worldId"),
    slug: requireSlug(formData, "slug"),
    title: requireText(formData, "title"),
    premise: optionalText(formData, "premise"),
    defaultTone: optionalText(formData, "defaultTone"),
    status: requireText(formData, "status") as "draft" | "active" | "archived",
    metadataJson: parseJsonObject(formData, "metadataJson")
  });

  redirect("/studio/books");
}

export async function updateBookAction(bookId: string, formData: FormData) {
  await updateBook(bookId, {
    worldId: requireText(formData, "worldId"),
    slug: requireSlug(formData, "slug"),
    title: requireText(formData, "title"),
    premise: optionalText(formData, "premise"),
    defaultTone: optionalText(formData, "defaultTone"),
    status: requireText(formData, "status") as "draft" | "active" | "archived",
    metadataJson: parseJsonObject(formData, "metadataJson")
  });

  redirect(`/studio/books/${bookId}`);
}
