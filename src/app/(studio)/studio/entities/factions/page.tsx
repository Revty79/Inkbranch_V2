import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { listFactionsByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioFactionListPageProps = {
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

export default async function StudioFactionListPage({
  searchParams
}: StudioFactionListPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Factions"
          description="Authoring requires an existing version context."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding factions."
        />
      </>
    );
  }

  const factions = await listFactionsByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Factions"
        description="Manage version-owned factions for social and conflict structure."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities/factions"
      />
      <StudioSubnav items={buildSubnav(selectedVersion.id)} />
      <div className="studio-list-actions">
        <Link
          href={`/studio/entities/factions/new?versionId=${selectedVersion.id}`}
        >
          Create Faction
        </Link>
      </div>
      {factions.length === 0 ? (
        <StudioEmptyState
          title="No factions in this version"
          description="Add factions to ground social forces and competing agendas."
        />
      ) : (
        <ul className="studio-list-grid">
          {factions.map((faction) => (
            <li key={faction.id}>
              <h3>{faction.name}</h3>
              <p>Slug: {faction.slug}</p>
              <p>Status: {faction.status}</p>
              <p>{faction.summary ?? "No summary yet."}</p>
              <div className="studio-inline-links">
                <Link
                  href={`/studio/entities/factions/${faction.id}/edit?versionId=${selectedVersion.id}`}
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
