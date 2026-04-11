import type { Role } from "@prisma/client";

export function canUseWritingDesk(role: Role): boolean {
  return role === "AUTHOR" || role === "ADMIN";
}

export function canUseAdminOffice(role: Role): boolean {
  return role === "ADMIN";
}
