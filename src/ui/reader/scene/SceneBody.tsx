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
    const paragraphs = body.prose
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter((paragraph) => paragraph.length > 0);

    return (
      <article className="reader-scene-prose">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
          ))
        ) : (
          <p>{body.prose}</p>
        )}
      </article>
    );
  }

  return <SceneFallbackBody title={body.title} paragraphs={body.paragraphs} />;
}
