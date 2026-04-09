import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  getArcMilestonesByBookVersionId,
  getEndingRulesByBookVersionId,
  getPacingRulesByBookVersionId,
  getRevealRulesByBookVersionId
} from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioPlanningPageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

function buildPlanningSubnav(versionId: string) {
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

export default async function StudioPlanningPage({
  searchParams
}: StudioPlanningPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Planning"
          description="Manage version-owned milestones, reveals, pacing, and ending rules."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before authoring planning rules."
        />
      </>
    );
  }

  const [milestones, reveals, pacing, endings] = await Promise.all([
    getArcMilestonesByBookVersionId(selectedVersion.id),
    getRevealRulesByBookVersionId(selectedVersion.id),
    getPacingRulesByBookVersionId(selectedVersion.id),
    getEndingRulesByBookVersionId(selectedVersion.id)
  ]);

  return (
    <>
      <StudioSectionHeader
        title="Planning"
        description="Author planner inputs without introducing planner runtime logic into Studio pages."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning"
      />
      <StudioSubnav items={buildPlanningSubnav(selectedVersion.id)} />
      <ul className="studio-list-grid">
        <li>
          <h3>Arc Milestones</h3>
          <p>{milestones.length} rules</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/planning/milestones?versionId=${selectedVersion.id}`}
            >
              View
            </Link>
            <Link
              href={`/studio/planning/milestones/new?versionId=${selectedVersion.id}`}
            >
              Create
            </Link>
          </div>
        </li>
        <li>
          <h3>Reveal Rules</h3>
          <p>{reveals.length} rules</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/planning/reveals?versionId=${selectedVersion.id}`}
            >
              View
            </Link>
            <Link
              href={`/studio/planning/reveals/new?versionId=${selectedVersion.id}`}
            >
              Create
            </Link>
          </div>
        </li>
        <li>
          <h3>Pacing Rules</h3>
          <p>{pacing.length} rules</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/planning/pacing?versionId=${selectedVersion.id}`}
            >
              View
            </Link>
            <Link
              href={`/studio/planning/pacing/new?versionId=${selectedVersion.id}`}
            >
              Create
            </Link>
          </div>
        </li>
        <li>
          <h3>Ending Rules</h3>
          <p>{endings.length} rules</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/planning/endings?versionId=${selectedVersion.id}`}
            >
              View
            </Link>
            <Link
              href={`/studio/planning/endings/new?versionId=${selectedVersion.id}`}
            >
              Create
            </Link>
          </div>
        </li>
      </ul>
    </>
  );
}
