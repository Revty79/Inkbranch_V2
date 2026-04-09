import { notFound } from "next/navigation";

import { updatePlanningRuleAction } from "@/app/(studio)/studio/_actions/planning";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getRevealRuleById } from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditRevealRulePageProps = {
  readonly params: Promise<{ revealRuleId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioEditRevealRulePage({
  params,
  searchParams
}: StudioEditRevealRulePageProps) {
  const { revealRuleId } = await params;
  const revealRule = await getRevealRuleById(revealRuleId);

  if (!revealRule) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? revealRule.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${revealRule.revealKey}`}
        description="Update reveal gating and exposure effect payloads."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/planning/reveals/${revealRule.id}/edit`}
      />
      <form
        className="studio-form"
        action={updatePlanningRuleAction.bind(null, "reveals", revealRule.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={revealRule.bookVersionId}
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
          <input
            name="revealKey"
            defaultValue={revealRule.revealKey}
            required
          />
        </label>
        <label>
          Subject Type
          <input
            name="subjectType"
            defaultValue={revealRule.subjectType}
            required
          />
        </label>
        <label>
          Subject Id (optional)
          <input name="subjectId" defaultValue={revealRule.subjectId ?? ""} />
        </label>
        <label>
          Gating Rules JSON
          <textarea
            name="gatingRulesJson"
            rows={5}
            defaultValue={JSON.stringify(revealRule.gatingRules ?? {}, null, 2)}
          />
        </label>
        <label>
          Exposure Effects JSON
          <textarea
            name="exposureEffectsJson"
            rows={5}
            defaultValue={JSON.stringify(
              revealRule.exposureEffects ?? {},
              null,
              2
            )}
          />
        </label>
        <StudioFormActions
          submitLabel="Save Reveal Rule"
          cancelHref={`/studio/planning/reveals?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
