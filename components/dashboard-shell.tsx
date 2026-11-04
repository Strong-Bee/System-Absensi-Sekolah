"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, BookOpen, Calendar, BarChart3, Settings, Menu, X, LogOut, GraduationCap } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Siswa", href: "/students", icon: Users },
  { name: "Kelas", href: "/classes", icon: BookOpen },
  { name: "Absensi", href: "/attendance", icon: Calendar },
  { name: "Laporan", href: "/reports", icon: BarChart3 },
  { name: "Pengaturan", href: "/settings", icon: Settings },
];

export default function DashboardShell({ children, user }: { children: React.ReactNode; user: { name: string; role: string } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const links = navigation.map(item => {
    const Icon = item.icon;
    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
    return <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}><Icon size={18} />{item.name}</Link>;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && <button aria-label="Tutup menu" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white p-5 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-600 p-2 text-white"><GraduationCap size={22} /></div><div><p className="font-bold text-slate-900">Absensi Sekolah</p><p className="text-xs text-slate-500">Management System</p></div></div>
          <button aria-label="Tutup menu" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><X size={20} /></button>
        </div>
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu utama</p>
        <nav className="flex-1 space-y-1">{links}</nav>
        <div className="border-t border-slate-100 pt-4">
          <p className="truncate px-3 text-sm font-semibold text-slate-800">{user.name}</p>
          <p className="mb-3 px-3 text-xs text-slate-500">{user.role}</p>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"><LogOut size={18} />Keluar</button>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button aria-label="Buka menu" onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={22} /></button>
          <p className="text-sm font-medium text-slate-500">Sistem Informasi Absensi Sekolah</p>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{user.role}</span>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
