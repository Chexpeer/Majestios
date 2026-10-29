"use client";

import { useContext } from "react";
import { PublicLayoutContext } from "@/components/public-layout-context";
import HomeSideNav from "@/components/home-side-nav";
import AnnouncementTicker from "@/components/announcement-ticker";

/**
 * Compatibilité avec les pages existantes : la coquille globale affiche déjà
 * la navigation et le flux. En dehors de cette coquille, le composant reste autonome.
 */
export default function PublicHeader() {
  const isInsideGlobalShell = useContext(PublicLayoutContext);
  if (isInsideGlobalShell) return null;
  return (
    <>
      <HomeSideNav />
      <div className="global-ticker-host"><AnnouncementTicker /></div>
    </>
  );
}
