import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";
import { buildSubmitPayload, buildDecisionPayload, callApi, statusLabel, APPROVAL_LABELS } from "./cheexpeer-command.mjs";

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
  if (m.result && Object.keys(m.result).length) detailBox.append(el("pre", "cx-result", JSON.stringify(m.result, null, 2)));
  const events = el("ul", "cx-timeline"); for (const e of data.events || []) events.append(el("li", "", `${fmt(e.occurred_at)} · ${e.event_type} (${e.actor_type})`));
  if (events.children.length) detailBox.append(el("p", "admin-kicker", "HISTORIQUE"), events);
  say(detailStatus, "");
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
