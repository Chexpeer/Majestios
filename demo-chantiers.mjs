// Démo publique de l'accueil : un SIREN → métier + département lus dans l'annuaire officiel → 3 marchés récents notés /20.
// Aucune inscription, rien n'est enregistré ni envoyé. Les marchés viennent de la fonction publique list_awarded_contracts (limite visiteur).
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";
import { sessionToken, rpcHeaders } from "./visiteur-limite.mjs";
import { METIERS_CHANTIER, SIREN_RE, entrepriseDepuisAnnuaire, classerChantiers } from "./cheexpeer-command.mjs";

const root = document.querySelector("#demo-chantiers");
if (root) {
  const form = root.querySelector("form"), status = root.querySelector("[data-demo-status]"), out = root.querySelector("[data-demo-out]");
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
  const say = (msg, error = false) => { status.textContent = msg; status.hidden = !msg; status.classList.toggle("is-error", error); };
  const eur = (n) => Number.isFinite(Number(n)) && n !== null ? Number(n).toLocaleString("fr-FR") + " €" : "montant non publié";
  const rpc = async (name, body) => {
    const r = await fetch(ANNONCES_SUPABASE.url + "/rest/v1/rpc/" + name, { method: "POST", headers: rpcHeaders(await sessionToken()), body: JSON.stringify(body) });
    if (!r.ok) throw new Error("rpc");
    return r.json();
  };
  const lancer = async (ent) => {
    const mots = ent.mots ?? METIERS_CHANTIER[ent.naf].mots;
    say("Recherche des chantiers récents…");
    const lots = await Promise.all(mots.slice(0, 3).map((m) => rpc("list_awarded_contracts", { p_department: ent.departement, p_query: m, p_cpv: null, p_min_amount: null, p_months: 12, p_limit: 20, p_offset: 0 }).catch(() => [])));
    const top = classerChantiers(lots.flat(), ent).slice(0, 3);
    say(top.length ? `${ent.nom} · ${ent.metier} · département ${ent.departement}` : "Aucun chantier récent trouvé dans votre département pour ce métier. Essayez un autre mot ci-dessous.");
    out.querySelector(".demo-res")?.remove();
    const res = el("div", "demo-res"); res.append(rendu(top)); out.append(res);
  };
  const norm = (t) => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const resoudreMetier = (texte) => {
    const brut = String(texte).trim(), t = norm(brut);
    if (t.length < 3) return { erreur: "Écrivez votre métier (3 lettres au moins) ou votre numéro SIREN." };
    const code = brut.toUpperCase().replace(/[\s.]/g, "").match(/^(\d{2})(\d{2})([A-Z])$/);
    const naf = code ? `${code[1]}.${code[2]}${code[3]}` : null;
    if (naf) return METIERS_CHANTIER[naf] ? { naf, metier: METIERS_CHANTIER[naf].nom, mots: undefined } : { erreur: `Le code ${naf} n'est pas encore reconnu : écrivez votre métier avec vos mots.` };
    const hit = Object.entries(METIERS_CHANTIER).find(([, m]) => norm(m.nom) === t || m.mots.some((w) => norm(w) === t) || norm(m.nom).includes(t));
    if (hit) return { naf: hit[0], metier: hit[1].nom, mots: undefined };
    const mots = [...new Set([brut.slice(0, 60), ...brut.split(/[\s,;]+/).filter((w) => w.length >= 4)])].slice(0, 3);
    return { naf: null, metier: brut.slice(0, 60), mots };
  };
  const choisirMetier = (ent) => {
    say(`${ent.nom} : écrivez votre métier avec vos mots ou votre code NAF/APE (ex. : froid commercial, 43.22B).`);
    const f = el("form", "demo-metier"), inp = el("input"), dl = el("datalist"); inp.name = "metier"; inp.setAttribute("list", "demo-metiers"); inp.placeholder = "Votre métier"; inp.required = true; dl.id = "demo-metiers";
    for (const m of Object.values(METIERS_CHANTIER)) { const o = el("option"); o.value = m.nom; dl.append(o); }
    const b = el("button", "", "Voir mes chantiers"); b.type = "submit";
    f.append(inp, dl, b);
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const m = resoudreMetier(inp.value); if (m.erreur) { say(m.erreur, true); return; }
      b.disabled = true;
      try { await lancer({ ...ent, ...m }); } finally { b.disabled = false; }
    });
    out.replaceChildren(f);
  };
  const rendu = (top) => {
    const frag = document.createDocumentFragment();
      const ul = el("ul", "demo-liste");
      for (const { marche: m, score } of top) {
        const li = el("li", "demo-chantier"), tete = el("div", "demo-tete");
        tete.append(el("strong", "demo-note", `${String(score.note).replace(".", ",")}/20`), el("span", "demo-objet", m.object || "—"));
        const meta = el("p", "demo-meta", `${eur(m.amount)} · ${m.awarded_on || "—"} · acheteur : ${m.buyer_name || "—"} (${m.buyer_dept || "?"})`);
        const det = el("details", "demo-detail"); det.append(el("summary", "", "Pourquoi cette note ?"));
        const crit = el("ul"); for (const c of score.criteres) crit.append(el("li", "", `${c.libelle} : ${String(c.points).replace(".", ",")}/${c.max} — ${c.detail}`));
        det.append(crit); li.append(tete, meta, det); ul.append(li);
      }
      frag.append(ul);
      if (top.length) {
        const cta = el("p", "demo-cta"); const a = el("a", "button-primary", "Voir tous mes chantiers et être alerté"); a.href = "espace-membre.html"; cta.append(a, el("span", "demo-mention", "Note provisoire : elle classe, elle ne garantit rien. Rien n'est enregistré."));
        frag.append(cta);
      }
    return frag;
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const saisie = form.elements.siren.value.trim(), siren = saisie.replace(/\s/g, ""), button = form.querySelector("button");
    out.replaceChildren();
    if (!SIREN_RE.test(siren)) {
      const dep = (form.elements.dep?.value || "").trim().toUpperCase().replace(/^0+(?=\d{2})/, "");
      if (!/^(\d{2}|2[AB]|97\d)$/.test(dep)) { say("Pour chercher par métier, indiquez aussi votre département (ex. : 69).", true); return; }
      const m = resoudreMetier(saisie); if (m.erreur) { say(m.erreur, true); return; }
      button.disabled = true;
      try { await lancer({ siren: "", nom: "Votre recherche", departement: dep, effectif: null, tranche: "", ...m }); } finally { button.disabled = false; }
      return;
    }
    button.disabled = true; say("Lecture de votre entreprise…");
    try {
      let ent = null;
      try { const r = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siren}&per_page=1`); ent = entrepriseDepuisAnnuaire(((await r.json()).results || []).find((x) => String(x.siren) === siren)); } catch { ent = null; }
      if (!ent) { say("Entreprise introuvable : vérifiez le numéro SIREN.", true); return; }
      if (!ent.departement) { say(`${ent.nom} : département introuvable dans l'annuaire.`, true); return; }
      if (!METIERS_CHANTIER[ent.naf]) { choisirMetier(ent); return; }
      await lancer(ent);
    } finally { button.disabled = false; }
  });
}

