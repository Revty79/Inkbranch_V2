import type { ReactNode } from "react";

import { ReaderHeader } from "./ReaderHeader";
import { ReaderNav } from "./ReaderNav";

interface ReaderShellProps {
  readonly children: ReactNode;
  readonly title?: string;
  readonly subtitle?: string;
  readonly activeChronicleId?: string;
}

export function ReaderShell({
  children,
  title,
  subtitle,
  activeChronicleId
}: ReaderShellProps) {
  return (
    <div className="reader-shell">
      <ReaderHeader title={title} subtitle={subtitle} />
      <ReaderNav chronicleId={activeChronicleId} />
      <div className="reader-shell-content">{children}</div>
    </div>
  );
}
