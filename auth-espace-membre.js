import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const config = MAJESTIOS_SUPABASE;
const form = document.querySelector("#personal-space-form");
const feedback = document.querySelector("#personal-space-feedback");
const submitButton = form?.querySelector('[type="submit"]');
const status = document.querySelector("#member-auth-status");
const preview = document.querySelector(".member-preview");
const otpStep = form?.querySelector("[data-otp-step]");
const otpInput = form?.elements.namedItem("otp");
const resendButton = form?.querySelector("[data-resend-otp]");
const emailInput = form?.elements.namedItem("email");

if (form && config?.url && config?.publishableKey) {
  const supabase = createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });

  let awaitingOtp = false;
  let pendingEmail = "";
  let resendTimer = null;
  const field = (name) => form.elements.namedItem(name);
  const value = (name) => String(field(name)?.value ?? "").trim();
  const setFeedback = (message, isError = false) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.dataset.state = isError ? "error" : "success";
    feedback.hidden = false;
  };
  const startResendCooldown = () => {
    if (!resendButton) return;
    let remaining = 60;
    resendButton.disabled = true;
    resendButton.textContent = `Renvoyer le code dans ${remaining} s`;
    clearInterval(resendTimer);
    resendTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(resendTimer);
        resendButton.disabled = false;
        resendButton.textContent = "Renvoyer un code";
      } else {
        resendButton.textContent = `Renvoyer le code dans ${remaining} s`;
      }
    }, 1000);
  };

  const sendOtp = async () => {
    const email = value("email").toLowerCase();
    if (!emailInput?.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }
    const options = { shouldCreateUser: false };
    const { error } = await supabase.auth.signInWithOtp({ email, options });
    if (error) {
      // Keep account-existence and delivery errors deliberately non-specific.
      throw new Error("La demande n’a pas pu être confirmée. Si l’envoi est autorisé pour cette adresse, vérifiez votre boîte de réception et vos courriers indésirables.");
    }
    pendingEmail = email;
    awaitingOtp = true;
    if (otpInput) otpInput.required = true;
    if (otpStep) otpStep.hidden = false;
    form.querySelectorAll("[data-before-otp]").forEach((element) => { element.hidden = true; });
    if (submitButton) submitButton.innerHTML = 'Vérifier le code <span aria-hidden="true">→</span>';
    setFeedback(`Un code temporaire a été envoyé à ${email}. Il est à usage unique.`);
    startResendCooldown();
    otpInput?.focus();
  };

  const updateAuthStatus = async (session) => {
    if (!status) return;
    const oldButton = preview?.querySelector("#member-signout");
    if (!session) {
      status.textContent = "Vous n’êtes pas connecté.";
      oldButton?.remove();
      return;
    }
    const { data, error } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", session.user.id)
      .limit(1);
    status.textContent = error
      ? "Compte connecté · vérification de l’espace indisponible."
      : data?.length
        ? "Vous êtes connecté à votre espace MajestiOS."
        : "Compte connecté · espace personnel à finaliser.";
    if (!preview || oldButton) return;
    const signOutButton = document.createElement("button");
    signOutButton.id = "member-signout";
    signOutButton.type = "button";
    signOutButton.className = "button button-secondary";
    signOutButton.textContent = "Se déconnecter";
    signOutButton.addEventListener("click", async () => {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) setFeedback("La déconnexion a échoué. Réessayez.", true);
      else updateAuthStatus(null);
    });
    preview.append(signOutButton);
  };

  const verifyOtp = async () => {
    const token = value("otp").replace(/\s+/g, "");
    if (!/^\d{6}$/.test(token)) {
      throw new Error("Saisissez le code à 6 chiffres reçu par e-mail.");
    }
    const { data, error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token,
      type: "email"
    });
    if (error || !data.session) {
      throw new Error("Ce code est invalide ou expiré. Demandez-en un nouveau.");
    }
    awaitingOtp = false;
    clearInterval(resendTimer);
    if (resendButton) { resendButton.disabled = false; resendButton.textContent = "Renvoyer un code"; }
    if (otpInput) otpInput.required = false;
    if (otpStep) otpStep.hidden = true;
    form.querySelectorAll("[data-before-otp]").forEach((element) => { element.hidden = false; });
    await updateAuthStatus(data.session);
    const { data: memberships, error: membershipError } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", data.user.id)
      .limit(1);
    if (membershipError) {
      setFeedback("Votre adresse est vérifiée, mais vos habilitations ne peuvent pas être contrôlées pour le moment. Réessayez plus tard.", true);
    } else if (!memberships?.length) {
      setFeedback("Votre compte est vérifié, mais aucun espace MajestiOS ne lui est associé. Contactez l’équipe pour finaliser votre accès.", true);
    } else {
      setFeedback("Connexion réussie. Bienvenue dans votre espace MajestiOS.");
    }
    if (submitButton) submitButton.disabled = false;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton) submitButton.disabled = true;
    if (feedback) feedback.hidden = true;
    try {
      if (awaitingOtp) await verifyOtp();
      else {
        if (!form.reportValidity()) return;
        await sendOtp();
      }
    } catch (error) {
      setFeedback(error.message || "Une erreur est survenue. Veuillez réessayer.", true);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  resendButton?.addEventListener("click", async () => {
    if (resendButton.disabled || !pendingEmail) return;
    resendButton.disabled = true;
    try {
      const options = { shouldCreateUser: false };
      const { error } = await supabase.auth.signInWithOtp({ email: pendingEmail, options });
      if (error) throw error;
      setFeedback("Un nouveau code vient d’être demandé. Seul le dernier code reçu doit être utilisé.");
      startResendCooldown();
    } catch {
      setFeedback("Impossible de renvoyer le code pour le moment. Réessayez un peu plus tard.", true);
      resendButton.disabled = false;
    }
  });

  supabase.auth.getSession().then(({ data }) => updateAuthStatus(data.session));
  supabase.auth.onAuthStateChange((_event, session) => updateAuthStatus(session));
} else if (form) {
  if (feedback) {
    feedback.textContent = "Le service de connexion n’est pas configuré. Votre demande n’a pas été envoyée.";
    feedback.hidden = false;
    feedback.dataset.state = "error";
  }
  if (submitButton) submitButton.disabled = true;
}
