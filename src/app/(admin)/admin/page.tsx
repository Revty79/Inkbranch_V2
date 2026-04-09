import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="admin-route">
      <h2>Inspector overview</h2>
      <p>
        The Admin Inspector is read-only. It exists to inspect committed runtime
        truth, event history, and generation visibility without adding
        planner/runtime mutation controls.
      </p>
      <div className="admin-inline-links">
        <Link href="/admin/chronicles">Inspect chronicles</Link>
      </div>
      <div className="admin-grid">
        <article className="admin-panel">
          <h3>Chronicles</h3>
          <p>
            Inspect run status, current projection, and chronicle-level links.
          </p>
        </article>
        <article className="admin-panel">
          <h3>Scenes and choices</h3>
          <p>
            Inspect scene history, offered choices, and committed resolution
            outcomes.
          </p>
        </article>
        <article className="admin-panel">
          <h3>Events and state</h3>
          <p>
            Inspect event append history, current knowledge state, and canon
            commits.
          </p>
        </article>
        <article className="admin-panel">
          <h3>Generation visibility</h3>
          <p>
            Inspect rendered prose presence and generation payload fallback
            markers where available.
          </p>
        </article>
      </div>
    </section>
  );
}
