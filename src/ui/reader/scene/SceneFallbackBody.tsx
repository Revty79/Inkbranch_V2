interface SceneFallbackBodyProps {
  readonly title: string;
  readonly paragraphs: string[];
}

export function SceneFallbackBody({
  title,
  paragraphs
}: SceneFallbackBodyProps) {
  return (
    <section className="reader-scene-fallback-body">
      <h3>{title}</h3>
      {paragraphs.map((paragraph, index) => (
        <p key={`${title}-${index + 1}`}>{paragraph}</p>
      ))}
    </section>
  );
}
