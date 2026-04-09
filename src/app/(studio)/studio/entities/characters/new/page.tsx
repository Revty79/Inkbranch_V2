import { notFound } from "next/navigation";

import { createEntityAction } from "@/app/(studio)/studio/_actions/entities";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  StudioEmptyState,
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioNewCharacterPageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioNewCharacterPage({
  searchParams
}: StudioNewCharacterPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (versions.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Character"
          description="Characters are owned by a book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then add characters."
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
        title="Create Character"
        description="Add a character record to the selected version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities/characters/new"
      />
      <form
        className="studio-form"
        action={createEntityAction.bind(null, "characters")}
      >
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
          Slug
          <input name="slug" placeholder="lead-detective" required />
        </label>
        <label>
          Name
          <input name="name" placeholder="Lead Detective" required />
        </label>
        <label>
          Summary
          <textarea name="summary" rows={4} />
        </label>
        <label>
          Status
          <select name="status" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label>
          Metadata JSON
          <textarea
            name="metadataJson"
            rows={5}
            placeholder='{"role":"protagonist"}'
          />
        </label>
        <StudioFormActions
          submitLabel="Create Character"
          cancelHref={`/studio/entities/characters?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
