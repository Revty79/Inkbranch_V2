import Link from "next/link";
import { notFound } from "next/navigation";

import { getBookById, getBookVersionById } from "@/data/queries/authoring";
import { StudioSectionHeader } from "@/ui/studio";

type StudioVersionDetailPageProps = {
  readonly params: Promise<{ versionId: string }>;
};

export default async function StudioVersionDetailPage({
  params
}: StudioVersionDetailPageProps) {
  const { versionId } = await params;
  const version = await getBookVersionById(versionId);

  if (!version) {
    notFound();
  }
  const book = await getBookById(version.bookId);

  return (
    <>
      <StudioSectionHeader
        title={`Version ${version.versionLabel}`}
        description="Version-centered authoring anchor for canon, entities, and planning rules."
      />
      <div className="studio-detail-panel">
        <p>Status: {version.status}</p>
        <p>Book: {book?.title ?? version.bookId}</p>
        <p>{version.isActive ? "Active version" : "Inactive version"}</p>
        <p>{version.notes ?? "No notes yet."}</p>
        <div className="studio-inline-links">
          <Link href={`/studio/versions/${version.id}/edit`}>Edit Version</Link>
          <Link href={`/studio/canon?versionId=${version.id}`}>Open Canon</Link>
          <Link href={`/studio/entities?versionId=${version.id}`}>
            Open Entities
          </Link>
          <Link href={`/studio/planning?versionId=${version.id}`}>
            Open Planning
          </Link>
        </div>
      </div>
    </>
  );
}
