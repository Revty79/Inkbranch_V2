import { ReaderStatusBadge } from "@/ui/reader/shared/ReaderStatusBadge";

interface ChoiceCardProps {
  readonly sceneInstanceId: string;
  readonly choiceId: string;
  readonly label: string;
  readonly intentLabel: string;
  readonly availability: "enabled" | "disabled";
  readonly onSelectChoice?: (formData: FormData) => Promise<void>;
}

export function ChoiceCard({
  sceneInstanceId,
  choiceId,
  label,
  intentLabel,
  availability,
  onSelectChoice
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
      <p>{intentLabel}</p>
      {enabled ? null : (
        <p>
          This path is not available in the current chapter.
        </p>
      )}
      <form action={onSelectChoice} className="reader-choice-form">
        <input type="hidden" name="sceneChoiceId" value={choiceId} />
        <input type="hidden" name="sceneInstanceId" value={sceneInstanceId} />
        <button
          type="submit"
          className="reader-choice-action"
          disabled={!enabled || !onSelectChoice}
        >
          {enabled ? "Choose and continue" : "Unavailable right now"}
        </button>
      </form>
    </article>
  );
}
