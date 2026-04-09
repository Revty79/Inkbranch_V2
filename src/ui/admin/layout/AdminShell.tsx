import type { ReactNode } from "react";

interface AdminShellProps {
  readonly nav: ReactNode;
  readonly header: ReactNode;
  readonly children: ReactNode;
}

export function AdminShell({ nav, header, children }: AdminShellProps) {
  return (
    <div className="admin-shell">
      <aside className="admin-shell-nav">{nav}</aside>
      <div className="admin-shell-main">
        {header}
        <div className="admin-shell-content">{children}</div>
      </div>
    </div>
  );
}
