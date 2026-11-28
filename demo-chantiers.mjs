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
    const lots = await Promise.all(mots.slice(0, 2).map((m) => rpc("list_awarded_contracts", { p_department: ent.departement, p_query: m, p_cpv: null, p_min_amount: null, p_months: 12, p_limit: 20, p_offset: 0 }).catch(() => [])));
    const top = classerChantiers(lots.flat(), ent).slice(0, 3);
    say(top.length ? `${ent.nom} · ${ent.metier} · département ${ent.departement}` : "Aucun chantier récent trouvé dans votre département pour ce métier.");
    out.replaceChildren(rendu(top));
  };
  const norm = (t) => String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const choisirMetier = (ent) => {
    say(`${ent.nom} : écrivez votre métier avec vos mots ou votre code NAF/APE (ex. : froid commercial, 43.22B).`);
    const f = el("form", "demo-metier"), inp = el("input"), dl = el("datalist"); inp.name = "metier"; inp.setAttribute("list", "demo-metiers"); inp.placeholder = "Votre métier"; inp.required = true; dl.id = "demo-metiers";
    for (const m of Object.values(METIERS_CHANTIER)) { const o = el("option"); o.value = m.nom; dl.append(o); }
    const b = el("button", "", "Voir mes chantiers"); b.type = "submit";
    f.append(inp, dl, b);
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const t = norm(inp.value); if (t.length < 3) return;
      const code = inp.value.toUpperCase().replace(/[\s.]/g, "").match(/^(\d{2})(\d{2})([A-Z])$/);
      const naf = code ? `${code[1]}.${code[2]}${code[3]}` : null;
      if (naf && !METIERS_CHANTIER[naf]) { say(`Le code ${naf} n'est pas encore reconnu : écrivez votre métier avec vos mots.`, true); return; }
      const hit = naf ? [naf, METIERS_CHANTIER[naf]] : Object.entries(METIERS_CHANTIER).find(([, m]) => norm(m.nom) === t || m.mots.some((w) => norm(w) === t) || norm(m.nom).includes(t));
      b.disabled = true;
      try { await lancer(hit ? { ...ent, naf: hit[0], metier: hit[1].nom, mots: undefined } : { ...ent, naf: null, metier: inp.value.trim().slice(0, 60), mots: [inp.value.trim().slice(0, 60)] }); } finally { b.disabled = false; }
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
    const siren = form.elements.siren.value.replace(/\s/g, ""), button = form.querySelector("button");
    out.replaceChildren();
    if (!SIREN_RE.test(siren)) { say("Le numéro SIREN comporte 9 chiffres.", true); return; }
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
