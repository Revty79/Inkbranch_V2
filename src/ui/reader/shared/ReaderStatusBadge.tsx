type ReaderStatusTone =
  | "active"
  | "paused"
  | "completed"
  | "abandoned"
  | "planned";

interface ReaderStatusBadgeProps {
  readonly label: string;
  readonly tone?: string;
}

function normalizeTone(value: string | undefined): ReaderStatusTone {
  if (
    value === "active" ||
    value === "paused" ||
    value === "completed" ||
    value === "abandoned" ||
    value === "planned"
  ) {
    return value;
  }

  return "planned";
}

export function ReaderStatusBadge({ label, tone }: ReaderStatusBadgeProps) {
  const normalizedTone = normalizeTone(tone);

  return (
    <span className={`reader-status reader-status-${normalizedTone}`}>
      {label}
    </span>
  );
}
