import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Email dan password wajib diisi." }, { status: 400 });
    }
    const { email, password } = body as Record<string, unknown>;
    if (typeof email !== "string" || typeof password !== "string" ||
        email.length > 254 || password.length < 1 || password.length > 256) {
      return NextResponse.json({ message: "Email atau password tidak valid." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await getPrisma().user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Email atau password salah." }, { status: 401 });
    }

    const token = createSessionToken({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });
    const response = NextResponse.json({
      message: "Login berhasil.",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return response;
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ message: "Layanan login sedang tidak tersedia." }, { status: 500 });
  }
}
