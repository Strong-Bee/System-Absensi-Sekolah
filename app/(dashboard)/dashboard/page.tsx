import Link from "next/link";
import { CalendarCheck, Users, BookOpen, ClipboardList } from "lucide-react";

const shortcuts = [
  { href: "/students", label: "Data siswa", detail: "Kelola data peserta didik", icon: Users },
  { href: "/classes", label: "Data kelas", detail: "Atur kelas dan wali kelas", icon: BookOpen },
  { href: "/attendance", label: "Absensi", detail: "Kelola sesi kehadiran", icon: CalendarCheck },
  { href: "/reports", label: "Laporan", detail: "Tinjau rekap presensi", icon: ClipboardList },
];

export default function DashboardPage() {
  return <div>
    <div className="mb-8"><p className="text-sm font-semibold text-blue-600">OVERVIEW</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1><p className="mt-2 text-slate-500">Pusat pengelolaan sistem absensi sekolah.</p></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {shortcuts.map(item => <Link key={item.href} href={item.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><div className="mb-5 inline-flex rounded-xl bg-blue-50 p-3 text-blue-700"><item.icon size={22}/></div><h2 className="font-semibold text-slate-900">{item.label}</h2><p className="mt-1 text-sm text-slate-500">{item.detail}</p><span className="mt-5 inline-block text-sm font-semibold text-blue-600 group-hover:underline">Buka menu →</span></Link>)}
    </section>
    <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-semibold text-amber-900">Tahap pemulihan aplikasi</h2><p className="mt-1 text-sm leading-6 text-amber-800">Struktur navigasi dan autentikasi dasar telah disiapkan. Modul data dan pencatatan QR perlu diimplementasikan serta diuji dengan database sekolah sebelum digunakan untuk operasional.</p></section>
  </div>;
}
