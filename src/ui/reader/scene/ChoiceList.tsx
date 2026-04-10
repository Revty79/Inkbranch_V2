import { ChoiceCard } from "./ChoiceCard";

export interface SceneChoiceListItem {
  readonly choiceId: string;
  readonly label: string;
  readonly intentLabel: string;
  readonly availability: "enabled" | "disabled";
}

interface ChoiceListProps {
  readonly sceneInstanceId: string;
  readonly choices: SceneChoiceListItem[];
  readonly onSelectChoice?: (formData: FormData) => Promise<void>;
}

export function ChoiceList({
  sceneInstanceId,
  choices,
  onSelectChoice
}: ChoiceListProps) {
  if (choices.length === 0) {
    return (
      <section className="reader-choice-list-section">
        <h3>Choose Your Next Move</h3>
        <p>No paths are ready in this chapter yet. Check back after the next update.</p>
      </section>
    );
  }

  return (
    <section className="reader-choice-list-section">
      <h3>Choose Your Next Move</h3>
      <ul className="reader-choice-list">
        {choices.map((choice) => (
          <li key={choice.choiceId}>
            <ChoiceCard
              sceneInstanceId={sceneInstanceId}
              choiceId={choice.choiceId}
              label={choice.label}
              intentLabel={choice.intentLabel}
              availability={choice.availability}
              onSelectChoice={onSelectChoice}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
