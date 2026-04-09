import { SceneFallbackBody } from "./SceneFallbackBody";

interface ScenePlaceholderProps {
  readonly sceneKind: string;
  readonly sceneGoal: string;
}

export function ScenePlaceholder({
  sceneKind,
  sceneGoal
}: ScenePlaceholderProps) {
  return (
    <SceneFallbackBody
      title="Scene package ready"
      paragraphs={[
        "Prose generation is not active yet for this chronicle, so the shell is showing structural scene context.",
        `Scene kind: ${sceneKind} | Scene goal: ${sceneGoal}`
      ]}
    />
  );
}
