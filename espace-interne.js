import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const supabase = createClient(MAJESTIOS_SUPABASE.url, MAJESTIOS_SUPABASE.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const gate = document.querySelector("#internal-gate");
const workspace = document.querySelector("#internal-workspace");
const gateMessage = document.querySelector("#internal-gate-message");
const feedback = document.querySelector("#internal-feedback");
const loginForm = document.querySelector("#internal-login-form");
const loginButton = document.querySelector("#internal-login-submit");
const signOutButton = document.querySelector("#internal-signout");
const sessionLabel = document.querySelector("#internal-session-label");
const allowedDestinations = new Set(["espace-interne.html", "crm.html", "administration.html", "admin-recherches.html"]);
const requestedDestination = new URLSearchParams(window.location.search).get("returnTo");
const returnTo = allowedDestinations.has(requestedDestination) ? requestedDestination : "espace-interne.html";
const authHash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
const inviteFlow = authHash.get("type") === "invite";
let passwordSetup = inviteFlow;
let passwordConfirmInput = null;

function showPasswordSetup() {
  passwordSetup = true;
  const emailLabel = document.querySelector('label[for="internal-email"]');
  const passwordLabel = document.querySelector('label[for="internal-password"]');
  emailLabel.hidden = true;
  passwordLabel.firstChild.textContent = "Choisissez votre mot de passe";
  const passwordInput = document.querySelector("#internal-password");
  passwordInput.autocomplete = "new-password";
  passwordInput.minLength = 12;
  if (!passwordConfirmInput) {
    const label = document.createElement("label");
    label.htmlFor = "internal-password-confirm";
    label.textContent = "Confirmez votre mot de passe";
    passwordConfirmInput = document.createElement("input");
    passwordConfirmInput.id = "internal-password-confirm";
    passwordConfirmInput.type = "password";
    passwordConfirmInput.autocomplete = "new-password";
    passwordConfirmInput.minLength = 12;
    passwordConfirmInput.required = true;
    label.append(passwordConfirmInput);
    loginForm.insertBefore(label, loginButton);
  }
  loginButton.innerHTML = 'Définir mon mot de passe <span aria-hidden="true">→</span>';
  gateMessage.textContent = "Votre invitation est reconnue. Définissez votre mot de passe personnel pour activer votre accès.";
}


function showMessage(message, isError = false) {
  feedback.textContent = message;
  feedback.dataset.state = isError ? "error" : "success";
  feedback.hidden = false;
}
function showLogin(message = "Connectez-vous avec les identifiants qui vous ont été attribués par MajestiOS.") {
  gate.hidden = false;
  workspace.hidden = true;
  loginForm.hidden = false;
  if (!passwordSetup) {
    const emailLabel = document.querySelector('label[for="internal-email"]');
    const passwordLabel = document.querySelector('label[for="internal-password"]');
    emailLabel.hidden = false;
    passwordLabel.firstChild.textContent = "Mot de passe";
    const passwordInput = document.querySelector("#internal-password");
    passwordInput.autocomplete = "current-password";
    passwordInput.minLength = 0;
    if (passwordConfirmInput) passwordConfirmInput.closest("label")?.remove();
    passwordConfirmInput = null;
    loginButton.innerHTML = 'Se connecter <span aria-hidden="true">→</span>';
  }
  gateMessage.textContent = message;
  sessionLabel.textContent = "Authentification interne";
  signOutButton.hidden = true;
}
function roleLabel(role) {
  return ({ owner: "Propriétaire interne", admin: "Administrateur interne", member: "Collaborateur interne", viewer: "Collaborateur · consultation seule" })[role] || "Membre interne";
}
function showWorkspace(organization, membership) {
  gate.hidden = true;
  workspace.hidden = false;
  loginForm.hidden = true;
  sessionLabel.textContent = "Accès interne vérifié";
  signOutButton.hidden = false;
  document.querySelector("#internal-organization").textContent = organization.name || "Organisation interne";
  document.querySelector("#internal-role").textContent = roleLabel(membership.role);
  document.querySelector("#internal-identity").textContent = membership.role === "viewer"
    ? "Votre accès est limité aux rubriques qui vous sont autorisées. Le CRM interne reste réservé aux comptes VIP."
    : "Votre espace de travail et vos habilitations sont confirmés.";
  const canAdminister = ["owner", "admin"].includes(membership.role);
  const crmLink = document.querySelector("#internal-crm-link");
  crmLink.hidden = !canAdminister;
  crmLink.setAttribute("aria-hidden", String(!canAdminister));
  document.querySelector("#internal-crm-access").textContent = canAdminister
    ? "ACCÈS VIP · HABILITATION OWNER / ADMIN"
    : "CRM INTERNE RÉSERVÉ AUX COMPTES VIP OWNER / ADMIN";
  document.querySelector("#internal-admin-card").hidden = !canAdminister;
  document.querySelector("#internal-search-card").hidden = !canAdminister;
  if (returnTo !== "espace-interne.html") {
    const destinationAllowed = canAdminister &&
      ["crm.html", "administration.html", "admin-recherches.html"].includes(returnTo);
    if (destinationAllowed) window.location.replace(returnTo);
  }
}
async function resolveInternalMembership(userId) {
  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members").select("organization_id, role").eq("user_id", userId).limit(100);
  if (membershipError) throw membershipError;
  const ids = (memberships || []).map(item => item.organization_id);
  if (!ids.length) return null;
  const { data: organizations, error: organizationError } = await supabase
    .from("organizations").select("id, name, kind").in("id", ids);
  if (organizationError) throw organizationError;
  const internal = (organizations || []).filter(item => item.kind === "internal");
  if (internal.length !== 1) {
    if (internal.length > 1) throw new Error("Plusieurs organisations internes sont associées à ce compte. L’accès reste suspendu.");
    return null;
  }
  const membership = memberships.find(item => item.organization_id === internal[0].id);
  if (!membership || !["owner", "admin", "member", "viewer"].includes(membership.role)) return null;
  return { organization: internal[0], membership };
}
async function authenticateExistingSession() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) {
    showLogin();
    return;
  }
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user || user.id !== session.user.id) throw new Error("Votre session n’a pas pu être confirmée.");
  const access = await resolveInternalMembership(user.id);
  if (!access) {
    await supabase.auth.signOut();
    showLogin("Ce compte ne possède pas d’appartenance interne MajestiOS. L’espace client et l’espace collaborateurs sont distincts.");
    return;
  }
  showWorkspace(access.organization, access.membership);
}
loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;
  loginButton.disabled = true;
  feedback.hidden = true;
  try {
    const password = String(loginForm.elements.password.value || "");
    if (passwordSetup) {
      if (password.length < 12 || password !== String(passwordConfirmInput?.value || "")) {
        throw new Error("Les deux mots de passe doivent être identiques et contenir au moins 12 caractères.");
      }
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("La session de votre invitation n’est plus valide. Ouvrez à nouveau le lien reçu par e-mail.");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      passwordSetup = false;
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      await authenticateExistingSession();
      return;
    }
    const email = String(loginForm.elements.email.value || "").trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user || user.id !== data.user.id) throw new Error("L’identité du compte n’a pas pu être confirmée.");
    const access = await resolveInternalMembership(user.id);
    if (!access) {
      await supabase.auth.signOut();
      throw new Error("Ce compte ne possède pas d’appartenance interne MajestiOS. Aucun accès collaborateur n’est accordé.");
    }
    showWorkspace(access.organization, access.membership);
  } catch (error) {
    showLogin("L’accès interne n’a pas été accordé.");
    showMessage(error?.message || "Connexion impossible. Vérifiez vos identifiants ou contactez l’administrateur.", true);
  } finally {
    loginButton.disabled = false;
  }
});
signOutButton.addEventListener("click", async () => {
  signOutButton.disabled = true;
  const { error } = await supabase.auth.signOut();
  signOutButton.disabled = false;
  if (error) {
    showMessage("La déconnexion n’a pas abouti. Réessayez.", true);
    return;
  }
  showLogin("Vous êtes déconnecté. Connectez-vous avec votre compte interne MajestiOS.");
});
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") {
    showPasswordSetup();
    showMessage("Choisissez votre nouveau mot de passe.");
  } else if (event === "SIGNED_IN" && session && inviteFlow) {
    showPasswordSetup();
  }
});

try {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (inviteFlow) {
    showPasswordSetup();
    if (!session) showMessage("Ouverture de votre invitation… Si rien ne se passe, rouvrez le lien reçu par e-mail.", true);
  } else {
    await authenticateExistingSession();
  }
} catch (error) {
  showLogin("La vérification de votre accès interne a échoué. Aucun module n’est ouvert.");
  showMessage(error?.message || "Vérification impossible. Réessayez plus tard.", true);
}
