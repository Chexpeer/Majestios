// Accompagnement aux appels d'offres, étape 1 : « Mes chances sur un appel d'offres ».
// Un SIREN (ou un métier + un département) → appels d'offres ouverts du BOAMP, notés /20 pour l'entreprise, avec les pièces à préparer.
// Aucune inscription, rien n'est enregistré ni envoyé. Source : BOAMP / DILA (données ouvertes), lues depuis le navigateur.
import { METIERS_CHANTIER, SIREN_RE, entrepriseDepuisAnnuaire, departementsRegion } from "./cheexpeer-command.mjs";
import { classerAppels, piecesAPreparer, resoudreMetier, departementAvis } from "./chances-ao-core.mjs";

const BOAMP = "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";
const CHAMPS = "idweb,id,objet,dateparution,datelimitereponse,nomacheteur,code_departement,code_departement_prestation,type_marche,descripteur_libelle,url_avis";

const root = document.querySelector("#chances-ao");
if (root) {
  const form = root.querySelector("form"), status = root.querySelector("[data-ao-status]"), out = root.querySelector("[data-ao-out]");
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  const say = (msg, error = false) => { status.textContent = msg; status.hidden = !msg; status.classList.toggle("is-error", error); };
  const fr = (n) => String(n).replace(".", ",");
  const dateFr = (v) => { const d = new Date(v); return Number.isNaN(d.getTime()) ? "non renseignée" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); };

  const chercher = async (ent) => {
    const deps = [...new Set([ent.departement, ...(departementsRegion(ent.departement) || [])].filter(Boolean))];
    const variantes = deps.flatMap((d) => (/^0\d$/.test(d) ? [d, d.slice(1)] : [d]));
    const zone = variantes.map((d) => `code_departement = "${d}"`).join(" OR ");
    const aujourdhui = new Date().toISOString().slice(0, 10);
    let mots = ent.mots ?? METIERS_CHANTIER[ent.naf]?.mots ?? [];
    mots = mots.filter((m) => !/\s/.test(m)).concat(mots.filter((m) => /\s/.test(m))).slice(0, 3);
    const lots = await Promise.all(mots.map(async (m) => {
      const mot = m.replace(/["\\]/g, "");
      const u = new URL(BOAMP);
      u.searchParams.set("limit", "100"); u.searchParams.set("order_by", "dateparution desc"); u.searchParams.set("select", CHAMPS);
      u.searchParams.set("where", `nature = "APPEL_OFFRE" AND datelimitereponse >= "${aujourdhui}" AND (${zone}) AND (search(objet,"${mot}") OR search(descripteur_libelle,"${mot}"))`);
      const r = await fetch(u, { headers: { Accept: "application/json" } });
      if (!r.ok) throw new Error("boamp");
      const j = await r.json();
      return Array.isArray(j.results) ? j.results : [];
    }));
    return lots.flat();
  };

  const rendu = (top, ent) => {
    const frag = document.createDocumentFragment(), ul = el("ul", "ao-liste");
    for (const { avis: a, score, jours } of top) {
      const li = el("li", "ao-carte"), tete = el("div", "ao-tete");
      tete.append(el("strong", "ao-note", `${fr(score.note)}/20`), el("span", "ao-objet", a.objet || "Objet non renseigné"));
      const delai = jours === null ? "date limite à vérifier" : jours === 0 ? "dernier jour" : `${jours} jour(s) restant(s)`;
      li.append(tete, el("p", "ao-meta", `${a.nomacheteur || "Acheteur non renseigné"} · département ${departementAvis(a, ent.departement) || "?"} · réponse avant le ${a.datelimitereponse ? dateFr(a.datelimitereponse) : "—"} (${delai})`));
      const det = el("details", "ao-detail"); det.append(el("summary", "", "Pourquoi cette note ?"));
      const crit = el("ul"); for (const c of score.criteres) crit.append(el("li", "", `${c.libelle} : ${fr(c.points)}/${c.max} — ${c.detail}`)); det.append(crit);
      const pie = el("details", "ao-detail"); pie.append(el("summary", "", "Pièces à préparer"));
      const liste = el("ul", "ao-pieces");
      for (const p of piecesAPreparer(a)) {
        const item = el("li"), lab = el("label"), cb = el("input"); cb.type = "checkbox";
        lab.append(cb, el("span", "", p.label)); item.append(lab, el("small", "", p.aide)); liste.append(item);
      }
      pie.append(liste, el("p", "ao-mention", "Liste habituelle : le règlement de consultation de l'avis fait foi. Cochez au fur et à mesure (rien n'est enregistré)."));
      const actions = el("p", "ao-actions");
      if (/^https:\/\//.test(a.url_avis || "")) { const v = el("a", "ao-lien", "Voir l'avis officiel"); v.href = a.url_avis; v.target = "_blank"; v.rel = "noopener noreferrer"; actions.append(v); }
      const c = el("a", "button-primary", "Être accompagné : créer mon espace");
      c.href = `espace-membre.html?ao=${encodeURIComponent(String(a.idweb || a.id || "").slice(0, 40))}#creation`; actions.append(c);
      li.append(det, pie, actions); ul.append(li);
    }
    frag.append(ul, el("p", "ao-mention", "Note d'adéquation provisoire : elle classe les avis selon votre métier, votre zone et le temps restant. Elle ne prédit pas l'attribution du marché."));
    return frag;
  };

  const lancer = async (ent) => {
    say("Recherche des appels d'offres ouverts…");
    try {
      const top = classerAppels(await chercher(ent), ent).slice(0, 5);
      say(top.length ? `${ent.nom} · ${ent.metier} · département ${ent.departement} et région` : "Aucun appel d'offres ouvert trouvé pour ce métier dans votre région. Essayez un autre mot.");
      out.replaceChildren(rendu(top, ent));
    } catch { say("La source officielle (BOAMP) ne répond pas pour le moment. Réessayez dans un instant.", true); }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const saisie = form.elements.siren.value.trim(), siren = saisie.replace(/\s/g, ""), bouton = form.querySelector("button");
    out.replaceChildren();
    bouton.disabled = true;
    try {
      if (SIREN_RE.test(siren)) {
        say("Lecture de votre entreprise…");
        let ent = null;
        try { const r = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siren}&per_page=1`); ent = entrepriseDepuisAnnuaire(((await r.json()).results || []).find((x) => String(x.siren) === siren)); } catch { ent = null; }
        if (!ent) { say("Entreprise introuvable : vérifiez le numéro SIREN.", true); return; }
        if (!ent.departement) { say(`${ent.nom} : département introuvable dans l'annuaire.`, true); return; }
        if (!METIERS_CHANTIER[ent.naf]) { say(`${ent.nom} : activité non reconnue automatiquement. Écrivez votre métier dans le champ et indiquez votre département.`, true); return; }
        ent.metier = METIERS_CHANTIER[ent.naf].nom;
        await lancer(ent);
      } else {
        const dep = (form.elements.dep?.value || "").trim().toUpperCase().replace(/^0+(?=\d{2})/, "");
        if (!/^(\d{2}|2[AB]|97\d)$/.test(dep)) { say("Pour chercher par métier, indiquez aussi votre département (ex. : 69).", true); return; }
        const m = resoudreMetier(saisie); if (m.erreur) { say(m.erreur, true); return; }
        await lancer({ siren: "", nom: "Votre recherche", departement: dep, effectif: null, tranche: "", ...m });
      }
    } finally { bouton.disabled = false; }
  });
}
