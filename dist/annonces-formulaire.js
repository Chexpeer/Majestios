import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { ANNONCES_OUVERTES, ANNONCES_SUPABASE, NOTICE_VERSION } from "./annonces-config.mjs";
import { KINDS, validateAnnouncement, serverMessage } from "./annonces-formulaire.mjs";
import { PAGES } from "./parcours-majestios.mjs";

const form = document.querySelector("#annonce-form");
const feedback = document.querySelector("#annonce-feedback");
const gate = document.querySelector("#annonce-gate");

// Le dépôt est réservé aux titulaires d'un espace personnel : sans session, seul le message d'invitation à créer son espace s'affiche.
const supabase = createClient(ANNONCES_SUPABASE.url, ANNONCES_SUPABASE.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } });
async function currentSession() {
  try { const { data } = await supabase.auth.getSession(); return data?.session || null; } catch { return null; }
}

if (form && feedback) {
  const kindSelect = form.elements.kind;
  for (const [value, label] of KINDS) kindSelect.append(new Option(label, value));

  // Les deux boutons de présentation préremplissent le type d'annonce.
  document.querySelectorAll("a[data-annonce-kind]").forEach((link) => {
    link.addEventListener("click", () => { kindSelect.value = link.dataset.annonceKind; });
  });

  currentSession().then((session) => {
    form.hidden = !session;
    if (gate) gate.hidden = Boolean(session);
  });

  const show = (message, error = false) => {
    feedback.hidden = false;
    feedback.textContent = message;
    feedback.classList.toggle("is-error", error);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    for (const el of form.querySelectorAll("[aria-invalid]")) el.removeAttribute("aria-invalid");
    const result = validateAnnouncement(Object.fromEntries(new FormData(form).entries()));
    if (!result.ok) {
      const names = Object.keys(result.errors);
      for (const name of names) form.elements[name]?.setAttribute("aria-invalid", "true");
      show(names.map((name) => result.errors[name]).join(" "), true);
      form.elements[names[0]]?.focus();
      return;
    }
    if (!ANNONCES_OUVERTES) {
      show("Prévisualisation : votre saisie est valide, mais le dépôt n’est pas encore ouvert. Aucune donnée n’a été envoyée ni enregistrée.");
      return;
    }
    const session = await currentSession();
    if (!session) {
      form.hidden = true;
      if (gate) gate.hidden = false;
      return;
    }
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const response = await fetch(ANNONCES_SUPABASE.url + "/rest/v1/rpc/submit_announcement", {
        method: "POST",
        headers: { "content-type": "application/json", apikey: ANNONCES_SUPABASE.publishableKey, authorization: "Bearer " + session.access_token },
        body: JSON.stringify({ ...result.payload, p_notice_version: NOTICE_VERSION })
      });
      if (!response.ok) throw new Error(await response.text());
      form.reset();
      show("Merci. Votre annonce est enregistrée et sera relue par l’équipe avant publication. Vos coordonnées ne seront jamais affichées. ");
      const link = document.createElement("a");
      link.href = PAGES.annoncesPubliques;
      link.textContent = "Voir les appels d’offres privés publiés";
      feedback.append(link);
    } catch (error) {
      show(serverMessage(error), true);
    } finally {
      button.disabled = false;
    }
  });
}
