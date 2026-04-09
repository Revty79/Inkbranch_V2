import type { BookVersionRecord } from "@/data/mappers";
import { listBookVersions } from "@/data/queries/authoring";

export type VersionContext = {
  readonly versions: BookVersionRecord[];
  readonly selectedVersion: BookVersionRecord | null;
};

export async function getVersionContext(
  versionId: string | undefined
): Promise<VersionContext> {
  const versions = await listBookVersions();

  if (versions.length === 0) {
    return {
      versions,
      selectedVersion: null
    };
  }

  if (!versionId) {
    return {
      versions,
      selectedVersion: versions[0]
    };
  }

  const selectedVersion = versions.find((version) => version.id === versionId);

  return {
    versions,
    selectedVersion: selectedVersion ?? versions[0]
  };
}
