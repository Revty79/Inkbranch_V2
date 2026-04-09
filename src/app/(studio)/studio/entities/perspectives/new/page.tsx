import Link from "next/link";
import { notFound } from "next/navigation";

import { createEntityAction } from "@/app/(studio)/studio/_actions/entities";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { listCharactersByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioNewPerspectivePageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioNewPerspectivePage({
  searchParams
}: StudioNewPerspectivePageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (versions.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Perspective"
          description="Perspectives are owned by a book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then add perspectives."
        />
      </>
    );
  }

  if (!selectedVersion) {
    notFound();
  }

  const characters = await listCharactersByBookVersionId(selectedVersion.id);

  if (characters.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Perspective"
          description="A perspective must be linked to a character in the same version."
        />
        <StudioVersionContext
          versions={versions}
          selectedVersionId={selectedVersion.id}
          actionPath="/studio/entities/perspectives/new"
        />
        <StudioEmptyState
          title="No characters available"
          description="Create at least one character in this version before adding perspectives."
        />
        <div className="studio-inline-links">
          <Link
            href={`/studio/entities/characters/new?versionId=${selectedVersion.id}`}
          >
            Create Character
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <StudioSectionHeader
        title="Create Perspective"
        description="Add POV metadata, baseline knowledge, and eligibility rules."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/entities/perspectives/new"
      />
      <form
        className="studio-form"
        action={createEntityAction.bind(null, "perspectives")}
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
          Character
          <select name="characterId" required>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Slug
          <input name="slug" placeholder="detective-pov" required />
        </label>
        <label>
          Name
          <input name="name" placeholder="Detective POV" required />
        </label>
        <label>
          Summary
          <textarea name="summary" rows={4} />
        </label>
        <label>
          Voice Guide
          <textarea name="voiceGuide" rows={4} />
        </label>
        <label>
          Knowledge Baseline JSON
          <textarea
            name="knowledgeBaselineJson"
            rows={5}
            placeholder='{"known":["family_secret"]}'
          />
        </label>
        <label>
          Eligibility Rules JSON
          <textarea
            name="eligibilityRulesJson"
            rows={5}
            placeholder='{"requires":["chapter_1_complete"]}'
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <StudioFormActions
          submitLabel="Create Perspective"
          cancelHref={`/studio/entities/perspectives?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
