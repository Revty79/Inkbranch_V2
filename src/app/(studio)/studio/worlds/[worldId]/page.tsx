import Link from "next/link";
import { notFound } from "next/navigation";

import { getWorldById } from "@/data/queries/authoring";
import { StudioSectionHeader } from "@/ui/studio";

type StudioWorldDetailPageProps = {
  readonly params: Promise<{ worldId: string }>;
};

export default async function StudioWorldDetailPage({
  params
}: StudioWorldDetailPageProps) {
  const { worldId } = await params;
  const world = await getWorldById(worldId);

  if (!world) {
    notFound();
  }

  return (
    <>
      <StudioSectionHeader
        title={world.title}
        description="World summary and quick access to editing."
      />
      <div className="studio-detail-panel">
        <p>Slug: {world.slug}</p>
        <p>Status: {world.status}</p>
        <p>{world.description ?? "No description yet."}</p>
        <div className="studio-inline-links">
          <Link href={`/studio/worlds/${world.id}/edit`}>Edit World</Link>
          <Link href="/studio/worlds">Back to Worlds</Link>
        </div>
      </div>
    </>
  );
}
