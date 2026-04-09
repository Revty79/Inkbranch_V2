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
      title="Scene route error"
      message={
        error.message ||
        "The current scene route failed to load. You can retry safely."
      }
      action={
        <button type="button" onClick={reset} className="reader-inline-button">
          Retry scene route
        </button>
      }
    />
  );
}
