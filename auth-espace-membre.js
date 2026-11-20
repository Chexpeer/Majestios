import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";
import { retourDepuisRecherche, destinationRetour } from "./retour-service.mjs";
import { validatePassword, formatDeadline } from "./mot-de-passe-majestios.mjs";

const config = MAJESTIOS_SUPABASE;
const NOTICE_VERSION = "2026-11-05";
const form = document.querySelector("#personal-space-form");
const feedback = document.querySelector("#personal-space-feedback");
const submitButton = form?.querySelector('[type="submit"]');
const status = document.querySelector("#member-auth-status");
const preview = document.querySelector(".member-preview");
const otpStep = form?.querySelector("[data-otp-step]");
const resendButton = form?.querySelector("[data-resend-otp]");
const emailInput = form?.elements.namedItem("email");
const sendLinkButton = form?.querySelector("[data-send-link]");

if (form && config?.url && config?.publishableKey) {
  const supabase = createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  // Retour vers le service d'origine (ex. dépôt d'annonce) une fois l'espace actif ; la clé survit au lien reçu par e-mail dans le même navigateur.
  try { const k = retourDepuisRecherche(window.location.search); if (k) sessionStorage.setItem("mj-retour", k); } catch (_) { /* sans importance */ }
  const retourEnAttente = () => { try { return destinationRetour(sessionStorage.getItem("mj-retour")); } catch (_) { return null; } };
  // Connexion réussie sans service à rejoindre : on referme le formulaire pour ne plus proposer « Se connecter / Créer ».
  const fermerFormulaire = () => {
    const d = document.querySelector("#personal-space-dialog");
    setTimeout(() => { if (d?.open) { if (typeof d.close === "function") d.close(); else d.removeAttribute("open"); } }, 1200);
  };
  const retourner = () => {
    const cible = retourEnAttente();
    if (!cible) return false;
    try { sessionStorage.removeItem("mj-retour"); } catch (_) { /* sans importance */ }
    setFeedback("Votre espace est prêt. Retour vers votre service…");
    setTimeout(() => { window.location.href = cible; }, 1200);
    return true;
  };

  let linkSent = false;
  let createMode = false;
  let awaitingPassword = false;
  let activationDeadline = "";
  let pendingOptions = { shouldCreateUser: false };
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

  const titleEl = document.querySelector("#personal-space-title");
  const introEl = form.querySelector(".personal-space-intro");
  const dialog = document.querySelector("#personal-space-dialog");
  const setCreateMode = (on) => {
    createMode = on;
    form.querySelectorAll("[data-create-only]").forEach((el) => { el.hidden = !on; });
    form.querySelectorAll("[data-mode-login], [data-login-only]").forEach((el) => { el.hidden = on; });
    form.querySelectorAll("[data-mode-create]").forEach((el) => { el.hidden = !on; });
    const ack = field("privacy_ack");
    if (ack) ack.required = on;
    if (titleEl) titleEl.textContent = on ? "Créer mon espace personnel" : "Se connecter à mon espace";
    if (introEl) introEl.textContent = on ? "Un e-mail avec un lien de connexion confirme votre adresse et crée votre espace." : "Connectez-vous avec votre adresse e-mail et votre mot de passe.";
    if (submitButton) submitButton.innerHTML = (on ? "Recevoir mon lien pour créer mon espace" : "Me connecter") + ' <span aria-hidden="true">→</span>';
  };
  form.querySelectorAll("[data-toggle-create]").forEach((b) => b.addEventListener("click", () => setCreateMode(!createMode)));
  document.querySelectorAll("[data-open-create]").forEach((b) => b.addEventListener("click", () => {
    setCreateMode(true);
    if (dialog && !dialog.open) { if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); }
  }));
  // Lien « Créer mon espace personnel » du menu (espace-membre.html#creation) : ouvre directement le formulaire de création.
  if (window.location.hash === "#creation") document.querySelector("[data-open-create]")?.click();
  const provisionWorkspace = async (session) => {
    const response = await fetch(`${config.url}/functions/v1/provision-client-workspace`, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: config.publishableKey, authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ flow: "signup", privacy_acknowledged: true, organization_name: value("organization_name") || session.user?.user_metadata?.organization_name || "", display_name: value("display_name") || session.user?.user_metadata?.display_name || "" })
    });
    let code = "";
    try { code = (await response.clone().json()).code || ""; } catch { code = ""; }
    return { ok: response.ok, code };
  };


  const pwStep = form.querySelector("[data-password-step]");
  const alertBox = document.querySelector("#member-activation-alert");
  const alertText = document.querySelector("#member-activation-text");
  const alertAction = document.querySelector("#member-activation-action");
  const showAlert = (deadline) => {
    if (!alertBox) return;
    needsActivation = true;
    alertText.textContent = `Créez un mot de passe sécurisé${deadline ? ` avant le ${formatDeadline(deadline)}` : ""} pour valider et sécuriser votre compte.`;
    alertBox.hidden = false;
  };
  let needsActivation = false;
  let hasPassword = false;
  const hideAlert = () => { needsActivation = false; if (alertBox) alertBox.hidden = true; };
  const showPasswordStep = () => {
    awaitingPassword = true;
    linkSent = false;
    form.querySelectorAll("[data-before-otp], [data-create-only], [data-login-only], [data-mode-login]").forEach((el) => { el.hidden = true; });
    if (otpStep) otpStep.hidden = true;
    if (submitButton) submitButton.hidden = false;
    if (pwStep) pwStep.hidden = false;
    // Les champs masqués (adresse, consentement, code…) ne doivent jamais bloquer l'envoi en silence : ils ne sont plus obligatoires à cette étape.
    form.querySelectorAll("input, select, textarea").forEach((el) => { if (!pwStep || !pwStep.contains(el)) el.required = false; });
    const pw = field("new_password"), pc = field("new_password_confirm");
    // Mot de passe déjà créé : on ne le redemande pas (Supabase exigerait l'ancien pour le changer), un clic suffit pour activer l'espace.
    pwStep?.querySelectorAll("label.form-field, #password-help").forEach((el) => { el.hidden = hasPassword; el.style.display = hasPassword ? "none" : ""; });
    if (pw) pw.required = !hasPassword;
    if (pc) pc.required = !hasPassword;
    if (titleEl) titleEl.textContent = "Activer mon espace";
    if (introEl) introEl.textContent = hasPassword ? "Votre mot de passe est déjà créé. Il reste à activer votre espace." : "Votre adresse est vérifiée. Choisissez votre mot de passe personnel.";
    if (submitButton) submitButton.innerHTML = 'Activer mon espace <span aria-hidden="true">→</span>';
    if (dialog && !dialog.open) { if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", ""); }
    if (!hasPassword) pw?.focus();
  };
  const setPasswordAndActivate = async () => {
    if (!hasPassword) {
      const check = validatePassword(value("new_password"), { email: pendingEmail, organization: value("organization_name"), confirm: value("new_password_confirm") });
      if (!check.ok) throw new Error(check.message);
    }
    const consent = { privacy_notice_acknowledged: true, privacy_notice_version: NOTICE_VERSION };
    const { error: pwError } = await supabase.auth.updateUser(hasPassword ? { data: consent } : { password: value("new_password"), data: consent });
    if (pwError) throw new Error("Le mot de passe n’a pas pu être enregistré. Choisissez-en un autre ou réessayez.");
    const { data: { session } } = await supabase.auth.getSession();
    const response = await provisionWorkspace(session);
    if (!response.ok) {
      const code = response.code;
      if (code === "ACTIVATION_EXPIRED") throw new Error("Le délai d’activation est dépassé. Redemandez un lien pour reprendre.");
      throw new Error("Votre mot de passe est enregistré, mais l’espace n’a pas pu être activé. Réessayez dans un instant.");
    }
    awaitingPassword = false;
    if (pwStep) pwStep.hidden = true;
    ["new_password", "new_password_confirm"].forEach((n) => { const el = field(n); if (el) { el.required = false; el.value = ""; } });
    hideAlert();
    if (emailInput) emailInput.required = true;
    form.querySelectorAll("[data-before-otp]").forEach((el) => { el.hidden = false; });
    setCreateMode(false);
    await updateAuthStatus(session);
    setFeedback("Votre espace est activé. Bienvenue dans votre espace MajestiOS.");
    retourner();
  };
  if (alertAction) alertAction.addEventListener("click", showPasswordStep);
  // Compte déjà connecté dont l'espace reste à activer : ouvrir le formulaire mène à la création du mot de passe, jamais à une nouvelle demande de lien.
  if (dialog && typeof MutationObserver === "function") {
    new MutationObserver(() => { if (dialog.open && needsActivation && !awaitingPassword) showPasswordStep(); }).observe(dialog, { attributes: true, attributeFilter: ["open"] });
  }

  const startResendCooldown = () => {
    if (!resendButton) return;
    let remaining = 60;
    resendButton.disabled = true;
    resendButton.textContent = `Renvoyer le lien dans ${remaining} s`;
    clearInterval(resendTimer);
    resendTimer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(resendTimer);
        resendButton.disabled = false;
        resendButton.textContent = "Renvoyer le lien";
      } else {
        resendButton.textContent = `Renvoyer le lien dans ${remaining} s`;
      }
    }, 1000);
  };

  const signInWithPasswordFlow = async () => {
    if (!emailInput?.checkValidity()) { emailInput?.reportValidity(); return; }
    const email = value("email").toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: String(field("login_password")?.value ?? "") });
    if (error || !data?.session) throw new Error("Adresse ou mot de passe incorrect. Première connexion ou mot de passe oublié : demandez un lien par e-mail.");
    pendingEmail = email;
    if (field("login_password")) field("login_password").value = "";
    await updateAuthStatus(data.session);
    if (needsActivation) {
      showPasswordStep();
      setFeedback("Connexion réussie. Il reste à activer votre espace : confirmez votre mot de passe.");
      return;
    }
    const { data: memberships } = await supabase.from("organization_members").select("organization_id").eq("user_id", data.user.id).limit(1);
    if (memberships?.length) {
      setFeedback("Connexion réussie. Bienvenue dans votre espace MajestiOS.");
      if (!retourner()) fermerFormulaire();
    } else setFeedback("Connexion réussie, mais aucun espace n’est associé à ce compte. Demandez un lien par e-mail pour le créer.", true);
  };

  const sendOtp = async () => {
    const email = value("email").toLowerCase();
    if (!emailInput?.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }
    if (createMode && !field("privacy_ack")?.checked) throw new Error("Cochez la case pour accepter la politique de confidentialité.");
    const options = createMode
      ? { shouldCreateUser: true, data: { privacy_notice_acknowledged: true, privacy_notice_version: NOTICE_VERSION, organization_name: value("organization_name"), display_name: value("display_name") } }
      : { shouldCreateUser: false };
    pendingOptions = options;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { ...options, emailRedirectTo: `${window.location.origin}/espace-membre.html` } });
    if (error) {
      if (error.status === 429 || /rate.?limit/i.test(error.code || error.message || "")) throw new Error("Trop de demandes d’e-mail en peu de temps. Patientez environ une heure avant de redemander un lien.");
      // Keep account-existence and delivery errors deliberately non-specific.
      throw new Error("La demande n’a pas pu être confirmée. Si l’envoi est autorisé pour cette adresse, vérifiez votre boîte de réception et vos courriers indésirables.");
    }
    pendingEmail = email;
    linkSent = true;
    if (otpStep) otpStep.hidden = false;
    form.querySelectorAll("[data-before-otp], [data-login-only]").forEach((element) => { element.hidden = true; });
    if (submitButton) submitButton.hidden = true;
    setFeedback(`Un e-mail vient d’être envoyé à ${email}. Ouvrez-le et cliquez sur le lien de connexion.`);
    startResendCooldown();
  };

  // La carte « connexion » doit toujours dire la vérité : déconnecté, connecté à activer, ou connecté et actif.
  const previewTitle = preview?.querySelector("h2");
  const openButton = preview?.querySelector("#open-personal-space");
  const createHint = preview?.querySelector(".member-create-hint");
  const originalTitle = previewTitle?.textContent;
  const originalOpenHtml = openButton?.innerHTML;
  const renderPreview = (mode) => {
    if (!preview) return;
    // Connecté et activé : la grande carte disparaît, il ne reste qu'une ligne discrète avec « Se déconnecter ».
    const compact = mode === "active";
    preview.classList.toggle("is-compact", compact);
    [["padding", "6px 0"], ["margin", "8px auto"], ["border", "0"], ["background", "none"], ["box-shadow", "none"], ["min-height", "0"]].forEach(([k, v]) => {
      if (compact) preview.style.setProperty(k, v, "important"); else preview.style.removeProperty(k);
    });
    preview.querySelectorAll(".member-preview-icon, h2, #member-auth-status").forEach((el) => { el.style.display = compact ? "none" : ""; });
    if (previewTitle) previewTitle.textContent = mode === "out" ? originalTitle : mode === "pending" ? "Votre compte est connecté" : "Vous êtes connecté";
    if (openButton) {
      openButton.hidden = mode === "active";
      openButton.style.display = mode === "active" ? "none" : "";
      openButton.innerHTML = mode === "pending" ? 'Activer mon espace <span aria-hidden="true">→</span>' : originalOpenHtml;
    }
    if (createHint) { createHint.hidden = mode !== "out"; createHint.style.display = mode !== "out" ? "none" : ""; }
  };
  const updateAuthStatus = async (session) => {
    if (!status) return;
    const oldButton = preview?.querySelector("#member-signout");
    if (!session) {
      hideAlert();
      status.textContent = "Vous n’êtes pas connecté.";
      renderPreview("out");
      oldButton?.remove();
      return;
    }
    if (session.user.email) pendingEmail = session.user.email;
    const { data, error } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", session.user.id)
      .limit(1);
    if (!error && !data?.length) {
      let { data: act } = await supabase.rpc("member_activation_status");
      // Compte connecté sans espace ni activation (ex. connexion directe) : on ouvre l'activation, pour ne jamais laisser la personne bloquée.
      if (act && act.state === "none") act = (await supabase.rpc("start_member_activation")).data;
      hasPassword = !!act?.has_password;
      if (act && ["pending", "expired"].includes(act.state)) showAlert(act.deadline);
      else hideAlert();
    } else hideAlert();
    renderPreview(data?.length ? "active" : "pending");
    status.textContent = error
      ? "Compte connecté · vérification de l’espace indisponible."
      : data?.length
        ? "Vous êtes connecté à votre espace MajestiOS."
        : "Compte connecté · espace personnel à finaliser : cliquez sur « Activer mon espace ».";
    // Plusieurs mises à jour peuvent se croiser : on revérifie après les attentes pour ne créer qu'un seul bouton.
    if (!preview || preview.querySelector("#member-signout")) return;
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitButton) submitButton.disabled = true;
    if (feedback) feedback.hidden = true;
    try {
      if (awaitingPassword) await setPasswordAndActivate();
      else if (linkSent) return;
      else {
        if (!form.reportValidity()) return;
        if (!createMode) {
          if (!value("login_password")) throw new Error("Saisissez votre mot de passe, ou demandez un lien de connexion par e-mail.");
          await signInWithPasswordFlow();
        } else await sendOtp();
      }
    } catch (error) {
      setFeedback(error.message || "Une erreur est survenue. Veuillez réessayer.", true);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  sendLinkButton?.addEventListener("click", async () => {
    if (feedback) feedback.hidden = true;
    try { await sendOtp(); } catch (error) { setFeedback(error.message || "Une erreur est survenue. Veuillez réessayer.", true); }
  });

  resendButton?.addEventListener("click", async () => {
    if (resendButton.disabled || !pendingEmail) return;
    resendButton.disabled = true;
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: pendingEmail, options: pendingOptions });
      if (error) throw error;
      setFeedback("Un nouveau lien vient d’être envoyé. Utilisez le dernier e-mail reçu.");
      startResendCooldown();
    } catch {
      setFeedback("Impossible de renvoyer le lien pour le moment. Réessayez un peu plus tard.", true);
      resendButton.disabled = false;
    }
  });

  // Arrivée par le lien du courrier : même parcours, on reprend l'activation.
  const arrivedByLink = /access_token=|[?&]code=/.test(window.location.hash + window.location.search);
  const resumeFromLink = async (session) => {
    if (!session?.user) return;
    const { data: members } = await supabase.from("organization_members").select("organization_id").eq("user_id", session.user.id).limit(1);
    if (members?.length) {
      if (!retourner()) { setFeedback("Connexion réussie. Bienvenue dans votre espace MajestiOS."); fermerFormulaire(); }
      return;
    }
    pendingEmail = session.user.email || pendingEmail;
    const { data: act } = await supabase.rpc("start_member_activation");
    if (act && ["pending", "expired"].includes(act.state)) {
      activationDeadline = act.deadline || "";
      await updateAuthStatus(session);
      showPasswordStep();
      setFeedback("Adresse vérifiée. Créez maintenant votre mot de passe sécurisé pour activer votre espace.");
    }
  };
  supabase.auth.getSession().then(async ({ data }) => {
    await updateAuthStatus(data.session);
    if (arrivedByLink && data.session) {
      try { history.replaceState(null, "", window.location.pathname); } catch (_) { /* sans importance */ }
      await resumeFromLink(data.session);
    }
  });
  supabase.auth.onAuthStateChange((_event, session) => updateAuthStatus(session));
} else if (form) {
  if (feedback) {
    feedback.textContent = "Le service de connexion n’est pas configuré. Votre demande n’a pas été envoyée.";
    feedback.hidden = false;
    feedback.dataset.state = "error";
  }
  if (submitButton) submitButton.disabled = true;
}
