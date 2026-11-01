/* Catalogue partagé MajestiOS : routes, surfaces virtuelles et catégories de recherche.
   Les catégories marquées planned sont prévues pour le futur moteur ; elles ne prétendent pas
   contenir des annonces réelles dans le prototype actuel. */
(function (root) {
  "use strict";

  const rubrics = [
    { id: "B01", key: "marches-publics", surface: "central-bleu", label: "Marchés publics", href: "marches-publics.html", group: "central", x: -7, z: 1 },
    { id: "B02", key: "marches-prives", surface: "central-vert", label: "Marchés privés", href: "marches-prives.html", group: "central", x: 7, z: 1 },
    { id: "B03", key: "veille-economique", surface: "central-corail", label: "Veille économique", href: "bodacc-veille-entreprises.html", group: "central", x: -7, z: -5 },
    { id: "B04", key: "prospection", surface: "central-turquoise", label: "Prospection", href: "prospection-inversee.html", group: "central", x: 7, z: -5 },
    { id: "B05", key: "developpement-commercial", surface: "central-orange", label: "Développement commercial", href: "developpement-commercial.html", group: "central", x: -7, z: -11 },
    { id: "B06", key: "accompagnement-appels-offres", surface: "peripherique-corail", label: "Accompagnement aux appels d’offres", href: "accompagnement-appels-offres.html", group: "peripherique", x: 13, z: -2 },
    { id: "B07", key: "salon-virtuel", surface: "peripherique-violet", label: "Salon virtuel", href: "salons-seminaires.html", group: "peripherique", x: 13, z: -8 },
    { id: "B08", key: "espace-entreprises", surface: "peripherique-turquoise", label: "Espace entreprises", href: "espace-membre.html", group: "peripherique", x: -13, z: -2 },
    { id: "B09", key: "crm", surface: "peripherique-violet-clair", label: "CRM", href: "crm.html", group: "peripherique", x: 13, z: -14 },
    { id: "B10", key: "business-intelligence", surface: "peripherique-orange", label: "Business Intelligence", href: "brainos.html", group: "peripherique", x: -13, z: -14 }
  ];

  const searchCategories = [
    { value: "all", label: "Toutes les catégories", active: true },
    { value: "services", label: "Services numériques", active: true, href: "categorie-services-numeriques.html" },
    { value: "travaux", label: "Travaux & aménagement", active: true, href: "categorie-travaux-amenagement.html" },
    { value: "conseil", label: "Conseil & études", active: true, href: "categorie-conseil-etudes.html" },
    { value: "batiment", label: "Bâtiment & construction", active: true, href: "categorie-batiment.html" },
    { value: "renovation", label: "Rénovation énergétique et générale", active: true, href: "categorie-renovation.html" },
    { value: "electricite", label: "Électricité", active: true, href: "categorie-electricite.html" },
    { value: "plomberie", label: "Plomberie & chauffage", active: true, href: "categorie-plomberie-chauffage.html" },
    { value: "maintenance", label: "Maintenance & exploitation", active: true, href: "categorie-maintenance.html" },
    { value: "fournitures", label: "Fournitures & équipements", planned: true },
    { value: "btp", label: "BTP : lots techniques et second œuvre", planned: true },
    { value: "logistique", label: "Transport & logistique", planned: true },
    { value: "formation", label: "Formation professionnelle", planned: true },
    { value: "communication", label: "Communication & événementiel", planned: true }
  ];

  const marketTypes = [
    { value: "all", label: "Publics et privés" },
    { value: "public", label: "Marchés publics" },
    { value: "private", label: "Marchés privés" }
  ];

  const searchRegions = [
    { value: "all", label: "Toutes les régions", active: true },
    { value: "nord", label: "Zone Nord · exemple · à venir", planned: true },
    { value: "ouest", label: "Zone Ouest · exemple · à venir", planned: true },
    { value: "sud", label: "Zone Sud · exemple · à venir", planned: true },
    { value: "nouvelle-aquitaine", label: "Nouvelle-Aquitaine", active: true },
    { value: "ile-de-france", label: "Île-de-France", active: true },
    { value: "auvergne-rhone-alpes", label: "Auvergne-Rhône-Alpes", active: true },
    { value: "occitanie", label: "Occitanie", active: true },
    { value: "pays-de-la-loire", label: "Pays de la Loire", active: true },
    { value: "bretagne", label: "Bretagne", active: true },
    { value: "normandie", label: "Normandie", active: true },
    { value: "hauts-de-france", label: "Hauts-de-France", active: true },
    { value: "grand-est", label: "Grand Est", active: true },
    { value: "bourgogne-franche-comte", label: "Bourgogne-Franche-Comté", active: true },
    { value: "centre-val-de-loire", label: "Centre-Val de Loire", active: true },
    { value: "provence-alpes-cote-d-azur", label: "Provence-Alpes-Côte d’Azur", active: true },
    { value: "corse", label: "Corse", active: true },
    { value: "outre-mer", label: "Outre-mer", active: true }
  ];

  root.MAJESTIOS_CATALOG = Object.freeze({
    version: "1.0.0",
    rubrics: Object.freeze(rubrics.map((item) => Object.freeze(item))),
    searchCategories: Object.freeze(searchCategories.map((item) => Object.freeze(item))),
    marketTypes: Object.freeze(marketTypes.map((item) => Object.freeze(item))),
    searchRegions: Object.freeze(searchRegions.map((item) => Object.freeze(item)))
  });
})(window);
