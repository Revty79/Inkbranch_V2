import { notFound } from "next/navigation";

import { updateCanonEntryAction } from "@/app/(studio)/studio/_actions/canon";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getCanonEntryById } from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditCanonEntryPageProps = {
  readonly params: Promise<{ canonEntryId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

function formatTags(tags: Record<string, unknown>): string {
  const rawTags = tags["tags"];
  if (!Array.isArray(rawTags)) {
    return "";
  }

  return rawTags
    .filter((value): value is string => typeof value === "string")
    .join(", ");
}

export default async function StudioEditCanonEntryPage({
  params,
  searchParams
}: StudioEditCanonEntryPageProps) {
  const { canonEntryId } = await params;
  const entry = await getCanonEntryById(canonEntryId);

  if (!entry) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? entry.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title="Edit Canon Entry"
        description="Update canonical text and subject linkage for this version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/canon/${entry.id}/edit`}
      />
      <form
        className="studio-form"
        action={updateCanonEntryAction.bind(null, entry.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={entry.bookVersionId}
            required
          >
            {versions.map((version) => (
              <option key={version.id} value={version.id}>
                {version.versionLabel}
              </option>
            ))}
          </select>
        </label>
        <label>
          Entry Type
          <input name="entryType" defaultValue={entry.entryType} required />
        </label>
        <label>
          Subject Type
          <input name="subjectType" defaultValue={entry.subjectType} required />
        </label>
        <label>
          Subject Id (optional)
          <input name="subjectId" defaultValue={entry.subjectId ?? ""} />
        </label>
        <label>
          Canonical Text
          <textarea
            name="canonicalText"
            rows={5}
            defaultValue={entry.canonicalText}
            required
          />
        </label>
        <label>
          Importance
          <input
            name="importance"
            type="number"
            defaultValue={entry.importance}
          />
        </label>
        <label>
          Visibility
          <select name="visibility" defaultValue={entry.visibility}>
            <option value="public">public</option>
            <option value="restricted">restricted</option>
            <option value="hidden">hidden</option>
          </select>
        </label>
        <label>
          Tags (comma-separated)
          <input name="tags" defaultValue={formatTags(entry.tags)} />
        </label>
        <label>
          Metadata JSON
          <textarea
            name="metadataJson"
            rows={5}
            defaultValue={JSON.stringify(entry.metadata ?? {}, null, 2)}
          />
        </label>
        <StudioFormActions
          submitLabel="Save Canon Entry"
          cancelHref={`/studio/canon?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
