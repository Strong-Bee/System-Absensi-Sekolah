import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className="w-full text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">AS</div>
      <h1 className="text-2xl font-bold text-slate-900">Pembuatan akun</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">Untuk menjaga keamanan data sekolah, akun hanya dapat dibuat atau diaktifkan oleh administrator.</p>
      <Link href="/login" className="mt-7 inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700">Kembali ke halaman masuk</Link>
    </section>
  );
}
