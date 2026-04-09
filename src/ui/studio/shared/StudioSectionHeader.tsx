type StudioSectionHeaderProps = {
  readonly title: string;
  readonly description: string;
};

export function StudioSectionHeader({
  title,
  description
}: StudioSectionHeaderProps) {
  return (
    <header className="studio-section-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}
