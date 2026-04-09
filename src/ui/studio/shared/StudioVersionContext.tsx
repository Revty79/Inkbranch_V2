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
        <label htmlFor="versionId">Active Book Version</label>
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
        <button type="submit">Apply</button>
      </form>
    </section>
  );
}
