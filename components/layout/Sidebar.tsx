import Link from "next/link";
import { Activity, Building2, Compass, Gauge, GitBranch, Users, Settings, Sparkles, ChartNoAxesCombined } from "lucide-react";
const items = [
  { href: "/dashboard", label: "Vue d’ensemble", icon: Gauge },
  { href: "/opportunities", label: "Opportunités", icon: Compass },
  { href: "/companies", label: "Entreprises", icon: Building2 },
  { href: "/decision-makers", label: "Décideurs", icon: Users },
  { href: "/crm", label: "Activités commerciales", icon: Activity },
  { href: "/pipeline", label: "Pipeline", icon: GitBranch },
  { href: "/analytics", label: "Analyses", icon: ChartNoAxesCombined },
];
export function Sidebar() {
  return <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
    <Link href="/dashboard" className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">M</span>
      <span><strong className="block text-lg tracking-tight text-slate-950">MajestiOS</strong><span className="text-xs text-slate-500">Opportunity Intelligence</span></span>
    </Link>
    <div className="px-4 pt-6"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[.16em] text-slate-400">Espace professionnel</p>
      <nav className="space-y-1">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"><Icon size={18} strokeWidth={1.8}/>{label}</Link>)}</nav>
    </div>
    <div className="mt-auto p-4"><Link href="/coach" className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm font-medium text-indigo-800"><Sparkles size={18}/><span><span className="block">Coach IA</span><span className="text-xs font-normal text-indigo-600">Mode de démonstration</span></span></Link>
      <Link href="/settings" className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-slate-100"><Settings size={18}/>Paramètres</Link>
    </div>
  </aside>;
}