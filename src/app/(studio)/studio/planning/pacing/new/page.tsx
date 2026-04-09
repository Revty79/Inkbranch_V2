import { notFound } from "next/navigation";

import { createPlanningRuleAction } from "@/app/(studio)/studio/_actions/planning";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  StudioEmptyState,
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioNewPacingRulePageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioNewPacingRulePage({
  searchParams
}: StudioNewPacingRulePageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (versions.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Pacing Rule"
          description="Pacing rules are owned by a book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then add pacing rules."
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
        title="Create Pacing Rule"
        description="Add a pacing rule using practical JSON configuration fields."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning/pacing/new"
      />
      <form
        className="studio-form"
        action={createPlanningRuleAction.bind(null, "pacing")}
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
          Scope
          <input name="scope" placeholder="chapter" required />
        </label>
        <label>
          Rule Type
          <input name="ruleType" placeholder="max-intensity" required />
        </label>
        <label>
          Rule Config JSON
          <textarea name="ruleConfigJson" rows={5} placeholder='{"max":3}' />
        </label>
        <StudioFormActions
          submitLabel="Create Pacing Rule"
          cancelHref={`/studio/planning/pacing?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
