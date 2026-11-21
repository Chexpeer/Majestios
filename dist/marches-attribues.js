import { ANNONCES_SUPABASE } from "./annonces-config.mjs";
import { sessionToken, rpcHeaders, limitReached, buildLimitNotice, sharedClient } from "./visiteur-limite.mjs";
import { MAX_ALERTES, buildAlertFromFilters, alertRequest, alertToFormValues, countNew } from "./alertes-marches.mjs";
import { SECTORS, buildContractsRequest, buildWinnersRequest, normalizeContracts, normalizeWinners, kindLabel, formatAmount, formatDateFr, metaSummary } from "./marches-attribues.mjs";

const root = document.querySelector("#marches-attribues");
if (root) {
  const rpc = async (name, body) => {
    const response = await fetch(ANNONCES_SUPABASE.url + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: rpcHeaders(await sessionToken()),
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
  const fact = (article, label, value) => {
    if (!value) return;
    const p = el("p");
    p.append(el("strong", "", label + " : "), document.createTextNode(value));
    article.append(p);
  };

  // Filtres des marchés : une famille d'achats par division CPV.
  const sectorSelect = root.querySelector("#marches-secteur");
  for (const [code, label] of Object.entries(SECTORS)) sectorSelect.append(new Option(label, code));

  // Bandeau de transparence : volumes, période couverte, date du dernier chargement.
  const meta = root.querySelector("#marches-meta");
  rpc("awarded_contracts_meta", {}).then((rows) => { meta.textContent = metaSummary(rows).text; }).catch(() => { meta.textContent = "Les marchés attribués sont momentanément inaccessibles."; });

  // Liste générique (marchés ou gagnants) avec pagination « Voir plus » et filtres sans perte de requête.
  const makeList = ({ form, list, status, more, fn, build, normalize, card, emptyText, errorText, loadingText, doneText }) => {
    let page = 0, loading = false, pendingReset = false;
    let notice = null;
    const load = async (reset) => {
      if (loading) { if (reset) pendingReset = true; return; }
      loading = true;
      if (reset) { page = 0; list.replaceChildren(); }
      more.hidden = true;
      notice?.remove();
      status.textContent = loadingText;
      try {
        const rows = await rpc(fn, build({ ...Object.fromEntries(new FormData(form).entries()), page }));
        const { items, hasMore } = normalize(rows);
        for (const item of items) list.append(card(item));
        status.textContent = list.children.length ? doneText(list.children.length) : emptyText;
        const token = await sessionToken();
        const locked = limitReached(token, list.children.length, hasMore);
        more.hidden = !hasMore;
        if (locked) { notice = buildLimitNotice(document, token); more.parentElement.after(notice); }
      } catch {
        status.textContent = errorText;
      } finally {
        loading = false;
        if (pendingReset) { pendingReset = false; load(true); }
      }
    };
    form.addEventListener("submit", (event) => { event.preventDefault(); load(true); });
    form.addEventListener("change", () => load(true));
    more.addEventListener("click", () => { page += 1; load(false); });
    load(true);
  };


  // Alertes « marché gagné » : réservées aux titulaires d'un espace personnel ; un visiteur voit seulement l'invitation à créer son espace.
  const alertsHost = root.querySelector("#marches-alertes");
  const filtersForm = root.querySelector("#marches-filtres");
  const renderAlerts = async () => {
    if (!alertsHost) return;
    const token = await sessionToken();
    alertsHost.replaceChildren();
    if (!token) {
      const p = el("p", "small-note", "Soyez alerté des nouveaux marchés gagnés dans votre zone et votre secteur : ");
      const a = el("a", "", "créez votre espace personnel (gratuit)");
      a.href = "espace-membre.html#creation";
      p.append(a, document.createTextNode("."));
      alertsHost.append(p);
      return;
    }
    const client = await sharedClient();
    if (!client) return;
    const { data: alerts, error } = await client.from("contract_alerts").select("id,label,department,cpv,query,min_amount,last_seen_on").order("created_at");
    if (error) return;
    const box = el("div", "marches-alertes-box");
    box.append(el("h3", "", "Mes alertes marché gagné"));
    const save = el("button", "button-primary button-compact", "Créer une alerte avec ces filtres");
    save.type = "button";
    const note = el("p", "small-note", "");
    save.addEventListener("click", async () => {
      const values = Object.fromEntries(new FormData(filtersForm).entries());
      const alert = buildAlertFromFilters(values);
      if (!alert) { note.textContent = "Choisissez au moins un filtre (département, famille d’achats, montant ou mot-clé) avant de créer une alerte."; return; }
      if ((alerts || []).length >= MAX_ALERTES) { note.textContent = "Vous avez déjà " + MAX_ALERTES + " alertes : supprimez-en une pour en créer une autre."; return; }
      const { error: insertError } = await client.from("contract_alerts").insert(alert);
      if (insertError) { note.textContent = "L’alerte n’a pas pu être enregistrée. Réessayez plus tard."; return; }
      renderAlerts();
    });
    box.append(save, note);
    for (const a of alerts || []) {
      const row = el("div", "marches-alerte");
      const title = el("p", "", a.label + " — ");
      const count = el("strong", "", "…");
      title.append(count);
      row.append(title);
      rpc("list_awarded_contracts", alertRequest(a)).then((rows) => {
        const n = countNew(rows, a.last_seen_on);
        count.textContent = n ? n + " nouveau(x) marché(s) depuis le " + formatDateFr(a.last_seen_on) : "aucun nouveau marché depuis le " + formatDateFr(a.last_seen_on);
      }).catch(() => { count.textContent = "indisponible pour le moment"; });
      const see = el("button", "button-primary button-compact", "Voir"); see.type = "button";
      see.addEventListener("click", () => {
        const values = alertToFormValues(a);
        filtersForm.elements.department.value = values.department; filtersForm.elements.query.value = values.query;
        filtersForm.elements.sector.value = values.sector; filtersForm.elements.minAmount.value = values.minAmount;
        filtersForm.dispatchEvent(new Event("change", { bubbles: true }));
      });
      const seen = el("button", "button-primary button-compact", "Marquer comme vu"); seen.type = "button";
      seen.addEventListener("click", async () => { await client.from("contract_alerts").update({ last_seen_on: new Date().toISOString().slice(0, 10) }).eq("id", a.id); renderAlerts(); });
      const del = el("button", "button-primary button-compact", "Supprimer"); del.type = "button";
      del.addEventListener("click", async () => { await client.from("contract_alerts").delete().eq("id", a.id); renderAlerts(); });
      row.append(see, seen, del);
      box.append(row);
    }
    alertsHost.append(box);
  };
  renderAlerts();

  const contractCard = (item) => {
    const article = el("article", "opportunity-result-card marche-card");
    article.dataset.uid = item.uid;
    article.append(el("p", "eyebrow", ("MARCHÉ ATTRIBUÉ" + (kindLabel(item.kind) ? " · " + kindLabel(item.kind) : "")).toUpperCase()));
    article.append(el("h3", "", item.object));
    fact(article, "Gagné par", item.winners);
    fact(article, "Acheteur", [item.buyer, [item.buyerCommune, item.buyerDept && "dép. " + item.buyerDept].filter(Boolean).join(", ")].filter(Boolean).join(" — "));
    fact(article, "Montant", formatAmount(item.amount) + (item.amountFlag ? " (montant à vérifier)" : ""));
    fact(article, "Offres reçues", item.offers === null ? "" : String(item.offers));
    fact(article, "Durée", item.durationMonths ? item.durationMonths + " mois" : "");
    fact(article, "Procédure", item.procedure);
    fact(article, "Notifié le", formatDateFr(item.awardedOn));
    if (item.subcontracting) article.append(el("p", "marche-badge", "Sous-traitance déclarée par le titulaire"));
    return article;
  };

  const winnerCard = (item) => {
    const article = el("article", "opportunity-result-card gagnant-card");
    article.dataset.id = item.id;
    article.append(el("p", "eyebrow", "ENTREPRISE TITULAIRE" + (item.category ? " · " + item.category : "")));
    article.append(el("h3", "", item.name));
    fact(article, "Lieu", [item.commune, item.dept && "dép. " + item.dept].filter(Boolean).join(", "));
    fact(article, "Marchés obtenus (6 mois)", String(item.contracts));
    fact(article, "Montant médian", item.medianAmount === null ? "" : formatAmount(item.medianAmount));
    return article;
  };

  makeList({
    form: root.querySelector("#marches-filtres"), list: root.querySelector("#marches-liste"), status: root.querySelector("#marches-statut"), more: root.querySelector("#marches-plus"),
    fn: "list_awarded_contracts", build: buildContractsRequest, normalize: normalizeContracts, card: contractCard,
    loadingText: "Chargement des marchés attribués…",
    doneText: (n) => n + " marché(s) affiché(s), du plus récent au plus ancien.",
    emptyText: "Aucun marché attribué pour ces critères sur les 6 derniers mois.",
    errorText: "Les marchés attribués sont momentanément inaccessibles. Aucun marché n’est inventé. Réessayez plus tard."
  });
  makeList({
    form: root.querySelector("#gagnants-filtres"), list: root.querySelector("#gagnants-liste"), status: root.querySelector("#gagnants-statut"), more: root.querySelector("#gagnants-plus"),
    fn: "top_awarded_winners", build: buildWinnersRequest, normalize: normalizeWinners, card: winnerCard,
    loadingText: "Chargement des entreprises titulaires…",
    doneText: (n) => n + " entreprise(s) affichée(s), classées par nombre de marchés obtenus.",
    emptyText: "Aucune entreprise ayant obtenu au moins 2 marchés pour ces critères sur les 6 derniers mois.",
    errorText: "Les entreprises titulaires sont momentanément inaccessibles. Aucune entreprise n’est inventée. Réessayez plus tard."
  });
}
