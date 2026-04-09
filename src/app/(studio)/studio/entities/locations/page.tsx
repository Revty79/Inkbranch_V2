import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { listLocationsByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioLocationListPageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

function buildSubnav(versionId: string) {
  return [
    {
      href: `/studio/entities/characters?versionId=${versionId}`,
      label: "Characters"
    },
    {
      href: `/studio/entities/locations?versionId=${versionId}`,
      label: "Locations"
    },
    {
      href: `/studio/entities/factions?versionId=${versionId}`,
      label: "Factions"
    },
    {
      href: `/studio/entities/perspectives?versionId=${versionId}`,
      label: "Perspectives"
    }
  ] as const;
}

export default async function StudioLocationListPage({
  searchParams
}: StudioLocationListPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Locations"
          description="Authoring requires an existing version context."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding locations."
        />
      </>
    );
  }

  const locations = await listLocationsByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Locations"
        description="Manage version-owned locations for canon and planning inputs."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities/locations"
      />
      <StudioSubnav items={buildSubnav(selectedVersion.id)} />
      <div className="studio-list-actions">
        <Link
          href={`/studio/entities/locations/new?versionId=${selectedVersion.id}`}
        >
          Create Location
        </Link>
      </div>
      {locations.length === 0 ? (
        <StudioEmptyState
          title="No locations in this version"
          description="Add locations to anchor scene context and traversal options."
        />
      ) : (
        <ul className="studio-list-grid">
          {locations.map((location) => (
            <li key={location.id}>
              <h3>{location.name}</h3>
              <p>Slug: {location.slug}</p>
              <p>Status: {location.status}</p>
              <p>{location.summary ?? "No summary yet."}</p>
              <div className="studio-inline-links">
                <Link
                  href={`/studio/entities/locations/${location.id}/edit?versionId=${selectedVersion.id}`}
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
