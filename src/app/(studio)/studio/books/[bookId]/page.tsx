import Link from "next/link";
import { notFound } from "next/navigation";

import { getBookById, getWorldById } from "@/data/queries/authoring";
import { StudioSectionHeader } from "@/ui/studio";

type StudioBookDetailPageProps = {
  readonly params: Promise<{ bookId: string }>;
};

export default async function StudioBookDetailPage({
  params
}: StudioBookDetailPageProps) {
  const { bookId } = await params;
  const book = await getBookById(bookId);

  if (!book) {
    notFound();
  }
  const world = await getWorldById(book.worldId);

  return (
    <>
      <StudioSectionHeader
        title={book.title}
        description="Book summary and quick links into version-centered authoring."
      />
      <div className="studio-detail-panel">
        <p>Slug: {book.slug}</p>
        <p>World: {world?.title ?? book.worldId}</p>
        <p>Status: {book.status}</p>
        <p>{book.premise ?? "No premise yet."}</p>
        <div className="studio-inline-links">
          <Link href={`/studio/books/${book.id}/edit`}>Edit Book</Link>
          <Link href={`/studio/versions?bookId=${book.id}`}>View Versions</Link>
          <Link href="/studio/books">Back to Books</Link>
        </div>
      </div>
    </>
  );
}
