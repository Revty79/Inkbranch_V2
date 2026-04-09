import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getPerspectivesByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioPerspectiveListPageProps = {
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

export default async function StudioPerspectiveListPage({
  searchParams
}: StudioPerspectiveListPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Perspectives"
          description="Authoring requires an existing version context."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding perspectives."
        />
      </>
    );
  }

  const perspectives = await getPerspectivesByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Perspectives"
        description="Manage POV definitions including voice guidance and eligibility rules."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities/perspectives"
      />
      <StudioSubnav items={buildSubnav(selectedVersion.id)} />
      <div className="studio-list-actions">
        <Link
          href={`/studio/entities/perspectives/new?versionId=${selectedVersion.id}`}
        >
          Create Perspective
        </Link>
      </div>
      {perspectives.length === 0 ? (
        <StudioEmptyState
          title="No perspectives in this version"
          description="Add perspectives after creating at least one character."
        />
      ) : (
        <ul className="studio-list-grid">
          {perspectives.map((perspective) => (
            <li key={perspective.id}>
              <h3>{perspective.name}</h3>
              <p>Slug: {perspective.slug}</p>
              <p>Character: {perspective.characterId}</p>
              <p>Status: {perspective.status}</p>
              <p>{perspective.summary ?? "No summary yet."}</p>
              <div className="studio-inline-links">
                <Link
                  href={`/studio/entities/perspectives/${perspective.id}/edit?versionId=${selectedVersion.id}`}
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
