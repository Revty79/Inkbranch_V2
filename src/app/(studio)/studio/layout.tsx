import type { ReactNode } from "react";

import { StudioHeader, StudioShell, StudioSidebar } from "@/ui/studio";

type StudioLayoutProps = {
  readonly children: ReactNode;
};

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <StudioShell
      header={
        <StudioHeader
          title="Studio"
          subtitle="Authoring shell for world, book, canon, entity, and planning inputs."
        />
      }
      sidebar={<StudioSidebar />}
    >
      {children}
    </StudioShell>
  );
}
