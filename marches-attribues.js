import { ANNONCES_SUPABASE } from "./annonces-config.mjs";
import { sessionToken, rpcHeaders, limitReached, buildLimitNotice } from "./visiteur-limite.mjs";
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
