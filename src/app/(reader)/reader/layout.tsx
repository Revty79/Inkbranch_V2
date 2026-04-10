import type { ReactNode } from "react";

import { ReaderShell } from "@/ui/reader";

interface ReaderLayoutProps {
  readonly children: ReactNode;
}

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  return (
    <ReaderShell
      title="Inkbranch Reader"
      subtitle="Follow each chronicle through its latest scenes, choices, and perspectives."
    >
      {children}
    </ReaderShell>
  );
}
