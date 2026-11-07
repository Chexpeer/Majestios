/* Catalogue partagé MajestiOS : routes, surfaces virtuelles et catégories de recherche.
   Les catégories marquées planned sont prévues pour le futur moteur ; elles ne prétendent pas
   contenir des annonces réelles dans le prototype actuel. */
(function (root) {
  "use strict";

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
    { value: "nettoyage", label: "Nettoyage & propreté", active: true },
    { value: "autre", label: "Autre marché public · recherche par mot-clé", active: true },
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

  // Taxonomie privée partagée par l’accueil et les pages de rubrique.
  // Seules les familles BODACC sont actives tant que les autres sources ne sont pas raccordées.
  const privateSearchCategories = [
    { value: "bodacc-creations", label: "Créations et implantations", group: "Signaux BODACC", active: true, source: "bodacc" },
    { value: "bodacc-cessions", label: "Ventes, cessions et reprises", group: "Signaux BODACC", active: true, source: "bodacc" },
    { value: "bodacc-modifications", label: "Modifications d’entreprises", group: "Signaux BODACC", active: true, source: "bodacc" },
    { value: "autre", label: "Autre signal BODACC · recherche par mot-clé", group: "Signaux BODACC", active: true, source: "bodacc" },
    { value: "immobilier", label: "Immobilier professionnel", group: "Autres opportunités privées", planned: true, source: null },
    { value: "emploi", label: "Emploi et recrutement", group: "Autres opportunités privées", planned: true, source: null },
    { value: "sous-traitance-offres", label: "Offres de sous-traitance", group: "Autres opportunités privées", planned: true, source: null },
    { value: "sous-traitance-recherche", label: "Recherche de sous-traitants et partenaires", group: "Autres opportunités privées", planned: true, source: null }
  ];

  const searchDepartments = `01|Ain
02|Aisne
03|Allier
04|Alpes-de-Haute-Provence
05|Hautes-Alpes
06|Alpes-Maritimes
07|Ardèche
08|Ardennes
09|Ariège
10|Aube
11|Aude
12|Aveyron
13|Bouches-du-Rhône
14|Calvados
15|Cantal
16|Charente
17|Charente-Maritime
18|Cher
19|Corrèze
2A|Corse-du-Sud
2B|Haute-Corse
21|Côte-d’Or
22|Côtes-d’Armor
23|Creuse
24|Dordogne
25|Doubs
26|Drôme
27|Eure
28|Eure-et-Loir
29|Finistère
30|Gard
31|Haute-Garonne
32|Gers
33|Gironde
34|Hérault
35|Ille-et-Vilaine
36|Indre
37|Indre-et-Loire
38|Isère
39|Jura
40|Landes
41|Loir-et-Cher
42|Loire
43|Haute-Loire
44|Loire-Atlantique
45|Loiret
46|Lot
47|Lot-et-Garonne
48|Lozère
49|Maine-et-Loire
50|Manche
51|Marne
52|Haute-Marne
53|Mayenne
54|Meurthe-et-Moselle
55|Meuse
56|Morbihan
57|Moselle
58|Nièvre
59|Nord
60|Oise
61|Orne
62|Pas-de-Calais
63|Puy-de-Dôme
64|Pyrénées-Atlantiques
65|Hautes-Pyrénées
66|Pyrénées-Orientales
67|Bas-Rhin
68|Haut-Rhin
69|Rhône
70|Haute-Saône
71|Saône-et-Loire
72|Sarthe
73|Savoie
74|Haute-Savoie
75|Paris
76|Seine-Maritime
77|Seine-et-Marne
78|Yvelines
79|Deux-Sèvres
80|Somme
81|Tarn
82|Tarn-et-Garonne
83|Var
84|Vaucluse
85|Vendée
86|Vienne
87|Haute-Vienne
88|Vosges
89|Yonne
90|Territoire de Belfort
91|Essonne
92|Hauts-de-Seine
93|Seine-Saint-Denis
94|Val-de-Marne
95|Val-d’Oise
971|Guadeloupe
972|Martinique
973|Guyane
974|La Réunion
976|Mayotte`.split("\n").map((line) => {
    const [value, label] = line.split("|");
    return Object.freeze({ value, label });
  });

  root.MAJESTIOS_CATALOG = Object.freeze({
    version: "1.0.0",
    searchCategories: Object.freeze(searchCategories.map((item) => Object.freeze(item))),
    marketTypes: Object.freeze(marketTypes.map((item) => Object.freeze(item))),
    privateSearchCategories: Object.freeze(privateSearchCategories.map((item) => Object.freeze(item))),
    searchDepartments: Object.freeze(searchDepartments)
  });
})(window);
