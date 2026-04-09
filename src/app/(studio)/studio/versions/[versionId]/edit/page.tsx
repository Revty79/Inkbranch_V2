import { notFound } from "next/navigation";

import { updateBookVersionAction } from "@/app/(studio)/studio/_actions/versions";
import { getBookVersionById, listBooks } from "@/data/queries/authoring";
import { StudioSectionHeader } from "@/ui/studio";

type StudioEditVersionPageProps = {
  readonly params: Promise<{ versionId: string }>;
};

export default async function StudioEditVersionPage({
  params
}: StudioEditVersionPageProps) {
  const { versionId } = await params;
  const [version, books] = await Promise.all([
    getBookVersionById(versionId),
    listBooks()
  ]);

  if (!version) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={`Edit ${version.versionLabel}`}
        description="Update version labels and status while keeping version ownership explicit."
      />
      <form
        className="studio-form"
        action={updateBookVersionAction.bind(null, version.id)}
      >
        <label>
          Book
          <select name="bookId" defaultValue={version.bookId} required>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Version Label
          <input
            name="versionLabel"
            defaultValue={version.versionLabel}
            required
          />
        </label>
        <label>
          Status
          <select name="status" defaultValue={version.status}>
            <option value="draft">draft</option>
            <option value="test">test</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className="studio-checkbox">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={version.isActive}
          />
          Mark as active version
        </label>
        <label>
          Notes
          <textarea name="notes" rows={4} defaultValue={version.notes ?? ""} />
        </label>
        <button type="submit">Save Version</button>
      </form>
    </>
  );
}
