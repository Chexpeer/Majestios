import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";

// Projet cible : MajestiOS-Test (les invitations n'y existent que là). Même configuration que Cheexpeer.
const supabase = createClient(ANNONCES_SUPABASE.url, ANNONCES_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
const $ = (s) => document.querySelector(s);
const frame = $(".admin-frame"), gate = $("#gate"), workspace = $("#workspace"), gateMessage = $("#gate-message"), sessionLabel = $("#session-label"), signout = $("#signout");
const loginForm = $("#iu-login"), form = $("#iu-form"), statusBox = $("#iu-status"), listStatus = $("#iu-list-status"), listBox = $("#iu-list");
const kindSel = form.elements.kind, orgSel = form.elements.organization_id, roleSel = form.elements.role, newName = form.elements.new_organization_name;
let rank = null, organizations = [];

const ROLE_LABELS = { admin: "Administrateur", member: "Membre", viewer: "Lecture seule", owner: "Responsable" };
const STATUS_LABELS = { pending: "En attente", accepted: "Acceptée", revoked: "Révoquée", expired: "Expirée" };
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };
const fmt = (d) => d ? new Date(d).toLocaleString("fr-FR") : "—";
const say = (node, message, error = false) => { node.textContent = message; node.classList.toggle("error", error); node.hidden = !message; };
function lock(message, { signed = false, login = false } = {}) {
  frame.classList.add("is-locked"); workspace.hidden = true; gate.hidden = false; gateMessage.textContent = message;
  sessionLabel.textContent = signed ? "Compte connecté · accès refusé" : "Non connecté"; signout.hidden = !signed; loginForm.hidden = !login;
}
const token = async () => (await supabase.auth.getSession()).data.session?.access_token || null;

async function authorize() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) { lock("Connectez-vous avec le compte interne qui vous a été attribué.", { login: true }); return false; }
  const { data: members, error: me } = await supabase.from("organization_members").select("organization_id,role").eq("user_id", session.user.id).in("role", ["owner", "admin"]).limit(20);
  if (me) { lock("Vos habilitations n'ont pas pu être vérifiées.", { signed: true }); return false; }
  const ids = (members || []).map((m) => m.organization_id);
  const { data: orgs } = ids.length ? await supabase.from("organizations").select("id,kind").in("id", ids) : { data: [] };
  const internalIds = new Set((orgs || []).filter((o) => o.kind === "internal").map((o) => o.id));
  const roles = (members || []).filter((m) => internalIds.has(m.organization_id)).map((m) => m.role);
  if (!roles.length) { lock("Ce compte n'est ni propriétaire ni administrateur de l'organisation interne.", { signed: true }); return false; }
  rank = roles.includes("owner") ? "owner" : "admin";
  sessionLabel.textContent = "Accès interne vérifié"; signout.hidden = false; gate.hidden = true; workspace.hidden = false; frame.classList.remove("is-locked");
  return true;
}

function refreshForm() {
  const client = kindSel.value === "client";
  const choices = organizations.filter((o) => o.kind === (client ? "client" : "internal"));
  orgSel.replaceChildren();
  if (client) { const o = el("option", "", "Nouvelle société cliente"); o.value = ""; orgSel.append(o); }
  for (const o of choices) { const opt = el("option", "", o.name); opt.value = o.id; orgSel.append(opt); }
  const creating = client && !orgSel.value;
  $("#iu-newname-wrap").hidden = !creating; newName.required = creating;
  const roles = client ? (creating ? ["owner"] : ["owner", "member", "viewer"]) : (rank === "owner" ? ["admin", "member", "viewer"] : ["member", "viewer"]);
  roleSel.replaceChildren();
  for (const r of roles) { const opt = el("option", "", ROLE_LABELS[r]); opt.value = r; roleSel.append(opt); }
  roleSel.disabled = creating;
  $("#iu-hint").textContent = client
    ? (creating ? "Le client créera sa société à l’acceptation et en sera le responsable. Il devra accepter la politique de confidentialité." : "Le client rejoindra la société choisie. Il devra accepter la politique de confidentialité.")
    : (rank === "owner" ? "Vous pouvez inviter des administrateurs, des membres et des lecteurs." : "Vous pouvez inviter des membres et des lecteurs. Seul le propriétaire invite des administrateurs.");
}

async function loadOrganizations() {
  const { data, error } = await supabase.rpc("list_invitable_organizations");
  organizations = error ? [] : (data || []);
  refreshForm();
}

async function loadList() {
  const { data, error } = await supabase.rpc("list_invitations", { p_limit: 50 });
  listBox.replaceChildren();
  if (error) { say(listStatus, "La liste n'a pas pu être chargée.", true); return; }
  say(listStatus, "");
  if (!data?.length) { listBox.append(el("li", "cx-meta", "Aucune invitation pour le moment.")); return; }
  for (const inv of data) {
    const li = el("li"); const main = el("span", "iu-main", inv.email);
    main.append(el("span", "iu-sub", `${inv.kind === "client" ? "Client" : "Équipe"} · ${inv.organization_name || "—"} · ${ROLE_LABELS[inv.role] || inv.role} · expire le ${fmt(inv.expires_at)}`));
    li.append(main, el("span", "cx-pill", STATUS_LABELS[inv.status] || inv.status));
    if (inv.status === "pending") {
      const b = el("button", "", "Révoquer"); b.type = "button";
      b.addEventListener("click", async () => { b.disabled = true; const { error: e } = await supabase.rpc("revoke_invitation", { p_id: inv.id }); if (e) say(listStatus, "Révocation impossible (vous ne pouvez révoquer que vos propres invitations).", true); await loadList(); });
      li.append(b);
    }
    listBox.append(li);
  }
}

async function send(payload) {
  try {
    const res = await fetch(`${ANNONCES_SUPABASE.url}/functions/v1/admin-invite-user`, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await token()}`, apikey: ANNONCES_SUPABASE.publishableKey }, body: JSON.stringify(payload)
    });
    const body = await res.json().catch(() => ({}));
    return res.ok ? { ok: true } : { ok: false, message: body.error || "L'invitation n'a pas abouti." };
  } catch { return { ok: false, message: "Réseau indisponible. Réessayez." }; }
}

kindSel.addEventListener("change", refreshForm);
orgSel.addEventListener("change", refreshForm);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const client = kindSel.value === "client", creating = client && !orgSel.value;
  const payload = { email: form.elements.email.value, kind: kindSel.value, role: creating ? "owner" : roleSel.value,
    organization_id: orgSel.value || null, new_organization_name: creating ? newName.value : null };
  const button = form.querySelector("button[type=submit]"); button.disabled = true; say(statusBox, "Envoi de l’invitation…");
  const result = await send(payload);
  button.disabled = false;
  if (!result.ok) { say(statusBox, result.message, true); return; }
  say(statusBox, "Invitation envoyée. La personne a 7 jours pour l’accepter.");
  form.elements.email.value = ""; newName.value = "";
  await loadList();
});
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { error } = await supabase.auth.signInWithOtp({ email: loginForm.elements.email.value.trim(), options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } });
  gateMessage.textContent = error ? "Le lien n'a pas pu être envoyé. Réessayez dans quelques minutes." : "Si ce compte existe, un lien de connexion vient d'être envoyé.";
});
signout.addEventListener("click", async () => { await supabase.auth.signOut(); location.reload(); });

(async () => {
  try { if (await authorize()) { await loadOrganizations(); await loadList(); } }
  catch { lock("Vérification impossible pour le moment.", { signed: false }); }
})();
