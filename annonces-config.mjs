// Configuration du dépôt, de la relecture et de la liste publique des annonces de sous-traitance.
//
// Projet Supabase cible : MajestiOS-Test (le SQL « annonces » n'y est appliqué que là). Le site principal
// (supabase-config.js) reste branché sur majestios-crm, où ce SQL n'est PAS appliqué.
// AVANT toute fusion vers la branche principale : décider du projet cible, y appliquer le SQL, puis changer cette URL.
export const ANNONCES_SUPABASE = Object.freeze({
  url: "https://qrlnnfjstoeliymxtkbk.supabase.co",
  publishableKey: "sb_publishable_z8kQXMfxhFlmmxZiJ73-GA_cdmbHTYn"
});

// Interrupteur d'ouverture du dépôt : à false, le formulaire valide la saisie mais n'envoie rien.
export const ANNONCES_OUVERTES = true;
export const NOTICE_VERSION = "annonces-brouillon-2026-11";
