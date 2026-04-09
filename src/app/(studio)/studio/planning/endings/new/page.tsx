import { notFound } from "next/navigation";

import { createPlanningRuleAction } from "@/app/(studio)/studio/_actions/planning";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  StudioEmptyState,
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioNewEndingRulePageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioNewEndingRulePage({
  searchParams
}: StudioNewEndingRulePageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (versions.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Ending Rule"
          description="Ending rules are owned by a book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then add ending rules."
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
        title="Create Ending Rule"
        description="Add ending constraints and resolution templates for this version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning/endings/new"
      />
      <form
        className="studio-form"
        action={createPlanningRuleAction.bind(null, "endings")}
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
          Ending Key
          <input name="endingKey" placeholder="redemption-end" required />
        </label>
        <label>
          Title
          <input name="title" placeholder="Redemption Ending" required />
        </label>
        <label>
          Ending Type
          <input name="endingType" placeholder="redemptive" required />
        </label>
        <label>
          Eligibility Rules JSON
          <textarea
            name="eligibilityRulesJson"
            rows={5}
            placeholder='{"requires":["mentor_forgiven"]}'
          />
        </label>
        <label>
          Priority Rules JSON
          <textarea
            name="priorityRulesJson"
            rows={5}
            placeholder='{"weight":10}'
          />
        </label>
        <label>
          Resolution Template JSON
          <textarea
            name="resolutionTemplateJson"
            rows={5}
            placeholder='{"summary":"The city heals."}'
          />
        </label>
        <StudioFormActions
          submitLabel="Create Ending Rule"
          cancelHref={`/studio/planning/endings?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
