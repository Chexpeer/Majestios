import { ANNONCES_OUVERTES, NOTICE_VERSION } from "./annonces-config.mjs";
import { KINDS, validateAnnouncement, serverMessage } from "./annonces-formulaire.mjs";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const form = document.querySelector("#annonce-form");
const feedback = document.querySelector("#annonce-feedback");

if (form && feedback) {
  const kindSelect = form.elements.kind;
  for (const [value, label] of KINDS) kindSelect.append(new Option(label, value));

  // Les deux boutons de présentation préremplissent le type d'annonce.
  document.querySelectorAll("a[data-annonce-kind]").forEach((link) => {
    link.addEventListener("click", () => { kindSelect.value = link.dataset.annonceKind; });
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
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      const response = await fetch(MAJESTIOS_SUPABASE.url + "/rest/v1/rpc/submit_announcement", {
        method: "POST",
        headers: { "content-type": "application/json", apikey: MAJESTIOS_SUPABASE.publishableKey, authorization: "Bearer " + MAJESTIOS_SUPABASE.publishableKey },
        body: JSON.stringify({ ...result.payload, p_notice_version: NOTICE_VERSION })
      });
      if (!response.ok) throw new Error(await response.text());
      form.reset();
      show("Merci. Votre annonce est enregistrée et sera relue par l’équipe avant publication. Vos coordonnées ne seront jamais affichées.");
    } catch (error) {
      show(serverMessage(error), true);
    } finally {
      button.disabled = false;
    }
  });
}
