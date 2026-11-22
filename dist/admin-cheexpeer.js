import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";
import { buildSubmitPayload, buildDecisionPayload, buildProspectsPayload, buildAnalysePayload, buildProspectsFromAnalysis, MISSION_TYPE_ANALYSE, callApi, statusLabel, APPROVAL_LABELS, MISSION_TYPE_PROSPECTS, prospectsToCsv, prospectsFilename } from "./cheexpeer-command.mjs";

// Projet cible : MajestiOS-Test (les API Cheexpeer n'existent que là). Même configuration que la relecture des annonces.
const supabase = createClient(ANNONCES_SUPABASE.url, ANNONCES_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
const $ = (s) => document.querySelector(s);
const frame = $(".admin-frame"), gate = $("#gate"), workspace = $("#workspace"), gateMessage = $("#gate-message"), sessionLabel = $("#session-label"), signout = $("#signout");
const loginForm = $("#cx-login"), submitForm = $("#cx-submit"), lookupForm = $("#cx-lookup");
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

function renderMission(data) {
  const m = data.mission; currentMission = m.id;
  detailBox.replaceChildren(); detailBox.hidden = false;
  const head = el("div"); head.append(el("h3", "", m.title), el("span", "cx-pill", statusLabel(m.status)));
  const meta = el("p", "cx-meta"); for (const t of [`Type : ${m.mission_type}`, `Créée : ${fmt(m.created_at)}`, `Terminée : ${fmt(m.finished_at)}`, `Autonomie ${m.autonomy_level}`]) meta.append(el("span", "", t));
  detailBox.append(head, meta);
  if (m.objective) detailBox.append(el("p", "", m.objective));
  for (const a of data.approvals || []) {
    const box = el("div", "cx-card"); box.append(el("p", "admin-kicker", "VALIDATION"), el("p", "", a.action_summary || "Validation requise"), el("span", "cx-pill", APPROVAL_LABELS[a.status] || a.status));
    if (a.decision_note) box.append(el("p", "cx-meta", "Note : " + a.decision_note));
    if (a.status === "pending") {
      const note = el("input"); note.placeholder = "Note de décision (facultatif)"; note.maxLength = 2000;
      const actions = el("div", "cx-actions");
      for (const [decision, label, cls] of [["approved", "Approuver", "cx-primary"], ["rejected", "Refuser", ""]]) {
        const b = el("button", cls, label); b.type = "button";
        b.addEventListener("click", () => decide(a.id, decision, note.value, actions));
        actions.append(b);
      }
      box.append(note, actions);
    }
    detailBox.append(box);
  }
  if (m.error_summary) detailBox.append(el("p", "cx-status error", "Erreur : " + m.error_summary));
  if ((m.mission_type === MISSION_TYPE_PROSPECTS || m.mission_type === MISSION_TYPE_ANALYSE) && m.status === "queued") {
    const run = el("div", "cx-actions"); const b = el("button", "cx-primary", "Lancer l'exécution"); b.type = "button";
    b.addEventListener("click", () => runMissions(b)); run.append(b); detailBox.append(run);
  }
  if (m.mission_type === MISSION_TYPE_PROSPECTS && Array.isArray(m.result?.entreprises)) renderProspects(m.result);
  else if (m.mission_type === MISSION_TYPE_ANALYSE && Array.isArray(m.result?.propositions)) renderAnalyse(m.result);
  else if (m.result && Object.keys(m.result).length) detailBox.append(el("pre", "cx-result", JSON.stringify(m.result, null, 2)));
  const events = el("ul", "cx-timeline"); for (const e of data.events || []) events.append(el("li", "", `${fmt(e.occurred_at)} · ${e.event_type} (${e.actor_type})`));
  if (events.children.length) detailBox.append(el("p", "admin-kicker", "HISTORIQUE"), events);
  say(detailStatus, "");
}

function renderProspects(result) {
  const list = result.entreprises, c = result.criteres || {};
  const box = el("div", "cx-card");
  box.append(el("p", "admin-kicker", "RÉSULTAT"), el("p", "", `${list.length} entreprise(s) · métier ${c.naf || "?"} · ${c.region || "région"} (marché dans le département ${c.departement || "?"})` + (result.reduit ? " · liste réduite pour tenir dans la taille autorisée" : "")));
  box.append(el("p", "cx-meta", "Téléphone, e-mail et Google Maps : à compléter dans une étape suivante. Source : " + (result.sources || []).join(", ") + "."));
  const actions = el("div", "cx-actions"); const dl = el("button", "cx-primary", "Télécharger (Excel / Google Sheets)"); dl.type = "button";
  dl.addEventListener("click", () => {
    const blob = new Blob([prospectsToCsv(list)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = prospectsFilename(c); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  actions.append(dl); box.append(actions);
  const wrap = el("div", "cx-table-wrap"); wrap.style.overflowX = "auto";
  const table = el("table", "cx-table"); const head = el("tr");
  for (const h of ["Entreprise", "SIREN", "NAF", "Établissement", "Commune", "Dép.", "Zone", "RGE", "Téléphone", "E-mail", "Google Maps"]) head.append(el("th", "", h));
  table.append(head);
  for (const e of list) { const tr = el("tr"); for (const v of [e.nom, e.siren, e.naf, e.etablissement, e.commune, e.departement, e.zone, e.rge ? "oui" : "—", e.telephone || "à compléter", e.email || "à compléter", e.google_maps || "à compléter"]) tr.append(el("td", "", v ?? "")); table.append(tr); }
  wrap.append(table); box.append(wrap); detailBox.append(box);
}
function renderAnalyse(r) {
  const box = el("div", "cx-card");
  box.append(el("p", "admin-kicker", "ANALYSE DE L'AVIS " + (r.idweb || "")), el("p", "", r.objet || ""));
  box.append(el("p", "cx-meta", `Acheteur : ${r.acheteur || "—"} · Date limite : ${r.date_limite ? fmt(r.date_limite) : "—"} · CPV : ${r.cpv || "—"} · Source : ${r.source || "BOAMP"}`));
  box.append(el("p", "admin-kicker", "LOTS ET LIEU DES TRAVAUX"));
  const ul = el("ul");
  for (const l of r.lots || []) ul.append(el("li", "", `${l.id} · ${l.titre || "—"} → ${l.lieu?.departements?.length ? "département(s) " + l.lieu.departements.join(", ") + (l.lieu.commune ? " (" + l.lieu.commune + ")" : "") : "lieu non déterminé"} · origine : ${l.lieu?.origine || "—"}`));
  box.append(ul);
  box.append(el("p", "admin-kicker", "CODES NAF PROPOSÉS — COCHEZ CEUX QUE VOUS VALIDEZ"));
  if (!r.propositions.length) box.append(el("p", "cx-status", "Aucun métier reconnu dans l'avis : saisissez le code NAF à la main ci-dessous."));
  const nafChecks = [], deptChecks = [];
  for (const p of r.propositions) {
    const label = el("label", "cx-meta"); const c = document.createElement("input"); c.type = "checkbox"; c.value = p.naf; c.checked = p.niveau === "forte"; nafChecks.push(c);
    label.append(c, document.createTextNode(` ${p.naf} · ${p.libelle || ""} · ${p.niveau} · lot ${p.lot} — « …${p.extrait}… »`)); box.append(label);
  }
  const manual = document.createElement("input"); manual.placeholder = "Autre code NAF (ex. 43.22B)"; manual.maxLength = 6; box.append(manual);
  box.append(el("p", "admin-kicker", "DÉPARTEMENTS DE RECHERCHE"));
  for (const d of r.departements || []) { const label = el("label", "cx-meta"); const c = document.createElement("input"); c.type = "checkbox"; c.value = d; c.checked = true; deptChecks.push(c); label.append(c, document.createTextNode(" " + d)); box.append(label); }
  const dep2 = document.createElement("input"); dep2.placeholder = (r.departements || []).length ? "Autre département (facultatif)" : "Département (territoire non déterminé)"; dep2.maxLength = 3; box.append(dep2);
  const status = el("p", "cx-status"); status.hidden = true;
  const actions = el("div", "cx-actions"); const go = el("button", "cx-primary", "Demander la recherche d'entreprises"); go.type = "button";
  go.addEventListener("click", async () => {
    const nafs = nafChecks.filter((c) => c.checked).map((c) => c.value); if (manual.value.trim()) nafs.push(manual.value.trim().toUpperCase().replace(/\s/g, "").replace(/^(\d{2})(\d{2}[A-Z])$/, "$1.$2"));
    const depts = deptChecks.filter((c) => c.checked).map((c) => c.value); if (dep2.value.trim()) depts.push(dep2.value.trim().toUpperCase());
    const built = buildProspectsFromAnalysis({ organizationId, nafs, departements: depts, marcheObjet: r.objet, newKey: () => crypto.randomUUID() });
    if (!built.ok) { say(status, built.message, true); return; }
    go.disabled = true; say(status, "Envoi…"); let created = 0;
    for (const body of built.bodies) { const res = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "submit", token: await token(), body }); if (!res.ok) { say(status, res.message, true); break; } created++; remember(res.data.mission.mission_id, body.title); }
    go.disabled = false; if (created === built.bodies.length) say(status, `${created} mission(s) créée(s). Elles attendent votre validation dans la liste « récentes » : approuvez puis lancez l'exécution.`);
  });
  actions.append(go); box.append(actions, status); detailBox.append(box);
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
  const button = submitForm.querySelector("button"); button.disabled = true; say(submitStatus, "Envoi…");
  const result = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "submit", token: await token(), body });
  button.disabled = false;
  if (!result.ok) { say(submitStatus, result.message, true); return; }
  const id = result.data.mission.mission_id;
  say(submitStatus, "Mission créée. Elle attend votre validation.");
  remember(id, body.title); await openMission(id);
});
const analyseForm = $("#cx-analyse"), analyseStatus = $("#cx-ana-status");
analyseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const body = buildAnalysePayload({ organizationId, idweb: analyseForm.elements.idweb.value, idempotencyKey: crypto.randomUUID() });
  if (!body) { say(analyseStatus, "Indiquez l'identifiant de l'avis, par exemple 26-111564.", true); return; }
  const button = analyseForm.querySelector("button"); button.disabled = true; say(analyseStatus, "Envoi…");
  const result = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "submit", token: await token(), body });
  button.disabled = false;
  if (!result.ok) { say(analyseStatus, result.message, true); return; }
  say(analyseStatus, "Mission créée. Approuvez-la dans le suivi, puis lancez l'exécution.");
  remember(result.data.mission.mission_id, body.title); await openMission(result.data.mission.mission_id);
});
const prospectsForm = $("#cx-prospects"), prospectsStatus = $("#cx-pro-status");
prospectsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const f = prospectsForm.elements;
  const body = buildProspectsPayload({ organizationId, naf: f.naf.value, departement: f.departement.value, limite: f.limite.value, gagnantNom: f.gagnant_nom.value, gagnantSiren: f.gagnant_siren.value, marcheObjet: f.marche_objet.value, idempotencyKey: crypto.randomUUID() });
  if (!body) { say(prospectsStatus, "Vérifiez le code NAF (ex. 43.22B), le département (ex. 81), le nombre (20 à 30) et le SIREN s'il est rempli.", true); return; }
  const button = prospectsForm.querySelector("button"); button.disabled = true; say(prospectsStatus, "Envoi…");
  const result = await callApi(fetch, { baseUrl: ANNONCES_SUPABASE.url, key: "submit", token: await token(), body });
  button.disabled = false;
  if (!result.ok) { say(prospectsStatus, result.message, true); return; }
  say(prospectsStatus, "Mission créée. Elle attend votre validation : approuvez-la dans le suivi, puis lancez l'exécution.");
  remember(result.data.mission.mission_id, body.title); await openMission(result.data.mission.mission_id);
});
lookupForm.addEventListener("submit", (event) => { event.preventDefault(); const id = lookupForm.elements.mission.value.trim(); if (/^[0-9a-f-]{36}$/i.test(id)) openMission(id); else say(detailStatus, "Identifiant invalide.", true); });

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = loginForm.elements.email.value.trim().toLowerCase();
  const button = loginForm.querySelector("button"); button.disabled = true;
  try {
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } });
    if (error) throw error;
    gateMessage.textContent = "Un e-mail vient d’être envoyé à " + email + ". Ouvrez-le et cliquez sur le lien : vous reviendrez ici, connecté. Pensez à regarder les courriers indésirables.";
    button.textContent = "Renvoyer le lien";
  } catch (error) { gateMessage.textContent = "Connexion impossible : " + (error?.message || "réessayez plus tard."); }
  finally { setTimeout(() => { button.disabled = false; }, 30000); }
});
signout.addEventListener("click", async () => { await supabase.auth.signOut(); lock("Vous êtes déconnecté.", { login: true }); });
try { await authorize(); } catch (error) { console.error(error); lock("La vérification des accès a échoué.", { signed: true }); }
