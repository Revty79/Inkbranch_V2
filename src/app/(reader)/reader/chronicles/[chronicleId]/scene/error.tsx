"use client";

import { ReaderErrorState } from "@/ui/reader";

interface ReaderSceneErrorProps {
  readonly error: Error;
  readonly reset: () => void;
}

export default function ReaderSceneError({
  error,
  reset
}: ReaderSceneErrorProps) {
  return (
    <ReaderErrorState
      title="Could not load this chapter"
      message={
        error.message || "This chapter failed to load. You can safely try again."
      }
      action={
        <button type="button" onClick={reset} className="reader-inline-button">
          Retry chapter
        </button>
      }
    />
  );
}
