/* Fond d'écran aléatoire des rubriques : une image différente, tirée au hasard, à chaque ouverture de page.
   Exécuté dans <head> avant l'affichage : l'image par défaut de la page n'est donc jamais téléchargée.
   Retour : retirer la balise <script src="fond-aleatoire.js"> des pages. */
(function () {
  try {
    var fonds = ["accompagnement-appels-offres", "bodacc-veille-entreprises", "developpement-commercial", "facturation-electronique", "intelligence-economique", "marches-prives", "marches-publics", "prospection-crm", "reputation-virtuelle", "reseau-synergies", "salons-seminaires", "sous-traitance", "suivi-commercial", "veille-marches", "ville-crepuscule", "falaise-phare", "montagnes-aurore", "salle-conseil-panorama"];
    var clairs = {}; // images claires : texte sombre à contour blanc
    var dernier = ""; try { dernier = sessionStorage.getItem("mj-fond") || ""; } catch (e) {}
    var choix; do { choix = fonds[Math.floor(Math.random() * fonds.length)]; } while (choix === dernier && fonds.length > 1);
    try { sessionStorage.setItem("mj-fond", choix); } catch (e) {}
    var style = document.createElement("style");
    style.textContent = 'body:has(main.interior-page[data-fond]){--mj-fond-image:url("visuels/fonds/' + choix + '.webp")!important}';
    document.head.appendChild(style);
    if (clairs[choix]) document.documentElement.setAttribute("data-ton", "clair");
  } catch (e) {}
})();
