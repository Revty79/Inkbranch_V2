import { notFound } from "next/navigation";

import { createEntityAction } from "@/app/(studio)/studio/_actions/entities";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  StudioEmptyState,
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioNewFactionPageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioNewFactionPage({
  searchParams
}: StudioNewFactionPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (versions.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Faction"
          description="Factions are owned by a book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then add factions."
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
        title="Create Faction"
        description="Add a faction record to the selected version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities/factions/new"
      />
      <form
        className="studio-form"
        action={createEntityAction.bind(null, "factions")}
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
          <input name="slug" placeholder="city-watch" required />
        </label>
        <label>
          Name
          <input name="name" placeholder="City Watch" required />
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
            placeholder='{"alignment":"order"}'
          />
        </label>
        <StudioFormActions
          submitLabel="Create Faction"
          cancelHref={`/studio/entities/factions?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
