"use client";

import { ReaderErrorState } from "@/ui/reader";

interface ReaderChronicleErrorProps {
  readonly error: Error;
  readonly reset: () => void;
}

export default function ReaderChronicleError({
  error,
  reset
}: ReaderChronicleErrorProps) {
  return (
    <ReaderErrorState
      title="Chronicle route error"
      message={
        error.message ||
        "The chronicle route failed to load. You can retry safely."
      }
      action={
        <button type="button" onClick={reset} className="reader-inline-button">
          Retry chronicle route
        </button>
      }
    />
  );
}
