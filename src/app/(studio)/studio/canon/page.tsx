import Link from "next/link";

import { getVersionContext } from "@/app/(studio)/studio/_lib/version-context";
import { listCanonEntriesByBookVersionId } from "@/data/queries/authoring";
import {
  StudioEmptyState,
  StudioSectionHeader,
  StudioVersionContext
} from "@/ui/studio";

type StudioCanonPageProps = {
  readonly searchParams: Promise<{ versionId?: string }>;
};

function formatCanonTags(tags: Record<string, unknown>): string {
  const rawTags = tags["tags"];
  if (!Array.isArray(rawTags)) {
    return "";
  }

  const values = rawTags.filter(
    (value): value is string => typeof value === "string"
  );
  return values.join(", ");
}

export default async function StudioCanonPage({
  searchParams
}: StudioCanonPageProps) {
  const { versionId } = await searchParams;
  const { versions, selectedVersion } = await getVersionContext(versionId);

  if (!selectedVersion) {
    return (
      <>
        <StudioSectionHeader
          title="Canon"
          description="Write the facts this version must stay true to."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version first, then add canon entries."
          actionHref="/studio/versions/new"
          actionLabel="Create a version"
        />
      </>
    );
  }

  const entries = await listCanonEntriesByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Canon"
        description="Capture story facts for the selected version so continuity stays consistent."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/canon"
      />
      <section className="studio-flow-note">
        <p>
          Use canon for stable truths. Then shape who readers follow in{" "}
          <Link href={`/studio/entities?versionId=${selectedVersion.id}`}>
            Entities
          </Link>{" "}
          and what story pressure applies in{" "}
          <Link href={`/studio/planning?versionId=${selectedVersion.id}`}>
            Planning
          </Link>
          .
        </p>
      </section>
      <div className="studio-list-actions">
        <Link href={`/studio/canon/new?versionId=${selectedVersion.id}`}>
          Create Canon Entry
        </Link>
        <Link href={`/studio/entities?versionId=${selectedVersion.id}`}>
          Go to Entities
        </Link>
      </div>
      {entries.length === 0 ? (
        <StudioEmptyState
          title="No canon entries in this version"
          description="Add your first canon entry so this version has clear story truth."
          actionHref={`/studio/canon/new?versionId=${selectedVersion.id}`}
          actionLabel="Create your first canon entry"
        />
      ) : (
        <ul className="studio-list-grid">
          {entries.map((entry) => {
            const tags = formatCanonTags(entry.tags);

            return (
              <li key={entry.id}>
                <h3>{entry.entryType}</h3>
                <p>Applies to: {entry.subjectType}</p>
                <p>Reader visibility: {entry.visibility}</p>
                <p>Story weight: {entry.importance}</p>
                <p>{entry.canonicalText}</p>
                <p>{tags.length > 0 ? `Tags: ${tags}` : "No tags."}</p>
                <div className="studio-inline-links">
                  <Link
                    href={`/studio/canon/${entry.id}/edit?versionId=${selectedVersion.id}`}
                  >
                    Edit
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
