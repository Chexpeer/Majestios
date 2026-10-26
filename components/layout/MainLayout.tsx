import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
export function MainLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen bg-slate-50 text-slate-900"><Sidebar/><div className="min-w-0 flex-1"><Topbar/><main className="mx-auto w-full max-w-[1500px] p-5 sm:p-8">{children}</main></div></div>;
}