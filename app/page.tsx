import Link from "next/link";
import { GraduationCap, QrCode, ShieldCheck, ChartNoAxesCombined } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-600 p-2"><GraduationCap size={24} /></div><span className="font-bold tracking-tight">Absensi Sekolah</span></div>
        <Link href="/login" className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-blue-100">Masuk</Link>
      </nav>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 md:grid-cols-2 md:pt-28">
        <div>
          <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">School Attendance Platform</span>
          <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Absensi sekolah lebih <span className="text-blue-400">mudah, cepat, dan akurat.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Kelola data siswa, kelas, dan kehadiran melalui satu dashboard. Pencatatan QR dirancang untuk membantu proses presensi yang tertib dan terdokumentasi.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/login" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500">Masuk ke Dashboard</Link><a href="#fitur" className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-slate-200 hover:bg-white/5">Lihat fitur</a></div>
        </div>
        <div id="fitur" className="grid gap-4 sm:grid-cols-2">
          {[{icon:QrCode,title:"Absensi QR",desc:"Alur pencatatan kehadiran berbasis sesi."},{icon:ShieldCheck,title:"Akses terkontrol",desc:"Akun dan peran pengguna dikelola sekolah."},{icon:ChartNoAxesCombined,title:"Rekap terpusat",desc:"Data kehadiran siap ditinjau dan dilaporkan."},{icon:GraduationCap,title:"Data sekolah",desc:"Siswa, guru, dan kelas dalam satu sistem."}].map(item=><article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"><item.icon className="mb-5 text-blue-400" size={28}/><h2 className="font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{item.desc}</p></article>)}
        </div>
      </section>
      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-500">© {new Date().getFullYear()} Sistem Absensi Sekolah</footer>
    </main>
  );
}
