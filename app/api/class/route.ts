import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ message: "Modul kelas belum tersedia." }, { status: 501 });
}

export async function POST() {
  if (!(await getSession())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ message: "Pembuatan kelas belum diimplementasikan." }, { status: 501 });
}
