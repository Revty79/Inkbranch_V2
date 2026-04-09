import { notFound } from "next/navigation";

import { updateEntityAction } from "@/app/(studio)/studio/_actions/entities";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getFactionById } from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditFactionPageProps = {
  readonly params: Promise<{ factionId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioEditFactionPage({
  params,
  searchParams
}: StudioEditFactionPageProps) {
  const { factionId } = await params;
  const faction = await getFactionById(factionId);

  if (!faction) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? faction.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${faction.name}`}
        description="Update faction details for the selected version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/entities/factions/${faction.id}/edit`}
      />
      <form
        className="studio-form"
        action={updateEntityAction.bind(null, "factions", faction.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={faction.bookVersionId}
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
          <input name="slug" defaultValue={faction.slug} required />
        </label>
        <label>
          Name
          <input name="name" defaultValue={faction.name} required />
        </label>
        <label>
          Summary
          <textarea
            name="summary"
            rows={4}
            defaultValue={faction.summary ?? ""}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={faction.status}>
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
            defaultValue={JSON.stringify(faction.metadata ?? {}, null, 2)}
          />
        </label>
        <StudioFormActions
          submitLabel="Save Faction"
          cancelHref={`/studio/entities/factions?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
