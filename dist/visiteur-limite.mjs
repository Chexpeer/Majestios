// Limite des recherches : 20 résultats pour un visiteur sans espace personnel, 40 pour un titulaire d'espace (pour l'instant) ;
// l'équipe interne et Cheexpeer n'ont aucune limite. Le plafond est imposé côté serveur (migration 20261121220000) : ce module l'affiche et transmet la session.
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";

export const LIMITE_VISITEUR = 20;
export const LIMITE_MEMBRE = 40;

let clientPromise = null;
/** Client Supabase partagé (session du navigateur) ; null s'il est inaccessible. */
export async function sharedClient() {
  try {
    clientPromise ||= import("https://esm.sh/@supabase/supabase-js@2.119.0").then(({ createClient }) =>
      createClient(ANNONCES_SUPABASE.url, ANNONCES_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }));
    return await clientPromise;
  } catch { return null; }
}
/** Jeton de session du titulaire connecté, ou null pour un visiteur (ou si la session est illisible). */
export async function sessionToken() {
  try {
    const client = await sharedClient();
    const { data } = await client.auth.getSession();
    return data?.session?.access_token || null;
  } catch { return null; }
}

/** En-têtes d'un appel public : la clé publique, plus la session si le visiteur est connecté. */
export function rpcHeaders(token) {
  const headers = { "content-type": "application/json", apikey: ANNONCES_SUPABASE.publishableKey };
  if (token) headers.authorization = "Bearer " + token;
  return headers;
}

/** Vrai quand le plafond de l'appelant est atteint ET que le serveur n'a rien de plus à donner (l'équipe interne n'est jamais bloquée). */
export function limitReached(token, shown, hasMore = false) { return !hasMore && shown >= (token ? LIMITE_MEMBRE : LIMITE_VISITEUR); }

/** Message affiché à la place de « Voir plus » : invitation à créer son espace (visiteur) ou information sur la limite (membre). */
export function buildLimitNotice(doc = document, token = null) {
  const box = doc.createElement("div");
  box.className = "limite-visiteur";
  box.setAttribute("role", "note");
  const p = doc.createElement("p");
  box.append(p);
  if (token) {
    p.textContent = "Pour l’instant, les résultats sont limités aux " + LIMITE_MEMBRE + " premiers. Affinez votre recherche (département, activité) pour trouver d’autres entreprises.";
    return box;
  }
  p.textContent = "Les visiteurs voient les " + LIMITE_VISITEUR + " premiers résultats. Pour voir la suite, créez votre espace personnel : c’est gratuit.";
  const a = doc.createElement("a");
  a.className = "button-primary button-compact";
  a.href = "espace-membre.html#creation";
  a.textContent = "Créer mon espace";
  box.append(a);
  return box;
}
