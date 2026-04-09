interface ReaderHeaderProps {
  readonly title?: string;
  readonly subtitle?: string;
}

export function ReaderHeader({
  title = "Inkbranch Reader",
  subtitle = "Chronicle-centered reading surface for committed runtime state."
}: ReaderHeaderProps) {
  return (
    <header className="reader-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
