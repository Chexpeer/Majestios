// Limite des recherches pour les visiteurs sans espace personnel : 20 résultats au plus ; les titulaires d'un espace voient tout.
// La limite est aussi appliquée côté serveur (migration 20261121220000) : ce module ne fait que l'afficher et transmettre la session.
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";

export const LIMITE_VISITEUR = 20;

let clientPromise = null;
/** Jeton de session du titulaire connecté, ou null pour un visiteur (ou si la session est illisible). */
export async function sessionToken() {
  try {
    clientPromise ||= import("https://esm.sh/@supabase/supabase-js@2.119.0").then(({ createClient }) =>
      createClient(ANNONCES_SUPABASE.url, ANNONCES_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }));
    const { data } = await (await clientPromise).auth.getSession();
    return data?.session?.access_token || null;
  } catch { return null; }
}

/** En-têtes d'un appel public : la clé publique, plus la session si le visiteur est connecté. */
export function rpcHeaders(token) {
  const headers = { "content-type": "application/json", apikey: ANNONCES_SUPABASE.publishableKey };
  if (token) headers.authorization = "Bearer " + token;
  return headers;
}

/** Vrai quand un visiteur a atteint la limite d'affichage. */
export function limitReached(token, shown) { return !token && shown >= LIMITE_VISITEUR; }

/** Message + bouton « Créer mon espace » affichés à la place de « Voir plus ». */
export function buildLimitNotice(doc = document) {
  const box = doc.createElement("div");
  box.className = "limite-visiteur";
  box.setAttribute("role", "note");
  const p = doc.createElement("p");
  p.textContent = "Les visiteurs voient les " + LIMITE_VISITEUR + " premiers résultats. Pour voir la suite, créez votre espace personnel : c’est gratuit.";
  const a = doc.createElement("a");
  a.className = "button-primary button-compact";
  a.href = "espace-membre.html#creation";
  a.textContent = "Créer mon espace";
  box.append(p, a);
  return box;
}
