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
        description="Manage draft, test, and published book versions that anchor authored truth."
      />
      <div className="studio-list-actions">
        <Link href="/studio/versions/new">Create Version</Link>
      </div>
      {filteredVersions.length === 0 ? (
        <StudioEmptyState
          title="No versions yet"
          description="Create a version to anchor canon, entities, and planning rules."
        />
      ) : (
        <ul className="studio-list-grid">
          {filteredVersions.map((version) => (
            <li key={version.id}>
              <h3>{version.versionLabel}</h3>
              <p>Status: {version.status}</p>
              <p>
                Book: {bookById.get(version.bookId)?.title ?? version.bookId}
              </p>
              <p>{version.isActive ? "Active version" : "Inactive version"}</p>
              <div className="studio-inline-links">
                <Link href={`/studio/versions/${version.id}`}>View</Link>
                <Link href={`/studio/versions/${version.id}/edit`}>Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
