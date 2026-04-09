import type { ReactNode } from "react";

type StudioShellProps = {
  readonly header: ReactNode;
  readonly sidebar: ReactNode;
  readonly children: ReactNode;
};

export function StudioShell({ header, sidebar, children }: StudioShellProps) {
  return (
    <div className="studio-shell">
      <div className="studio-shell-sidebar">{sidebar}</div>
      <div className="studio-shell-main">
        {header}
        <div className="studio-shell-content">{children}</div>
      </div>
    </div>
  );
}
