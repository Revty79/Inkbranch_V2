import { createHash, randomBytes } from "crypto";
import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "inkbranch_session";

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE_DAYS = Number.parseInt(
  process.env.SESSION_MAX_AGE_DAYS ?? "30",
  10,
);

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
};

function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function sessionExpiresAt(): Date {
  return new Date(Date.now() + SESSION_MAX_AGE_DAYS * DAY_IN_MS);
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date,
) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = sessionExpiresAt();

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function deleteSessionByToken(token: string) {
  const tokenHash = hashSessionToken(token);

  await prisma.session
    .delete({
      where: { tokenHash },
    })
    .catch(() => null);
}

export async function getUserFromSessionToken(
  token: string,
): Promise<AuthUser | null> {
  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt <= new Date()) {
    await prisma.session
      .delete({
        where: { id: session.id },
      })
      .catch(() => null);
    return null;
  }

  return session.user;
}
