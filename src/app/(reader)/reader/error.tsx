"use client";

import { ReaderErrorState } from "@/ui/reader";

interface ReaderRouteErrorProps {
  readonly error: Error;
  readonly reset: () => void;
}

export default function ReaderRouteError({
  error,
  reset
}: ReaderRouteErrorProps) {
  return (
    <ReaderErrorState
      title="Reader shell error"
      message={
        error.message ||
        "The reader shell failed to load this route. You can retry safely."
      }
      action={
        <button type="button" onClick={reset} className="reader-inline-button">
          Retry route
        </button>
      }
    />
  );
}
