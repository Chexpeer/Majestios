// Interrupteur d'ouverture du dépôt d'annonces. Tant qu'il est à false, le formulaire valide la saisie
// mais n'envoie rien (aucune donnée ne quitte le navigateur). Ne passer à true qu'après :
// 1. application du SQL validé sur le projet cible, 2. validation juridique (ANN-02), 3. décision écrite du porteur.
export const ANNONCES_OUVERTES = false;
export const NOTICE_VERSION = "annonces-brouillon-2026-11";
