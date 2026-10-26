import { Bell, Search } from "lucide-react";
export function Topbar() {
  return <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 sm:px-8">
    <div className="flex items-center gap-2 text-sm text-slate-500"><Search size={17}/><span className="hidden sm:inline">Rechercher une opportunité, une entreprise…</span><span className="sm:hidden">Rechercher…</span></div>
    <div className="flex items-center gap-4"><button aria-label="Notifications" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell size={19}/></button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">MD</div></div>
  </header>;
}