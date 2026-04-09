import type { ReactNode } from "react";

type StudioOverviewPanelProps = {
  readonly children: ReactNode;
};

export function StudioOverviewPanel({ children }: StudioOverviewPanelProps) {
  return <section className="studio-overview-grid">{children}</section>;
}
