(() => {
  "use strict";

  const page = document.querySelector("main.interior-page");
  if (!page || document.querySelector("#advanced-search-form")) return;

  const path = window.location.pathname.split("/").pop();
  const configs = {
    "marches-publics.html": ["Rechercher des marchés publics", "Interrogez le flux BOAMP avec des critères métier et géographiques. Vérifiez toujours l’avis officiel.", "public"],
    "developpement-commercial.html": ["Rechercher des opportunités de développement commercial", "Repérez les consultations publiques et les signaux commerciaux privés.", ""],
    "prospection-active.html": ["Rechercher des opportunités pour la prospection", "Identifiez des pistes à qualifier avant toute prise de contact.", ""],
    "veille-marches.html": ["Rechercher dans la veille des marchés", "Filtrez les avis publics par mot-clé, catégorie et département.", "public"],
    "accompagnement-appels-offres.html": ["Trouver un marché à qualifier", "Recherchez une consultation avant d’évaluer les exigences et les délais.", "public"],
    "sous-traitance.html": ["Rechercher des pistes de sous-traitance", "Explorez les avis et signaux accessibles ; toute piste reste à qualifier.", ""],
    "marches-prives.html": ["Rechercher des signaux commerciaux privés", "Explorez les annonces d’entreprise publiées au BODACC. Ce sont des signaux, pas des appels d’offres.", "private"],
    "intelligence-economique.html": ["Rechercher des signaux économiques", "Repérez les informations publiées utiles à une décision commerciale.", ""],
    "reseaux-synergies.html": ["Rechercher des opportunités de partenariat", "Identifiez des pistes de coopération à partir des marchés et signaux publiés.", ""],
    "bodacc-veille-entreprises.html": ["Rechercher dans les annonces BODACC", "Consultez les annonces légales comme signaux stratégiques à vérifier.", "private"],
    "suivi-commercial.html": ["Rechercher une piste à suivre", "Retrouvez les marchés et signaux à qualifier avant leur suivi commercial.", ""],
    "reputation-virtuelle.html": ["Rechercher des opportunités pour votre visibilité", "Repérez les pistes à qualifier avant un accompagnement de visibilité locale.", ""],
    "espace-membre.html": ["Rechercher des opportunités pour votre entreprise", "Consultez les marchés et signaux pertinents pour votre activité.", ""],
    "salons-seminaires.html": ["Rechercher des opportunités de partenariat", "Repérez les pistes de coopération à examiner au sein du réseau.", ""],
    "crm.html": ["Rechercher des opportunités à suivre dans le CRM", "Repérez les marchés et signaux susceptibles d’alimenter votre suivi commercial.", ""],
    "majestios-v5.html": ["Rechercher dans l’écosystème MajestiOS V.5", "Accédez aux marchés et signaux publiés qui alimentent les fonctions transversales.", ""]
  };
  const config = configs[path];
  if (!config) return;

  const section = document.createElement("section");
  section.className = "tender-feed-section rubric-search-card";
  section.id = "recherche-avancee";
  section.setAttribute("aria-label", "Moteur de recherche avancé");
  section.innerHTML =
    '<div class="feed-wrap"><div class="feed-demo">' +
      '<div class="rubric-search-heading"><h2>' + config[0] + '</h2><p>' + config[1] + '</p></div>' +
      '<form class="feed-toolbar" id="advanced-search-form">' +
        '<label class="feed-search"><span aria-hidden="true">⌕</span><span class="sr-only">Rechercher une opportunité commerciale</span><input id="feed-search" type="search" placeholder="Mot-clé, entreprise, secteur..." autocomplete="off"></label>' +
        '<label class="feed-filter-label" id="market-step" hidden><span class="sr-only">Choisir le type de marché</span><select id="feed-market-type" aria-label="Type de marché" required><option value="">1. Choisir le type de marché</option><option value="public">Marchés publics</option><option value="private">Marchés privés et signaux d’entreprises</option></select></label>' +
        '<label class="feed-filter-label" id="category-step" hidden><span class="sr-only">Choisir une catégorie</span><select id="feed-sector" aria-label="Catégorie d’opportunité" required disabled><option value="all">2. Choisir d’abord un type</option></select></label>' +
        '<label class="feed-filter-label" id="department-step" hidden><span class="sr-only">Filtrer par département</span><select id="feed-department" aria-label="Département"><option value="all">3. Choisir un département (facultatif)</option></select></label>' +
        '<p class="search-source-note" id="search-source-note">Choisissez le type d’opportunité, puis une catégorie adaptée. Les marchés privés regroupent les signaux BODACC et les familles Immobilier, Emploi et Sous-traitance ; les sources non connectées sont indiquées comme telles.</p>' +
        '<button class="feed-search-submit" type="submit">Rechercher <span aria-hidden="true">→</span></button>' +
      '</form></div></div>';

  const lede = page.querySelector(".interior-lede");
  if (lede) lede.insertAdjacentElement("afterend", section);
  else page.prepend(section);

  const initialMarket = new URLSearchParams(window.location.search).get("marche") || "";
  const market = section.querySelector("#feed-market-type");
  const categoryStep = section.querySelector("#category-step");
  market.value = initialMarket;
  if (initialMarket) categoryStep.hidden = false;
})();
