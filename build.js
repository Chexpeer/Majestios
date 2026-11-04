const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const outputDirectory = path.join(root, "dist");
const manifestPath = path.join(root, "site-files.json");

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(manifestPath)) fail("Build interrompu : site-files.json est absent.");

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (error) {
  fail("Build interrompu : site-files.json est invalide : " + error.message);
}

const siteFiles = manifest?.files;
if (!Array.isArray(siteFiles) || siteFiles.length === 0 || siteFiles.some((file) => typeof file !== "string" || !file.trim())) {
  fail("Build interrompu : le champ \"files\" de site-files.json doit contenir des chemins non vides.");
}

const normalizedFiles = siteFiles.map((file) => file.replace(/\\\\/g, "/"));
const duplicateFiles = normalizedFiles.filter((file, index) => normalizedFiles.indexOf(file) !== index);
if (duplicateFiles.length) {
  fail("Build interrompu : fichier(s) déclaré(s) plusieurs fois :\\n- " + [...new Set(duplicateFiles)].join("\\n- "));
}

const invalidPaths = normalizedFiles.filter((file) => path.posix.isAbsolute(file) || file.split("/").includes(".."));
if (invalidPaths.length) {
  fail("Build interrompu : chemin(s) interdit(s) dans le manifeste :\\n- " + invalidPaths.join("\\n- "));
}

const documentationFiles = normalizedFiles.filter((file) => /\\.mdx?$/i.test(file));
if (documentationFiles.length) {
  fail("Build interrompu : la documentation ne doit pas être publiée dans dist/ :\\n- " + documentationFiles.join("\\n- "));
}

const missingFiles = normalizedFiles.filter((file) => !fs.existsSync(path.join(root, file)) || !fs.statSync(path.join(root, file)).isFile());
if (missingFiles.length) {
  fail("Build interrompu : " + missingFiles.length + " fichier(s) source(s) absent(s) :\\n- " + missingFiles.join("\\n- "));
}

// Ne remplacer dist/ qu’après validation complète du manifeste et de toutes les sources.
fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of normalizedFiles) {
  const destination = path.join(outputDirectory, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}

// Vérification post-copie : chaque sortie doit être identique à sa source.
const invalidOutputFiles = normalizedFiles.filter((file) => {
  const sourcePath = path.join(root, file);
  const outputPath = path.join(outputDirectory, file);
  return !fs.existsSync(outputPath) ||
    !fs.statSync(outputPath).isFile() ||
    !fs.readFileSync(sourcePath).equals(fs.readFileSync(outputPath));
});

if (invalidOutputFiles.length) {
  fail("Build échoué : " + invalidOutputFiles.length + " fichier(s) absent(s) ou altéré(s) dans dist/ :\\n- " + invalidOutputFiles.join("\\n- "));
}

console.log("Build vérifié : " + normalizedFiles.length + " fichiers copiés dans dist/ sans différence avec les sources.");
