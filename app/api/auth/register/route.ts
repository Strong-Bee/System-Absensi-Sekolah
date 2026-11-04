import { NextResponse } from "next/server";

// Account provisioning is intentionally restricted to trusted administrators.
export async function POST() {
  return NextResponse.json(
    { message: "Pendaftaran mandiri dinonaktifkan. Hubungi administrator sekolah untuk dibuatkan akun." },
    { status: 403 },
  );
}
