import type {
  PlanningMilestoneContext,
  PlanningMilestoneEntry
} from "@/core/planner/contracts";

export interface MilestoneSelection {
  readonly targetMilestone: PlanningMilestoneEntry | null;
  readonly unresolvedMilestones: PlanningMilestoneEntry[];
  readonly completedMilestones: PlanningMilestoneEntry[];
  readonly notes: string[];
}

function milestoneSortValue(
  entry: PlanningMilestoneEntry
): [number, number, number, string, string] {
  const statusRank =
    entry.status === "available"
      ? 0
      : entry.status === "unseen"
        ? 1
        : entry.status === "blocked"
          ? 2
          : 3;

  return [
    statusRank,
    entry.required ? 0 : 1,
    entry.sequenceHint ?? Number.MAX_SAFE_INTEGER,
    entry.arcKey,
    entry.milestoneKey
  ];
}

function compareMilestones(
  a: PlanningMilestoneEntry,
  b: PlanningMilestoneEntry
): number {
  const left = milestoneSortValue(a);
  const right = milestoneSortValue(b);

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] < right[index]) {
      return -1;
    }

    if (left[index] > right[index]) {
      return 1;
    }
  }

  if (a.priority !== b.priority) {
    return b.priority - a.priority;
  }

  return 0;
}

export function selectTargetMilestone(
  context: PlanningMilestoneContext
): MilestoneSelection {
  const completedMilestones = context.milestones.filter(
    (milestone) => milestone.status === "completed"
  );

  const unresolvedMilestones = context.milestones
    .filter((milestone) => milestone.status !== "completed")
    .sort(compareMilestones);

  const targetMilestone =
    unresolvedMilestones.find((milestone) => milestone.status !== "blocked") ??
    unresolvedMilestones[0] ??
    null;

  const notes: string[] = [];

  if (!targetMilestone) {
    notes.push("No unresolved milestones were available for targeting.");
  } else {
    notes.push(
      `Targeting milestone ${targetMilestone.arcKey}/${targetMilestone.milestoneKey}.`
    );
  }

  return {
    targetMilestone,
    unresolvedMilestones,
    completedMilestones,
    notes
  };
}
