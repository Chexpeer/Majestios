// Garantie « rien ne se perd » : le rangement des sources en dossiers ne doit changer aucune adresse publiée.
// La liste de référence (146 adresses au 21/11/2026, avant migration) doit rester entièrement publiée ; des ajouts restent permis.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { publishedPath, listPages } = require("../chemins-site.cjs");

const root = path.resolve(__dirname, "..");
const reference = fs.readFileSync(path.join(root, "docs/evolution-11/ADRESSES-PUBLIEES-REFERENCE-2026-11-21.txt"), "utf8").split("\n").filter(Boolean);
const manifest = JSON.parse(fs.readFileSync(path.join(root, "site-files.json"), "utf8")).files;
const published = manifest.map(publishedPath);

const missing = reference.filter((address) => !published.includes(address));
assert.deepEqual(missing, [], "Adresses publiées avant la migration et disparues :\n- " + missing.join("\n- "));
assert.equal(new Set(published).size, published.length, "Deux sources publiées à la même adresse.");

// Toute page rangée en dossier est bien déclarée au manifeste, et chaque source déclarée existe.
for (const { name, source } of listPages(root)) assert.ok(manifest.includes(source), "Page non déclarée au manifeste : " + source);
for (const file of manifest) assert.ok(fs.existsSync(path.join(root, file)), "Source absente : " + file);
// Les pages rangées en dossier ne publient jamais un dossier dans l'adresse (adresses à plat conservées).
for (const file of manifest.filter((f) => f.startsWith("pages/"))) assert.ok(!publishedPath(file).includes("/"), "Adresse non plate : " + file);
console.log("Adresses publiées : " + reference.length + " adresses de référence conservées, aucune perdue, aucune en double.");
