import { InspectorMetaTable } from "../shared/InspectorMetaTable";

interface EventLogEntryProps {
  readonly eventId: string;
  readonly eventType: string;
  readonly eventTs: string;
  readonly causedByType: string | null;
  readonly causedById: string | null;
  readonly payload: Record<string, unknown>;
}

export function EventLogEntry({
  eventId,
  eventType,
  eventTs,
  causedByType,
  causedById,
  payload
}: EventLogEntryProps) {
  return (
    <article className="admin-panel">
      <h3>{eventType}</h3>
      <InspectorMetaTable
        rows={[
          { label: "Event id", value: eventId },
          { label: "Timestamp", value: eventTs },
          { label: "Caused by type", value: causedByType ?? "n/a" },
          { label: "Caused by id", value: causedById ?? "n/a" }
        ]}
      />
      <details className="admin-json-detail">
        <summary>Payload detail</summary>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </details>
    </article>
  );
}
