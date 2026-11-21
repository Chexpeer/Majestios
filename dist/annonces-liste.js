import { ANNONCES_SUPABASE, NOTICE_VERSION } from "./annonces-config.mjs";
import { KIND_LABELS, buildListRequest, normalizeAnnouncements, formatDateFr, placeLabel, validateIntroduction, introductionError } from "./annonces-liste.mjs";

const root = document.querySelector("#annonces-privees");
if (root) {
  const filters = root.querySelector("#annonces-filtres");
  const list = root.querySelector("#annonces-liste");
  const status = root.querySelector("#annonces-statut");
  const more = root.querySelector("#annonces-plus");
  let page = 0;
  let loading = false;
  let pendingReset = false;

  const rpc = async (name, body) => {
    const response = await fetch(ANNONCES_SUPABASE.url + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: ANNONCES_SUPABASE.publishableKey },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  };

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const introductionForm = (item) => {
    const details = el("details", "annonce-contact");
    details.append(el("summary", "", "Demander une mise en relation"));
    const form = el("form", "annonce-contact-form");
    form.noValidate = true;
    form.innerHTML = '<label class="form-field">Votre nom<input name="name" type="text" maxlength="120" autocomplete="name" required></label>' +
      '<label class="form-field">Votre e-mail<input name="email" type="email" maxlength="254" autocomplete="email" required></label>' +
      '<label class="form-field">Votre message<textarea name="message" rows="3" maxlength="1000" required></textarea></label>' +
      '<label class="hp-field" aria-hidden="true">Ne pas remplir<input name="website" type="text" tabindex="-1" autocomplete="off"></label>' +
      '<label class="form-field"><span><input name="consent" type="checkbox"> J’accepte que MajestiOS transmette ma demande à l’auteur de l’annonce. Ses coordonnées ne me sont pas communiquées directement.</span></label>';
    const submit = el("button", "button-primary button-compact", "Envoyer la demande");
    submit.type = "submit";
    const feedback = el("p", "annonce-feedback");
    feedback.setAttribute("role", "status");
    feedback.hidden = true;
    form.append(submit, feedback);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const result = validateIntroduction(Object.fromEntries(new FormData(form).entries()));
      feedback.hidden = false;
      if (!result.ok) { feedback.textContent = Object.values(result.errors).join(" "); return; }
      submit.disabled = true;
      try {
        await rpc("request_announcement_introduction", { p_reference: item.reference, ...result.payload, p_notice_version: NOTICE_VERSION });
        form.reset();
        feedback.textContent = "Merci. Votre demande est transmise : l’équipe la relaie à l’auteur de l’annonce.";
      } catch (error) {
        feedback.textContent = introductionError(error);
      } finally { submit.disabled = false; }
    });
    details.append(form);
    return details;
  };

  const card = (item) => {
    const article = el("article", "opportunity-result-card annonce-card");
    article.dataset.reference = item.reference;
    article.append(el("p", "eyebrow", "ANNONCE · " + KIND_LABELS[item.kind].toUpperCase()));
    article.append(el("h3", "", item.title));
    article.append(el("p", "", item.description));
    const facts = [["Entreprise", item.company], ["Métier", item.trade], ["Zone", placeLabel(item)], ["Publiée le", formatDateFr(item.publishedAt)], ["Valable jusqu’au", formatDateFr(item.validUntil)], ["Référence", item.reference]];
    for (const [label, value] of facts) {
      if (!value) continue;
      const p = el("p");
      p.append(el("strong", "", label + " : "), document.createTextNode(value));
      article.append(p);
    }
    article.append(introductionForm(item));
    return article;
  };

  const load = async (reset) => {
    if (loading) { if (reset) pendingReset = true; return; }
    loading = true;
    if (reset) { page = 0; list.replaceChildren(); }
    more.hidden = true;
    status.textContent = "Chargement des annonces…";
    try {
      const rows = await rpc("list_published_announcements", buildListRequest({ ...Object.fromEntries(new FormData(filters).entries()), page }));
      const { items, hasMore } = normalizeAnnouncements(rows);
      for (const item of items) list.append(card(item));
      const total = list.children.length;
      status.textContent = total ? total + " annonce(s) affichée(s)." : "Aucune annonce publiée pour ces critères pour le moment. Vous pouvez déposer la vôtre gratuitement.";
      more.hidden = !hasMore;
    } catch {
      status.textContent = "Les annonces sont momentanément inaccessibles. Aucune annonce n’est inventée. Réessayez plus tard.";
    } finally {
      loading = false;
      if (pendingReset) { pendingReset = false; load(true); }
    }
  };

  filters.addEventListener("submit", (event) => { event.preventDefault(); load(true); });
  filters.addEventListener("change", () => load(true));
  more.addEventListener("click", () => { page += 1; load(false); });
  load(true);
}
