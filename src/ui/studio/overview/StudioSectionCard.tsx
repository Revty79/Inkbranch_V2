import Link from "next/link";

import { StudioStatusBadge } from "@/ui/studio/shared/StudioStatusBadge";

type StudioSectionCardProps = {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly status: "planned" | "ready";
};

export function StudioSectionCard({
  title,
  description,
  href,
  status
}: StudioSectionCardProps) {
  return (
    <article className="studio-section-card">
      <div className="studio-section-card-top">
        <h3>{title}</h3>
        <StudioStatusBadge status={status} />
      </div>
      <p>{description}</p>
      <Link href={href}>Open Section</Link>
    </article>
  );
}
