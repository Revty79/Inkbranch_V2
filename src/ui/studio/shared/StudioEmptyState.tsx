type StudioEmptyStateProps = {
  readonly title: string;
  readonly description: string;
};

export function StudioEmptyState({
  title,
  description
}: StudioEmptyStateProps) {
  return (
    <section className="studio-empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  );
}
