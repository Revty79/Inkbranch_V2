import { notFound } from "next/navigation";

import { createPlanningRuleAction } from "@/app/(studio)/studio/_actions/planning";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  StudioEmptyState,
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioNewMilestonePageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioNewMilestonePage({
  searchParams
}: StudioNewMilestonePageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (versions.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Milestone"
          description="Milestones are owned by a book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then add milestones."
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
        title="Create Milestone"
        description="Add an arc milestone with practical JSON rule fields for v1."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/planning/milestones/new"
      />
      <form
        className="studio-form"
        action={createPlanningRuleAction.bind(null, "milestones")}
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
          Arc Key
          <input name="arcKey" placeholder="main_arc" required />
        </label>
        <label>
          Milestone Key
          <input name="milestoneKey" placeholder="truth_revealed" required />
        </label>
        <label>
          Title
          <input name="title" placeholder="Truth Revealed" required />
        </label>
        <label>
          Description
          <textarea name="description" rows={4} />
        </label>
        <label>
          Priority
          <input name="priority" type="number" defaultValue={0} />
        </label>
        <label className="studio-checkbox">
          <input type="checkbox" name="required" />
          Required milestone
        </label>
        <label>
          Sequence Hint (optional)
          <input name="sequenceHint" type="number" />
        </label>
        <label>
          Eligibility Rules JSON
          <textarea
            name="eligibilityRulesJson"
            rows={5}
            placeholder='{"requires":["chapter_2"]}'
          />
        </label>
        <label>
          Completion Rules JSON
          <textarea
            name="completionRulesJson"
            rows={5}
            placeholder='{"on_choice":"accept_truth"}'
          />
        </label>
        <StudioFormActions
          submitLabel="Create Milestone"
          cancelHref={`/studio/planning/milestones?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
