(() => {
  "use strict";
  const page = document.querySelector(".category-page");
  const space = page?.querySelector(".virtual-space[data-world]");
  const card = page?.querySelector(".floating-route-card[aria-labelledby='category-results-title']");
  if (!page || !space || !card) return;

  const definitions = {
    services: { value: "services", label: "Services numériques" },
    travaux: { value: "travaux", label: "Travaux & aménagement" },
    conseil: { value: "conseil", label: "Conseil & études" },
    batiment: { value: "batiment", label: "Bâtiment & construction" },
    renovation: { value: "renovation", label: "Rénovation énergétique & générale" },
    electricite: { value: "electricite", label: "Électricité" },
    plomberie: { value: "plomberie", label: "Plomberie & chauffage" },
    maintenance: { value: "maintenance", label: "Maintenance & exploitation" }
  };
  const catalogue = window.MAJESTIOS_CATALOG || {};
  const categoryMetadata = (catalogue.searchCategories || []).find(
    (item) => item.value === space.dataset.world && !item.planned
  );
  const fallbackDefinition = definitions[space.dataset.world];
  const definition = fallbackDefinition
    ? { ...fallbackDefinition, label: categoryMetadata?.label || fallbackDefinition.label }
    : null;
  if (!definition) return;

  const params = new URLSearchParams(window.location.search);
  params.set("marche", "public");
  const query = (params.get("q") || "").trim();
  const market = params.get("marche");
  const department = params.get("departement") || "all";
  const marketTypes = catalogue.marketTypes || [];
  const departments = catalogue.searchDepartments || [];
  const marketLabels = Object.fromEntries(marketTypes.map((item) => [item.value, item.label]));
  const departmentLabels = Object.fromEntries(departments.map((item) => [item.value, item.value + " · " + item.label]));


  const heading = card.querySelector("#category-results-title");
  if (heading) heading.textContent = `Résultats de recherche — ${definition.label}`;
  const paragraphs = card.querySelectorAll(":scope > p");
  if (paragraphs[0]) paragraphs[0].textContent = "Cette page est la destination dédiée à cette catégorie. La recherche interroge la source correspondant au type de marché sélectionné.";
  if (paragraphs[1]) paragraphs[1].textContent = "Les résultats dépendent de la disponibilité des sources officielles et doivent être vérifiés dans l’avis d’origine. Aucun résultat fictif n’est présenté comme une consultation disponible.";

  const panel = document.createElement("section");
  panel.className = "category-results-panel";
  panel.id = "category-results-panel";
  panel.setAttribute("aria-live", "polite");
  panel.setAttribute("aria-labelledby", "category-results-status");
  const status = document.createElement("h3");
  status.id = "category-results-status";
  status.textContent = "Zone de résultats";
  panel.append(status);

  const criteria = document.createElement("dl");
  criteria.className = "category-active-filters";
  const addCriterion = (label, value) => {
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value;
    criteria.append(term, description);
  };
  addCriterion("Catégorie", definition.label);
  addCriterion("Mots-clés", query || "Aucun mot-clé précisé");
  addCriterion("Type de marché", marketLabels[market] || "Publics et privés");
  addCriterion("Département", departmentLabels[department] || (department === "all" ? "Tous les départements" : department));
  panel.append(criteria);

  const empty = document.createElement("p");
  empty.className = "category-results-empty";
  empty.textContent = "Interrogation de la source officielle en cours selon les critères transmis…";
  panel.append(empty);
  const note = document.createElement("p");
  note.className = "small-note";
  note.textContent = "Les résultats BOAMP et les signaux BODACC gardent des provenances distinctes. Vérifiez chaque annonce sur la source officielle avant toute décision.";
  panel.append(note);

  const oldPanel = card.querySelector("#category-results-panel");
  if (oldPanel) oldPanel.remove();
  const link = card.querySelector('a.feed-interest[href*="index.html"]');
  card.insertBefore(panel, link || card.lastElementChild);

  if (link) {
    const returnParams = new URLSearchParams(params);
    returnParams.set("categorie", definition.value);
    link.href = `index.html?${returnParams.toString()}#recherche-avancee`;
    link.textContent = "Modifier les critères dans la recherche avancée →";
  }

  const loadSearch = () => {
    if (window.MajestiosOpportunitySearch) {
      window.MajestiosOpportunitySearch.render({ panel, params, category: definition.value });
      return;
    }
    const script = document.createElement("script");
    script.src = "opportunity-search.js";
    script.onload = () => window.MajestiosOpportunitySearch?.render({ panel, params, category: definition.value });
    script.onerror = () => { if (empty) empty.textContent = "Le module de recherche n’a pas pu être chargé. Aucun résultat n’est inventé."; };
    document.head.append(script);
  };
  loadSearch();
})();