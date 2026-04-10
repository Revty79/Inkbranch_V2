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
      label: "Reveal timing"
    },
    {
      href: `/studio/planning/pacing?versionId=${versionId}`,
      label: "Pacing rules"
    },
    {
      href: `/studio/planning/endings?versionId=${versionId}`,
      label: "Ending paths"
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
          description="Set milestones, reveal timing, pacing, and ending paths for a version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then shape planning rules for that draft."
          actionHref="/studio/versions/new"
          actionLabel="Create a version"
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
        description="Shape the story path for this version with milestones, reveals, pacing, and endings."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning"
      />
      <section className="studio-flow-note">
        <p>
          Planning is strongest when canon and entities are already in place.
          Update{" "}
          <Link href={`/studio/canon?versionId=${selectedVersion.id}`}>
            Canon
          </Link>{" "}
          or{" "}
          <Link href={`/studio/entities?versionId=${selectedVersion.id}`}>
            Entities
          </Link>{" "}
          if you need more context first.
        </p>
      </section>
      <StudioSubnav items={buildPlanningSubnav(selectedVersion.id)} />
      <ul className="studio-list-grid">
        <li>
          <h3>Milestones</h3>
          <p>{milestones.length} rules</p>
          <p>Major story beats that should happen across the run.</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/planning/milestones?versionId=${selectedVersion.id}`}
            >
              View rules
            </Link>
            <Link
              href={`/studio/planning/milestones/new?versionId=${selectedVersion.id}`}
            >
              Add milestone
            </Link>
          </div>
        </li>
        <li>
          <h3>Reveal timing</h3>
          <p>{reveals.length} rules</p>
          <p>Control when secrets can appear and when they must stay hidden.</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/planning/reveals?versionId=${selectedVersion.id}`}
            >
              View rules
            </Link>
            <Link
              href={`/studio/planning/reveals/new?versionId=${selectedVersion.id}`}
            >
              Add reveal rule
            </Link>
          </div>
        </li>
        <li>
          <h3>Pacing rules</h3>
          <p>{pacing.length} rules</p>
          <p>Set cadence targets so scenes move at the right rhythm.</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/planning/pacing?versionId=${selectedVersion.id}`}
            >
              View rules
            </Link>
            <Link
              href={`/studio/planning/pacing/new?versionId=${selectedVersion.id}`}
            >
              Add pacing rule
            </Link>
          </div>
        </li>
        <li>
          <h3>Ending paths</h3>
          <p>{endings.length} rules</p>
          <p>Define what must be true before each ending can unlock.</p>
          <div className="studio-inline-links">
            <Link
              href={`/studio/planning/endings?versionId=${selectedVersion.id}`}
            >
              View rules
            </Link>
            <Link
              href={`/studio/planning/endings/new?versionId=${selectedVersion.id}`}
            >
              Add ending rule
            </Link>
          </div>
        </li>
      </ul>
    </>
  );
}
