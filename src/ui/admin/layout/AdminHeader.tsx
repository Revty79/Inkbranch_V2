interface AdminHeaderProps {
  readonly title: string;
  readonly subtitle: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
