"use client";

import HomeSideNav from "@/components/home-side-nav";
import AnnouncementTicker from "@/components/announcement-ticker";

/**
 * Navigation et flux communs à toutes les pages publiques.
 * Le contenu du flux reste identique d'une rubrique à l'autre.
 */
export default function PublicHeader() {
  return (
    <>
      <HomeSideNav />
      <div className="global-ticker-host">
        <AnnouncementTicker />
      </div>
    </>
  );
}
