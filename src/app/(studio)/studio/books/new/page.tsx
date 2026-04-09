import Link from "next/link";

import { createBookAction } from "@/app/(studio)/studio/_actions/books";
import { listWorlds } from "@/data/queries/authoring";
import { StudioEmptyState, StudioSectionHeader } from "@/ui/studio";

export default async function StudioNewBookPage() {
  const worlds = await listWorlds();

  if (worlds.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Book"
          description="Books require an existing world."
        />
        <StudioEmptyState
          title="No worlds available"
          description="Create a world first, then return to create a book."
        />
        <div className="studio-inline-links">
          <Link href="/studio/worlds/new">Create World</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <StudioSectionHeader
        title="Create Book"
        description="Create a book inside an existing world."
      />
      <form className="studio-form" action={createBookAction}>
        <label>
          World
          <select name="worldId" required>
            {worlds.map((world) => (
              <option key={world.id} value={world.id}>
                {world.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Slug
          <input name="slug" required />
        </label>
        <label>
          Title
          <input name="title" required />
        </label>
        <label>
          Premise
          <textarea name="premise" rows={4} />
        </label>
        <label>
          Default Tone
          <input name="defaultTone" />
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
            placeholder='{"audience":"adult"}'
          />
        </label>
        <button type="submit">Create Book</button>
      </form>
    </>
  );
}
