import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getPacingRulesByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioPacingRulesPageProps = {
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

export default async function StudioPacingRulesPage({
  searchParams
}: StudioPacingRulesPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Pacing Rules"
          description="Planning rules require an existing version context."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding pacing rules."
        />
      </>
    );
  }

  const pacingRules = await getPacingRulesByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Pacing Rules"
        description="Define pacing constraints through simple scope + rule-type records."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning/pacing"
      />
      <StudioSubnav items={buildSubnav(selectedVersion.id)} />
      <div className="studio-list-actions">
        <Link
          href={`/studio/planning/pacing/new?versionId=${selectedVersion.id}`}
        >
          Create Pacing Rule
        </Link>
      </div>
      {pacingRules.length === 0 ? (
        <StudioEmptyState
          title="No pacing rules in this version"
          description="Add pacing guidance for the planner's deterministic scene selection."
        />
      ) : (
        <ul className="studio-list-grid">
          {pacingRules.map((rule) => (
            <li key={rule.id}>
              <h3>{rule.ruleType}</h3>
              <p>Scope: {rule.scope}</p>
              <div className="studio-inline-links">
                <Link
                  href={`/studio/planning/pacing/${rule.id}/edit?versionId=${selectedVersion.id}`}
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
