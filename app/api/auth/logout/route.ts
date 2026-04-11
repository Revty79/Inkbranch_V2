import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  deleteSessionByToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    await deleteSessionByToken(sessionToken);
  }

  const response = NextResponse.json({ success: true });
  clearSessionCookie(response);
  return response;
}
