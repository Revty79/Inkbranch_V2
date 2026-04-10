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
          description="Define the cast, places, groups, and perspectives for a version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before building characters and other entities."
          actionHref="/studio/versions/new"
          actionLabel="Create a version"
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
        description="Build the people, places, groups, and POV anchors for the selected version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities"
      />
      <section className="studio-flow-note">
        <p>
          Start with characters and perspectives, then add canonical facts in{" "}
          <Link href={`/studio/canon?versionId=${selectedVersion.id}`}>
            Canon
          </Link>{" "}
          and story pressure in{" "}
          <Link href={`/studio/planning?versionId=${selectedVersion.id}`}>
            Planning
          </Link>
          .
        </p>
      </section>
      <StudioSubnav items={buildEntitiesSubnav(selectedVersion.id)} />
      <ul className="studio-list-grid">
        <li>
          <h3>Characters</h3>
          <p>{characters.length} created</p>
          <p>Who appears in this story and what drives them.</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/entities/characters?versionId=${selectedVersion.id}`}
            >
              View list
            </Link>
            <Link
              href={`/studio/entities/characters/new?versionId=${selectedVersion.id}`}
            >
              Add character
            </Link>
          </div>
        </li>
        <li>
          <h3>Locations</h3>
          <p>{locations.length} created</p>
          <p>Important places where scenes can unfold.</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/entities/locations?versionId=${selectedVersion.id}`}
            >
              View list
            </Link>
            <Link
              href={`/studio/entities/locations/new?versionId=${selectedVersion.id}`}
            >
              Add location
            </Link>
          </div>
        </li>
        <li>
          <h3>Factions</h3>
          <p>{factions.length} created</p>
          <p>Groups, alliances, and rival interests.</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/entities/factions?versionId=${selectedVersion.id}`}
            >
              View list
            </Link>
            <Link
              href={`/studio/entities/factions/new?versionId=${selectedVersion.id}`}
            >
              Add faction
            </Link>
          </div>
        </li>
        <li>
          <h3>Perspectives</h3>
          <p>{perspectives.length} created</p>
          <p>Reader viewpoint anchors and voice guidance.</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/entities/perspectives?versionId=${selectedVersion.id}`}
            >
              View list
            </Link>
            <Link
              href={`/studio/entities/perspectives/new?versionId=${selectedVersion.id}`}
            >
              Add perspective
            </Link>
          </div>
        </li>
      </ul>
    </>
  );
}
