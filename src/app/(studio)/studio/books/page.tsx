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
        description="Create books inside a world and define each book's premise."
      />
      <section className="studio-flow-note">
        <p>
          Once a book exists, create a version so you can begin canon,
          entities, and planning work.
        </p>
      </section>
      <div className="studio-list-actions">
        <Link href="/studio/books/new">Create Book</Link>
        <Link href="/studio/versions">Go to Versions</Link>
      </div>
      {books.length === 0 ? (
        <StudioEmptyState
          title="No books yet"
          description="Create your first book after setting up a world."
          actionHref="/studio/books/new"
          actionLabel="Create your first book"
        />
      ) : (
        <ul className="studio-list-grid">
          {books.map((book) => (
            <li key={book.id}>
              <h3>{book.title}</h3>
              <p>{book.premise ?? "No premise yet."}</p>
              <p>URL key: {book.slug}</p>
              <p>World: {worldById.get(book.worldId)?.title ?? book.worldId}</p>
              <p>Draft status: {book.status}</p>
              <div className="studio-inline-links">
                <Link href={`/studio/books/${book.id}`}>Open book</Link>
                <Link href={`/studio/books/${book.id}/edit`}>Edit details</Link>
                <Link href={`/studio/versions?bookId=${book.id}`}>
                  View versions
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
