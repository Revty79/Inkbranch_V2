import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { listCharactersByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioCharacterListPageProps = {
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

export default async function StudioCharacterListPage({
  searchParams
}: StudioCharacterListPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Characters"
          description="Authoring requires an existing version context."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding characters."
        />
      </>
    );
  }

  const characters = await listCharactersByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Characters"
        description="Manage version-owned characters for canon and planning inputs."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities/characters"
      />
      <StudioSubnav items={buildSubnav(selectedVersion.id)} />
      <div className="studio-list-actions">
        <Link
          href={`/studio/entities/characters/new?versionId=${selectedVersion.id}`}
        >
          Create Character
        </Link>
      </div>
      {characters.length === 0 ? (
        <StudioEmptyState
          title="No characters in this version"
          description="Add the first character record to anchor perspectives and canon facts."
        />
      ) : (
        <ul className="studio-list-grid">
          {characters.map((character) => (
            <li key={character.id}>
              <h3>{character.name}</h3>
              <p>Slug: {character.slug}</p>
              <p>Status: {character.status}</p>
              <p>{character.summary ?? "No summary yet."}</p>
              <div className="studio-inline-links">
                <Link
                  href={`/studio/entities/characters/${character.id}/edit?versionId=${selectedVersion.id}`}
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
