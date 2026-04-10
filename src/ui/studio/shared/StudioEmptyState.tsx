import Link from "next/link";

type StudioEmptyStateProps = {
  readonly title: string;
  readonly description: string;
  readonly actionHref?: string;
  readonly actionLabel?: string;
};

export function StudioEmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: StudioEmptyStateProps) {
  return (
    <section className="studio-empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionHref && actionLabel ? (
        <p className="studio-empty-state-action">
          <Link href={actionHref}>{actionLabel}</Link>
        </p>
      ) : null}
    </section>
  );
}
