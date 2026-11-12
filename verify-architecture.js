const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

function walk(directory, relative = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "dist") return [];
    const rel = path.join(relative, entry.name);
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute, rel) : [rel];
  });
}

const files = walk(root);
// La documentation Markdown est autorisée dans docs/, avec README.md et AGENTS.md à la racine, ainsi que le README technique des Edge Functions.
// Exception temporaire : le cahier des charges existe déjà sur main ; le PR ne peut pas déplacer un fichier hérité de sa branche de base.
// Sa copie canonique V5 est conservée dans docs/evolution-5.0/.
// Elle ne doit jamais être publiée avec le site : le build ne copie que les fichiers de son manifeste.
const markdownAllowed = (file) => {
  const normalized = file.split(path.sep).join("/");
  return normalized === "README.md" || normalized === "AGENTS.md" || normalized.startsWith("docs/") || normalized === "CAHIER-DES-CHARGES-VEILLE-STRATEGIQUE.md" || normalized === "supabase/functions/README.md";
};
const markdownFiles = files.filter((file) => /\.mdx?$/i.test(file) && !markdownAllowed(file));
assert(markdownFiles.length === 0, "Documentation Markdown hors README.md, AGENTS.md et docs/ : " + markdownFiles.join(", "));
assert(exists("README.md"), "README.md absent : guide de démarrage attendu");

assert(exists("index.html"), "Accueil absent");
assert(exists("build.js"), "Build absent");
assert(exists("catalogue-majestios.js"), "Catalogue partagé absent");
assert(exists("app.js"), "Moteur de recherche absent");

let siteFiles = [];
try {
  const manifest = JSON.parse(read("site-files.json"));
  assert(manifest.version === 1, "Build : version de manifeste non prise en charge");
  siteFiles = Array.isArray(manifest.files) ? manifest.files : [];
} catch (error) {
  errors.push("Build : site-files.json absent ou invalide : " + error.message);
}
assert(siteFiles.length > 0, "Build : manifeste des ressources vide");
assert(new Set(siteFiles).size === siteFiles.length, "Build : fichiers dupliqués dans site-files.json");
for (const file of siteFiles) {
  assert(typeof file === "string" && file.trim().length > 0, "Build : chemin vide ou invalide dans le manifeste");
  if (typeof file !== "string" || !file.trim()) continue;
  assert(!path.posix.isAbsolute(file) && !file.replace(/\\/g, "/").split("/").includes(".."), "Build : chemin interdit : " + file);
  assert(exists(file) && fs.statSync(path.join(root, file)).isFile(), "Build : ressource déclarée absente ou non-fichier : " + file);
}
assert(!siteFiles.some((file) => /\.mdx?$/i.test(file)), "Build : la documentation Markdown ne doit pas être publiée avec le site");

const htmlPages = files.filter((file) => file.endsWith(".html") && !file.includes(path.sep));
for (const page of htmlPages) assert(siteFiles.includes(page), "Build : page HTML absente du manifeste : " + page);
const navigationController = read("app.js");
const drawerController = read("navigation-tiroirs.js");
const drawerStyles = read("navigation-tiroirs.css");
assert(navigationController.includes('navigation-tiroirs.js') && navigationController.includes('navigation-tiroirs.css'),
  "Navigation : le contrôleur partagé doit charger le système de tiroirs et ses styles");
assert(navigationController.includes("Assistant conversationnel de première génération"), "Assistant conversationnel absent du contrôleur partagé");
assert(navigationController.includes("majestios-chat.css") && exists("majestios-chat.css"),
  "Assistant : la feuille de style dédiée doit être chargée par le contrôleur commun");
for (const preservedText of ["MAJESTIOS · GUIDE DE VISITE","Besoin d’un coup de pouce","Par où commencer ?","Vous proposez, MajestiOS dispose.","Rechercher une opportunité","Découvrir le développement commercial","Préparer mon espace personnel","Consulter les questions fréquentes"]) {
  assert(navigationController.includes(preservedText), "Assistant : texte ou raccourci historique non préservé : " + preservedText);
}
assert(navigationController.includes('bodacc-veille-entreprises.html'),
  "Assistant : orientation directe vers la veille BODACC absente");

// Les destinations fonctionnelles du site sont contrôlées indépendamment du menu public.
// Certaines pages sont internes, sectorielles ou légales et ne doivent pas toutes devenir des entrées de menu.
const requiredNavigationRoutes = [
  "assistant-majestios.html",
  "marches-publics.html","marches-prives.html","veille-marches.html","bodacc-veille-entreprises.html",
  "sous-traitance.html","developpement-commercial.html","prospection-active.html",
  "accompagnement-appels-offres.html","facturation-electronique.html","suivi-commercial.html","qualification-entreprises.html",
  "reseaux-synergies.html","salons-seminaires.html","reputation-virtuelle.html",
  "intelligence-economique.html","espace-membre.html","espace-interne.html","crm.html",
  "administration.html","nous-rejoindre.html","contact.html","faq.html","vision-majestios.html",
  "categorie-services-numeriques.html","categorie-travaux-amenagement.html","categorie-conseil-etudes.html",
  "categorie-batiment.html","categorie-renovation.html","categorie-electricite.html",
  "categorie-plomberie-chauffage.html","categorie-maintenance.html","majestios-v5.html",
  "mentions-legales.html","politique-confidentialite.html"
];
for (const route of requiredNavigationRoutes) {
  assert(exists(route), "Navigation : route fonctionnelle inexistante : " + route);
  assert(siteFiles.includes(route), "Navigation : route fonctionnelle non publiée : " + route);
}

// Contrat du menu réel : sept rubriques principales, vingt-et-une entrées secondaires et dix-neuf destinations uniques avec l'espace Assistant.
const menuRoutes = [...drawerController.matchAll(/\["[^"]+","([^"]+\.html)"\]/g)].map((match) => match[1]);
const uniqueMenuRoutes = [...new Set(menuRoutes)];
for (const route of uniqueMenuRoutes) {
  assert(exists(route), "Navigation : destination de sous-menu inexistante : " + route);
  assert(siteFiles.includes(route), "Navigation : destination de sous-menu non publiée : " + route);
}
assert( menuRoutes.length === 21, "Navigation : le menu doit contenir 21 entrées secondaires, actuellement " + menuRoutes.length);
assert(uniqueMenuRoutes.length === 19, "Navigation : les destinations secondaires uniques doivent être 19, actuellement " + uniqueMenuRoutes.length);
for (const label of ["Appels d’offres","Développement commercial","Réseau","Réputation virtuelle","Espaces privés","Explorer davantage","Assistant"]) {
  assert(drawerController.includes('label:"' + label + '"'), "Navigation : rubrique principale absente : " + label);
}
assert(drawerController.includes('mouseenter') && drawerController.includes('mouseleave'),
  "Navigation : ouverture au survol sur ordinateur absente");
assert(drawerController.includes('focusin') && drawerController.includes('focusout'),
  "Navigation : ouverture clavier sur ordinateur absente");
assert(drawerController.includes('max-width: 900px') && drawerController.includes('title.addEventListener("click"'),
  "Navigation : ouverture tactile des sous-menus absente");
assert(drawerController.includes('menuButton.addEventListener("click"') && drawerController.includes('nav.classList.add("open")'),
  "Navigation : commande du hamburger absente");
assert(drawerStyles.includes(".nav-group-link") && drawerStyles.includes(".nav-group-items"),
  "Navigation : styles des rubriques et sous-menus absents");
assert(drawerStyles.includes("#menu-toggle") || drawerStyles.includes(".menu-toggle"),
  "Navigation : style du bouton hamburger absent");
for (const page of htmlPages) {
  const pageHtml = read(page);
  assert(pageHtml.includes('src="navigation-tiroirs.js"'),
    page + " : initialiseur de navigation commune et accès VIP absent");
}
// La barre peut être présente dans le HTML ou créée par le bootstrap commun.
// Ce contrat couvre aussi les pages internes qui possèdent leur propre navigation métier.
for (const asset of [
  "styles.css", "charte-majestios.css", "app.js", "navigation-majestios.css", "homepage.css", "homepage-theme.css", "catalogue-majestios.js", "rubriques-immersives.css",
  "rubriques-immersives.js", "category-results.js", "search-results.js",
  "opportunity-search.js", "rubric-search.js", "naf-suggestions.js",
  "company-targeting.js", "company-targeting-page.js", "company-fit.js"
]) assert(siteFiles.includes(asset), "Build : ressource requise absente du manifeste : " + asset);

const home = read("index.html");
assert(home.includes("<title>MajestiOS — Développement commercial intelligent</title>"), "Accueil : titre SEO de la vision CRM tout-en-un inattendu");
assert(!home.includes('aria-label="Immeuble interactif MajestiOS"') && !home.includes('id="floor-rows"'),
  "Accueil : l'ancien système de navigation par immeuble doit être retiré");
assert(home.includes('id="site-nav"') && home.includes('id="menu-toggle"'), "Accueil : navigation principale ou commande hamburger absente");
assert(home.includes('id="home-search-mount"'), "Accueil : emplacement du formulaire partagé absent");
assert(home.includes('src="rubric-search.js"'), "Accueil : composant partagé de recherche non chargé");
assert(home.includes("FLUX DE DÉMONSTRATION") && home.includes("Exemples fictifs de marchés publics et privés") && home.includes("Aucune annonce réelle n’est diffusée pour le moment"), "Accueil : avertissement des exemples fictifs absent");
assert(home.includes("<h1>Donner de la hauteur<br>à vos <span>ambitions...</span></h1>") && home.includes("MajestiOS, l’alliance de l’intelligence numérique et de la prospection intelligente."), "Accueil : composition éditoriale restaurée non préservée");
assert(home.includes('href="developpement-commercial.html"') && home.includes('href="reseaux-synergies.html"'),
  "Accueil : accès aux principales rubriques de navigation absent");
assert(!home.includes("IMMEUBLE INTERACTIF · 9 DESTINATIONS"), "Accueil : ancien titre de l'immeuble encore affiché");
assert(!/<script>\s*[\s\S]*?<\/script>/i.test(home), "Accueil : contrôleur inline résiduel encore présent");
assert(!navigationController.includes('const interactiveSvg = document.querySelector("#majestios-panorama")'), "Navigation : gestionnaire de l’ancien SVG interactif encore présent");
assert(!home.includes("<style"), "Accueil : les styles doivent être externalisés dans des feuilles dédiées");
assert(home.includes('id="home-search-mount"') && home.includes("Recherche d'opportunités"), "Accueil : promesse centrale de la vision CRM tout-en-un absente");
assert((read("homepage.css") + read("homepage-theme.css")).includes('url("Designer%20(2).png")'), "Accueil : le fond panoramique Designer doit être préservé");
const homepageCss = read("homepage.css") + read("homepage-theme.css");
assert(!/\\.(?:building|tower|floor|elevator|home-help|dialog-[\\w-]*|window)[\\w-]*|#floor-rows/i.test(homepageCss), "CSS accueil : styles obsolètes de l’ancien immeuble encore présents");

for (const asset of ["IMMEUBLE.jfif","immeuble-masque.png","Designer (2).png"]) {
  assert(exists(asset),"Visuel de l'accueil absent : "+asset);
  assert(siteFiles.includes(asset),"Build : visuel de l'accueil non publié : "+asset);
}
assert(!exists("Ambitios.webp") && !exists("Développement-.webp") && !exists("Majestios.immeuble.jpg"),
  "Un ancien visuel de l'accueil doit être retiré après vérification de ses références");

// Chaque URL locale utilisée par une feuille CSS doit réellement exister et être publiée.
// Cela évite les arrière-plans silencieusement cassés après le build.
for (const stylesheet of siteFiles.filter((file) => /\.css$/i.test(file))) {
  const css = read(stylesheet);
  // Les URL entre guillemets peuvent contenir des parenthèses (ex. « image (2).jfif »).
  // Les capturer jusqu'au guillemet fermant évite de tronquer le nom de fichier.
  for (const match of css.matchAll(/url\(\s*(?:"([^"]+)"|'([^']+)'|([^)"'\s][^)]*))\s*\)/gi)) {
    const value = (match[1] || match[2] || match[3] || "").trim();
    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) continue;
    let decoded;
    try { decoded = decodeURIComponent(value.split(/[?#]/,1)[0]); }
    catch { errors.push(stylesheet+" : URL CSS locale mal encodée : "+value); continue; }
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(stylesheet),decoded));
    assert(!target.startsWith("../") && exists(target),
      stylesheet+" : ressource CSS locale absente : "+value);
    if (exists(target)) assert(siteFiles.includes(target),
      stylesheet+" : ressource CSS non publiée dans site-files.json : "+value);
  }
}
assert(exists("reputation-virtuelle.html"),"Page Réputation virtuelle absente");
assert(siteFiles.includes("reputation-virtuelle.html"),"Build : page Réputation virtuelle non publiée");

const catalogue = read("catalogue-majestios.js");
assert(catalogue.includes("searchCategories") && catalogue.includes("searchDepartments") && catalogue.includes("marketTypes"),
  "Catalogue : filtres de recherche incomplets");
const categoryResults = read("category-results.js");
assert(categoryResults.includes('params.set("marche", "public")'),
  "Catégories publiques : la recherche et le retour doivent conserver le type de marché public");
const searchResults = read("search-results.js");
assert(searchResults.includes('department === "all"\n    ? "Tous les départements"'),
  "Résultats : le filtre département par défaut doit être libellé clairement");
for (const [page, category] of [
  ["categorie-services-numeriques.html", "services"],
  ["categorie-travaux-amenagement.html", "travaux"],
  ["categorie-conseil-etudes.html", "conseil"],
  ["categorie-batiment.html", "batiment"],
  ["categorie-renovation.html", "renovation"],
  ["categorie-electricite.html", "electricite"],
  ["categorie-plomberie-chauffage.html", "plomberie"],
  ["categorie-maintenance.html", "maintenance"]
]) {
  assert(read(page).includes(`href="index.html?marche=public&amp;categorie=${category}#recherche-avancee"`),
    "Catégories publiques : le retour doit restaurer le type et la catégorie sur " + page);
}
const rubricSearch = read("rubric-search.js");
const appSearch = read("app.js");
assert(rubricSearch.includes('form.dataset.progressive = "true"') && rubricSearch.includes('feed-criteria-toggle'),
  "Recherche rubriques : le filtrage progressif doit être activé hors accueil");
assert(read("prospection-active.html").includes('id="prospecting-criteria-toggle"') &&
  read("prospection-active.html").includes('prospecting-advanced-details" hidden'),
  "Prospection : les critères doivent être révélés progressivement par le même bouton");
assert(rubricSearch.includes('id="advanced-search-form"') && rubricSearch.includes('id="feed-search"') &&
  rubricSearch.includes('id="feed-market-type"') && rubricSearch.includes('id="feed-sector"') &&
  rubricSearch.includes('id="feed-department"') && rubricSearch.includes('id="search-source-note"'),
  "Recherche : le composant unique doit définir tous les champs communs pour l’accueil et les rubriques");
assert(appSearch.includes("MAJESTIOS_CATALOG") && appSearch.includes("populateSearchFilters"),
  "Recherche : les interactions ne consomment pas le catalogue partagé");
assert(appSearch.includes('#open-personal-space, #open-personal-space-shortcut'),
  "Espace privé : les deux boutons doivent ouvrir le même formulaire de préparation");

const memberPage = read("espace-membre.html");
const memberAuth = read("auth-espace-membre.js");
const supabaseConfig = read("supabase-config.js");
const workspaceFunction = read("supabase/functions/provision-client-workspace/index.ts");
assert(memberPage.includes('src="auth-espace-membre.js"') && memberPage.includes('data-supabase-auth'),
  "Espace membre : le formulaire doit utiliser le contrôleur Auth Supabase");
assert(memberPage.includes('name="email"') && memberPage.includes('autocomplete="one-time-code"') &&
  memberPage.includes("création de nouveaux espaces sera ouverte après activation du provisionnement"),
  "Espace membre : connexion OTP et suspension explicite de l'inscription attendues");
assert(memberAuth.includes("signInWithOtp(") && memberAuth.includes("verifyOtp(") &&
  memberAuth.includes("shouldCreateUser: false") && !memberAuth.includes("setMode") && !memberAuth.includes("signup"),
  "Espace membre : connexion OTP seule tant que le provisionnement n'est pas activé");
assert(!memberPage.includes('name="password"') && !memberPage.includes('name="passwordConfirm"') &&
  !memberAuth.includes("signInWithPassword(") && !memberAuth.includes("resetPasswordForEmail("),
  "Espace membre : aucun mot de passe ne doit être demandé dans le parcours OTP");
assert(!memberAuth.includes('provision-client-workspace') && memberPage.includes("création de nouveaux espaces"),
  "Espace membre : ne pas appeler un provisionnement absent de l'environnement actif");
assert(!/SUPABASE_SERVICE_ROLE_KEY|sb_secret_[A-Za-z0-9]+/i.test(supabaseConfig),
  "Sécurité Supabase : aucune clé service_role ne doit être publiée dans le navigateur");
const atomicProvisioning = read("supabase/migrations/20261106090000_atomic_client_workspace_provisioning.sql");
assert(workspaceFunction.includes('admin.auth.getUser(token)') &&
  workspaceFunction.includes('admin.rpc("provision_client_workspace"') &&
  workspaceFunction.includes('privacy_acknowledged'),
  "Backend : la fonction Edge doit vérifier la session et déléguer le provisionnement atomique au RPC sécurisé");
assert(atomicProvisioning.includes("insert into public.organization_members(organization_id, user_id, role)") &&
  atomicProvisioning.includes("'owner'") &&
  atomicProvisioning.includes("public.privacy_acknowledgments"),
  "Backend : le RPC atomique doit créer le propriétaire et journaliser la politique");
for (const migration of [
  "supabase/migrations/20261105163901_majestios_core_multitenant_foundation.sql",
  "supabase/migrations/20261105163922_harden_private_authorization_and_fk_indexes.sql",
  "supabase/migrations/20261105163953_enforce_tenant_relationship_integrity.sql",
  "supabase/migrations/20261105164403_add_private_consent_records.sql",
  "supabase/migrations/20261105164411_replace_consent_placeholder_with_privacy_acknowledgments.sql",
  "supabase/migrations/20261105164732_harden_privacy_acknowledgment_access.sql",
  "supabase/migrations/20261106090000_atomic_client_workspace_provisioning.sql"
]) {
  assert(exists(migration), "Backend : migration versionnée absente : " + migration);
}
assert(siteFiles.includes("supabase-config.js") && siteFiles.includes("auth-espace-membre.js"),
  "Build : les modules publics de configuration et Auth doivent être déclarés dans le manifeste");

for (const page of ["marches-publics.html","developpement-commercial.html","prospection-active.html","veille-marches.html",
  "accompagnement-appels-offres.html","sous-traitance.html","intelligence-economique.html","reseaux-synergies.html",
  "bodacc-veille-entreprises.html","suivi-commercial.html","marches-prives.html","reputation-virtuelle.html",
  "espace-membre.html","salons-seminaires.html","crm.html","majestios-v5.html",
  "categorie-services-numeriques.html","categorie-travaux-amenagement.html","categorie-conseil-etudes.html",
  "categorie-batiment.html","categorie-renovation.html","categorie-electricite.html",
  "categorie-plomberie-chauffage.html","categorie-maintenance.html","faq.html","nous-rejoindre.html",
  "vision-majestios.html","qualification-entreprises.html","resultats-recherche.html"]) {
  const html = read(page);
  if (page === "reputation-virtuelle.html") {
    assert(!html.includes('src="rubric-search.js"'),
      "Réputation virtuelle : le moteur de recherche partagé ne doit pas être chargé sur cette page");
  } else {
    assert(html.indexOf('src="catalogue-majestios.js"') >= 0 &&
      html.indexOf('src="catalogue-majestios.js"') < html.indexOf('src="rubric-search.js"') &&
      html.indexOf('src="rubric-search.js"') < html.indexOf('src="app.js"'),
      "Recherche : ordre de chargement du catalogue et du moteur commun incorrect sur " + page);
  }
  assert(/href="rubriques-immersives\.css"/.test(html),
    "Recherche : feuille de style commune absente sur " + page);
  assert(/href="charte-majestios\.css"/.test(html),
    "Charte : feuille de style commune absente sur " + page);
  const stylesheetLinks = [...html.matchAll(/<link[^>]+href="([^"]+\.css)"[^>]*>/g)].map(match => match[1]);
  assert(stylesheetLinks[stylesheetLinks.length - 1] === "charte-majestios.css",
    "Charte : charte-majestios.css doit être chargée en dernier sur " + page);
  assert(stylesheetLinks.indexOf("rubriques-immersives.css") < stylesheetLinks.indexOf("charte-majestios.css"),
    "Charte : les styles de rubrique doivent précéder la charte commune sur " + page);
}

// La charte est une source de tokens unique, consommée par les feuilles publiques et privées.
assert(siteFiles.includes("charte-majestios-tokens.css"),
  "Charte : les tokens centraux doivent être publiés dans le manifeste");
const sharedTokens = read("charte-majestios-tokens.css");
for (const token of ["--majestios-gold:", "--majestios-navy:", "--majestios-font-body:", "--majestios-radius-control:"]) {
  assert(sharedTokens.includes(token), "Charte : token central manquant : " + token);
}
assert(/@import url\(["']charte-majestios-tokens\.css["']\)/.test(read("charte-majestios.css")),
  "Charte : la feuille publique doit importer la source de tokens");
assert(/@import url\(["']charte-majestios-tokens\.css["']\)/.test(read("charte-majestios-espaces.css")),
  "Charte : la feuille des espaces privés doit importer la source de tokens");
assert(siteFiles.includes("charte-majestios-espaces.css"),
  "Charte : la couche des espaces privés doit être publiée dans le manifeste");
for (const page of ["crm.html","administration.html","admin-recherches.html","espace-interne.html"]) {
  const html = read(page);
  assert(/href="charte-majestios-espaces\.css"/.test(html),
    "Charte : couche privée absente sur " + page);
}

const prospecting = read("prospection-active.html");
assert(prospecting.includes("<title>Prospection — MajestiOS</title>"), "Prospection : titre incorrect");
assert(prospecting.includes("<h1>Prospection</h1>"), "Prospection : titre principal incorrect");
assert(!/prospection invers[ée]/i.test(prospecting), "Ancienne appellation de prospection encore visible");

if (errors.length) {
  console.error("Vérification de l’architecture échouée : " + errors.length + " problème(s).\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Architecture vérifiée : " + htmlPages.length + " pages HTML, navigation classique, trois visuels historiques conservés, fonds de rubrique sans ressources manquantes, moteur de recherche et " + siteFiles.length + " ressources. README.md présent, documentation Markdown limitée à docs/ et AGENTS.md.");
