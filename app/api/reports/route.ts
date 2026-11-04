import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ message: "Laporan belum tersedia." }, { status: 501 });
}
