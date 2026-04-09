import Link from "next/link";

import { createBookVersionAction } from "@/app/(studio)/studio/_actions/versions";
import { listBooks } from "@/data/queries/authoring";
import { StudioEmptyState, StudioSectionHeader } from "@/ui/studio";

export default async function StudioNewVersionPage() {
  const books = await listBooks();

  if (books.length === 0) {
    return (
      <>
        <StudioSectionHeader
          title="Create Version"
          description="Book versions require an existing book."
        />
        <StudioEmptyState
          title="No books available"
          description="Create a book first, then create a version."
        />
        <div className="studio-inline-links">
          <Link href="/studio/books/new">Create Book</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <StudioSectionHeader
        title="Create Version"
        description="Create a version record that anchors version-owned authoring inputs."
      />
      <form className="studio-form" action={createBookVersionAction}>
        <label>
          Book
          <select name="bookId" required>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Version Label
          <input name="versionLabel" placeholder="v1-draft" required />
        </label>
        <label>
          Status
          <select name="status" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="test">test</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className="studio-checkbox">
          <input type="checkbox" name="isActive" />
          Mark as active version
        </label>
        <label>
          Notes
          <textarea name="notes" rows={4} />
        </label>
        <button type="submit">Create Version</button>
      </form>
    </>
  );
}
