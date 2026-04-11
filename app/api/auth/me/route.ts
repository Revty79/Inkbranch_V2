import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  getUserFromSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await getUserFromSessionToken(sessionToken);

  if (!user) {
    const response = NextResponse.json({ user: null }, { status: 200 });
    clearSessionCookie(response);
    return response;
  }

  return NextResponse.json({ user }, { status: 200 });
}
