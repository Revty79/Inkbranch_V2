import type { MetadataRecord } from "@/core/domain/types";

import type { PlanningContext } from "./context";
import type { PlannerResult } from "./result";

export interface PlanNextSceneInput {
  readonly context: PlanningContext;
  readonly metadata?: MetadataRecord;
}

export type PlanNextSceneOutput = PlannerResult;

export interface Planner {
  planNextScene(input: PlanNextSceneInput): Promise<PlanNextSceneOutput>;
}

export type PlannerService = Planner;
