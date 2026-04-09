import { createWorldAction } from "@/app/(studio)/studio/_actions/worlds";
import { StudioSectionHeader } from "@/ui/studio";

export default function StudioNewWorldPage() {
  return (
    <>
      <StudioSectionHeader
        title="Create World"
        description="Create a top-level universe that will contain books."
      />
      <form className="studio-form" action={createWorldAction}>
        <label>
          Slug
          <input name="slug" placeholder="world-slug" required />
        </label>
        <label>
          Title
          <input name="title" placeholder="World title" required />
        </label>
        <label>
          Description
          <textarea name="description" rows={4} />
        </label>
        <label>
          Status
          <select name="status" defaultValue="draft">
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
            placeholder='{"theme":"mystery"}'
          />
        </label>
        <button type="submit">Create World</button>
      </form>
    </>
  );
}
