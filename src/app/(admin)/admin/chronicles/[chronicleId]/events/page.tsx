import { notFound } from "next/navigation";

import { ChronicleInspectorNav, EventLogList } from "@/ui/admin";
import { getEventLogEntriesByChronicleId } from "@/data/queries/runtime";

import { getChronicleInspectorContext } from "../_lib/context";

interface AdminChronicleEventsPageProps {
  readonly params: Promise<{
    chronicleId: string;
  }>;
}

export default async function AdminChronicleEventsPage({
  params
}: AdminChronicleEventsPageProps) {
  const { chronicleId } = await params;
  const context = await getChronicleInspectorContext(chronicleId);

  if (!context) {
    notFound();
  }

  const events = await getEventLogEntriesByChronicleId(context.chronicle.id);

  return (
    <section className="admin-route">
      <h2>Event log</h2>
      <ChronicleInspectorNav chronicleId={context.chronicle.id} />
      <EventLogList
        entries={[...events].reverse().map((event) => ({
          eventId: event.id,
          eventType: event.eventType,
          eventTs: event.eventTs,
          causedByType: event.causedByType,
          causedById: event.causedById,
          payload: event.payload
        }))}
      />
    </section>
  );
}
