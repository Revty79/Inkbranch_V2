import { InspectorEmptyState } from "../shared/InspectorEmptyState";

export interface GenerationFallbackItem {
  readonly sceneInstanceId: string;
  readonly generatorMode: string;
  readonly fallbackReason: string;
}

interface GenerationFallbackPanelProps {
  readonly fallbacks: GenerationFallbackItem[];
}

export function GenerationFallbackPanel({
  fallbacks
}: GenerationFallbackPanelProps) {
  if (fallbacks.length === 0) {
    return (
      <InspectorEmptyState
        title="No recorded generation fallbacks"
        message="No scene generator payload currently indicates fallback mode."
      />
    );
  }

  return (
    <section className="admin-panel">
      <h2>Generation fallback markers</h2>
      <ul className="admin-generation-list">
        {fallbacks.map((fallback) => (
          <li key={fallback.sceneInstanceId}>
            <strong>{fallback.sceneInstanceId}</strong> · mode{" "}
            {fallback.generatorMode} · reason {fallback.fallbackReason}
          </li>
        ))}
      </ul>
    </section>
  );
}
