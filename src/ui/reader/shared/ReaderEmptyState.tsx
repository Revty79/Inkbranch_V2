import type { ReactNode } from "react";

interface ReaderEmptyStateProps {
  readonly title: string;
  readonly message: string;
  readonly action?: ReactNode;
}

export function ReaderEmptyState({
  title,
  message,
  action
}: ReaderEmptyStateProps) {
  return (
    <section className="reader-empty-state">
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="reader-empty-action">{action}</div> : null}
    </section>
  );
}
