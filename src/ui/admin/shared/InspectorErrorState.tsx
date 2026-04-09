import type { ReactNode } from "react";

interface InspectorErrorStateProps {
  readonly title: string;
  readonly message: string;
  readonly action?: ReactNode;
}

export function InspectorErrorState({
  title,
  message,
  action
}: InspectorErrorStateProps) {
  return (
    <section className="admin-error-state">
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="admin-error-action">{action}</div> : null}
    </section>
  );
}
