import { getPerspectiveById } from "@/data/queries/authoring";
import {
  getChronicleById,
  getChronicleStateByChronicleId,
  getPerspectiveRunsByChronicleId
} from "@/data/queries/runtime";
import type {
  ChronicleRecord,
  ChronicleStateRecord,
  PerspectiveRunRecord
} from "@/data/mappers";

export interface ChronicleInspectorContext {
  readonly chronicle: ChronicleRecord;
  readonly chronicleState: ChronicleStateRecord | null;
  readonly perspectiveRuns: PerspectiveRunRecord[];
  readonly perspectiveNameById: Map<string, string>;
}

export async function getChronicleInspectorContext(
  chronicleId: string
): Promise<ChronicleInspectorContext | null> {
  const chronicle = await getChronicleById(chronicleId);

  if (!chronicle) {
    return null;
  }

  const [chronicleState, perspectiveRuns] = await Promise.all([
    getChronicleStateByChronicleId(chronicle.id),
    getPerspectiveRunsByChronicleId(chronicle.id)
  ]);
  const perspectiveIds = Array.from(
    new Set(perspectiveRuns.map((run) => run.perspectiveId))
  );
  const perspectiveNameById = new Map(
    await Promise.all(
      perspectiveIds.map(async (perspectiveId) => {
        const perspective = await getPerspectiveById(perspectiveId);
        return [perspectiveId, perspective?.name ?? perspectiveId] as const;
      })
    )
  );

  return {
    chronicle,
    chronicleState,
    perspectiveRuns,
    perspectiveNameById
  };
}
