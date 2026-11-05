import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const config = MAJESTIOS_SUPABASE;
const form = document.querySelector("#personal-space-form");
const feedback = document.querySelector("#personal-space-feedback");
const modeToggle = document.querySelector("#toggle-auth-mode");
const submitButton = form?.querySelector('[type="submit"]');
const status = document.querySelector("#member-auth-status");
const preview = document.querySelector(".member-preview");

if (form && config?.url && config?.publishableKey) {
  const supabase = createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  let mode = "signup";
  const field = (name) => form.elements.namedItem(name);
  const setFeedback = (message, isError = false) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.dataset.state = isError ? "error" : "success";
    feedback.hidden = false;
  };

  const setMode = (nextMode) => {
    mode = nextMode;
    form.dataset.mode = mode;
    form.querySelectorAll("[data-signup-only]").forEach((element) => {
      element.hidden = mode !== "signup";
      element.querySelectorAll("input").forEach((input) => {
        input.required = mode === "signup" && input.dataset.required === "true";
      });
    });
    const organizationField = field("organizationName");
    const passwordField = field("password");
    if (passwordField) passwordField.autocomplete = mode === "signup" ? "new-password" : "current-password";
    if (organizationField) {
      organizationField.required = mode === "signup";
      organizationField.closest(".form-field")?.classList.toggle("is-optional", mode === "login");
    }
    if (submitButton) submitButton.innerHTML = mode === "signup"
      ? 'Créer mon espace <span aria-hidden="true">→</span>'
      : 'Se connecter <span aria-hidden="true">→</span>';
    if (modeToggle) modeToggle.textContent = mode === "signup"
      ? "Déjà membre ? Se connecter"
      : "Pas encore de compte ? Créer mon espace";
    if (feedback) feedback.hidden = true;
  };

  const provisionWorkspace = async (session, organizationName) => {
    const { data, error } = await supabase.functions.invoke("provision-client-workspace", {
      body: { organization_name: organizationName || "" },
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    if (error) throw error;
    if (!data?.ok || !data.organization) throw new Error("La création de l’espace n’a pas été confirmée.");
    return data.organization;
  };

  const updateAuthStatus = async (session) => {
    if (!status) return;
    if (!session) {
      status.textContent = "Vous n’êtes pas connecté.";
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
        : "Compte connecté · espace entreprise à finaliser.";
    if (!preview || preview.querySelector("#member-signout")) return;
    const signOutButton = document.createElement("button");
    signOutButton.id = "member-signout";
    signOutButton.type = "button";
    signOutButton.className = "button button-secondary";
    signOutButton.textContent = "Se déconnecter";
    signOutButton.addEventListener("click", async () => {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) setFeedback("La déconnexion a échoué. Réessayez.", true);
      else {
        signOutButton.remove();
        updateAuthStatus(null);
      }
    });
    preview.append(signOutButton);
  };

  modeToggle?.addEventListener("click", () => setMode(mode === "signup" ? "login" : "signup"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (submitButton) submitButton.disabled = true;
    if (feedback) feedback.hidden = true;

    try {
      const email = String(field("email")?.value ?? "").trim().toLowerCase();
      const password = String(field("password")?.value ?? "");
      const organizationName = String(field("organizationName")?.value ?? "").trim();
      const displayName = [
        String(field("firstName")?.value ?? "").trim(),
        String(field("lastName")?.value ?? "").trim()
      ].filter(Boolean).join(" ");
      const phone = String(field("phone")?.value ?? "").trim();

      if (mode === "signup") {
        if (password.length < 12) throw new Error("Choisissez un mot de passe d’au moins 12 caractères.");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/espace-membre.html?confirmed=1`,
            data: {
              display_name: displayName,
              phone,
              organization_name: organizationName,
              privacy_notice_acknowledged: true,
              privacy_notice_version: "2026-11-05"
            }
          }
        });
        if (error) throw error;
        if (data.session) {
          const organization = await provisionWorkspace(data.session, organizationName);
          setFeedback(`Votre compte est créé et votre espace « ${organization.name} » est prêt. Vous êtes connecté.`);
          await updateAuthStatus(data.session);
        } else {
          setFeedback("Votre demande de création de compte est enregistrée. Consultez votre messagerie pour confirmer votre adresse e-mail, puis revenez ici pour vous connecter.");
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        try {
          const organization = await provisionWorkspace(data.session, organizationName);
          setFeedback(`Connexion réussie. Votre espace « ${organization.name} » est disponible.`);
        } catch (workspaceError) {
          setFeedback(workspaceError.message || "Connexion réussie, mais votre espace doit encore être configuré.", true);
        }
        await updateAuthStatus(data.session);
      }
    } catch (error) {
      setFeedback(error.message || "Une erreur est survenue. Veuillez réessayer.", true);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  document.querySelector("#forgot-member-password")?.addEventListener("click", async () => {
    const email = String(field("email")?.value ?? "").trim().toLowerCase();
    if (!email) {
      setFeedback("Saisissez votre adresse e-mail avant de demander un lien de réinitialisation.", true);
      field("email")?.focus();
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/espace-membre.html`
    });
    setFeedback(error
      ? "Impossible d’envoyer le lien de réinitialisation. Vérifiez l’adresse et réessayez."
      : "Si un compte correspond à cette adresse, un lien de réinitialisation vient d’être envoyé.");
  });

  supabase.auth.getSession().then(async ({ data }) => {
    await updateAuthStatus(data.session);
    if (new URLSearchParams(window.location.search).get("confirmed") === "1" && data.session) {
      try {
        const organization = await provisionWorkspace(data.session, data.session.user.user_metadata?.organization_name);
        if (status) status.textContent = `Adresse confirmée · espace « ${organization.name} » prêt.`;
      } catch (error) {
        if (status) status.textContent = error.message || "Adresse confirmée · finalisation de l’espace nécessaire.";
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });
  supabase.auth.onAuthStateChange((_event, session) => updateAuthStatus(session));
  setMode("signup");
} else if (form) {
  if (feedback) {
    feedback.textContent = "Le service de connexion n’est pas configuré. Votre demande n’a pas été envoyée.";
    feedback.hidden = false;
    feedback.dataset.state = "error";
  }
  if (submitButton) submitButton.disabled = true;
}
