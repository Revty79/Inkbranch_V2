import { InspectorEmptyState } from "../shared/InspectorEmptyState";

import { EventLogEntry } from "./EventLogEntry";

export interface EventLogListItem {
  readonly eventId: string;
  readonly eventType: string;
  readonly eventTs: string;
  readonly causedByType: string | null;
  readonly causedById: string | null;
  readonly payload: Record<string, unknown>;
}

interface EventLogListProps {
  readonly entries: EventLogListItem[];
}

export function EventLogList({ entries }: EventLogListProps) {
  if (entries.length === 0) {
    return (
      <InspectorEmptyState
        title="No event log entries"
        message="No runtime events have been appended for this chronicle yet."
      />
    );
  }

  return (
    <section className="admin-grid">
      {entries.map((entry) => (
        <EventLogEntry
          key={entry.eventId}
          eventId={entry.eventId}
          eventType={entry.eventType}
          eventTs={entry.eventTs}
          causedByType={entry.causedByType}
          causedById={entry.causedById}
          payload={entry.payload}
        />
      ))}
    </section>
  );
}
