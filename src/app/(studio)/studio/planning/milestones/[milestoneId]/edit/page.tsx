import { notFound } from "next/navigation";

import { updatePlanningRuleAction } from "@/app/(studio)/studio/_actions/planning";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getArcMilestoneById } from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditMilestonePageProps = {
  readonly params: Promise<{ milestoneId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioEditMilestonePage({
  params,
  searchParams
}: StudioEditMilestonePageProps) {
  const { milestoneId } = await params;
  const milestone = await getArcMilestoneById(milestoneId);

  if (!milestone) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? milestone.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${milestone.title}`}
        description="Update milestone sequencing and rule payloads."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/planning/milestones/${milestone.id}/edit`}
      />
      <form
        className="studio-form"
        action={updatePlanningRuleAction.bind(null, "milestones", milestone.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={milestone.bookVersionId}
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
          Arc Key
          <input name="arcKey" defaultValue={milestone.arcKey} required />
        </label>
        <label>
          Milestone Key
          <input
            name="milestoneKey"
            defaultValue={milestone.milestoneKey}
            required
          />
        </label>
        <label>
          Title
          <input name="title" defaultValue={milestone.title} required />
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue={milestone.description ?? ""}
          />
        </label>
        <label>
          Priority
          <input
            name="priority"
            type="number"
            defaultValue={milestone.priority}
          />
        </label>
        <label className="studio-checkbox">
          <input
            type="checkbox"
            name="required"
            defaultChecked={milestone.required}
          />
          Required milestone
        </label>
        <label>
          Sequence Hint (optional)
          <input
            name="sequenceHint"
            type="number"
            defaultValue={milestone.sequenceHint ?? ""}
          />
        </label>
        <label>
          Eligibility Rules JSON
          <textarea
            name="eligibilityRulesJson"
            rows={5}
            defaultValue={JSON.stringify(
              milestone.eligibilityRules ?? {},
              null,
              2
            )}
          />
        </label>
        <label>
          Completion Rules JSON
          <textarea
            name="completionRulesJson"
            rows={5}
            defaultValue={JSON.stringify(
              milestone.completionRules ?? {},
              null,
              2
            )}
          />
        </label>
        <StudioFormActions
          submitLabel="Save Milestone"
          cancelHref={`/studio/planning/milestones?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
