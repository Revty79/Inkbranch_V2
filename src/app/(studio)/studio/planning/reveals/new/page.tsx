import { notFound } from "next/navigation";

import { createPlanningRuleAction } from "@/app/(studio)/studio/_actions/planning";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  StudioEmptyState,
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioNewRevealRulePageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioNewRevealRulePage({
  searchParams
}: StudioNewRevealRulePageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (versions.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Reveal Rule"
          description="Reveal rules are owned by a book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then add reveal rules."
        />
      </>
    );
  }

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title="Create Reveal Rule"
        description="Add reveal gating and exposure-effects payloads for this version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning/reveals/new"
      />
      <form
        className="studio-form"
        action={createPlanningRuleAction.bind(null, "reveals")}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={selectedVersion.id}
            required
          >
            {versions.map((version) => (
              <option key={version.id} value={version.id}>
                {version.versionLabel}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reveal Key
          <input name="revealKey" placeholder="mentor-secret" required />
        </label>
        <label>
          Subject Type
          <input name="subjectType" placeholder="character" required />
        </label>
        <label>
          Subject Id (optional)
          <input name="subjectId" placeholder="UUID if linked" />
        </label>
        <label>
          Gating Rules JSON
          <textarea
            name="gatingRulesJson"
            rows={5}
            placeholder='{"requires":["milestone_x"]}'
          />
        </label>
        <label>
          Exposure Effects JSON
          <textarea
            name="exposureEffectsJson"
            rows={5}
            placeholder='{"knowledge":["mentor_secret_known"]}'
          />
        </label>
        <StudioFormActions
          submitLabel="Create Reveal Rule"
          cancelHref={`/studio/planning/reveals?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
