interface PerspectiveBadgeProps {
  readonly perspectiveId: string;
  readonly label?: string;
}

export function PerspectiveBadge({
  perspectiveId,
  label
}: PerspectiveBadgeProps) {
  return (
    <span className="reader-perspective-badge">
      {label ? `${label}: ` : "Perspective: "}
      <strong>{perspectiveId}</strong>
    </span>
  );
}
