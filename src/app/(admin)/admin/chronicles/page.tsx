import { ChronicleList } from "@/ui/admin";
import {
  getChronicleStateByChronicleId,
  listChronicles
} from "@/data/queries/runtime";

export default async function AdminChroniclesPage() {
  const chronicles = await listChronicles(200);
  const stateEntries = await Promise.all(
    chronicles.map(async (chronicle) => {
      const state = await getChronicleStateByChronicleId(chronicle.id);

      return [chronicle.id, state] as const;
    })
  );
  const stateByChronicleId = new Map<
    string,
    Awaited<ReturnType<typeof getChronicleStateByChronicleId>>
  >(stateEntries);

  return (
    <section className="admin-route">
      <h2>Chronicles</h2>
      <p>
        Chronicle-centered inspection starts here. Select a chronicle to inspect
        state, scenes, events, knowledge, commits, and generation markers.
      </p>
      <ChronicleList
        chronicles={chronicles.map((chronicle) => ({
          chronicleId: chronicle.id,
          status: chronicle.status,
          bookVersionId: chronicle.bookVersionId,
          readerId: chronicle.readerId,
          startedAt: chronicle.startedAt,
          completedAt: chronicle.completedAt,
          currentSceneInstanceId:
            stateByChronicleId.get(chronicle.id)?.currentSceneInstanceId ?? null
        }))}
      />
    </section>
  );
}
