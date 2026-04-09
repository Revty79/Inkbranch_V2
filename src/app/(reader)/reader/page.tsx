export default function ReaderPage() {
  return (
    <main className="page-shell">
      <h1>Reader</h1>
      <p>
        Reader-facing surface for scene delivery and decision consumption from
        planner-approved scene packages.
      </p>
      <p>
        This area must not decide story validity or mutate runtime state
        directly.
      </p>
    </main>
  );
}
