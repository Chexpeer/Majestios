const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const schema = JSON.parse(fs.readFileSync(path.join(root, "schemas/opportunite.schema.json"), "utf8"));
const source = fs.readFileSync(path.join(root, "opportunity-search.js"), "utf8");

assert.equal(schema.type, "object", "Le contrat de données doit être un objet JSON Schema.");
for (const field of ["id", "title", "category", "marketType", "source", "sourceUrl", "publishedAt", "status"]) {
  assert.ok(schema.required.includes(field), `Le contrat doit exiger le champ ${field}.`);
}
for (const category of [
  "services", "travaux", "conseil", "batiment", "renovation", "electricite", "plomberie", "maintenance",
  "bodacc-creations", "bodacc-cessions", "bodacc-modifications", "bodacc-procedures", "bodacc-radiations",
  "bodacc-autres-signaux", "public-non-classifie", "immobilier", "emploi", "sous-traitance-offres", "sous-traitance-recherche"
]) {
  assert.ok(schema.properties.category.enum.includes(category), `La catégorie ${category} doit être représentable dans le contrat CRM.`);
}
assert.ok(schema.properties.recordType.enum.includes("public_tender"), "Le contrat doit distinguer les appels d’offres publics.");
assert.ok(schema.properties.recordType.enum.includes("private_company_signal"), "Le contrat doit distinguer les signaux d’entreprise privés.");
for (const field of ["deduplicationKey", "firstSeenAt", "sourceConditionsRef", "qualification", "crmLink"]) {
  assert.ok(schema.properties[field], `Le contrat CRM doit prévoir ${field}.`);
}
assert.ok(schema.properties.provenance.properties.retrievedAt, "La provenance doit conserver la date de collecte.");
assert.ok(source.includes('new CustomEvent("majestios:search-results"'), "Le moteur doit émettre un événement de résultats normalisés pour préparer le raccordement CRM.");
assert.ok(source.includes('source: "BOAMP"') && source.includes('source: "BODACC"'), "Les deux sources actuellement connectées doivent alimenter le contrat commun.");

console.log("Contrat de données CRM vérifié : catégories publiques/privées, provenance, dédoublonnage, qualification et point d’intégration moteur.");
