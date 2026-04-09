import Link from "next/link";

import { listWorlds } from "@/data/queries/authoring";
import { StudioEmptyState, StudioSectionHeader } from "@/ui/studio";

export default async function StudioWorldsPage() {
  const worlds = await listWorlds();

  return (
    <>
      <StudioSectionHeader
        title="Worlds"
        description="Manage top-level universes that scope books and authoring context."
      />
      <div className="studio-list-actions">
        <Link href="/studio/worlds/new">Create World</Link>
      </div>
      {worlds.length === 0 ? (
        <StudioEmptyState
          title="No worlds yet"
          description="Create a world to start the authoring hierarchy."
        />
      ) : (
        <ul className="studio-list-grid">
          {worlds.map((world) => (
            <li key={world.id}>
              <h3>{world.title}</h3>
              <p>{world.description ?? "No description yet."}</p>
              <p>Slug: {world.slug}</p>
              <p>Status: {world.status}</p>
              <div className="studio-inline-links">
                <Link href={`/studio/worlds/${world.id}`}>View</Link>
                <Link href={`/studio/worlds/${world.id}/edit`}>Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
