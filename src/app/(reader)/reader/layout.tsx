import type { ReactNode } from "react";

import { ReaderShell } from "@/ui/reader";

interface ReaderLayoutProps {
  readonly children: ReactNode;
}

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  return (
    <ReaderShell
      title="Inkbranch Reader"
      subtitle="Read committed runtime scenes and choices without exposing engine internals."
    >
      {children}
    </ReaderShell>
  );
}
