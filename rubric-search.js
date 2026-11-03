(() => {
  "use strict";

  const page = document.querySelector("main.interior-page");
  if (!page || document.querySelector("#advanced-search-form")) return;

  const path = window.location.pathname.split("/").pop();
  const configs = {
    "marches-publics.html": { market: "public", fixedMarket: true },
    "developpement-commercial.html": { market: "", fixedMarket: false },
    "prospection-active.html": { market: "", fixedMarket: false },
    "veille-marches.html": { market: "public", fixedMarket: true },
    "accompagnement-appels-offres.html": { market: "public", fixedMarket: true },
    "sous-traitance.html": { market: "", fixedMarket: false },
    "marches-prives.html": { market: "private", fixedMarket: true },
    "intelligence-economique.html": { market: "", fixedMarket: false },
    "reseaux-synergies.html": { market: "", fixedMarket: false },
    "bodacc-veille-entreprises.html": { market: "private", fixedMarket: true },
    "suivi-commercial.html": { market: "", fixedMarket: false }
  };
  const config = configs[path];
  if (!config) return;

  const catalogue = window.MAJESTIOS_CATALOG || {};
  const publicCategories = (catalogue.searchCategories || [])
    .filter((item) => item.active && item.value !== "all")
    .map((item) => ({ value: item.value, label: item.label, group: "Marchés publics · BOAMP" }));
  const privateCategories = [
    { value: "bodacc-creations", label: "Créations et implantations", group: "Signaux BODACC" },
    { value: "bodacc-cessions", label: "Ventes, cessions et reprises", group: "Signaux BODACC" },
    { value: "bodacc-modifications", label: "Modifications d’entreprises", group: "Signaux BODACC" },
    { value: "bodacc-procedures", label: "Difficultés et procédures collectives", group: "Signaux BODACC" },
    { value: "bodacc-radiations", label: "Radiations et cessations", group: "Signaux BODACC" },
    { value: "immobilier", label: "Immobilier professionnel", group: "Autres opportunités privées", connected: false },
    { value: "emploi", label: "Emploi et recrutement", group: "Autres opportunités privées", connected: false },
    { value: "sous-traitance-offres", label: "Offres de sous-traitance", group: "Autres opportunités privées", connected: false },
    { value: "sous-traitance-recherche", label: "Recherche de sous-traitants et partenaires", group: "Autres opportunités privées", connected: false }
  ];

  const section = document.createElement("section");
  section.className = "tender-feed-section rubric-shared-search";
  section.id = "recherche-avancee";
  section.setAttribute("aria-label", "Moteur de recherche avancé");
  section.innerHTML =
    '<div class="feed-wrap"><div class="feed-demo">' +
      '<form class="feed-toolbar" id="advanced-search-form" action="resultats-recherche.html" method="get">' +
        '<label class="feed-search"><span aria-hidden="true">⌕</span><span class="sr-only">Rechercher une opportunité commerciale</span><input id="feed-search" name="q" type="search" maxlength="160" placeholder="Mot-clé, entreprise, secteur..." autocomplete="off"></label>' +
        (config.fixedMarket
          ? '<input type="hidden" name="marche" value="' + config.market + '">'
          : '<label class="feed-filter-label" id="market-step" hidden><span class="sr-only">Choisir le type de marché</span><select id="feed-market-type" aria-label="Type de marché"><option value="">1. Choisir le type de marché</option><option value="public">Marchés publics</option><option value="private">Marchés privés · signaux BODACC</option></select></label>') +
        '<label class="feed-filter-label" id="category-step" hidden><span class="sr-only">Choisir une catégorie</span><select id="feed-sector" name="categorie" aria-label="Catégorie d’opportunité" disabled><option value="all">2. Choisir d’abord un type</option></select></label>' +
        '<label class="feed-filter-label" id="department-step" hidden><span class="sr-only">Filtrer par région</span><select id="feed-region" name="zone" aria-label="Région administrative"><option value="all">Toutes les régions</option></select></label>' +
        '<p class="search-source-note" id="search-source-note">Choisissez d’abord le type d’opportunité, puis une rubrique adaptée. Les signaux BODACC ne sont pas des appels d’offres ; les sources non connectées sont indiquées comme telles.</p>' +
        '<button class="feed-search-submit" type="submit">Rechercher <span aria-hidden="true">→</span></button>' +
      '</form></div></div>';

  const lede = page.querySelector(".interior-lede");
  if (lede) lede.insertAdjacentElement("afterend", section);
  else page.prepend(section);

  const form = section.querySelector("#advanced-search-form");
  const queryField = section.querySelector("#feed-search");
  const marketStep = section.querySelector("#market-step");
  const marketSelect = section.querySelector("#feed-market-type");
  const categoryStep = section.querySelector("#category-step");
  const categorySelect = section.querySelector("#feed-sector");
  const departmentStep = section.querySelector("#department-step");
  const regionSelect = section.querySelector("#feed-region");
  const params = new URLSearchParams(window.location.search);
  const initialMarket = config.fixedMarket ? config.market : (params.get("marche") || "");
  const initialCategory = params.get("categorie") || "all";
  const initialRegion = params.get("zone") || "all";

  const addOption = (parent, value, label, disabled = false) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.disabled = disabled;
    parent.append(option);
  };

  const populateCategories = (market, selected = "all") => {
    categorySelect.replaceChildren();
    addOption(categorySelect, "all", market ? "Toutes les catégories" : "2. Choisir d’abord un type");
    const source = market === "public" ? publicCategories : market === "private" ? privateCategories : [];
    const groups = new Map();
    source.forEach((item) => {
      let parent = categorySelect;
      if (item.group) {
        if (!groups.has(item.group)) {
          const group = document.createElement("optgroup");
          group.label = item.group;
          groups.set(item.group, group);
          categorySelect.append(group);
        }
        parent = groups.get(item.group);
      }
      addOption(parent, item.value,
        item.connected === false ? item.label + " · source à connecter" : item.label,
        item.connected === false);
    });
    categorySelect.disabled = !market;
    categorySelect.value = source.some((item) => item.value === selected && item.connected !== false) ? selected : "all";
  };

  const regions = catalogue.searchRegions || [];
  regionSelect.replaceChildren();
  addOption(regionSelect, "all", "Toutes les régions");
  const plannedGroup = document.createElement("optgroup");
  plannedGroup.label = "Régions françaises · à connecter";
  plannedGroup.disabled = true;
  regions.forEach((region) => {
    if (region.value === "all") return;
    if (region.planned) addOption(plannedGroup, region.value, region.label + " · à venir", true);
    else addOption(regionSelect, region.value, region.label);
  });
  if (plannedGroup.children.length) regionSelect.append(plannedGroup);

  if (queryField) queryField.value = params.get("q") || "";
  if (marketSelect) marketSelect.value = initialMarket;
  populateCategories(initialMarket, initialCategory);
  if (config.fixedMarket || initialMarket) categoryStep.hidden = false;
  if (initialCategory !== "all" || initialRegion !== "all") departmentStep.hidden = false;
  if (regionSelect && [...regionSelect.options].some((option) => option.value === initialRegion && !option.disabled)) {
    regionSelect.value = initialRegion;
  }

  if (marketStep) {
    queryField.addEventListener("focus", () => { marketStep.hidden = false; });
    queryField.addEventListener("input", () => {
      if (queryField.value.trim()) marketStep.hidden = false;
    });
    marketSelect.addEventListener("change", () => {
      populateCategories(marketSelect.value);
      categoryStep.hidden = !marketSelect.value;
      departmentStep.hidden = true;
      regionSelect.value = "all";
    });
  }
  categorySelect.addEventListener("change", () => { departmentStep.hidden = false; });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const market = config.fixedMarket ? config.market : (marketSelect ? marketSelect.value : "");
    if (!config.fixedMarket && !market) {
      marketStep.hidden = false;
      marketSelect.focus();
      return;
    }
    const selected = categorySelect.value;
    const searchParams = new URLSearchParams();
    if (queryField.value.trim()) searchParams.set("q", queryField.value.trim());
    if (selected && selected !== "all" && !categorySelect.selectedOptions[0]?.disabled) searchParams.set("categorie", selected);
    if (regionSelect.value && regionSelect.value !== "all") searchParams.set("zone", regionSelect.value);
    if (market) searchParams.set("marche", market);
    const matchingPublicCategory = market === "public"
      ? (catalogue.searchCategories || []).find((item) => item.value === selected && !item.planned && item.href)
      : null;
    const destination = matchingPublicCategory ? matchingPublicCategory.href : "resultats-recherche.html";
    window.location.href = destination + (searchParams.size ? "?" + searchParams.toString() : "");
  });
})();