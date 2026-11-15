import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { ANNONCES_SUPABASE } from "./annonces-config.mjs";
import { PAGES, landingAfterInvitation, emailRedirect } from "./parcours-majestios.mjs";

// Version de la notice de confidentialité exigée pour les clients (identique à provision_client_workspace).
const NOTICE_VERSION = "2026-11-05";
const supabase = createClient(ANNONCES_SUPABASE.url, ANNONCES_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
const $ = (s) => document.querySelector(s);
const message = $("#ia-message"), loginForm = $("#ia-login"), consentForm = $("#ia-consent"), next = $("#ia-next");
const MESSAGES = {
  INVITATION_NOT_FOUND: "Aucune invitation valide n'est associée à cette adresse (elle a peut-être expiré ou été révoquée). Demandez-en une nouvelle.",
  EMAIL_NOT_CONFIRMED: "Votre adresse e-mail n'est pas encore confirmée. Utilisez le lien reçu par e-mail.",
  ACCOUNT_CONFLICT: "Ce compte appartient déjà à un autre type d'espace. Utilisez une autre adresse e-mail.",
};

async function accept(notice) {
  const { data, error } = await supabase.rpc("accept_invitation", { p_notice_version: notice });
  if (error) {
    if ((error.message || "").includes("NOTICE_REQUIRED")) { message.textContent = "Dernière étape : acceptez la politique de confidentialité pour créer votre espace."; consentForm.hidden = false; return; }
    const code = Object.keys(MESSAGES).find((c) => (error.message || "").includes(c));
    message.textContent = MESSAGES[code] || "L'invitation n'a pas pu être acceptée. Réessayez ou contactez l'équipe.";
    return;
  }
  consentForm.hidden = true;
  message.textContent = "Invitation acceptée. Votre accès est actif.";
  next.href = landingAfterInvitation({ kind: data?.kind, role: data?.role }); next.hidden = false;
}

consentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!$("#ia-check").checked) { message.textContent = "Cochez la case pour continuer."; return; }
  await accept(NOTICE_VERSION);
});
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { error } = await supabase.auth.signInWithOtp({ email: loginForm.elements.email.value.trim(), options: { shouldCreateUser: false, emailRedirectTo: emailRedirect(location.origin, PAGES.accepterInvitation) } });
  message.textContent = error ? "Le lien n'a pas pu être envoyé. Réessayez dans quelques minutes." : "Si une invitation existe pour cette adresse, un lien vient d'être envoyé.";
});

(async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { message.textContent = "Ouvrez le lien reçu par e-mail, ou demandez-en un nouveau avec l'adresse invitée."; loginForm.hidden = false; return; }
    await accept(null);
  } catch { message.textContent = "Vérification impossible pour le moment."; }
})();
