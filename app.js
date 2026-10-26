const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuToggle = $(".menu-toggle");
const navigation = $("#site-nav");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
    navigation.classList.toggle("open", !isOpen);
  });

  $$("a", navigation).forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    });
  });
}

const tenderEndpoint = "https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";
const tenderFields = [
  "idweb", "objet", "nomacheteur", "nature", "nature_libelle", "dateparution",
  "datelimitereponse", "code_departement_prestation", "code_departement",
  "type_marche", "descripteur_libelle", "famille_libelle", "url_avis"
].join(",");

function formatDate(value, options = { dateStyle: "medium" }) {
  if (!value) return "Non précisée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Non précisée";
  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

function formatTenderType(types) {
  const values = Array.isArray(types) ? types : types ? [types] : [];
  if (values.length === 0) return "Nature non précisée";
  return values
    .map((type) => ({ TRAVAUX: "Travaux", SERVICES: "Services", FOURNITURES: "Fournitures" }[type] ?? type))
    .join(" · ");
}

function tenderDepartment(record) {
  const departments = Array.isArray(record.code_departement) ? record.code_departement : [record.code_departement];
  const department = record.code_departement_prestation || departments.find(Boolean) || "";
  return department ? `Département ${department}` : "Zone non précisée dans l’avis";
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function tenderDetailUrl(id) {
  const currentPath = window.location.pathname.replace(/index\.html$/, "");
  const detailPath = /\/opportunites\/?$/.test(currentPath) ? "avis/" : "opportunites/avis/";
  const url = new URL(detailPath, window.location.href);
  url.searchParams.set("id", id || "");
  return url;
}

function buildTenderCard(record, onSelect) {
  const card = makeElement("article", "feed-card");
  const icon = makeElement("span", "feed-card-icon", "▤");
  icon.setAttribute("aria-hidden", "true");

  const content = makeElement("div", "feed-card-content");
  const heading = makeElement("div", "feed-card-heading");
  heading.append(makeElement("h3", "", record.objet || "Objet non précisé"));
  heading.append(makeElement("span", "feed-live-tag", "BOAMP"));
  content.append(heading);
  content.append(makeElement("p", "feed-buyer", record.nomacheteur || "Acheteur non précisé"));
  content.append(makeElement("p", "feed-description", record.famille_libelle || "Avis publié au Bulletin officiel des annonces des marchés publics."));
  content.append(makeElement(
    "div",
    "feed-card-metadata",
    `${formatTenderType(record.type_marche)} · ${tenderDepartment(record)} · Publié le ${formatDate(record.dateparution)} · Réponse avant ${formatDate(record.datelimitereponse, { dateStyle: "short", timeStyle: "short" })}`
  ));

  const actions = makeElement("div", "feed-card-actions");
  const details = makeElement("a", "feed-interest", "Voir la fiche");
  details.href = tenderDetailUrl(record.idweb).href;
  details.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(record);
  });
  const source = makeElement("a", "feed-source-link", "Avis officiel ↗");
  source.href = record.url_avis || `https://www.boamp.fr/pages/avis/?q=idweb:${encodeURIComponent(record.idweb || "")}`;
  source.target = "_blank";
  source.rel = "noopener noreferrer";
  source.addEventListener("click", (event) => event.stopPropagation());
  actions.append(details, source);
  card.append(icon, content, actions);
  card.addEventListener("click", () => onSelect(record));
  return card;
}

function setupTenderFeed() {
  const feedStream = $("#feed-stream");
  if (!feedStream) return;

  const searchInput = $("#feed-search");
  const typeFilter = $("#feed-sector");
  const departmentFilter = $("#feed-region");
  const count = $("#feed-result-count");
  const status = $("#feed-status");
  const liveDot = $("#feed-live-dot");
  const refreshButton = $("#feed-refresh");
  const loadMoreButton = $("#feed-load-more");
  const records = new Map();
  const pageSize = 24;
  let offset = 0;
  let isLoading = false;
  let hasMore = true;
  let lastUpdated = null;

  const setStatus = (message, state = "loading") => {
    if (status) status.textContent = message;
    if (liveDot) {
      liveDot.dataset.state = state;
      liveDot.setAttribute("aria-label", state === "live" ? "Flux à jour" : "État du flux");
    }
  };

  const renderRecords = () => {
    const query = (searchInput?.value || "").trim().toLocaleLowerCase("fr");
    const selectedType = typeFilter?.value || "all";
    const selectedDepartment = (departmentFilter?.value || "").trim().toLocaleLowerCase("fr");
    const matches = [...records.values()].filter((record) => {
      const searchable = [
        record.objet,
        record.nomacheteur,
        record.nature_libelle,
        record.famille_libelle,
        ...(Array.isArray(record.type_marche) ? record.type_marche : record.type_marche ? [record.type_marche] : []),
        ...(record.descripteur_libelle || [])
      ].filter(Boolean).join(" ").toLocaleLowerCase("fr");
      const department = tenderDepartment(record).toLocaleLowerCase("fr");
      const marketTypes = Array.isArray(record.type_marche)
        ? record.type_marche
        : record.type_marche ? [record.type_marche] : [];
      return searchable.includes(query)
        && (selectedType === "all" || marketTypes.includes(selectedType))
        && (!selectedDepartment || department.includes(selectedDepartment));
    });

    if (count) count.textContent = `${matches.length} avis affiché${matches.length === 1 ? "" : "s"}`;
    feedStream.replaceChildren();
    if (!matches.length) {
      feedStream.append(makeElement("p", "feed-empty", "Aucun avis ne correspond à ces filtres. Élargissez la recherche ou chargez d’autres avis."));
    } else {
      const fragment = document.createDocumentFragment();
      matches.forEach((record) => fragment.append(buildTenderCard(record, showTenderDetail)));
      feedStream.append(fragment);
    }
    if (loadMoreButton) loadMoreButton.hidden = !hasMore;
  };

  const fetchPage = async (reset = false) => {
    if (isLoading || (!hasMore && !reset)) return;
    isLoading = true;
    const previousOffset = offset;
    const previousHasMore = hasMore;
    if (reset) {
      offset = 0;
      hasMore = true;
      if (records.size === 0) {
        feedStream.replaceChildren(makeElement("p", "feed-loading", "Chargement des avis BOAMP en cours…"));
      }
    }
    if (loadMoreButton) loadMoreButton.disabled = true;
    if (refreshButton) refreshButton.disabled = true;
    setStatus(reset ? "Actualisation de la source BOAMP…" : "Chargement d’autres avis BOAMP…");

    const now = new Date().toISOString();
    const parameters = new URLSearchParams({
      limit: String(pageSize),
      offset: String(offset),
      order_by: "dateparution desc",
      select: tenderFields,
      where: `nature="APPEL_OFFRE" AND datelimitereponse >= "${now}"`
    });

    try {
      const response = await fetch(`${tenderEndpoint}?${parameters}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error(`Source BOAMP indisponible (HTTP ${response.status}).`);
      const payload = await response.json();
      if (!Array.isArray(payload.results)) throw new Error("La réponse BOAMP n’a pas le format attendu.");

      if (reset) records.clear();
      payload.results.forEach((record) => {
        if (record.idweb) records.set(record.idweb, record);
      });
      offset += payload.results.length;
      hasMore = payload.results.length === pageSize && offset < payload.total_count;
      lastUpdated = new Date();
      renderRecords();
      setStatus(`Source BOAMP · actualisée à ${new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(lastUpdated)}`, "live");
    } catch (error) {
      if (records.size === 0) {
        feedStream.replaceChildren(makeElement(
          "p",
          "feed-error",
          `${error.message} Le flux en direct n’est pas disponible pour le moment. Réessayez dans quelques instants ou consultez le site BOAMP.`
        ));
      } else if (reset) {
        offset = previousOffset;
        hasMore = previousHasMore;
        renderRecords();
      }
      setStatus(
        records.size
          ? "Actualisation impossible · avis précédemment chargés conservés"
          : "Connexion à la source BOAMP impossible",
        "error"
      );
    } finally {
      isLoading = false;
      if (loadMoreButton) loadMoreButton.disabled = false;
      if (refreshButton) refreshButton.disabled = false;
    }
  };

  const showTenderDetail = (record) => {
    window.location.href = tenderDetailUrl(record.idweb).href;
  };

  searchInput?.addEventListener("input", renderRecords);
  typeFilter?.addEventListener("change", renderRecords);
  departmentFilter?.addEventListener("input", renderRecords);
  refreshButton?.addEventListener("click", () => fetchPage(true));
  loadMoreButton?.addEventListener("click", () => fetchPage());
  fetchPage(true);
  window.setInterval(() => fetchPage(true), 5 * 60 * 1000);
}

function setupTenderDetail() {
  const target = $("#announcement-detail");
  if (!target) return;
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    target.append(makeElement("p", "feed-error", "Référence d’avis absente ou invalide."));
    return;
  }

  const parameters = new URLSearchParams({
    limit: "1",
    select: tenderFields,
    where: `idweb="${id}"`
  });
  target.append(makeElement("p", "feed-loading", "Chargement de l’avis officiel…"));

  fetch(`${tenderEndpoint}?${parameters}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000)
  })
    .then((response) => {
      if (!response.ok) throw new Error(`La source BOAMP répond avec le statut ${response.status}.`);
      return response.json();
    })
    .then((payload) => {
      target.replaceChildren();
      const record = payload.results?.[0];
      if (!record) {
        target.append(makeElement("p", "feed-error", "Avis introuvable dans le flux BOAMP."));
        return;
      }
      target.append(makeElement("p", "eyebrow", `AVIS BOAMP · ${record.idweb}`));
      target.append(makeElement("h1", "announcement-title", record.objet || "Objet non précisé"));
      target.append(makeElement("p", "announcement-buyer", record.nomacheteur || "Acheteur non précisé"));

      const facts = makeElement("dl", "announcement-facts");
      [
        ["Nature de l’avis", record.nature_libelle || "Non précisée"],
        ["Type de marché", formatTenderType(record.type_marche)],
        ["Publié le", formatDate(record.dateparution)],
        ["Date limite de réponse", formatDate(record.datelimitereponse, { dateStyle: "full", timeStyle: "short" })],
        ["Zone de prestation", tenderDepartment(record)],
        ["Catégorie BOAMP", record.famille_libelle || "Non précisée"]
      ].forEach(([label, value]) => {
        const item = makeElement("div", "announcement-fact");
        item.append(makeElement("dt", "", label), makeElement("dd", "", value));
        facts.append(item);
      });
      target.append(facts);

      const terms = Array.isArray(record.descripteur_libelle) ? record.descripteur_libelle : [];
      const tags = makeElement("div", "announcement-tags");
      terms.slice(0, 10).forEach((term) => tags.append(makeElement("span", "announcement-tag", term)));
      if (terms.length) target.append(tags);

      target.append(makeElement(
        "p",
        "announcement-caveat",
        "Fait : cet avis est publié dans le jeu de données BOAMP. Il ne prouve pas qu’une entreprise donnée est éligible ou souhaite répondre ; vérifiez l’avis officiel, les pièces et les échéances avant toute décision."
      ));
      const officialLink = makeElement("a", "button button-primary", "Ouvrir l’avis officiel BOAMP ↗");
      officialLink.href = record.url_avis || `https://www.boamp.fr/pages/avis/?q=idweb:${encodeURIComponent(record.idweb)}`;
      officialLink.target = "_blank";
      officialLink.rel = "noopener noreferrer";
      target.append(officialLink);
    })
    .catch((error) => {
      target.replaceChildren(makeElement("p", "feed-error", `${error.message} Consultez directement le site officiel BOAMP.`));
    });
}

function setupDemo() {
  const caseTabs = $$(".case-tab");
  const detail = $("#demo-detail");
  if (!caseTabs.length || !detail) return;

  const scenarios = {
    lost: {
      title: "Candidature non retenue",
      fact: "Dans ce scénario fictif, une entreprise n’a pas remporté un appel d’offres.",
      hypothesis: "La perte pourrait justifier une revue du positionnement ou un partenariat. Aucune piste n’est confirmée.",
      action: "Vérifier les documents officiels, puis décider si un suivi est pertinent."
    },
    won: {
      title: "Un marché vient d’être attribué",
      fact: "Dans ce scénario fictif, un marché a été attribué à une organisation.",
      hypothesis: "L’exécution pourrait créer des besoins en sous-traitance, ressources ou logistique. L’avis seul ne le prouve pas.",
      action: "Qualifier les exigences et le calendrier avant tout échange."
    },
    hiring: {
      title: "Recrutements dans un même métier",
      fact: "Ce scénario fictif réunit plusieurs offres d’emploi dans des profils techniques.",
      hypothesis: "Une convergence peut signaler une évolution des compétences recherchées ; les sources et la période doivent être vérifiées.",
      action: "Vérifier les annonces, leur fraîcheur et leur contexte."
    }
  };
  let activeView = "signal";

  const render = () => {
    const caseId = $(".case-tab.active")?.dataset.case || "lost";
    const scenario = scenarios[caseId];
    const view = activeView;
    detail.replaceChildren();
    $("#demo-title").textContent = scenario.title;
    const addBlock = (label, text, className = "") => {
      const block = makeElement("section", `demo-info-block ${className}`.trim());
      block.append(makeElement("h4", "", label), makeElement("p", "", text));
      detail.append(block);
    };

    if (view === "signal") addBlock("Fait du scénario", scenario.fact, "fact-block");
    else if (view === "analysis") addBlock("Hypothèse à confirmer", scenario.hypothesis, "hypothesis-block");
    else if (view === "network") addBlock("Acteurs", "Les organisations et interlocuteurs sont fictifs et ne sont pas vérifiés.");
    else {
      addBlock("Étape suggérée", scenario.action, "hypothesis-block");
      addBlock("Human Gate", "Une personne habilitée décide de la suite. Cette démonstration n’enregistre rien et ne contacte personne.", "decision-block");
    }
  };

  caseTabs.forEach((button) => button.addEventListener("click", () => {
    caseTabs.forEach((tab) => {
      tab.classList.toggle("active", tab === button);
      tab.setAttribute("aria-selected", String(tab === button));
    });
    render();
  }));
  $$(".demo-tab").forEach((button) => button.addEventListener("click", () => {
    activeView = button.dataset.view;
    $$(".demo-tab").forEach((tab) => {
      tab.classList.toggle("active", tab === button);
      tab.setAttribute("aria-selected", String(tab === button));
    });
    render();
  }));
  render();
}

function setupLeadForm() {
  const leadForm = $("#lead-form");
  const feedback = $("#form-feedback");
  if (!leadForm || !feedback) return;

  const setIntent = (intent) => {
    leadForm.querySelectorAll(".intent-fields").forEach((section) => {
      const visible = section.dataset.for === intent;
      section.hidden = !visible;
      section.querySelectorAll("input, textarea").forEach((field) => {
        field.required = visible && ["tender", "sector", "area", "message"].includes(field.name);
      });
    });
    feedback.hidden = true;
  };

  const profile = $("#contact-profile");
  const requestedProfile = new URLSearchParams(window.location.search).get("profil");
  if (profile && ["visitor", "prospect", "client"].includes(requestedProfile)) {
    profile.value = requestedProfile;
  }

  leadForm.querySelectorAll('input[name="intent"]').forEach((radio) => {
    radio.addEventListener("change", () => setIntent(radio.value));
  });
  setIntent(leadForm.querySelector('input[name="intent"]:checked')?.value || "contact");

  $("#preview-request")?.addEventListener("click", () => {
    if (!leadForm.reportValidity()) return;
    feedback.textContent = "Cette demande de démonstration n’a pas été transmise : aucun service de contact n’est configuré.";
    feedback.hidden = false;
  });
}

setupTenderFeed();
setupTenderDetail();
setupDemo();
setupLeadForm();
