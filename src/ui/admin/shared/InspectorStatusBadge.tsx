type InspectorStatusTone =
  | "active"
  | "paused"
  | "completed"
  | "abandoned"
  | "planned"
  | "resolved"
  | "fallback"
  | "error";

interface InspectorStatusBadgeProps {
  readonly label: string;
  readonly tone?: string;
}

function normalizeTone(value: string | undefined): InspectorStatusTone {
  if (
    value === "active" ||
    value === "paused" ||
    value === "completed" ||
    value === "abandoned" ||
    value === "planned" ||
    value === "resolved" ||
    value === "fallback" ||
    value === "error"
  ) {
    return value;
  }

  return "planned";
}

export function InspectorStatusBadge({
  label,
  tone
}: InspectorStatusBadgeProps) {
  const normalizedTone = normalizeTone(tone);

  return (
    <span className={`admin-status admin-status-${normalizedTone}`}>
      {label}
    </span>
  );
}
