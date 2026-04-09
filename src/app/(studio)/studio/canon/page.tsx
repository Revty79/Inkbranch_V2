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
          description="Manage canonical entries scoped to an authored book version."
        />
        <StudioEmptyState
          title="No versions available"
          description="Create a version before adding canon entries."
        />
      </>
    );
  }

  const entries = await listCanonEntriesByBookVersionId(selectedVersion.id);

  return (
    <>
      <StudioSectionHeader
        title="Canon"
        description="Create and edit canonical facts that the planner can trust as authored truth."
      />
      <StudioVersionContext
        versions={versions}
        selectedVersionId={selectedVersion.id}
        actionPath="/studio/canon"
      />
      <div className="studio-list-actions">
        <Link href={`/studio/canon/new?versionId=${selectedVersion.id}`}>
          Create Canon Entry
        </Link>
      </div>
      {entries.length === 0 ? (
        <StudioEmptyState
          title="No canon entries in this version"
          description="Add the first canonical entry to ground planner decisions in authored truth."
        />
      ) : (
        <ul className="studio-list-grid">
          {entries.map((entry) => {
            const tags = formatCanonTags(entry.tags);

            return (
              <li key={entry.id}>
                <h3>{entry.entryType}</h3>
                <p>Subject: {entry.subjectType}</p>
                <p>Visibility: {entry.visibility}</p>
                <p>Importance: {entry.importance}</p>
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
