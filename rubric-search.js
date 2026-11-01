(() => {
  "use strict";

  const page = document.querySelector("main.interior-page");
  if (!page || document.querySelector(".advanced-search-form")) return;

  const path = window.location.pathname.split("/").pop();
  const configs = {
    "marches-publics.html": {
      title: "Rechercher des marchés publics",
      description: "Interrogez le flux BOAMP avec des critères métier et géographiques. Vérifiez toujours l’avis officiel.",
      market: "public",
      fixedMarket: true
    },
    "developpement-commercial.html": {
      title: "Rechercher des opportunités de développement commercial",
      description: "Repérez des consultations publiques ou explorez séparément les signaux commerciaux privés du BODACC.",
      market: "all"
    },
    "prospection-inversee.html": {
      title: "Rechercher des opportunités pour la prospection inversée",
      description: "Partez des annonces et signaux publiés pour identifier les pistes qui méritent une qualification humaine.",
      market: "all"
    },
    "veille-marches.html": {
      title: "Rechercher dans la veille des marchés",
      description: "Filtrez les avis publics par mot-clé, catégorie et région administrative.",
      market: "public",
      fixedMarket: true
    },
    "accompagnement-appels-offres.html": {
      title: "Trouver un marché à qualifier",
      description: "Recherchez une consultation avant d’évaluer les exigences, les pièces et les délais de réponse.",
      market: "public",
      fixedMarket: true
    },
    "sous-traitance.html": {
      title: "Rechercher des pistes de sous-traitance",
      description: "Explorez les avis et signaux accessibles ; une annonce ne prouve pas à elle seule qu’un besoin de sous-traitance existe.",
      market: "all"
    }
  };
  const config = configs[path];
  if (!config) return;

  const categories = [
    ["all", "Toutes les catégories"],
    ["services", "Services numériques"],
    ["travaux", "Travaux et aménagement"],
    ["conseil", "Conseil et études"],
    ["batiment", "Bâtiment et construction"],
    ["renovation", "Rénovation"],
    ["electricite", "Électricité"],
    ["plomberie", "Plomberie et chauffage"],
    ["maintenance", "Maintenance et exploitation"]
  ];
  const regions = [
    ["all", "Toutes les régions"],
    ["nouvelle-aquitaine", "Nouvelle-Aquitaine"],
    ["ile-de-france", "Île-de-France"],
    ["auvergne-rhone-alpes", "Auvergne-Rhône-Alpes"],
    ["bourgogne-franche-comte", "Bourgogne-Franche-Comté"],
    ["bretagne", "Bretagne"],
    ["centre-val-de-loire", "Centre-Val de Loire"],
    ["corse", "Corse"],
    ["grand-est", "Grand Est"],
    ["hauts-de-france", "Hauts-de-France"],
    ["normandie", "Normandie"],
    ["occitanie", "Occitanie"],
    ["pays-de-la-loire", "Pays de la Loire"],
    ["provence-alpes-cote-d-azur", "Provence-Alpes-Côte d’Azur"],
    ["outre-mer", "Outre-mer"]
  ];
  const optionMarkup = (items) => items.map(([value, label]) =>
    '<option value="' + value + '">' + label + '</option>'
  ).join("");

  const section = document.createElement("section");
  section.className = "floating-route-card rubric-search-card";
  section.setAttribute("aria-labelledby", "rubric-search-title");
  const form = document.createElement("form");
  form.action = "resultats-recherche.html";
  form.method = "get";
  form.className = "advanced-search-form";
  form.id = "rubric-opportunity-search";
  form.innerHTML =
    '<label for="rubric-search-query">Mot-clé, activité ou entreprise</label>' +
    '<input id="rubric-search-query" name="q" type="search" maxlength="160" placeholder="Ex. plomberie, rénovation, maintenance">' +
    '<label for="rubric-search-category">Catégorie</label>' +
    '<select id="rubric-search-category" name="categorie">' + optionMarkup(categories) + '</select>' +
    (config.fixedMarket
      ? '<input type="hidden" name="marche" value="' + config.market + '">'
      : '<label for="rubric-search-market">Type de source</label><select id="rubric-search-market" name="marche"><option value="all">Marchés publics (BOAMP) — vue générale</option><option value="public">Marchés publics (BOAMP)</option><option value="private">Signaux commerciaux privés (BODACC)</option></select>') +
    '<label for="rubric-search-region">Région</label>' +
    '<select id="rubric-search-region" name="zone">' + optionMarkup(regions) + '</select>' +
    '<button class="button-primary" type="submit">Rechercher →</button>';

  const heading = document.createElement("h2");
  heading.id = "rubric-search-title";
  heading.textContent = config.title;
  const description = document.createElement("p");
  description.textContent = config.description;
  const note = document.createElement("p");
  note.className = "small-note";
  note.textContent = "Les résultats dépendent de la source sélectionnée. Les signaux BODACC ne sont pas des appels d’offres ; aucune donnée n’est considérée comme qualifiée sans vérification.";
  section.append(heading, description, form, note);

  const lede = page.querySelector(".interior-lede");
  const virtualSpace = page.querySelector(".virtual-space");
  if (lede) lede.insertAdjacentElement("afterend", section);
  else if (virtualSpace) virtualSpace.insertAdjacentElement("beforebegin", section);
  else page.prepend(section);
})();
