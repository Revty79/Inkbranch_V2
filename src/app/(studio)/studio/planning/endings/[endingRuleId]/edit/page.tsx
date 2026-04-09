import { notFound } from "next/navigation";

import { updatePlanningRuleAction } from "@/app/(studio)/studio/_actions/planning";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getEndingRuleById } from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditEndingRulePageProps = {
  readonly params: Promise<{ endingRuleId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioEditEndingRulePage({
  params,
  searchParams
}: StudioEditEndingRulePageProps) {
  const { endingRuleId } = await params;
  const endingRule = await getEndingRuleById(endingRuleId);

  if (!endingRule) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? endingRule.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${endingRule.title}`}
        description="Update ending eligibility, priority, and resolution payloads."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/planning/endings/${endingRule.id}/edit`}
      />
      <form
        className="studio-form"
        action={updatePlanningRuleAction.bind(null, "endings", endingRule.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={endingRule.bookVersionId}
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
          <input
            name="endingKey"
            defaultValue={endingRule.endingKey}
            required
          />
        </label>
        <label>
          Title
          <input name="title" defaultValue={endingRule.title} required />
        </label>
        <label>
          Ending Type
          <input
            name="endingType"
            defaultValue={endingRule.endingType}
            required
          />
        </label>
        <label>
          Eligibility Rules JSON
          <textarea
            name="eligibilityRulesJson"
            rows={5}
            defaultValue={JSON.stringify(
              endingRule.eligibilityRules ?? {},
              null,
              2
            )}
          />
        </label>
        <label>
          Priority Rules JSON
          <textarea
            name="priorityRulesJson"
            rows={5}
            defaultValue={JSON.stringify(
              endingRule.priorityRules ?? {},
              null,
              2
            )}
          />
        </label>
        <label>
          Resolution Template JSON
          <textarea
            name="resolutionTemplateJson"
            rows={5}
            defaultValue={JSON.stringify(
              endingRule.resolutionTemplate ?? {},
              null,
              2
            )}
          />
        </label>
        <StudioFormActions
          submitLabel="Save Ending Rule"
          cancelHref={`/studio/planning/endings?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
