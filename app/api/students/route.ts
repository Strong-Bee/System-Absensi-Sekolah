import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

const optional = (value: unknown, max: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "20", 10) || 20));
  const where = q ? { OR: [{ name: { contains: q } }, { nisn: { contains: q } }, { email: { contains: q } }] } : {};
  const [data, total] = await Promise.all([
    getPrisma().student.findMany({
      where, orderBy: { name: "asc" }, skip: (page - 1) * limit, take: limit,
      select: {
        id: true, nisn: true, name: true, email: true, phone: true, address: true,
        parentName: true, parentPhone: true, createdAt: true,
        classes: { select: { class: { select: { id: true, name: true, code: true } } } },
      },
    }),
    getPrisma().student.count({ where }),
  ]);
  return NextResponse.json({ data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ message: "Hanya admin yang dapat menambahkan siswa." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Format JSON tidak valid." }, { status: 400 });
  }

  const nisn = typeof body.nisn === "string" ? body.nisn.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!/^\d{10}$/.test(nisn)) return NextResponse.json({ message: "NISN harus terdiri dari 10 digit." }, { status: 400 });
  if (name.length < 2 || name.length > 120) return NextResponse.json({ message: "Nama siswa harus 2–120 karakter." }, { status: 400 });
  const email = optional(body.email, 254);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ message: "Format email tidak valid." }, { status: 400 });

  try {
    const data = await getPrisma().student.create({
      data: { nisn, name, email, phone: optional(body.phone, 30), address: optional(body.address, 1000), parentName: optional(body.parentName, 120), parentPhone: optional(body.parentPhone, 30) },
    });
    return NextResponse.json({ message: "Siswa berhasil ditambahkan.", data }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return NextResponse.json({ message: "NISN sudah terdaftar." }, { status: 409 });
    console.error("Create student failed:", error);
    return NextResponse.json({ message: "Gagal menyimpan data siswa." }, { status: 500 });
  }
}
