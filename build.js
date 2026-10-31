const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = path.join(__dirname, "dist");
const siteFiles = ["index.html", "nous-rejoindre.html", "espace-membre.html", "faq.html", "marches-publics.html", "veille-marches.html", "marches-prives.html", "prospection-inversee.html", "developpement-commercial.html", "intelligence-economique.html", "reseaux-synergies.html", "sous-traitance.html", "accompagnement-appels-offres.html", "bodacc-veille-entreprises.html", "salons-seminaires.html", "suivi-commercial.html", "zone-artisanale.html", "zone-artisanale.css", "zone-artisanale.js", "rubriques-immersives.css", "rubriques-immersives.js", "styles.css", "app.js", "schema-majestios.svg"];

fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of siteFiles) {
  fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file));
}
