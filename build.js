const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = path.join(__dirname, "dist");
const siteFiles = ["index.html", "6180 (2).webp", "majestios-veille-economique (1).webp", "majestios-call-center (1).webp", "majestios-batiment.webp", "IMMEUBLE MajestiOS .webp", "majestios-appels-d-offres (1).webp", "crm.html", "majestios-v5.html", "categorie-services-numeriques.html", "categorie-travaux-amenagement.html", "categorie-conseil-etudes.html", "categorie-batiment.html", "categorie-renovation.html", "categorie-electricite.html", "categorie-plomberie-chauffage.html", "categorie-maintenance.html", "nous-rejoindre.html", "espace-membre.html", "faq.html", "marches-publics.html", "veille-marches.html", "marches-prives.html", "prospection-active.html", "developpement-commercial.html", "intelligence-economique.html", "reseaux-synergies.html", "sous-traitance.html", "accompagnement-appels-offres.html", "bodacc-veille-entreprises.html", "salons-seminaires.html", "suivi-commercial.html", "vision-majestios.html", "rubriques-immersives.css", "rubriques-immersives.js", "styles.css", "charte-majestios.css", "app.js", "category-results.js", "search-results.js", "opportunity-search.js", "rubric-search.js", "resultats-recherche.html", "mentions-legales.html", "politique-confidentialite.html", "catalogue-majestios.js", "naf-suggestions.js", "company-targeting.js", "company-targeting-page.js", "company-fit.js", "qualification-entreprises.html"];

const duplicateFiles = siteFiles.filter((file, index) => siteFiles.indexOf(file) !== index);
if (duplicateFiles.length) {
  console.error(`Build interrompu : fichier(s) déclaré(s) plusieurs fois :\\n- ${[...new Set(duplicateFiles)].join("\\n- ")}`);
  process.exit(1);
}

const missingFiles = siteFiles.filter((file) => !fs.existsSync(path.join(__dirname, file)));
if (missingFiles.length) {
  console.error(`Build interrompu : ${missingFiles.length} fichier(s) source manquant(s) :\n- ${missingFiles.join("\n- ")}`);
  process.exit(1);
}

// Ne remplacer dist/ qu’après avoir vérifié toutes les sources requises.
fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of siteFiles) {
  fs.copyFileSync(path.join(__dirname, file), path.join(outputDirectory, file));
}

// Vérification post-copie : ne pas considérer le build comme réussi si une ressource
// manque dans dist/ ou si son contenu diffère de la source.
const invalidOutputFiles = siteFiles.filter((file) => {
  const sourcePath = path.join(__dirname, file);
  const outputPath = path.join(outputDirectory, file);
  return !fs.existsSync(outputPath) ||
    !fs.statSync(outputPath).isFile() ||
    !fs.readFileSync(sourcePath).equals(fs.readFileSync(outputPath));
});

if (invalidOutputFiles.length) {
  console.error(`Build échoué : ${invalidOutputFiles.length} fichier(s) absent(s) ou altéré(s) dans dist/ :\\n- ${invalidOutputFiles.join("\\n- ")}`);
  process.exit(1);
}

console.log(`Build vérifié : ${siteFiles.length} fichiers copiés dans dist/ sans différence avec les sources.`);
