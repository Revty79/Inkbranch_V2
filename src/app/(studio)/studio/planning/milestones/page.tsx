import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getArcMilestonesByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioMilestonesPageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

function buildSubnav(versionId: string) {
  return [
    {
      href: `/studio/planning/milestones?versionId=${versionId}`,
      label: "Milestones"
    },
    {
      href: `/studio/planning/reveals?versionId=${versionId}`,
      label: "Reveals"
    },
    { href: `/studio/planning/pacing?versionId=${versionId}`, label: "Pacing" },
    {
      href: `/studio/planning/endings?versionId=${versionId}`,
      label: "Endings"
    }
  ] as const;
}

export default async function StudioMilestonesPage({
  searchParams
}: StudioMilestonesPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Arc Milestones"
          description="Planning rules require an existing version context."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding arc milestones."
        />
      </>
    );
  }

  const milestones = await getArcMilestonesByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Arc Milestones"
        description="Define required and optional milestones across narrative arcs."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning/milestones"
      />
      <StudioSubnav items={buildSubnav(selectedVersion.id)} />
      <div className="studio-list-actions">
        <Link
          href={`/studio/planning/milestones/new?versionId=${selectedVersion.id}`}
        >
          Create Milestone
        </Link>
      </div>
      {milestones.length === 0 ? (
        <StudioEmptyState
          title="No milestones in this version"
          description="Create milestones to structure arc progression inputs for the planner."
        />
      ) : (
        <ul className="studio-list-grid">
          {milestones.map((milestone) => (
            <li key={milestone.id}>
              <h3>{milestone.title}</h3>
              <p>Arc: {milestone.arcKey}</p>
              <p>Key: {milestone.milestoneKey}</p>
              <p>Priority: {milestone.priority}</p>
              <p>{milestone.required ? "Required" : "Optional"}</p>
              <div className="studio-inline-links">
                <Link
                  href={`/studio/planning/milestones/${milestone.id}/edit?versionId=${selectedVersion.id}`}
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
