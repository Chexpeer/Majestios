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

const siteFiles = manifest && manifest.version === 1 ? manifest.files : null;
if (!Array.isArray(siteFiles) || siteFiles.length === 0 || siteFiles.some((file) => typeof file !== "string" || !file.trim())) {
  fail('Build interrompu : le manifeste doit contenir un tableau "files" non vide de chemins valides.');
}

const normalizedFiles = siteFiles.map((file) => file.replace(/\\/g, "/"));
const duplicateFiles = normalizedFiles.filter((file, index) => normalizedFiles.indexOf(file) !== index);
if (duplicateFiles.length) fail("Build interrompu : fichiers déclarés plusieurs fois :\n- " + [...new Set(duplicateFiles)].join("\n- "));

const invalidPaths = normalizedFiles.filter((file) => {
  const resolved = path.resolve(root, file);
  return path.posix.isAbsolute(file) || file.split("/").includes("..") || (resolved !== root && !resolved.startsWith(root + path.sep));
});
if (invalidPaths.length) fail("Build interrompu : chemins interdits dans le manifeste :\n- " + invalidPaths.join("\n- "));

const documentationFiles = normalizedFiles.filter((file) => /\.mdx?$/i.test(file));
if (documentationFiles.length) fail("Build interrompu : la documentation ne doit pas être publiée :\n- " + documentationFiles.join("\n- "));

const missingFiles = normalizedFiles.filter((file) => {
  const sourcePath = path.join(root, file);
  return !fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile();
});
if (missingFiles.length) fail("Build interrompu : sources absentes ou non-fichiers :\n- " + missingFiles.join("\n- "));

// Le dossier publié n'est remplacé qu'après validation complète du manifeste et des sources.
fs.rmSync(outputDirectory, { recursive: true, force: true });
fs.mkdirSync(outputDirectory, { recursive: true });

for (const file of normalizedFiles) {
  const sourcePath = path.join(root, file);
  const destinationPath = path.join(outputDirectory, file);
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
}

const invalidOutputFiles = normalizedFiles.filter((file) => {
  const sourcePath = path.join(root, file);
  const outputPath = path.join(outputDirectory, file);
  return !fs.existsSync(outputPath) ||
    !fs.statSync(outputPath).isFile() ||
    !fs.readFileSync(sourcePath).equals(fs.readFileSync(outputPath));
});
if (invalidOutputFiles.length) fail("Build échoué : fichiers absents ou altérés dans dist/ :\n- " + invalidOutputFiles.join("\n- "));

console.log("Build vérifié : " + normalizedFiles.length + " fichiers copiés depuis site-files.json sans différence avec les sources.");
