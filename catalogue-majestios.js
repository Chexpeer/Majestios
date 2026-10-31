/* Catalogue partagé MajestiOS : routes, surfaces virtuelles et catégories de recherche.
   Les catégories marquées planned sont prévues pour le futur moteur ; elles ne prétendent pas
   contenir des annonces réelles dans le prototype actuel. */
(function (root) {
  "use strict";

  const rubrics = [
    { id: "B01", key: "marches-publics", surface: "central-bleu", label: "Marchés publics", href: "marches-publics.html", group: "central", x: -7, z: 1 },
    { id: "B02", key: "marches-prives", surface: "central-vert", label: "Marchés privés", href: "marches-prives.html", group: "central", x: 7, z: 1 },
    { id: "B03", key: "developpement-commercial", surface: "central-orange", label: "Développement commercial", href: "developpement-commercial.html", group: "central", x: -7, z: -5 },
    { id: "B04", key: "prospection-inversee", surface: "central-turquoise", label: "Prospection inversée", href: "prospection-inversee.html", group: "central", x: 7, z: -5 },
    { id: "B05", key: "intelligence-economique", surface: "central-corail", label: "Intelligence économique", href: "intelligence-economique.html", group: "central", x: -7, z: -11 },
    { id: "B06", key: "reseaux-synergies", surface: "peripherique-turquoise", label: "Réseaux et synergies", href: "reseaux-synergies.html", group: "peripherique", x: -13, z: -2 },
    { id: "B07", key: "veille-marches", surface: "central-bleu-clair", label: "Veille des marchés", href: "veille-marches.html", group: "central", x: 7, z: -11 },
    { id: "B08", key: "accompagnement-appels-offres", surface: "peripherique-corail", label: "Accompagnement aux appels d’offres", href: "accompagnement-appels-offres.html", group: "peripherique", x: 13, z: -2 },
    { id: "B09", key: "sous-traitance", surface: "peripherique-vert", label: "Sous-traitance", href: "sous-traitance.html", group: "peripherique", x: -13, z: -8 },
    { id: "B10", key: "salons-seminaires", surface: "peripherique-violet", label: "Salons et séminaires", href: "salons-seminaires.html", group: "peripherique", x: 13, z: -8 },
    { id: "B11", key: "bodacc-veille-entreprises", surface: "peripherique-orange", label: "Veille des entreprises — BODACC", href: "bodacc-veille-entreprises.html", group: "peripherique", x: -13, z: -14 },
    { id: "B12", key: "suivi-commercial", surface: "peripherique-violet-clair", label: "Suivi commercial et capitalisation", href: "suivi-commercial.html", group: "peripherique", x: 13, z: -14 }
  ];

  const searchCategories = [
    { value: "all", label: "Toutes les catégories", active: true },
    { value: "services", label: "Services numériques", active: true },
    { value: "travaux", label: "Travaux & aménagement", active: true },
    { value: "conseil", label: "Conseil & études", active: true },
    { value: "fournitures", label: "Fournitures & équipements", planned: true },
    { value: "btp", label: "BTP : lots techniques et second œuvre", planned: true },
    { value: "maintenance", label: "Maintenance & exploitation", planned: true },
    { value: "logistique", label: "Transport & logistique", planned: true },
    { value: "formation", label: "Formation & recrutement", planned: true },
    { value: "communication", label: "Communication & événementiel", planned: true }
  ];

  const marketTypes = [
    { value: "all", label: "Publics et privés" },
    { value: "public", label: "Marchés publics" },
    { value: "private", label: "Marchés privés" }
  ];

  root.MAJESTIOS_CATALOG = Object.freeze({
    version: "1.0.0",
    rubrics: Object.freeze(rubrics.map((item) => Object.freeze(item))),
    searchCategories: Object.freeze(searchCategories.map((item) => Object.freeze(item))),
    marketTypes: Object.freeze(marketTypes.map((item) => Object.freeze(item)))
  });
})(window);
