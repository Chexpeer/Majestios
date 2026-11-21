// Parcours de connexion et de création de compte : une seule table, une page d'arrivée par cas.
// Les liens e-mail ont chacun leur page de retour (ils doivent tous être couverts par « https://<site>/** » dans Supabase).
export const PAGES = Object.freeze({
  connexionInterne: "espace-interne.html",
  accepterInvitation: "accepter-invitation.html",
  espaceMembre: "espace-membre.html",
  administration: "administration.html",
  relectureAnnonces: "admin-annonces.html",
  invitations: "admin-utilisateurs.html",
  cheexpeer: "admin-cheexpeer.html",
  crm: "crm.html",
  recherches: "admin-recherches.html",
  annoncesPubliques: "marches-prives.html",
});

// Pages internes que seuls le propriétaire et les administrateurs internes peuvent ouvrir.
export const ADMIN_ONLY = Object.freeze([PAGES.crm, PAGES.administration, PAGES.recherches, PAGES.cheexpeer, PAGES.invitations, PAGES.relectureAnnonces]);
export const RETURN_ALLOWED = Object.freeze([PAGES.connexionInterne, ...ADMIN_ONLY]);

const isAdminRole = (role) => role === "owner" || role === "admin";

// Destination demandée (?returnTo=) : acceptée seulement si elle est connue ; sinon page d'accueil interne.
export function safeReturnTo(requested) {
  return RETURN_ALLOWED.includes(requested) ? requested : PAGES.connexionInterne;
}

// Peut-on envoyer cette personne vers cette destination ?
export function canOpen(destination, role) {
  if (destination === PAGES.connexionInterne) return Boolean(role);
  return ADMIN_ONLY.includes(destination) && isAdminRole(role);
}

// Page d'arrivée après acceptation d'une invitation.
export function landingAfterInvitation({ kind, role }) {
  if (kind === "client") return PAGES.espaceMembre;
  if (kind === "internal") return isAdminRole(role) ? PAGES.administration : PAGES.connexionInterne;
  return PAGES.connexionInterne;
}

// Page d'arrivée d'un lien de connexion (hors invitation) selon le type de compte.
export function landingAfterLogin({ internalRole = null, isClient = false, returnTo = null }) {
  if (internalRole) {
    const wanted = safeReturnTo(returnTo);
    return canOpen(wanted, internalRole) ? wanted : PAGES.connexionInterne;
  }
  return isClient ? PAGES.espaceMembre : PAGES.connexionInterne;
}

// Adresse de retour d'un lien e-mail : toujours la page du cas, jamais une adresse libre.
export function emailRedirect(origin, page, returnTo = null) {
  const clean = String(origin || "").replace(/\/+$/, "");
  const query = page === PAGES.connexionInterne && returnTo && RETURN_ALLOWED.includes(returnTo) && returnTo !== PAGES.connexionInterne
    ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
  return `${clean}/${page}${query}`;
}
