const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = path.join(__dirname, "dist");
const siteFiles = ["index.html", "6180 (2).webp", "majestios-veille-economique (1).webp", "majestios-call-center (1).webp", "majestios-batiment.webp", "IMMEUBLE MajestiOS .webp", "majestios-appels-d-offres (1).webp", "crm.html", "brainos.html", "categorie-services-numeriques.html", "categorie-travaux-amenagement.html", "categorie-conseil-etudes.html", "categorie-batiment.html", "categorie-renovation.html", "categorie-electricite.html", "categorie-plomberie-chauffage.html", "categorie-maintenance.html", "nous-rejoindre.html", "espace-membre.html", "faq.html", "marches-publics.html", "veille-marches.html", "marches-prives.html", "prospection-active.html", "developpement-commercial.html", "intelligence-economique.html", "reseaux-synergies.html", "sous-traitance.html", "accompagnement-appels-offres.html", "bodacc-veille-entreprises.html", "salons-seminaires.html", "reputation-virtuelle.html", "suivi-commercial.html", "vision-majestios.html", "blog-100-blagues.html", "rubriques-immersives.css", "rubriques-immersives.js", "styles.css", "charte-majestios.css", "app.js", "category-results.js", "search-results.js", "opportunity-search.js", "rubric-search.js", "resultats-recherche.html", "publier-ma-demande.html", "mentions-legales.html", "politique-confidentialite.html", "catalogue-majestios.js", "naf-suggestions.js", "company-targeting.js", "company-targeting-page.js", "company-fit.js", "qualification-entreprises.html"];

// Le cockpit admin est inclus uniquement dans les déploiements Preview Vercel.
// Il reste absent des builds de production tant que l'authentification serveur n'est pas prête.
const previewAdminFiles = process.env.VERCEL_ENV === "preview"
  ? ["admin/index.html", "admin/admin.css", "admin/admin.js"]
  : [];
siteFiles.push(...previewAdminFiles);

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
  const destination = path.join(outputDirectory, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(__dirname, file), destination);
}

// Inventaire du site généré à partir des fichiers réellement inclus dans ce build.
// Disponible uniquement dans les previews avec le cockpit admin.
if (process.env.VERCEL_ENV === "preview") {
  const sectionDefinitions = [
    { id: "01", name: "Marchés publics", hrefs: ["marches-publics.html", "veille-marches.html", "accompagnement-appels-offres.html"] },
    { id: "02", name: "Marchés privés", hrefs: ["marches-prives.html", "sous-traitance.html", "qualification-entreprises.html"] },
    { id: "03", name: "Veille économique", hrefs: ["bodacc-veille-entreprises.html", "veille-marches.html"] },
    { id: "04", name: "Prospection active", hrefs: ["prospection-active.html", "marches-publics.html", "marches-prives.html"] },
    { id: "05", name: "Développement commercial", hrefs: ["developpement-commercial.html", "prospection-active.html", "suivi-commercial.html"] },
    { id: "06", name: "Accompagnement aux appels d’offres", hrefs: ["accompagnement-appels-offres.html", "marches-publics.html", "qualification-entreprises.html"] },
    { id: "07", name: "Réputation virtuelle", hrefs: ["reputation-virtuelle.html", "reseaux-synergies.html", "sous-traitance.html"] },
    { id: "08", name: "Espace entreprises", hrefs: ["espace-membre.html"] },
    { id: "09", name: "CRM", hrefs: ["crm.html", "suivi-commercial.html", "developpement-commercial.html"], buildingNote: "Aucune zone cliquable CRM distincte n’est identifiée dans le mapping SVG actuel." },
    { id: "10", name: "Business Intelligence", hrefs: ["intelligence-economique.html", "brainos.html", "vision-majestios.html"], buildingNote: "Le dernier étage est libellé « IA & Business Intelligence » sur l’accueil." }
  ];
  const htmlPages = siteFiles.filter((file) => file.endsWith(".html"));
  const assignedPages = new Set(sectionDefinitions.flatMap((section) => section.hrefs));
  const siteMap = {
    generatedAtBuild: new Date().toISOString(),
    source: "build.js · liste effective des fichiers copiés dans dist/",
    sections: sectionDefinitions.map((section) => ({
      ...section,
      pages: section.hrefs.map((href) => ({ href, presentInBuild: htmlPages.includes(href) }))
    })),
    additionalPages: htmlPages.filter((href) => !assignedPages.has(href)).map((href) => ({ href, presentInBuild: true })),
    totalHtmlPages: htmlPages.length
  };
  const adminOutput = path.join(outputDirectory, "admin");
  fs.mkdirSync(adminOutput, { recursive: true });
  fs.writeFileSync(path.join(adminOutput, "site-map.json"), JSON.stringify(siteMap, null, 2) + "\n", "utf8");
}

// Audit statique des liens internes du build Preview : rapport consultable dans le cockpit.
if (process.env.VERCEL_ENV === "preview") {
  const htmlFiles = siteFiles.filter((file) => file.endsWith(".html"));
  const htmlSet = new Set(htmlFiles);
  const inbound = new Map(htmlFiles.map((file) => [file, new Set()]));
  const broken = [];
  const references = [];
  const normalizeTarget = (raw, source) => {
    const value = raw.trim().replace(/&amp;/g, "&");
    if (!value || value.startsWith("#") || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return null;
    let pathname;
    try { pathname = decodeURIComponent(new URL(value, "https://local.invalid/" + source).pathname).replace(/^\//, ""); }
    catch { return null; }
    if (!pathname) return null;
    const candidates = [pathname, pathname.endsWith("/") ? pathname + "index.html" : pathname + "/index.html"];
    return candidates.find((candidate) => siteFiles.includes(candidate)) || candidates[0];
  };
  for (const source of htmlFiles) {
    const html = fs.readFileSync(path.join(outputDirectory, source), "utf8");
    const attrs = /\b(?:href|src|action|poster|xlink:href)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
    let match;
    while ((match = attrs.exec(html))) {
      const raw = match[1] ?? match[2] ?? match[3] ?? "";
      const target = normalizeTarget(raw, source);
      if (target === null) continue;
      references.push({ source, target });
      if (!siteFiles.includes(target)) {
        broken.push({ source, target, original: raw });
      } else if (htmlSet.has(target)) {
        inbound.get(target).add(source);
      }
    }
    const srcset = /\bsrcset\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
    while ((match = srcset.exec(html))) {
      for (const candidate of (match[1] ?? match[2] ?? "").split(",")) {
        const raw = candidate.trim().split(/\s+/)[0];
        const target = normalizeTarget(raw, source);
        if (target && !siteFiles.includes(target)) broken.push({ source, target, original: raw });
      }
    }
  }
  const orphanPages = htmlFiles.filter((file) => file !== "index.html" && !file.startsWith("admin/") && !(inbound.get(file)?.size));
  const titleCounts = new Map();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(outputDirectory, file), "utf8");
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (title) titleCounts.set(title, [...(titleCounts.get(title) || []), file]);
  }
  const duplicateTitles = [...titleCounts.entries()].filter(([, pages]) => pages.length > 1).map(([title, pages]) => ({ title, pages }));
  const report = {
    generatedAtBuild: new Date().toISOString(),
    scope: "Contrôle statique des références locales dans les fichiers du build Preview ; aucune requête HTTP externe.",
    totals: { htmlPages: htmlFiles.length, localReferences: references.length, brokenReferences: broken.length, orphanPages: orphanPages.length, duplicateTitles: duplicateTitles.length },
    brokenReferences: broken,
    orphanPages,
    duplicateTitles
  };
  const adminOutput = path.join(outputDirectory, "admin");
  fs.mkdirSync(adminOutput, { recursive: true });
  fs.writeFileSync(path.join(adminOutput, "site-audit.json"), JSON.stringify(report, null, 2) + "\n", "utf8");
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
