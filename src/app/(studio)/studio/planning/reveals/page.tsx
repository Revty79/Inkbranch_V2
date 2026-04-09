import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getRevealRulesByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioSubnav,
  StudioVersionContext
} from "@/ui/studio";

type StudioRevealRulesPageProps = {
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

export default async function StudioRevealRulesPage({
  searchParams
}: StudioRevealRulesPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Reveal Rules"
          description="Planning rules require an existing version context."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding reveal rules."
        />
      </>
    );
  }

  const revealRules = await getRevealRulesByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Reveal Rules"
        description="Define reveal keys, gating conditions, and exposure effects."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning/reveals"
      />
      <StudioSubnav items={buildSubnav(selectedVersion.id)} />
      <div className="studio-list-actions">
        <Link
          href={`/studio/planning/reveals/new?versionId=${selectedVersion.id}`}
        >
          Create Reveal Rule
        </Link>
      </div>
      {revealRules.length === 0 ? (
        <StudioEmptyState
          title="No reveal rules in this version"
          description="Add reveal constraints before planner implementation starts."
        />
      ) : (
        <ul className="studio-list-grid">
          {revealRules.map((rule) => (
            <li key={rule.id}>
              <h3>{rule.revealKey}</h3>
              <p>Subject Type: {rule.subjectType}</p>
              <p>Subject Id: {rule.subjectId ?? "none"}</p>
              <div className="studio-inline-links">
                <Link
                  href={`/studio/planning/reveals/${rule.id}/edit?versionId=${selectedVersion.id}`}
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
