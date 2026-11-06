import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const supabase = createClient(MAJESTIOS_SUPABASE.url, MAJESTIOS_SUPABASE.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const gate = document.querySelector("#admin-gate");
const gateMessage = document.querySelector("#admin-gate-message");
const workspace = document.querySelector("#admin-workspace");
const sessionLabel = document.querySelector("#admin-session-label");
const signOutButton = document.querySelector("#admin-signout");

function showGate(message, signedIn = false) {
  workspace.hidden = true;
  gate.hidden = false;
  gateMessage.textContent = message;
  sessionLabel.textContent = signedIn ? "Compte connecté · accès refusé" : "Session non authentifiée";
  signOutButton.hidden = !signedIn;
}

async function verifyInternalAdmin() {
  gate.hidden = false;
  workspace.hidden = true;
  gateMessage.textContent = "Vérification de votre identité et de vos habilitations internes…";

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) {
    showGate("Connectez-vous avec le compte interne qui vous a été attribué. Un compte client ne permet pas d’ouvrir l’administration.");
    return;
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user || user.id !== session.user.id) {
    showGate("Votre session n’a pas pu être confirmée. Reconnectez-vous avant de poursuivre.");
    return;
  }

  const { data: memberships, error: membershipError } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .limit(100);
  if (membershipError) throw membershipError;
  if (!memberships?.length) {
    showGate("Votre compte est connecté, mais aucune appartenance à un espace MajestiOS ne lui est attribuée. Aucun accès d’administration n’est accordé.", true);
    return;
  }

  const organizationIds = memberships.map((membership) => membership.organization_id);
  const { data: organizations, error: organizationError } = await supabase
    .from("organizations")
    .select("id, name, kind")
    .in("id", organizationIds);
  if (organizationError) throw organizationError;

  const internalOrganizations = (organizations || []).filter((organization) => organization.kind === "internal");
  if (internalOrganizations.length !== 1) {
    showGate(internalOrganizations.length
      ? "Plusieurs organisations internes sont associées à ce compte. L’accès est suspendu jusqu’à clarification."
      : "Votre compte ne possède pas d’appartenance à l’organisation interne MajestiOS. L’espace client et le CRM client restent séparés de l’administration.", true);
    return;
  }

  const internalOrganization = internalOrganizations[0];
  const membership = memberships.find((item) => item.organization_id === internalOrganization.id);
  if (!membership || !["owner", "admin"].includes(membership.role)) {
    showGate("Votre appartenance à l’organisation interne ne comprend pas le rôle administrateur requis. Aucun accès au poste de commandement n’est accordé.", true);
    return;
  }

  document.querySelector("#admin-organization-name").textContent = internalOrganization.name || "Organisation interne";
  document.querySelector("#admin-role-label").textContent = membership.role === "owner" ? "Propriétaire interne" : "Administrateur interne";
  sessionLabel.textContent = "Accès interne vérifié";
  signOutButton.hidden = false;
  gate.hidden = true;
  workspace.hidden = false;
}

signOutButton.addEventListener("click", async () => {
  signOutButton.disabled = true;
  const { error } = await supabase.auth.signOut();
  signOutButton.disabled = false;
  if (error) {
    showGate("La déconnexion n’a pas abouti. Réessayez.", true);
    return;
  }
  showGate("Vous êtes déconnecté. Connectez-vous avec un compte administrateur interne pour accéder au poste de commandement.");
});

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") showGate("Vous êtes déconnecté. Connectez-vous avec un compte administrateur interne pour accéder au poste de commandement.");
});

try {
  await verifyInternalAdmin();
} catch (error) {
  showGate(error?.message || "La vérification des habilitations a échoué. L’accès reste fermé.", true);
}
