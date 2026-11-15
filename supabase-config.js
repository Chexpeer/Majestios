// Configuration publique du client web ; aucune clé secrète ou service_role côté navigateur.
//
// BRANCHE DE TEST (test-ecriture-claude) : tout le site pointe sur MajestiOS-Test, pour qu'une seule connexion
// serve à toutes les pages d'administration. AVANT toute fusion vers la branche principale (production) :
// remettre ici l'adresse et la clé du projet majestios-crm (voir docs/METHODE-DE-TRAVAIL-DOCUMENTATION-TEST-CRM.md).
export const MAJESTIOS_SUPABASE = Object.freeze({
  url: "https://qrlnnfjstoeliymxtkbk.supabase.co",
  publishableKey: "sb_publishable_z8kQXMfxhFlmmxZiJ73-GA_cdmbHTYn"
});
