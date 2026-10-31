(() => {
  "use strict";
  const list = document.querySelector("#search-active-filters");
  if (!list) return;
  const params = new URLSearchParams(window.location.search);
  const catalogue = window.MAJESTIOS_CATALOG || {};
  const category = params.get("categorie") || "all";
  const market = params.get("marche") || "all";
  const region = params.get("zone") || "all";
  const categories = catalogue.searchCategories || [];
  const markets = catalogue.marketTypes || [];
  const regions = catalogue.searchRegions || [];
  const findLabel = (items, value, fallback) => items.find((item) => item.value === value)?.label || fallback;
  const criteria = [
    ["Mots-clés", (params.get("q") || "").trim() || "Aucun mot-clé précisé"],
    ["Catégorie", findLabel(categories, category, category)],
    ["Type de marché", findLabel(markets, market, market)],
    ["Localisation", findLabel(regions, region, region)]
  ];
  for (const [label, value] of criteria) {
    const term = document.createElement("dt");
    term.textContent = label;
    const description = document.createElement("dd");
    description.textContent = value;
    list.append(term, description);
  }

  // Préserver les critères au retour vers le formulaire de recherche.
  const returnLink = document.querySelector('a.button-primary[href^="index.html"]');
  if (returnLink) {
    const returnParams = new URLSearchParams(params);
    returnLink.href = `index.html${returnParams.size ? `?${returnParams.toString()}` : ""}#recherche-avancee`;
  }

  const panel = document.querySelector("#search-results-panel");
  const loadSearch = () => {
    if (window.MajestiosOpportunitySearch) {
      window.MajestiosOpportunitySearch.render({ panel, params, category });
      return;
    }
    const script = document.createElement("script");
    script.src = "opportunity-search.js";
    script.onload = () => window.MajestiosOpportunitySearch?.render({ panel, params, category });
    script.onerror = () => {
      const empty = panel?.querySelector(".category-results-empty");
      if (empty) empty.textContent = "Le module de recherche n’a pas pu être chargé. Aucun résultat n’est inventé.";
    };
    document.head.append(script);
  };
  if (panel) loadSearch();
})();