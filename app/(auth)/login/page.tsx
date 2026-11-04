"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login gagal.");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Tidak dapat menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">AS</div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">School Attendance</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Masuk ke akun</h1>
        <p className="mt-2 text-sm text-slate-500">Kelola kehadiran sekolah dalam satu tempat.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input id="email" type="email" autoComplete="username" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="nama@sekolah.sch.id" />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input id="password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Masukkan password" />
        </div>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Memproses..." : "Masuk"}</button>
      </form>
      <p className="mt-6 text-center text-xs leading-5 text-slate-500">Akun dibuat oleh administrator sekolah. Pendaftaran mandiri tidak tersedia.</p>
      <p className="mt-5 text-center text-sm"><Link href="/" className="font-medium text-blue-600 hover:text-blue-700">Kembali ke beranda</Link></p>
    </section>
  );
}
