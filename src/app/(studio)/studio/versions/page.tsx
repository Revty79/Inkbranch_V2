import Link from "next/link";

import { listBooks, listBookVersions } from "@/data/queries/authoring";
import { StudioEmptyState, StudioSectionHeader } from "@/ui/studio";

type StudioVersionsPageProps = {
  readonly searchParams: Promise<{ bookId?: string }>;
};

export default async function StudioVersionsPage({
  searchParams
}: StudioVersionsPageProps) {
  const { bookId } = await searchParams;
  const [versions, books] = await Promise.all([
    listBookVersions(),
    listBooks()
  ]);
  const filteredVersions = bookId
    ? versions.filter((version) => version.bookId === bookId)
    : versions;
  const bookById = new Map(books.map((book) => [book.id, book]));

  return (
    <>
      <StudioSectionHeader
        title="Versions"
        description="Create working versions for each book and author against the right draft."
      />
      <section className="studio-flow-note">
        <p>
          Versions are your authoring workspaces. After creating one, use it in
          Canon, Entities, and Planning.
        </p>
      </section>
      <div className="studio-list-actions">
        <Link href="/studio/versions/new">Create Version</Link>
        <Link href="/studio/canon">Go to Canon</Link>
      </div>
      {filteredVersions.length === 0 ? (
        <StudioEmptyState
          title="No versions yet"
          description="Create a version before writing canon, entities, or planning rules."
          actionHref="/studio/versions/new"
          actionLabel="Create your first version"
        />
      ) : (
        <ul className="studio-list-grid">
          {filteredVersions.map((version) => (
            <li key={version.id}>
              <h3>{version.versionLabel}</h3>
              <p>
                Book: {bookById.get(version.bookId)?.title ?? version.bookId}
              </p>
              <p>Version status: {version.status}</p>
              <p>{version.isActive ? "Marked active" : "Not active"}</p>
              <div className="studio-inline-links">
                <Link href={`/studio/versions/${version.id}`}>Open version</Link>
                <Link href={`/studio/versions/${version.id}/edit`}>
                  Edit details
                </Link>
                <Link href={`/studio/canon?versionId=${version.id}`}>
                  Write canon
                </Link>
                <Link href={`/studio/entities?versionId=${version.id}`}>
                  Manage entities
                </Link>
                <Link href={`/studio/planning?versionId=${version.id}`}>
                  Manage planning
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
