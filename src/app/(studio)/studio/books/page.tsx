import Link from "next/link";

import { listBooks, listWorlds } from "@/data/queries/authoring";
import { StudioEmptyState, StudioSectionHeader } from "@/ui/studio";

export default async function StudioBooksPage() {
  const [books, worlds] = await Promise.all([listBooks(), listWorlds()]);
  const worldById = new Map(worlds.map((world) => [world.id, world]));

  return (
    <>
      <StudioSectionHeader
        title="Books"
        description="Manage books within worlds and their high-level authoring metadata."
      />
      <div className="studio-list-actions">
        <Link href="/studio/books/new">Create Book</Link>
      </div>
      {books.length === 0 ? (
        <StudioEmptyState
          title="No books yet"
          description="Create a book after defining at least one world."
        />
      ) : (
        <ul className="studio-list-grid">
          {books.map((book) => (
            <li key={book.id}>
              <h3>{book.title}</h3>
              <p>{book.premise ?? "No premise yet."}</p>
              <p>Slug: {book.slug}</p>
              <p>World: {worldById.get(book.worldId)?.title ?? book.worldId}</p>
              <p>Status: {book.status}</p>
              <div className="studio-inline-links">
                <Link href={`/studio/books/${book.id}`}>View</Link>
                <Link href={`/studio/books/${book.id}/edit`}>Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
