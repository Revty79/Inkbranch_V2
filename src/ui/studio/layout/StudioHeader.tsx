type StudioHeaderProps = {
  readonly title: string;
  readonly subtitle: string;
};

export function StudioHeader({ title, subtitle }: StudioHeaderProps) {
  return (
    <div className="studio-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
