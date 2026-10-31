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
  const definition = definitions[space.dataset.world];
  if (!definition) return;

  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim();
  const market = params.get("marche") || "all";
  const region = params.get("zone") || "all";
  const marketLabels = { all: "Publics et privés", public: "Marchés publics", private: "Marchés privés" };
  const regionLabels = {
    all: "Toutes les zones", nord: "Zone Nord · exemple", ouest: "Zone Ouest · exemple",
    sud: "Zone Sud · exemple", "nouvelle-aquitaine": "Nouvelle-Aquitaine",
    "ile-de-france": "Île-de-France", "auvergne-rhone-alpes": "Auvergne-Rhône-Alpes",
    occitanie: "Occitanie", "pays-de-la-loire": "Pays de la Loire", bretagne: "Bretagne",
    normandie: "Normandie", "hauts-de-france": "Hauts-de-France", "grand-est": "Grand Est",
    "bourgogne-franche-comte": "Bourgogne-Franche-Comté", "centre-val-de-loire": "Centre-Val de Loire",
    "provence-alpes-cote-d-azur": "Provence-Alpes-Côte d’Azur", corse: "Corse", "outre-mer": "Outre-mer"
  };

  const heading = card.querySelector("#category-results-title");
  if (heading) heading.textContent = `Résultats de recherche — ${definition.label}`;
  const paragraphs = card.querySelectorAll(":scope > p");
  if (paragraphs[0]) paragraphs[0].textContent = "Cette page est la destination dédiée à cette catégorie. Les filtres transmis sont conservés pour préparer le classement des annonces lorsque les sources seront connectées.";
  if (paragraphs[1]) paragraphs[1].textContent = "Aucune annonce réelle n’est actuellement chargée. MajestiOS n’affiche pas de résultats fictifs comme s’il s’agissait de consultations disponibles.";

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
  addCriterion("Localisation", regionLabels[region] || region);
  panel.append(criteria);

  const empty = document.createElement("p");
  empty.className = "category-results-empty";
  empty.textContent = "0 annonce vérifiée affichée. Les connecteurs aux sources d’appels d’offres et le moteur de classement restent à raccorder.";
  panel.append(empty);
  const note = document.createElement("p");
  note.className = "small-note";
  note.textContent = "Les critères sont préparés dans cette page ; ils ne prouvent pas qu’une source a été interrogée. Les zones marquées « exemple » ne correspondent pas à des territoires de données réellement filtrées.";
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