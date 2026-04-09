import { StudioNav } from "./StudioNav";

export function StudioSidebar() {
  return (
    <aside className="studio-sidebar">
      <h2>Inkbranch Studio</h2>
      <p>Authoring shell for book-bible inputs.</p>
      <StudioNav />
    </aside>
  );
}
