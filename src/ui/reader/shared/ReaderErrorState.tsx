import type { ReactNode } from "react";

interface ReaderErrorStateProps {
  readonly title?: string;
  readonly message: string;
  readonly action?: ReactNode;
}

export function ReaderErrorState({
  title = "Reader unavailable",
  message,
  action
}: ReaderErrorStateProps) {
  return (
    <section className="reader-error-state" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="reader-error-action">{action}</div> : null}
    </section>
  );
}
