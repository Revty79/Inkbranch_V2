interface ReaderHeaderProps {
  readonly title?: string;
  readonly subtitle?: string;
}

export function ReaderHeader({
  title = "Inkbranch Reader",
  subtitle = "Step into a chronicle, follow the current perspective, and keep the story moving."
}: ReaderHeaderProps) {
  return (
    <header className="reader-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
