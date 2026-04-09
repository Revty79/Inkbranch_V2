import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface ChoiceCardProps {
  readonly choiceId: string;
  readonly label: string;
  readonly intentLabel: string;
  readonly availability: "enabled" | "disabled";
}

export function ChoiceCard({
  choiceId,
  label,
  intentLabel,
  availability
}: ChoiceCardProps) {
  const enabled = availability === "enabled";

  return (
    <article className="reader-choice-card">
      <div className="reader-choice-card-top">
        <h4>{label}</h4>
        <ReaderStatusBadge
          label={enabled ? "enabled" : "disabled"}
          tone={enabled ? "active" : "abandoned"}
        />
      </div>
      <p>
        Intent: <strong>{intentLabel}</strong>
      </p>
      {enabled ? null : (
        <p>
          This option is currently unavailable for the active scene context.
        </p>
      )}
      <p className="reader-choice-id">Ref: {choiceId}</p>
    </article>
  );
}
