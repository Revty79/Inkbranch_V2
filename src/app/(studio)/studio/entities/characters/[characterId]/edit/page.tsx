import { notFound } from "next/navigation";

import { updateEntityAction } from "@/app/(studio)/studio/_actions/entities";
import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { getCharacterById } from "@/data/queries/authoring";
import {
  StudioFormActions,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioEditCharacterPageProps = {
  readonly params: Promise<{ characterId: string }>;
  readonly searchParams: Promise<{ versionId?: string }>;
};

export default async function StudioEditCharacterPage({
  params,
  searchParams
}: StudioEditCharacterPageProps) {
  const { characterId } = await params;
  const character = await getCharacterById(characterId);

  if (!character) {
    notFound();
  }

  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(
    versionId ?? character.bookVersionId
  );

  if (!selectedVersion) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${character.name}`}
        description="Update character details for the selected version."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath={`/studio/entities/characters/${character.id}/edit`}
      />
      <form
        className="studio-form"
        action={updateEntityAction.bind(null, "characters", character.id)}
      >
        <label>
          Book Version
          <select
            name="bookVersionId"
            defaultValue={character.bookVersionId}
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
          Slug
          <input name="slug" defaultValue={character.slug} required />
        </label>
        <label>
          Name
          <input name="name" defaultValue={character.name} required />
        </label>
        <label>
          Summary
          <textarea
            name="summary"
            rows={4}
            defaultValue={character.summary ?? ""}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={character.status}>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label>
          Metadata JSON
          <textarea
            name="metadataJson"
            rows={5}
            defaultValue={JSON.stringify(character.metadata ?? {}, null, 2)}
          />
        </label>
        <StudioFormActions
          submitLabel="Save Character"
          cancelHref={`/studio/entities/characters?versionId=${selectedVersion.id}`}
        />
      </form>
    </>
  );
}
