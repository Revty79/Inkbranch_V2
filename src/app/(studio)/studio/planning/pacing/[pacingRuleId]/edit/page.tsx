import { notFound } from "next/navigation";

import { updatePlanningRuleAction } from "@/app/(studio)/studio/_actions/planning";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getPacingRuleById } from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditPacingRulePageProps = {
  readonly params: Promise<{ pacingRuleId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioEditPacingRulePage({
  params,
  searchParams
}: StudioEditPacingRulePageProps) {
  const { pacingRuleId } = await params;
  const pacingRule = await getPacingRuleById(pacingRuleId);

  if (!pacingRule) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? pacingRule.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${pacingRule.ruleType}`}
        description="Update pacing rule scope and configuration payload."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/planning/pacing/${pacingRule.id}/edit`}
      />
      <form
        className="studio-form"
        action={updatePlanningRuleAction.bind(null, "pacing", pacingRule.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={pacingRule.bookVersionId}
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
          <input name="scope" defaultValue={pacingRule.scope} required />
        </label>
        <label>
          Rule Type
          <input name="ruleType" defaultValue={pacingRule.ruleType} required />
        </label>
        <label>
          Rule Config JSON
          <textarea
            name="ruleConfigJson"
            rows={5}
            defaultValue={JSON.stringify(pacingRule.ruleConfig ?? {}, null, 2)}
          />
        </label>
        <StudioFormActions
          submitLabel="Save Pacing Rule"
          cancelHref={`/studio/planning/pacing?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
