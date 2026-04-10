import type { BookVersionRecord } from "@/data/mappers";

type StudioVersionContextProps = {
  readonly versions: BookVersionRecord[];
  readonly selectedVersionId: string | null;
  readonly actionPath: string;
};

export function StudioVersionContext({
  versions,
  selectedVersionId,
  actionPath
}: StudioVersionContextProps) {
  return (
    <section className="studio-version-context">
      <form method="get" action={actionPath}>
        <label htmlFor="versionId">Working version</label>
        <select
          id="versionId"
          name="versionId"
          defaultValue={selectedVersionId ?? ""}
        >
          {versions.length === 0 ? (
            <option value="">No versions available</option>
          ) : null}
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.versionLabel} ({version.status})
              {version.isActive ? " * active" : ""}
            </option>
          ))}
        </select>
        <p className="studio-version-context-note">
          Everything on this page is saved to the selected version.
        </p>
        <button type="submit">Switch version</button>
      </form>
    </section>
  );
}
