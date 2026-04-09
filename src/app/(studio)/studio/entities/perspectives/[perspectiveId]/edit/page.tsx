import { notFound } from "next/navigation";

import { updateEntityAction } from "@/app/(studio)/studio/_actions/entities";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import {
  getPerspectiveById,
  listCharactersByBookVersionId
} from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditPerspectivePageProps = {
  readonly params: Promise<{ perspectiveId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioEditPerspectivePage({
  params,
  searchParams
}: StudioEditPerspectivePageProps) {
  const { perspectiveId } = await params;
  const perspective = await getPerspectiveById(perspectiveId);

  if (!perspective) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? perspective.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  const characters = await listCharactersByBookVersionId(selectedVersion.id);
  const includesCurrentCharacter = characters.some(
    (character) => character.id === perspective.characterId
  );

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${perspective.name}`}
        description="Update perspective voice and eligibility fields for this version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/entities/perspectives/${perspective.id}/edit`}
      />
      <form
        className="studio-form"
        action={updateEntityAction.bind(null, "perspectives", perspective.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={perspective.bookVersionId}
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
          <select
            name="characterId"
            defaultValue={perspective.characterId}
            required
          >
            {!includesCurrentCharacter ? (
              <option value={perspective.characterId}>
                Current character ({perspective.characterId})
              </option>
            ) : null}
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={perspective.slug} required />
        </label>
        <label>
          Name
          <input name="name" defaultValue={perspective.name} required />
        </label>
        <label>
          Summary
          <textarea
            name="summary"
            rows={4}
            defaultValue={perspective.summary ?? ""}
          />
        </label>
        <label>
          Voice Guide
          <textarea
            name="voiceGuide"
            rows={4}
            defaultValue={perspective.voiceGuide ?? ""}
          />
        </label>
        <label>
          Knowledge Baseline JSON
          <textarea
            name="knowledgeBaselineJson"
            rows={5}
            defaultValue={JSON.stringify(
              perspective.knowledgeBaseline ?? {},
              null,
              2
            )}
          />
        </label>
        <label>
          Eligibility Rules JSON
          <textarea
            name="eligibilityRulesJson"
            rows={5}
            defaultValue={JSON.stringify(
              perspective.eligibilityRules ?? {},
              null,
              2
            )}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={perspective.status}>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <StudioFormActions
          submitLabel="Save Perspective"
          cancelHref={`/studio/entities/perspectives?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
