import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";
import { buildSubmitPayload, buildDecisionPayload, buildProspectsPayload, buildAnalysePayload, buildProspectsFromAnalysis, buildOpportunitePayload, buildFichesPayload, fichesToCsv, MISSION_TYPE_FICHES, MISSION_TYPE_OPPORTUNITE, MISSION_TYPE_ANALYSE, callApi, statusLabel, APPROVAL_LABELS, MISSION_TYPE_PROSPECTS, prospectsToCsv, prospectsFilename } from "./cheexpeer-command.mjs";

// Projet cible : MajestiOS-Test (les API Cheexpeer n'existent que là). Même configuration que la relecture des annonces.
const supabase = createClient(ANNONCES_SUPABASE.url, ANNONCES_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
const $ = (s) => document.querySelector(s);
const frame = $(".admin-frame"), gate = $("#gate"), workspace = $("#workspace"), gateMessage = $("#gate-message"), sessionLabel = $("#session-label"), signout = $("#signout");
const loginForm = $("#cx-login"), submitForm = $("#cx-submit");
const submitStatus = $("#cx-submit-status"), detailStatus = $("#cx-detail-status"), detailBox = $("#cx-detail"), recentBox = $("#cx-recent");
const RECENT_KEY = "majestios.cheexpeer.recent.v1";
let organizationId = null, currentMission = null;

const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const fmt = (d) => d ? new Date(d).toLocaleString("fr-FR") : "—";
const say = (node, message, error = false) => { node.textContent = message; node.classList.toggle("error", error); node.hidden = !message; };
function lock(message, { signed = false, login = false } = {}) {
  frame.classList.add("is-locked"); workspace.hidden = true; gate.hidden = false; gateMessage.textContent = message;
  sessionLabel.textContent = signed ? "Compte connecté · accès refusé" : "Non connecté"; signout.hidden = !signed; loginForm.hidden = !login;
}
const readRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]").filter((x) => typeof x?.id === "string").slice(0, 8); } catch { return []; } };
function remember(id, title) { try { localStorage.setItem(RECENT_KEY, JSON.stringify([{ id, title, at: Date.now() }, ...readRecent().filter((x) => x.id !== id)].slice(0, 8))); } catch { /* facultatif */ } renderRecent(); }
function renderRecent() {
  recentBox.replaceChildren();
  const items = readRecent();
  if (!items.length) { recentBox.append(el("li", "cx-meta", "Aucune mission suivie dans ce navigateur.")); return; }
  for (const item of items) { const li = el("li"); const b = el("button", "", `${item.title || "Mission"} · ${item.id.slice(0, 8)}…`); b.type = "button"; b.addEventListener("click", () => openMission(item.id)); li.append(b); recentBox.append(li); }
}
async function token() { const { data: { session } } = await supabase.auth.getSession(); return session?.access_token || null; }

async function authorize() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) { lock("Connectez-vous avec le compte interne qui vous a été attribué.", { login: true }); return false; }
  const { data: members, error: me } = await supabase.from("organization_members").select("organization_id,role").eq("user_id", session.user.id).in("role", ["owner", "admin"]).limit(20);
  if (me) { lock("Vos habilitations n'ont pas pu être vérifiées.", { signed: true }); return false; }
  const ids = (members || []).map((m) => m.organization_id);
  const { data: orgs } = ids.length ? await supabase.from("organizations").select("id,kind").in("id", ids) : { data: [] };
  const internal = (orgs || []).filter((o) => o.kind === "internal");
  if (internal.length !== 1) { lock(internal.length ? "Plusieurs organisations internes sont associées à ce compte. Accès suspendu." : "Ce compte n'est ni propriétaire ni administrateur de l'organisation interne.", { signed: true }); return false; }
  organizationId = internal[0].id;
  sessionLabel.textContent = "Accès interne vérifié"; signout.hidden = false; gate.hidden = true; workspace.hidden = false; frame.classList.remove("is-locked");
  renderRecent();
  refreshChat(); loadChatHistory();
  return true;
}

const autoBox = $("#cx-auto"), AUTO_KEY = "majestios.cheexpeer.auto.v1";
try { if (autoBox && localStorage.getItem(AUTO_KEY) === "0") autoBox.checked = false; } catch { /* sans importance */ }
autoBox?.addEventListener("change", () => { try { localStorage.setItem(AUTO_KEY, autoBox.checked ? "1" : "0"); } catch { /* sans importance */ } });
const auto = () => !autoBox || autoBox.checked;
let chainFichesNext = false, keptList = null, lastScores = new Map();
/** Meilleures notes d'abord, puis les plus proches. */
const bestFirst = (list) => [...list].sort((a, b) => (b.score?.note ?? -1) - (a.score?.note ?? -1) || (a.distance_km ?? 1e9) - (b.distance_km ?? 1e9));
const keepScores = (list) => { lastScores = new Map((list || []).filter((e) => e?.siren).map((e) => [String(e.siren), { note: e.score?.note ?? null, preuve: e.score?.preuve ?? null, distance_km: e.distance_km ?? null }])); };
function renderMission(data) {
  const m = data.mission; currentMission = m.id;
  detailBox.replaceChildren(); detailBox.hidden = false;
  const head = el("div"); head.append(el("h3", "", m.title), el("span", "cx-pill", statusLabel(m.status)));
  const meta = el("p", "cx-meta"); for (const t of [`Lancée : ${fmt(m.created_at)}`, ...(m.finished_at ? [`Terminée : ${fmt(m.finished_at)}`] : [])]) meta.append(el("span", "", t));
  detailBox.append(head, meta);
  if (m.objective) detailBox.append(el("p", "", m.objective));
  for (const a of data.approvals || []) {
    const box = el("div", "cx-card"); box.append(el("p", "", a.action_summary || "En attente de votre accord"), el("span", "cx-pill", APPROVAL_LABELS[a.status] || a.status));
    if (a.decision_note) box.append(el("p", "cx-meta", "Note : " + a.decision_note));
    if (a.status === "pending") {
      const note = el("input"); note.placeholder = "Note de décision (facultatif)"; note.maxLength = 2000;
      const actions = el("div", "cx-actions");
      for (const [decision, label, cls] of [["approved", "Valider", "cx-primary"], ["rejected", "Refuser", ""]]) {
        const b = el("button", cls, label); b.type = "button";
        b.addEventListener("click", () => decide(a.id, decision, note.value, actions));
        actions.append(b);
      }
      box.append(note, actions);
    }
    detailBox.append(box);
  }
  if (m.error_summary) detailBox.append(el("p", "cx-status error", "Erreur : " + m.error_summary));
  if ((m.mission_type === MISSION_TYPE_PROSPECTS || m.mission_type === MISSION_TYPE_ANALYSE || m.mission_type === MISSION_TYPE_OPPORTUNITE || m.mission_type === MISSION_TYPE_FICHES) && m.status === "queued") {
    const run = el("div", "cx-actions"); const b = el("button", "cx-primary", "Reprendre"); b.type = "button";
    b.addEventListener("click", () => runMissions(b)); run.append(b); detailBox.append(run);
  }
  if (m.mission_type === MISSION_TYPE_PROSPECTS && Array.isArray(m.result?.entreprises)) renderProspects(m.result);
  else if (m.mission_type === MISSION_TYPE_ANALYSE && Array.isArray(m.result?.propositions)) renderAnalyse(m.result);
  else if (m.mission_type === MISSION_TYPE_OPPORTUNITE && Array.isArray(m.result?.partenaires)) renderOpportunite(m.result);
  else if (m.mission_type === MISSION_TYPE_FICHES && Array.isArray(m.result?.fiches)) renderFiches(m.result);
  else if (m.result && Object.keys(m.result).length) detailBox.append(el("pre", "cx-result", JSON.stringify(m.result, null, 2)));
  const events = el("ul", "cx-timeline"); for (const e of data.events || []) events.append(el("li", "", `${fmt(e.occurred_at)} · ${EVENT_LABELS[e.event_type] || "Étape enregistrée"}`));
  if (events.children.length) { const d = el("details", "cx-history"); d.append(el("summary", "", "Historique des étapes"), events); detailBox.append(d); }
  say(detailStatus, "");
}

/** Bouton « Compléter les fiches » sous une liste d'entreprises : crée une mission (30 au plus) qui attend votre validation. */
function addFichesButton(box, entreprises, label) {
  const list = bestFirst((entreprises || []).filter((e) => e && e.siren));
  if (!list.length) return null;
  const status = el("p", "cx-status"); status.hidden = true;
  const actions = el("div", "cx-actions"); const b = el("button", "", `Trouver dirigeants, téléphones et e-mails (${Math.min(list.length, 30)} premières entreprises)`); b.type = "button";
  b.addEventListener("click", async () => {
    const body = buildFichesPayload({ organizationId, entreprises: list, label, idempotencyKey: crypto.randomUUID() });
    if (!body) { say(status, "Aucune entreprise exploitable.", true); return; }
    b.disabled = true; await launch(body, status); b.disabled = false;
  });
  actions.append(b); box.append(actions, status); return b;
}
function renderFiches(r) {
  const withScores = lastScores.size > 0;
  if (withScores) r = { ...r, fiches: bestFirst((r.fiches || []).map((f) => ({ ...f, score: lastScores.get(String(f.siren)) ? { note: lastScores.get(String(f.siren)).note } : null, distance_km: lastScores.get(String(f.siren))?.distance_km ?? null }))) };
  const box = el("div", "cx-card");
  box.append(el("p", "admin-kicker", "FICHES CONTACTS"), el("p", "", `${r.nombre} fiche(s). ${r.avertissement || ""}`));
  const actions = el("div", "cx-actions"); const dl = el("button", "cx-primary", "Télécharger (Excel / Google Sheets)"); dl.type = "button";
  dl.addEventListener("click", () => { const blob = new Blob([fichesToCsv(r.fiches, withScores ? lastScores : null)], { type: "text/csv;charset=utf-8" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "fiches-contacts.csv"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); });
  actions.append(dl); box.append(actions);
  const wrap = el("div", "cx-table-wrap"); wrap.style.overflowX = "auto"; const table = el("table", "cx-table"); const head = el("tr");
  for (const h of [...(withScores ? ["Note /20", "Distance"] : []), "Entreprise", "SIREN", "Dirigeant(s) (annuaire officiel)", "Google Maps", "Correspondance", "Téléphone", "E-mail", "Site web"]) head.append(el("th", "", h)); table.append(head);
  for (const f of r.fiches || []) {
    const tr = el("tr"); if (withScores) for (const v of [f.score?.note != null ? `${f.score.note}/20` : "—", f.distance_km != null ? `${String(f.distance_km).replace(".", ",")} km` : "—"]) tr.append(el("td", "", v));
    const dir = (f.dirigeants || []).map((d) => [d.nom, d.qualite && `(${d.qualite})`].filter(Boolean).join(" ")).join(" ; ");
    for (const v of [f.nom, f.siren, dir || "non trouvé"]) tr.append(el("td", "", v ?? ""));
    const td = el("td"); if (f.google?.lien_google_maps) { const a = el("a", "", "ouvrir"); a.href = f.google.lien_google_maps; a.target = "_blank"; a.rel = "noopener noreferrer"; td.append(a); } else td.textContent = "—"; tr.append(td);
    for (const v of [f.google?.statut || "—", f.telephone ? `${f.telephone} (${f.telephone_source})` : "non trouvé", (f.emails || []).length ? `${f.emails.join(" ; ")} (${f.email_source})` : "non trouvé"]) tr.append(el("td", "", v));
    const ts = el("td"); if (f.site_web) { const a = el("a", "", f.site_web.replace(/^https?:\/\/(www\.)?/, "").slice(0, 40)); a.href = f.site_web; a.target = "_blank"; a.rel = "noopener noreferrer"; ts.append(a); } else ts.textContent = "non trouvé"; tr.append(ts);
    table.append(tr);
  }
  wrap.append(table); box.append(wrap); detailBox.append(box);
  if (keptList) { const d = el("details", "cx-history"); d.append(el("summary", "", "Liste complète des entreprises"), keptList); detailBox.append(d); keptList = null; }
}
function renderProspects(result) {
  const list = result.entreprises, c = result.criteres || {};
  const box = el("div", "cx-card");
  box.append(el("p", "admin-kicker", "RÉSULTAT"), el("p", "", `${list.length} entreprise(s) · métier ${c.naf || "?"} · ${c.region || "région"} (marché dans le département ${c.departement || "?"})` + (result.reduit ? " · liste réduite pour tenir dans la taille autorisée" : "")));
  if (result.chantier) { const rp = result.repartition_distance; box.append(el("p", "cx-meta", `Chantier : ${result.chantier.origine} — à confirmer (distance à vol d'oiseau).` + (rp ? ` Entreprises à moins de ${rp.paliers_km[0]} km : ${rp.jusqua_palier_1} · ${rp.paliers_km[1]} km : ${rp.jusqua_palier_2} · ${rp.paliers_km[2]} km : ${rp.jusqua_palier_3}.` : ""))); }
  box.append(el("p", "cx-meta", "Téléphone, e-mail et site web : bouton « Trouver dirigeants, téléphones et e-mails » ci-dessus. Source : " + (result.sources || []).join(", ") + "."));
  const actions = el("div", "cx-actions"); const dl = el("button", "cx-primary", "Télécharger (Excel / Google Sheets)"); dl.type = "button";
  dl.addEventListener("click", () => {
    const blob = new Blob([prospectsToCsv(list)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = prospectsFilename(c); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  actions.append(dl); box.append(actions);
  keepScores(list);
  const fichesBtn = addFichesButton(box, list, `${c.naf || ""} dép. ${c.departement || ""}`);
  const APERCU = 30, shown = list.slice(0, APERCU);
  if (list.length > APERCU) box.append(el("p", "cx-meta", `Aperçu : les ${APERCU} premières lignes sur ${list.length}. La liste complète est dans le fichier à télécharger.` + (result.plafond_atteint ? " Plafond de sécurité atteint : le métier compte encore d'autres entreprises dans ce département." : "")));
  const wrap = el("div", "cx-table-wrap"); wrap.style.overflowX = "auto";
  const table = el("table", "cx-table"); const head = el("tr");
  const avecDist = (result.entreprises || []).some((e) => e.score) || !!result.chantier;
  for (const h of [...(avecDist ? ["Note", "Distance"] : []), "Entreprise", "SIREN", "NAF", "Établissement", "Commune", "Dép.", "Zone", "RGE", "Téléphone", "E-mail", "Google Maps"]) head.append(el("th", "", h));
  table.append(head);
  for (const e of shown) { const tr = el("tr"); for (const v of [...(avecDist ? [e.score ? `${String(e.score.note).replace(".", ",")}/20` : "—", e.distance_km != null ? `${String(e.distance_km).replace(".", ",")} km` : "—"] : []), e.nom, e.siren, e.naf, e.etablissement, e.commune, e.departement, e.zone, e.rge ? "oui" : "—", e.telephone || "à compléter", e.email || "à compléter", e.google_maps || "à compléter"]) tr.append(el("td", "", v ?? "")); table.append(tr); }
  wrap.append(table); box.append(wrap); detailBox.append(box);
  if (chainFichesNext && fichesBtn) { chainFichesNext = false; keptList = box; fichesBtn.click(); }
}
const eur = (n) => Number.isFinite(Number(n)) && n !== null ? Number(n).toLocaleString("fr-FR") + " €" : "—";
function renderOpportunite(r) {
  const box = el("div", "cx-card"), mk = r.marche || {}, ind = r.indice || {};
  box.append(el("p", "admin-kicker", "FICHE D'OPPORTUNITÉ"), el("p", "", mk.objet || ""));
  box.append(el("p", "cx-meta", `Attribué le ${mk.date_attribution || "—"} · Montant : ${eur(mk.montant)}${mk.indicateur_montant ? " (" + mk.indicateur_montant + ")" : ""} · Durée : ${mk.duree_mois ? mk.duree_mois + " mois" : "—"} · Acheteur : ${mk.acheteur || "—"}`));
  box.append(el("p", "admin-kicker", "GAGNANT(S)"));
  const g = el("ul"); for (const w of r.gagnants || []) g.append(el("li", "", `${w.nom || "—"} · SIREN ${w.siren} · NAF ${w.naf || "?"} · ${w.categorie || "catégorie ?"} · effectif ${w.tranche_effectif ? "tranche " + w.tranche_effectif : "inconnu"}`)); box.append(g);
  box.append(el("p", "admin-kicker", "INDICE : " + String(ind.niveau || "—").toUpperCase()), el("p", "", ind.formulation || ""));
  const why = el("ul"); for (const t of ind.raisons || []) why.append(el("li", "", t)); box.append(why);
  box.append(el("p", "cx-meta", `Qualification : ${ind.qualification || "non réalisée"} · seuils provisoires, à fixer après essais sur cas réels.`));
  box.append(el("p", "admin-kicker", "MÉTIER ET LIEU"));
  const mt = el("ul"); for (const x of r.metiers || []) mt.append(el("li", "", `${x.naf} · ${x.libelle || ""} — ${x.origine}${x.extrait ? " : « …" + x.extrait + "… »" : ""}`)); box.append(mt);
  box.append(el("p", "cx-meta", `Territoire : ${(r.territoire?.departements || []).join(", ") || "non déterminé"} (${r.territoire?.origine || "—"})`));
  box.append(el("p", "admin-kicker", `${(r.partenaires || []).length} PARTENAIRE(S) POTENTIEL(S)`));
  const actions = el("div", "cx-actions"); const dl = el("button", "cx-primary", "Télécharger (Excel / Google Sheets)"); dl.type = "button";
  dl.addEventListener("click", () => {
    const blob = new Blob([prospectsToCsv(r.partenaires || [])], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `opportunite-${String(mk.contract_uid || "marche").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 30)}.csv`; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  actions.append(dl); box.append(actions);
  keepScores(r.partenaires);
  const fichesBtn = addFichesButton(box, r.partenaires, "partenaires du marché");
  if (r.chantier) box.append(el("p", "cx-meta", `Lieu du chantier retenu : ${r.chantier.origine} — à confirmer (distance à vol d'oiseau, paliers 25 / 50 / 100 km).`));
  const wrap = el("div", "cx-table-wrap"); wrap.style.overflowX = "auto"; const table = el("table", "cx-table"); const head = el("tr");
  for (const h of ["Score (provisoire)", "Distance", "Entreprise", "SIREN", "NAF", "Commune", "Dép.", "Pourquoi"]) head.append(el("th", "", h)); table.append(head);
  for (const e of (r.partenaires || []).slice(0, 30)) { const tr = el("tr"); for (const v of [e.score ? `${String(e.score.note).replace(".", ",")}/20` : "—", e.distance_km != null ? `${String(e.distance_km).replace(".", ",")} km` : "—", e.nom, e.siren, e.naf, e.commune, e.departement, e.raison]) tr.append(el("td", "", v ?? "")); table.append(tr); }
  wrap.append(table); box.append(wrap); detailBox.append(box);
  if (chainFichesNext && fichesBtn) { chainFichesNext = false; keptList = box; fichesBtn.click(); }
}
let chainNext = false;
function renderAnalyse(r) {
  const box = el("div", "cx-card");
  box.append(el("p", "admin-kicker", "ANALYSE DE L'ANNONCE " + (r.idweb || "")), el("p", "", r.objet || ""));
  box.append(el("p", "cx-meta", `Acheteur : ${r.acheteur || "—"} · Date limite : ${r.date_limite ? fmt(r.date_limite) : "—"}`));
  box.append(el("p", "admin-kicker", "LOTS ET LIEU DES TRAVAUX"));
  const ul = el("ul");
  for (const l of r.lots || []) ul.append(el("li", "", `${l.id} · ${l.titre || "—"} → ${l.lieu?.departements?.length ? "département(s) " + l.lieu.departements.join(", ") + (l.lieu.commune ? " (" + l.lieu.commune + ")" : "") : "lieu non déterminé"} · origine : ${l.lieu?.origine || "—"}`));
  box.append(ul);
  box.append(el("p", "admin-kicker", "MÉTIERS REPÉRÉS DANS L'ANNONCE (décochez ceux qui ne vous intéressent pas)"));
  if (!r.propositions.length) box.append(el("p", "cx-status", "Aucun métier reconnu dans l'avis : saisissez le code NAF à la main ci-dessous."));
  const nafChecks = [], deptChecks = [];
  for (const p of r.propositions) {
    const label = el("label", "cx-meta"); const c = document.createElement("input"); c.type = "checkbox"; c.value = p.naf; c.checked = p.niveau === "forte"; nafChecks.push(c);
    label.append(c, document.createTextNode(` ${p.naf} · ${p.libelle || ""} · ${p.niveau} · lot ${p.lot} — « …${p.extrait}… »`)); box.append(label);
  }
  const manual = document.createElement("input"); manual.placeholder = "Autre métier, code NAF (ex. 43.22B)"; manual.maxLength = 6; box.append(manual);
  box.append(el("p", "admin-kicker", "OÙ CHERCHER (départements)"));
  for (const d of r.departements || []) { const label = el("label", "cx-meta"); const c = document.createElement("input"); c.type = "checkbox"; c.value = d; c.checked = true; deptChecks.push(c); label.append(c, document.createTextNode(" " + d)); box.append(label); }
  const dep2 = document.createElement("input"); dep2.placeholder = (r.departements || []).length ? "Autre département (facultatif)" : "Département (territoire non déterminé)"; dep2.maxLength = 3; box.append(dep2);
  const communeLieu = (r.lots || []).map((l) => l.lieu?.commune).find(Boolean);
  box.append(el("p", "cx-meta", communeLieu ? `Commune du chantier lue dans l'avis : ${communeLieu}. Les entreprises seront classées par distance à vol d'oiseau (à confirmer).` : "Commune du chantier non précisée dans l'avis : les entreprises seront cherchées par département, sans distance."));
  const status = el("p", "cx-status"); status.hidden = true;
  const actions = el("div", "cx-actions"); const go = el("button", "cx-primary", "Trouver les entreprises"); go.type = "button";
  go.addEventListener("click", async () => {
    const nafs = nafChecks.filter((c) => c.checked).map((c) => c.value); if (manual.value.trim()) nafs.push(manual.value.trim().toUpperCase().replace(/\s/g, "").replace(/^(\d{2})(\d{2}[A-Z])$/, "$1.$2"));
    const depts = deptChecks.filter((c) => c.checked).map((c) => c.value); if (dep2.value.trim()) depts.push(dep2.value.trim().toUpperCase());
    const communeLot = (r.lots || []).map((l) => l.lieu?.commune).find(Boolean) || "";
    const built = buildProspectsFromAnalysis({ organizationId, nafs, departements: depts, marcheObjet: r.objet, communeChantier: communeLot, newKey: () => crypto.randomUUID() });
    if (!built.ok) { say(status, built.message, true); return; }
    go.disabled = true; let done = 0;
    for (const [i, body] of built.bodies.entries()) { chainFichesNext = auto() && i === built.bodies.length - 1; const ok = await launch(body, status); if (!ok) break; done++; }
    chainFichesNext = false;
    go.disabled = false; if (done === built.bodies.length) say(status, "Terminé. La liste d'entreprises est dans le suivi, plus bas.");
  });
  actions.append(go); box.append(actions, status); detailBox.append(box);
  if (chainNext) { chainNext = false; if (r.propositions.some((p) => p.niveau === "forte") && (r.departements || []).length) { say(status, "Cheexpeer a retenu les métiers les plus sûrs et lance la recherche d'entreprises, leurs notes et leurs coordonnées…"); go.click(); } }
}

const EVENT_LABELS = { mission_submitted: "Demande enregistrée", approval_requested: "Validation demandée", approval_approved: "Validée", approval_rejected: "Refusée", mission_claimed: "Prise en charge", mission_started: "Travail commencé", mission_succeeded: "Terminée", mission_failed: "Échec", mission_completed: "Terminée" };
/** Un seul clic : envoi, validation (c'est votre clic qui décide), exécution, puis affichage du résultat. */
async function launch(body, statusNode, { run = true } = {}) {
  say(statusNode, "Cheexpeer travaille…");
  const sent = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "submit", token: await token(), body });
  if (!sent.ok) { say(statusNode, sent.message, true); return false; }
  const id = sent.data.mission.mission_id; remember(id, body.title);
  const read = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "read", token: await token(), body: { organization_id: organizationId, mission_id: id } });
  const pending = read.ok ? (read.data.approvals || []).find((a) => a.status === "pending") : null;
  if (pending) {
    const decided = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "decision", token: await token(), body: buildDecisionPayload({ organizationId, approvalId: pending.id, decision: "approved", note: "Lancé d'un clic par un administrateur" }) });
    if (!decided.ok) { say(statusNode, decided.message, true); await openMission(id); return false; }
  }
  if (run) {
    const ran = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "run", token: await token(), body: { organization_id: organizationId } });
    if (!ran.ok) { say(statusNode, ran.message, true); await openMission(id); return false; }
    if (ran.data.failed?.length) { say(statusNode, "Cheexpeer n'a pas pu terminer cette tâche. Le détail est dans le suivi.", true); await openMission(id); return false; }
  }
  say(statusNode, "Terminé. Le résultat est dans le suivi, plus bas.");
  await openMission(id); return true;
}
async function runMissions(button) {
  button.disabled = true; say(detailStatus, "Exécution en cours…");
  const result = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "run", token: await token(), body: { organization_id: organizationId } });
  button.disabled = false;
  if (!result.ok) { say(detailStatus, result.message, true); return; }
  if (result.data.failed?.length) { say(detailStatus, "L'exécution a échoué pour une mission. Consultez son historique.", true); }
  await openMission(currentMission);
}

async function openMission(id) {
  say(detailStatus, "Lecture de la mission…");
  const result = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "read", token: await token(), body: { organization_id: organizationId, mission_id: id } });
  if (!result.ok) { detailBox.hidden = true; say(detailStatus, result.message, true); return; }
  renderMission(result.data);
}
async function decide(approvalId, decision, note, actions) {
  const body = buildDecisionPayload({ organizationId, approvalId, decision, note });
  actions.querySelectorAll("button").forEach((b) => { b.disabled = true; });
  const result = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "decision", token: await token(), body });
  if (!result.ok) { say(detailStatus, result.message, true); actions.querySelectorAll("button").forEach((b) => { b.disabled = false; }); return; }
  await openMission(currentMission);
}


// ---- Dialogue avec Majestios Bot (nom visible de Cheexpeer) ----
const chatState = $("#cx-chat-state"), chatLog = $("#cx-chat-log"), chatForm = $("#cx-chat-form"), chatToggle = $("#cx-chat-toggle"), chatClear = $("#cx-chat-clear");
let chatConversation = null, chatEnabled = false;
const botPanel = $("#cx-bot-panel"), botLauncher = $("#cx-bot-launcher"), botClose = $("#cx-bot-close");
function setBot(open) { botPanel.hidden = !open; botLauncher.setAttribute("aria-expanded", String(open)); if (open) chatForm.elements.message?.focus(); else botLauncher.focus(); }
botLauncher.addEventListener("click", () => setBot(true));
botClose.addEventListener("click", () => setBot(false));
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !botPanel.hidden) setBot(false); });
function addChat(role, text) {
  const li = el("li", role === "user" ? "me" : "bot"); li.append(el("span", "who", role === "user" ? "VOUS" : "MAJESTIOS BOT"), document.createTextNode(text));
  chatLog.append(li); chatLog.scrollTop = chatLog.scrollHeight;
}
async function refreshChat() {
  const { data, error } = await supabase.rpc("cheexpeer_chat_status");
  if (error || !data) { say(chatState, "L'état du dialogue n'a pas pu être lu.", true); chatForm.hidden = true; return; }
  chatEnabled = data.enabled === true;
  say(chatState, chatEnabled
    ? `Dialogue actif · ${data.used_today}/${data.daily_cap} messages aujourd'hui · ${data.used_month}/${data.monthly_cap} ce mois-ci.`
    : "Le dialogue est éteint. Il ne coûte rien tant qu'il est éteint." + (data.is_owner ? "" : " Seul le propriétaire peut l'activer."));
  chatToggle.hidden = !data.is_owner; chatToggle.textContent = chatEnabled ? "Éteindre le dialogue" : "Activer le dialogue";
  chatForm.hidden = !chatEnabled;
}
async function loadChatHistory() {
  const { data } = await supabase.rpc("cheexpeer_chat_history", { p_conversation: null });
  chatLog.replaceChildren(); chatConversation = data?.conversation_id || null;
  for (const m of data?.messages || []) addChat(m.role, m.content);
  chatClear.hidden = !chatConversation;
}
chatToggle.addEventListener("click", async () => {
  chatToggle.disabled = true;
  const { error } = await supabase.rpc("set_cheexpeer_chat_enabled", { p_enabled: !chatEnabled });
  chatToggle.disabled = false;
  if (error) { say(chatState, "Action refusée : seul le propriétaire peut modifier cet interrupteur.", true); return; }
  await refreshChat();
});
chatClear.addEventListener("click", async () => {
  if (chatConversation) await supabase.rpc("cheexpeer_chat_clear", { p_conversation: chatConversation });
  await loadChatHistory();
});
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const field = chatForm.elements.message, text = field.value.trim(); if (!text) return;
  const button = chatForm.querySelector("button[type=submit]"); button.disabled = true; addChat("user", text); field.value = "";
  const result = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "chat", token: await token(), body: { message: text, conversation_id: chatConversation } });
  button.disabled = false;
  if (!result.ok) { addChat("assistant", (typeof result.data?.error === "string" && result.data.error) || result.message || "Majestios Bot ne peut pas répondre."); await refreshChat(); return; }
  chatConversation = result.data.conversation_id; chatClear.hidden = false; addChat("assistant", result.data.reply); await refreshChat();
});

submitForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = buildSubmitPayload({ organizationId, title: submitForm.elements.title.value, objective: submitForm.elements.objective.value, idempotencyKey: crypto.randomUUID() });
  if (!body) { say(submitStatus, "Indiquez un intitulé.", true); return; }
  const button = submitForm.querySelector("button[type=submit]"); button.disabled = true;
  await launch(body, submitStatus, { run: false });
  button.disabled = false;
});
const analyseForm = $("#cx-analyse"), analyseStatus = $("#cx-ana-status");
analyseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = buildAnalysePayload({ organizationId, idweb: analyseForm.elements.idweb.value, idempotencyKey: crypto.randomUUID() });
  if (!body) { say(analyseStatus, "Indiquez le numéro de l'annonce, par exemple 26-111564.", true); return; }
  const button = analyseForm.querySelector("button[type=submit]"); button.disabled = true;
  chainNext = auto(); chainFichesNext = false;
  await launch(body, analyseStatus);
  chainNext = false; button.disabled = false;
});
const oppForm = $("#cx-opp-search"), oppStatus = $("#cx-opp-status"), oppList = $("#cx-opp-list");
oppForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const q = oppForm.elements.query.value.trim(), dep = oppForm.elements.departement.value.trim().toUpperCase();
  const button = oppForm.querySelector("button"); button.disabled = true; say(oppStatus, "Recherche…"); oppList.replaceChildren();
  const { data, error } = await supabase.rpc("list_awarded_contracts", { p_department: /^(0[1-9]|[1-8][0-9]|9[0-5]|2[AB]|97[1-6])$/.test(dep) ? dep : null, p_query: q.length >= 3 ? q : null, p_cpv: null, p_min_amount: null, p_months: 6, p_limit: 10, p_offset: 0 });
  button.disabled = false;
  if (error) { say(oppStatus, "La recherche a échoué. Réessayez.", true); return; }
  say(oppStatus, data?.length ? `${data.length} marché(s) trouvé(s). Cliquez sur « Analyser » : Cheexpeer fait le reste.` : "Aucun marché trouvé : essayez un autre mot-clé.");
  for (const c of data || []) {
    const li = el("li"); li.append(el("p", "", `${c.object || "—"}`), el("p", "cx-meta", `${c.awarded_on} · ${eur(c.amount)} · gagnant : ${c.winners || "—"} · acheteur : ${c.buyer_name || "—"} (${c.buyer_dept || "?"})`));
    const b = el("button", "cx-primary", "Analyser"); b.type = "button";
    b.addEventListener("click", async () => {
      const body = buildOpportunitePayload({ organizationId, contractUid: c.contract_uid, label: c.winners, idempotencyKey: crypto.randomUUID() });
      if (!body) { say(oppStatus, "Marché non utilisable.", true); return; }
      b.disabled = true; chainFichesNext = auto(); await launch(body, oppStatus); chainFichesNext = false; b.disabled = false;
    });
    li.append(b); oppList.append(li);
  }
});
const prospectsForm = $("#cx-prospects"), prospectsStatus = $("#cx-pro-status");
prospectsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const f = prospectsForm.elements;
  const body = buildProspectsPayload({ organizationId, naf: f.naf.value, departement: f.departement.value, limite: f.limite.value, gagnantNom: f.gagnant_nom.value, gagnantSiren: f.gagnant_siren.value, marcheObjet: f.marche_objet.value, idempotencyKey: crypto.randomUUID() });
  if (!body) { say(prospectsStatus, "Vérifiez le code métier (ex. 43.22B), le département (ex. 81) et le numéro SIREN s'il est rempli.", true); return; }
  const button = prospectsForm.querySelector("button"); button.disabled = true;
  chainFichesNext = auto();
  await launch(body, prospectsStatus); chainFichesNext = false;
  button.disabled = false;
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = loginForm.elements.email.value.trim().toLowerCase();
  const button = loginForm.querySelector("button"); button.disabled = true;
  try {
    try { localStorage.setItem("majestios.retour.connexion", JSON.stringify({ page: location.pathname.split("/").pop(), t: Date.now() })); } catch { /* sans importance */ }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } });
    if (error) throw error;
    gateMessage.textContent = "Un e-mail vient d’être envoyé à " + email + ". Ouvrez-le et cliquez sur le lien : vous reviendrez ici, connecté. Pensez à regarder les courriers indésirables.";
    button.textContent = "Renvoyer le lien";
  } catch (error) { gateMessage.textContent = "Connexion impossible : " + (error?.message || "réessayez plus tard."); }
  finally { setTimeout(() => { button.disabled = false; }, 30000); }
});
signout.addEventListener("click", async () => { await supabase.auth.signOut(); lock("Vous êtes déconnecté.", { login: true }); });
try { await authorize(); } catch (error) { console.error(error); lock("La vérification des accès a échoué.", { signed: true }); }


// Menu déroulant des missions : une seule mission affichée à la fois ; le suivi, lui, reste toujours visible.
(function () {
  const menu = document.querySelector("#cx-mission-menu"); if (!menu) return;
  const aides = { analyse: "Collez le numéro d'une annonce : Cheexpeer lit l'annonce, trouve les métiers et le lieu, puis cherche les entreprises.", opportunite: "Choisissez un marché récemment attribué : Cheexpeer identifie le gagnant et les entreprises du même métier à contacter.", prospects: "Indiquez un métier et un département : Cheexpeer sort la liste des entreprises correspondantes, à télécharger.", diagnostic: "Vérifie simplement que Cheexpeer répond. Sans effet sur vos données." };
  const KEY = "majestios.cheexpeer.mission.v1";
  const show = (value) => {
    for (const card of document.querySelectorAll("[data-mission]")) card.hidden = card.dataset.mission !== value;
    for (const tab of document.querySelectorAll(".cx-tab")) { const on = tab.dataset.tab === value; tab.setAttribute("aria-selected", String(on)); tab.tabIndex = on ? 0 : -1; }
    const help = document.querySelector("#cx-mission-help"); if (help) help.textContent = aides[value] || "";
    try { localStorage.setItem(KEY, value); } catch { /* sans importance */ }
  };
  let start = menu.value; try { const saved = localStorage.getItem(KEY); if (saved && aides[saved]) start = saved; } catch { /* sans importance */ }
  menu.value = start; show(start);
  menu.addEventListener("change", () => show(menu.value));
  const tabs = [...document.querySelectorAll(".cx-tab")];
  for (const tab of tabs) {
    tab.addEventListener("click", () => { menu.value = tab.dataset.tab; show(tab.dataset.tab); });
    tab.addEventListener("keydown", (event) => {
      const i = tabs.indexOf(tab), d = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0; if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length]; next.focus(); next.click(); event.preventDefault();
    });
  }
})();
