import { ChoiceCard } from "./ChoiceCard";

export interface SceneChoiceListItem {
  readonly choiceId: string;
  readonly label: string;
  readonly intentLabel: string;
  readonly availability: "enabled" | "disabled";
}

interface ChoiceListProps {
  readonly choices: SceneChoiceListItem[];
}

export function ChoiceList({ choices }: ChoiceListProps) {
  if (choices.length === 0) {
    return (
      <section className="reader-choice-list-section">
        <h3>Available Choices</h3>
        <p>No committed choices are available for this scene yet.</p>
      </section>
    );
  }

  return (
    <section className="reader-choice-list-section">
      <h3>Available Choices</h3>
      <ul className="reader-choice-list">
        {choices.map((choice) => (
          <li key={choice.choiceId}>
            <ChoiceCard
              choiceId={choice.choiceId}
              label={choice.label}
              intentLabel={choice.intentLabel}
              availability={choice.availability}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
