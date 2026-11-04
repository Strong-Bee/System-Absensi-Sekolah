import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
const optional = (value: unknown, max: number) => typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

async function resolveId(context: Context) {
  const { id: raw } = await context.params;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, context: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const id = await resolveId(context);
  if (!id) return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  const data = await getPrisma().student.findUnique({
    where: { id },
    include: { classes: { include: { class: { select: { id: true, name: true, code: true } } } } },
  });
  if (!data) return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, context: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ message: "Hanya admin yang dapat mengubah data siswa." }, { status: 403 });
  const id = await resolveId(context);
  if (!id) return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Format JSON tidak valid." }, { status: 400 });
  }

  const data: { nisn?: string; name?: string; email?: string | null; phone?: string | null; address?: string | null; parentName?: string | null; parentPhone?: string | null } = {};
  if ("nisn" in body) {
    const nisn = typeof body.nisn === "string" ? body.nisn.trim() : "";
    if (!/^\d{10}$/.test(nisn)) return NextResponse.json({ message: "NISN harus terdiri dari 10 digit." }, { status: 400 });
    data.nisn = nisn;
  }
  if ("name" in body) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (name.length < 2 || name.length > 120) return NextResponse.json({ message: "Nama siswa harus 2–120 karakter." }, { status: 400 });
    data.name = name;
  }
  const fields = { email: 254, phone: 30, address: 1000, parentName: 120, parentPhone: 30 } as const;
  for (const field of Object.keys(fields) as Array<keyof typeof fields>) {
    if (field in body) data[field] = optional(body[field], fields[field]);
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return NextResponse.json({ message: "Format email tidak valid." }, { status: 400 });
  if (!Object.keys(data).length) return NextResponse.json({ message: "Tidak ada perubahan yang dikirim." }, { status: 400 });

  try {
    const updated = await getPrisma().student.update({ where: { id }, data });
    return NextResponse.json({ message: "Data siswa berhasil diperbarui.", data: updated });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
      if (error.code === "P2002") return NextResponse.json({ message: "NISN sudah digunakan siswa lain." }, { status: 409 });
    }
    console.error("Update student failed:", error);
    return NextResponse.json({ message: "Gagal memperbarui data siswa." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (session.role !== "ADMIN") return NextResponse.json({ message: "Hanya admin yang dapat menghapus siswa." }, { status: 403 });
  const id = await resolveId(context);
  if (!id) return NextResponse.json({ message: "ID tidak valid." }, { status: 400 });
  try {
    await getPrisma().student.delete({ where: { id } });
    return NextResponse.json({ message: "Siswa berhasil dihapus." });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") return NextResponse.json({ message: "Siswa tidak ditemukan." }, { status: 404 });
      if (error.code === "P2003") return NextResponse.json({ message: "Siswa tidak dapat dihapus karena memiliki riwayat absensi atau relasi kelas." }, { status: 409 });
    }
    console.error("Delete student failed:", error);
    return NextResponse.json({ message: "Gagal menghapus data siswa." }, { status: 500 });
  }
}
