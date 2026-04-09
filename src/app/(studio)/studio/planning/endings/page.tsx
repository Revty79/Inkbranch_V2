import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getEndingRulesByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioEndingRulesPageProps = {
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

export default async function StudioEndingRulesPage({
  searchParams
}: StudioEndingRulesPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Ending Rules"
          description="Planning rules require an existing version context."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding ending rules."
        />
      </>
    );
  }

  const endingRules = await getEndingRulesByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Ending Rules"
        description="Define ending eligibility, priority, and resolution templates."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning/endings"
      />
      <StudioSubnav items={buildSubnav(selectedVersion.id)} />
      <div className="studio-list-actions">
        <Link
          href={`/studio/planning/endings/new?versionId=${selectedVersion.id}`}
        >
          Create Ending Rule
        </Link>
      </div>
      {endingRules.length === 0 ? (
        <StudioEmptyState
          title="No ending rules in this version"
          description="Add ending criteria to shape planner completion behavior."
        />
      ) : (
        <ul className="studio-list-grid">
          {endingRules.map((rule) => (
            <li key={rule.id}>
              <h3>{rule.title}</h3>
              <p>Ending Key: {rule.endingKey}</p>
              <p>Type: {rule.endingType}</p>
              <div className="studio-inline-links">
                <Link
                  href={`/studio/planning/endings/${rule.id}/edit?versionId=${selectedVersion.id}`}
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
