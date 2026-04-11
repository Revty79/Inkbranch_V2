import "server-only";

import { cookies } from "next/headers";
import { getUserFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  return getUserFromSessionToken(sessionToken);
}
