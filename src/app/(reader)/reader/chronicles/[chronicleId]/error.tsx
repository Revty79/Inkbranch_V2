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
      title="Could not load this chronicle"
      message={
        error.message ||
        "The chronicle summary could not load right now. You can safely try again."
      }
      action={
        <button type="button" onClick={reset} className="reader-inline-button">
          Retry chronicle
        </button>
      }
    />
  );
}
