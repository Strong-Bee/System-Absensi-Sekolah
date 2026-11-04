import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const SESSION_COOKIE = "school_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  return value;
}

export type SessionUser = { id: number; role: "ADMIN" | "GURU"; name: string; email: string };

export function createSessionToken(user: SessionUser) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, name: user.name, email: user.email },
    secret(),
    { expiresIn: SESSION_TTL_SECONDS, issuer: "system-absensi-sekolah", audience: "school-app" },
  );
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, secret(), {
      issuer: "system-absensi-sekolah",
      audience: "school-app",
    }) as JwtPayload;
    const id = Number(payload.sub);
    if (!Number.isSafeInteger(id) || id <= 0) return null;
    if (payload.role !== "ADMIN" && payload.role !== "GURU") return null;
    if (typeof payload.name !== "string" || typeof payload.email !== "string") return null;
    return { id, role: payload.role, name: payload.name, email: payload.email };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
