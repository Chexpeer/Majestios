"use client";

import type { ReactNode } from "react";
import HomeSideNav from "@/components/home-side-nav";
import AnnouncementTicker from "@/components/announcement-ticker";
import { PublicLayoutContext } from "@/components/public-layout-context";

/**
 * Coquille globale : garantit la navigation et le flux commun sur toutes les routes.
 * Les appels historiques à PublicHeader dans les pages deviennent silencieux dans ce contexte.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <PublicLayoutContext.Provider value={true}>
      <HomeSideNav />
      <div className="global-ticker-host">
        <AnnouncementTicker />
      </div>
      <div className="global-site-content">{children}</div>
    </PublicLayoutContext.Provider>
  );
}
