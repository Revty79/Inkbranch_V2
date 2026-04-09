type StudioStatusBadgeProps = {
  readonly status: "planned" | "ready";
};

export function StudioStatusBadge({ status }: StudioStatusBadgeProps) {
  return (
    <span className={`studio-status studio-status-${status}`}>{status}</span>
  );
}
