import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";
import { TABS, KIND_LABELS, allowedDecisions, buildDecision, moderationError, DECISION_LABELS } from "./annonces-moderation.mjs";

const supabase = createClient(ANNONCES_SUPABASE.url, ANNONCES_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
const $ = (selector) => document.querySelector(selector);
const frame = $(".admin-frame"), gate = $("#gate"), workspace = $("#workspace"), gateMessage = $("#gate-message"), sessionLabel = $("#session-label"), signout = $("#signout");
const loginForm = $("#mod-login"), tabsBox = $("#mod-tabs"), list = $("#mod-list"), statusBox = $("#mod-status");
let currentTab = "pending";
let pendingEmail = "";

const setStatus = (message, error = false) => { statusBox.textContent = message; statusBox.classList.toggle("error", error); statusBox.hidden = !message; };
function lock(message, { signed = false, login = false } = {}) {
  frame.classList.add("is-locked");
  workspace.hidden = true;
  gate.hidden = false;
  gateMessage.textContent = message;
  sessionLabel.textContent = signed ? "Compte connecté · accès refusé" : "Non connecté";
  signout.hidden = !signed;
  loginForm.hidden = !login;
}

async function authorize() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) { lock("Connectez-vous avec le compte interne qui vous a été attribué : un code vous sera envoyé par e-mail.", { login: true }); return false; }
  const { error: queueError } = await supabase.rpc("moderation_queue", { p_status: "pending", p_limit: 1 });
  if (queueError) { lock(moderationError(queueError), { signed: true }); return false; }
  sessionLabel.textContent = "Accès interne vérifié";
  signout.hidden = false;
  gate.hidden = true;
  workspace.hidden = false;
  frame.classList.remove("is-locked");
  return true;
}

const el = (tag, className, text) => { const n = document.createElement(tag); if (className) n.className = className; if (text !== undefined) n.textContent = text; return n; };
const field = (labelText, node) => { const l = el("label", "", labelText); l.append(node); return l; };

function card(item) {
  const article = el("article", "mod-card");
  article.dataset.reference = item.reference;
  article.append(el("p", "admin-kicker", (KIND_LABELS[item.kind] || item.kind).toUpperCase() + " · " + item.reference));
  const meta = el("div", "mod-meta");
  for (const text of [item.trade, item.department && "Département " + item.department, item.area_note, item.valid_until && "Valable jusqu’au " + item.valid_until, "Déposée le " + new Date(item.created_at).toLocaleDateString("fr-FR")].filter(Boolean)) meta.append(el("span", "", text));
  const contact = el("p", "mod-contact", "Auteur (jamais publié) : " + [item.contact_name, item.email, item.phone].filter(Boolean).join(" · "));
  const editable = item.status === "pending";
  const title = el(editable ? "input" : "h2", "", editable ? undefined : item.title);
  const description = el(editable ? "textarea" : "p", "", editable ? undefined : item.description);
  if (editable) { title.value = item.title; title.maxLength = 120; description.value = item.description; description.rows = 5; description.maxLength = 2000; }
  const note = el("input"); note.type = "text"; note.maxLength = 500; note.placeholder = "Motif (obligatoire pour refuser)";
  article.append(meta, contact);
  article.append(editable ? field("Titre", title) : title, editable ? field("Description", description) : description);
  const decisions = allowedDecisions(item.status);
  if (decisions.length) article.append(field("Motif", note));
  const actions = el("div", "mod-actions");
  const labels = { publish: "Publier", reject: "Refuser", withdraw: "Retirer de la publication" };
  const feedback = el("p", "mod-status"); feedback.hidden = true;
  for (const decision of decisions) {
    const button = el("button", decision === "publish" ? "mod-publish" : "", labels[decision]);
    button.type = "button";
    button.addEventListener("click", async () => {
      const built = buildDecision({ id: item.id, status: item.status, decision, note: note.value, title: editable ? title.value : "", description: editable ? description.value : "", original: item });
      feedback.hidden = false; feedback.classList.remove("error");
      if (!built.ok) { feedback.textContent = built.errors.join(" "); feedback.classList.add("error"); return; }
      actions.querySelectorAll("button").forEach((b) => { b.disabled = true; });
      const { error } = await supabase.rpc("moderate_announcement", built.params);
      if (error) { feedback.textContent = moderationError(error); feedback.classList.add("error"); actions.querySelectorAll("button").forEach((b) => { b.disabled = false; }); return; }
      setStatus(DECISION_LABELS[decision] + " (" + item.reference + ")");
      await load();
    });
    actions.append(button);
  }
  article.append(actions, feedback);
  return article;
}

async function load() {
  list.replaceChildren();
  setStatus("Chargement…");
  const { data, error } = await supabase.rpc("moderation_queue", { p_status: currentTab, p_limit: 50 });
  if (error) { setStatus(moderationError(error), true); return; }
  for (const item of data || []) list.append(card(item));
  setStatus((data || []).length ? (data.length + " annonce(s).") : "Aucune annonce dans cette catégorie.");
}

for (const [value, label] of TABS) {
  const button = el("button", "", label);
  button.type = "button";
  button.dataset.tab = value;
  button.setAttribute("aria-pressed", String(value === currentTab));
  button.addEventListener("click", () => {
    currentTab = value;
    tabsBox.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tab === value)));
    load();
  });
  tabsBox.append(button);
}

// Connexion par code e-mail (même principe que l'espace personnel) sur le projet qui héberge les annonces.
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = loginForm.elements.email.value.trim().toLowerCase();
  const code = loginForm.elements.code.value.trim();
  try {
    if (!pendingEmail) {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } });
      if (error) throw error;
      pendingEmail = email;
      loginForm.elements.code.hidden = false;
      loginForm.elements.code.focus();
      gateMessage.textContent = "Un e-mail vient d’être envoyé à " + email + ". Cliquez sur son lien, ou saisissez le code s’il en contient un.";
      return;
    }
    const { error } = await supabase.auth.verifyOtp({ email: pendingEmail, token: code, type: "email" });
    if (error) throw error;
    pendingEmail = "";
    if (await authorize()) await load();
  } catch (error) {
    gateMessage.textContent = "Connexion impossible : " + (error?.message || "réessayez.");
  }
});
signout.addEventListener("click", async () => { await supabase.auth.signOut(); lock("Vous êtes déconnecté.", { login: true }); });
supabase.auth.onAuthStateChange((event) => { if (event === "SIGNED_OUT") lock("Vous êtes déconnecté.", { login: true }); });

try { if (await authorize()) await load(); } catch (error) { lock(error?.message || "La vérification des habilitations a échoué."); }
