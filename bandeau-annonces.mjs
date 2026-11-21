// Bandeau défilant des dernières annonces publiées, au-dessus de la barre de navigation.
// Données publiques uniquement (titre, type, lieu) : jamais de coordonnées. Rien ne s'affiche s'il n'y a pas d'annonce ou si le service est indisponible.
import { KIND_LABELS, normalizeAnnouncements } from "./annonces-liste.mjs";

export const MAX_ITEMS = 10;
export const LIEN_ANNONCES = "annonces.html#annonces-privees";
const PAGES_EXCLUES = /(^|\/)(administration|crm|espace-interne|accepter-invitation|admin-[a-z-]+)\.html$/;

/** Pages où le bandeau n'a pas sa place (outils de l'équipe, acceptation d'invitation). */
export function pageAvecBandeau(pathname = "") { return !PAGES_EXCLUES.test(pathname); }

const coupe = (texte, max) => (texte.length > max ? texte.slice(0, max - 1).trimEnd() + "…" : texte);

/** Éléments du bandeau à partir des lignes renvoyées par le serveur. */
export function elementsDuBandeau(rows) {
  const { items } = normalizeAnnouncements(rows);
  return items.slice(0, MAX_ITEMS).map((a) => ({
    reference: a.reference,
    type: KIND_LABELS[a.kind] || "Annonce",
    titre: coupe(a.title, 80),
    lieu: a.department ? "Dép. " + a.department : ""
  }));
}

function monter(elements) {
  const header = document.querySelector(".site-header");
  if (!header || document.querySelector(".annonces-ticker") || !elements.length) return;
  if (!document.querySelector('link[href*="bandeau-annonces.css"]')) {
    const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "bandeau-annonces.css"; document.head.append(css);
  }
  const bandeau = document.createElement("div");
  bandeau.className = "annonces-ticker";
  bandeau.setAttribute("role", "region");
  bandeau.setAttribute("aria-label", "Dernières annonces publiées");
  const etiquette = document.createElement("a");
  etiquette.className = "annonces-ticker-label"; etiquette.href = LIEN_ANNONCES; etiquette.textContent = "ANNONCES";
  const piste = document.createElement("div"); piste.className = "annonces-ticker-track";
  const groupe = (copie) => {
    const g = document.createElement("div"); g.className = "annonces-ticker-group";
    if (copie) g.setAttribute("aria-hidden", "true");
    for (const e of elements) {
      const a = document.createElement("a"); a.href = LIEN_ANNONCES; if (copie) a.tabIndex = -1;
      const t = document.createElement("strong"); t.textContent = e.type;
      a.append(t, document.createTextNode(" · " + e.titre + (e.lieu ? " · " + e.lieu : "")));
      g.append(a);
    }
    return g;
  };
  piste.append(groupe(false), groupe(true));
  piste.style.setProperty("--ticker-duree", Math.max(24, elements.length * 7) + "s");
  bandeau.append(etiquette, piste);
  header.before(bandeau);
  document.querySelector(".homepage-ticker")?.setAttribute("hidden", ""); // remplace le flux de démonstration par les vraies annonces
}

export async function lancerBandeau({ url, publishableKey }) {
  if (!pageAvecBandeau(location.pathname)) return;
  try {
    let rows = null;
    try { const c = JSON.parse(sessionStorage.getItem("mj-bandeau") || "null"); if (c && Date.now() - c.t < 300000) rows = c.rows; } catch (_) { /* sans importance */ }
    if (!rows) {
      const r = await fetch(url + "/rest/v1/rpc/list_published_announcements", {
        method: "POST", headers: { "content-type": "application/json", apikey: publishableKey },
        body: JSON.stringify({ p_kind: null, p_department: null, p_limit: MAX_ITEMS, p_offset: 0 })
      });
      if (!r.ok) return;
      rows = await r.json();
      try { sessionStorage.setItem("mj-bandeau", JSON.stringify({ t: Date.now(), rows })); } catch (_) { /* sans importance */ }
    }
    monter(elementsDuBandeau(rows));
  } catch (_) { /* le bandeau est facultatif */ }
}
