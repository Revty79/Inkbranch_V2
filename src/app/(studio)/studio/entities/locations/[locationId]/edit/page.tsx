import { notFound } from "next/navigation";

import { updateEntityAction } from "@/app/(studio)/studio/_actions/entities";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getLocationById } from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditLocationPageProps = {
  readonly params: Promise<{ locationId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioEditLocationPage({
  params,
  searchParams
}: StudioEditLocationPageProps) {
  const { locationId } = await params;
  const location = await getLocationById(locationId);

  if (!location) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? location.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${location.name}`}
        description="Update location details for the selected version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/entities/locations/${location.id}/edit`}
      />
      <form
        className="studio-form"
        action={updateEntityAction.bind(null, "locations", location.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={location.bookVersionId}
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
          <input name="slug" defaultValue={location.slug} required />
        </label>
        <label>
          Name
          <input name="name" defaultValue={location.name} required />
        </label>
        <label>
          Summary
          <textarea
            name="summary"
            rows={4}
            defaultValue={location.summary ?? ""}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={location.status}>
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
            defaultValue={JSON.stringify(location.metadata ?? {}, null, 2)}
          />
        </label>
        <StudioFormActions
          submitLabel="Save Location"
          cancelHref={`/studio/entities/locations?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
