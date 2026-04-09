import { notFound } from "next/navigation";

import { updateBookAction } from "@/app/(studio)/studio/_actions/books";
import { getBookById, listWorlds } from "@/data/queries/authoring";
import { StudioSectionHeader } from "@/ui/studio";

type StudioEditBookPageProps = {
  readonly params: Promise<{ bookId: string }>;
};

export default async function StudioEditBookPage({
  params
}: StudioEditBookPageProps) {
  const { bookId } = await params;
  const [book, worlds] = await Promise.all([getBookById(bookId), listWorlds()]);

  if (!book) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${book.title}`}
        description="Update book metadata and world association."
      />
      <form
        className="studio-form"
        action={updateBookAction.bind(null, book.id)}
      >
        <label>
          World
          <select name="worldId" defaultValue={book.worldId} required>
            {worlds.map((world) => (
              <option key={world.id} value={world.id}>
                {world.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={book.slug} required />
        </label>
        <label>
          Title
          <input name="title" defaultValue={book.title} required />
        </label>
        <label>
          Premise
          <textarea name="premise" rows={4} defaultValue={book.premise ?? ""} />
        </label>
        <label>
          Default Tone
          <input name="defaultTone" defaultValue={book.defaultTone ?? ""} />
        </label>
        <label>
          Status
          <select name="status" defaultValue={book.status}>
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
            defaultValue={JSON.stringify(book.metadata ?? {}, null, 2)}
          />
        </label>
        <button type="submit">Save Book</button>
      </form>
    </>
  );
}
