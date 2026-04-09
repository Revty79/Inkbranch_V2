import type {
  RuntimeCommitEventInput,
  RuntimeCommitEventRecord,
  RuntimeCommitStore
} from "@/core/runtime/contracts";

export async function appendRuntimeCommitEvent(
  store: RuntimeCommitStore,
  input: RuntimeCommitEventInput
): Promise<RuntimeCommitEventRecord> {
  return store.appendRuntimeEvent({
    ...input,
    eventTs: input.eventTs ?? new Date().toISOString()
  });
}
