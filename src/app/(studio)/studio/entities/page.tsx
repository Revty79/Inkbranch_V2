import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  getPerspectivesByBookVersionId,
  listCharactersByBookVersionId,
  listFactionsByBookVersionId,
  listLocationsByBookVersionId
} from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioEntitiesPageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

function buildEntitiesSubnav(versionId: string) {
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

export default async function StudioEntitiesPage({
  searchParams
}: StudioEntitiesPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Entities"
          description="Manage version-owned characters, locations, factions, and perspectives."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a book version before authoring entities."
        />
      </>
    );
  }

  const [characters, locations, factions, perspectives] = await Promise.all([
    listCharactersByBookVersionId(selectedVersion.id),
    listLocationsByBookVersionId(selectedVersion.id),
    listFactionsByBookVersionId(selectedVersion.id),
    getPerspectivesByBookVersionId(selectedVersion.id)
  ]);

  return (
    <>
      <StudioSectionHeader
        title="Entities"
        description="Author the cast, places, groups, and perspective anchors for the selected version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities"
      />
      <StudioSubnav items={buildEntitiesSubnav(selectedVersion.id)} />
      <ul className="studio-list-grid">
        <li>
          <h3>Characters</h3>
          <p>{characters.length} records</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/entities/characters?versionId=${selectedVersion.id}`}
            >
              View
            </Link>
            <Link
              href={`/studio/entities/characters/new?versionId=${selectedVersion.id}`}
            >
              Create
            </Link>
          </div>
        </li>
        <li>
          <h3>Locations</h3>
          <p>{locations.length} records</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/entities/locations?versionId=${selectedVersion.id}`}
            >
              View
            </Link>
            <Link
              href={`/studio/entities/locations/new?versionId=${selectedVersion.id}`}
            >
              Create
            </Link>
          </div>
        </li>
        <li>
          <h3>Factions</h3>
          <p>{factions.length} records</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/entities/factions?versionId=${selectedVersion.id}`}
            >
              View
            </Link>
            <Link
              href={`/studio/entities/factions/new?versionId=${selectedVersion.id}`}
            >
              Create
            </Link>
          </div>
        </li>
        <li>
          <h3>Perspectives</h3>
          <p>{perspectives.length} records</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/entities/perspectives?versionId=${selectedVersion.id}`}
            >
              View
            </Link>
            <Link
              href={`/studio/entities/perspectives/new?versionId=${selectedVersion.id}`}
            >
              Create
            </Link>
          </div>
        </li>
      </ul>
    </>
  );
}
