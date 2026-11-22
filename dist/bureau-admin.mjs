// Bureau de l'administrateur : règles pures (testables sans navigateur) pour « Ce qui m'attend » et « Dernières activités ».
// Lecture seule. Chaque bloc est indépendant : si une donnée est indisponible, le bloc le dit sans casser les autres.
export const TYPES_ACTIVITE = Object.freeze({ note: "Note", call: "Appel", email: "E-mail", meeting: "Rendez-vous", task: "Tâche", status_change: "Changement de statut", qualification: "Qualification", system: "Système" });

const plur = (n, un, plusieurs) => `${n} ${n > 1 ? plusieurs : un}`;

/** Éléments « Ce qui m'attend ». Chaque entrée : { cle, texte, href, urgent, disponible }. Entrées à zéro : omises. */
export function buildAttente({ relancesEnRetard = null, relancesAVenir = null, annoncesARelire = null } = {}) {
  const items = [];
  const nombre = (v) => (Number.isFinite(Number(v)) && v !== null ? Number(v) : null);
  const retard = nombre(relancesEnRetard), avenir = nombre(relancesAVenir), annonces = nombre(annoncesARelire);
  if (retard === null && avenir === null) items.push({ cle: "relances", texte: "Relances du CRM : information indisponible pour cette session.", href: "crm.html", urgent: false, disponible: false });
  else {
    if (retard) items.push({ cle: "relances-retard", texte: `${plur(retard, "relance du CRM en retard", "relances du CRM en retard")}`, href: "crm.html", urgent: true, disponible: true });
    if (avenir) items.push({ cle: "relances", texte: `${plur(avenir, "relance du CRM à venir", "relances du CRM à venir")}`, href: "crm.html", urgent: false, disponible: true });
  }
  if (annonces === null) items.push({ cle: "annonces", texte: "Annonces à relire : information indisponible pour cette session.", href: "admin-annonces.html", urgent: false, disponible: false });
  else if (annonces) items.push({ cle: "annonces", texte: `${plur(annonces, "annonce à relire", "annonces à relire")}`, href: "admin-annonces.html", urgent: false, disponible: true });
  return items;
}

/** Sépare les relances en attente en « en retard » et « à venir » selon l'échéance. */
export function compterRelances(rows, now = new Date()) {
  const t = now.getTime();
  let retard = 0, avenir = 0;
  for (const r of Array.isArray(rows) ? rows : []) { const d = Date.parse(r?.due_at); if (!Number.isFinite(d)) continue; if (d <= t) retard += 1; else avenir += 1; }
  return { retard, avenir };
}

/** Dernières activités du CRM, mises en forme pour l'écran ; sujets et corps tronqués, aucune donnée inventée. */
export function formatActivites(rows, limite = 8) {
  return (Array.isArray(rows) ? rows : []).slice(0, limite).map((r) => ({
    quand: Date.parse(r?.occurred_at ?? r?.created_at) ? new Date(r.occurred_at ?? r.created_at).toISOString() : null,
    type: TYPES_ACTIVITE[r?.activity_type] || "Activité",
    sujet: String(r?.subject ?? "").replace(/\s+/g, " ").trim().slice(0, 140) || "(sans titre)"
  }));
}

export const ACCES_RAPIDES = Object.freeze([
  { titre: "CRM interne", detail: "Entreprises, contacts, opportunités, relances", href: "crm.html" },
  { titre: "Cheexpeer", detail: "Confier une mission, valider, suivre les résultats", href: "admin-cheexpeer.html" },
  { titre: "Recherches ciblées", detail: "Préparer une recherche d'entreprises ou de marchés", href: "admin-recherches.html" },
  { titre: "Annonces à relire", detail: "Modération et publication", href: "admin-annonces.html" },
  { titre: "Équipe et invitations", detail: "Rôles, retraits, invitations", href: "admin-utilisateurs.html" },
  { titre: "Site public", detail: "Voir le site comme un visiteur", href: "index.html" }
]);

export function dateCourte(iso) {
  const d = Date.parse(iso); if (!Number.isFinite(d)) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" }).format(new Date(d));
}
