import Link from "next/link";

import { listWorlds } from "@/data/queries/authoring";
import { StudioEmptyState, StudioSectionHeader } from "@/ui/studio";

export default async function StudioWorldsPage() {
  const worlds = await listWorlds();

  return (
    <>
      <StudioSectionHeader
        title="Worlds"
        description="Create the story worlds that hold your books."
      />
      <section className="studio-flow-note">
        <p>
          Start here. A world captures the broad setting and context for one or
          more books.
        </p>
      </section>
      <div className="studio-list-actions">
        <Link href="/studio/worlds/new">Create World</Link>
        <Link href="/studio/books">Go to Books</Link>
      </div>
      {worlds.length === 0 ? (
        <StudioEmptyState
          title="No worlds yet"
          description="Create your first world, then add a book inside it."
          actionHref="/studio/worlds/new"
          actionLabel="Create your first world"
        />
      ) : (
        <ul className="studio-list-grid">
          {worlds.map((world) => (
            <li key={world.id}>
              <h3>{world.title}</h3>
              <p>{world.description ?? "No description yet."}</p>
              <p>URL key: {world.slug}</p>
              <p>Draft status: {world.status}</p>
              <div className="studio-inline-links">
                <Link href={`/studio/worlds/${world.id}`}>Open world</Link>
                <Link href={`/studio/worlds/${world.id}/edit`}>Edit details</Link>
                <Link href="/studio/books">Manage books</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
