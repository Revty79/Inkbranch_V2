import { notFound } from "next/navigation";

import { createCanonEntryAction } from "@/app/(studio)/studio/_actions/canon";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  StudioEmptyState,
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioNewCanonEntryPageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioNewCanonEntryPage({
  searchParams
}: StudioNewCanonEntryPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (versions.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Canon Entry"
          description="Canon entries require an existing book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then return to add canon entries."
        />
      </>
    );
  }

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title="Create Canon Entry"
        description="Add a new canonical fact to the selected book version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/canon/new"
      />
      <form className="studio-form" action={createCanonEntryAction}>
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={selectedVersion.id}
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
          <input name="entryType" placeholder="character_fact" required />
        </label>
        <label>
          Subject Type
          <input name="subjectType" placeholder="character" required />
        </label>
        <label>
          Subject Id (optional)
          <input name="subjectId" placeholder="UUID if linked" />
        </label>
        <label>
          Canonical Text
          <textarea name="canonicalText" rows={5} required />
        </label>
        <label>
          Importance
          <input name="importance" type="number" defaultValue={0} />
        </label>
        <label>
          Visibility
          <select name="visibility" defaultValue="public">
            <option value="public">public</option>
            <option value="restricted">restricted</option>
            <option value="hidden">hidden</option>
          </select>
        </label>
        <label>
          Tags (comma-separated)
          <input name="tags" placeholder="canon, secret, history" />
        </label>
        <label>
          Metadata JSON
          <textarea
            name="metadataJson"
            rows={5}
            placeholder='{"source":"bible"}'
          />
        </label>
        <StudioFormActions
          submitLabel="Create Canon Entry"
          cancelHref={`/studio/canon?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
