import { SceneFallbackBody } from "./SceneFallbackBody";

interface SceneBodyProse {
  readonly mode: "prose";
  readonly prose: string;
}

interface SceneBodyFallback {
  readonly mode: "fallback";
  readonly title: string;
  readonly paragraphs: string[];
}

export type SceneBodyModel = SceneBodyProse | SceneBodyFallback;

interface SceneBodyProps {
  readonly body: SceneBodyModel;
}

export function SceneBody({ body }: SceneBodyProps) {
  if (body.mode === "prose") {
    return (
      <article className="reader-scene-prose">
        <p>{body.prose}</p>
      </article>
    );
  }

  return <SceneFallbackBody title={body.title} paragraphs={body.paragraphs} />;
}
