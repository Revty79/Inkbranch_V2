import type { ReactNode } from "react";

interface InspectorEmptyStateProps {
  readonly title: string;
  readonly message: string;
  readonly action?: ReactNode;
}

export function InspectorEmptyState({
  title,
  message,
  action
}: InspectorEmptyStateProps) {
  return (
    <section className="admin-empty-state">
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="admin-empty-action">{action}</div> : null}
    </section>
  );
}
