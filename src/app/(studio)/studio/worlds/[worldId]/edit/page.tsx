import { notFound } from "next/navigation";

import { updateWorldAction } from "@/app/(studio)/studio/_actions/worlds";
import { getWorldById } from "@/data/queries/authoring";
import { StudioSectionHeader } from "@/ui/studio";

type StudioEditWorldPageProps = {
  readonly params: Promise<{ worldId: string }>;
};

export default async function StudioEditWorldPage({
  params
}: StudioEditWorldPageProps) {
  const { worldId } = await params;
  const world = await getWorldById(worldId);

  if (!world) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${world.title}`}
        description="Update world metadata and status."
      />
      <form
        className="studio-form"
        action={updateWorldAction.bind(null, world.id)}
      >
        <label>
          Slug
          <input name="slug" defaultValue={world.slug} required />
        </label>
        <label>
          Title
          <input name="title" defaultValue={world.title} required />
        </label>
        <label>
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue={world.description ?? ""}
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={world.status}>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label>
          Metadata JSON
          <textarea
            name="metadataJson"
            rows={4}
            defaultValue={JSON.stringify(world.metadata ?? {}, null, 2)}
          />
        </label>
        <button type="submit">Save World</button>
      </form>
    </>
  );
}
