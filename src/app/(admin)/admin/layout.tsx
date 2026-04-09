import type { ReactNode } from "react";

import { AdminHeader, AdminNav, AdminShell } from "@/ui/admin";

interface AdminLayoutProps {
  readonly children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminShell
      nav={<AdminNav />}
      header={
        <AdminHeader
          title="Admin Inspector"
          subtitle="Read-oriented runtime and generation inspection for Inkbranch v2."
        />
      }
    >
      {children}
    </AdminShell>
  );
}
