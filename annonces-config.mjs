// Configuration du dépôt, de la relecture et de la liste publique des annonces de sous-traitance.
//
// BRANCHE DE LIVRAISON (production) : projet majestios-crm, comme supabase-config.js. Le SQL « annonces » n'y est PAS encore
// appliqué : le dépôt d'annonces reste donc fermé (ANNONCES_OUVERTES = false) jusqu'à la mise à jour de la base de production
// décidée par le propriétaire (migrations listées dans docs/evolution-12/ETAT-ET-ORIENTATION-2026-11-21.md).
export const ANNONCES_SUPABASE = Object.freeze({
  url: "https://qrlnnfjstoeliymxtkbk.supabase.co",
  publishableKey: "sb_publishable_z8kQXMfxhFlmmxZiJ73-GA_cdmbHTYn"
});

// Interrupteur d'ouverture du dépôt : à false, le formulaire valide la saisie mais n'envoie rien.
export const ANNONCES_OUVERTES = false;
export const NOTICE_VERSION = "annonces-brouillon-2026-11";
