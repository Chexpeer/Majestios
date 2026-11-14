const assert = require("node:assert/strict");
const fs = require("node:fs");
const src = fs.readFileSync(require("node:path").join(__dirname, "..", "supabase", "functions", "bootstrap-internal-admin", "index.ts"), "utf8");
assert.match(src, /Deno\.env\.get\("INTERNAL_ADMIN_EMAIL"\)/, "L'adresse administrateur doit pouvoir venir d'un secret.");
assert.match(src, /Deno\.env\.get\("INTERNAL_ALLOWED_ORIGINS"\)/, "Les origines autorisées doivent venir d'un secret.");
assert.match(src, /LEGACY_ADMIN_EMAIL/, "Le repli historique doit être explicite pour éviter tout verrouillage.");
assert.doesNotMatch(src, /const corsHeaders = \{\s*"Access-Control-Allow-Origin": "\*"/, "Le CORS ne doit plus être figé sur *.");
assert.match(src, /const corsHeaders = corsFor\(req\)/, "Les en-têtes CORS doivent être calculés par requête.");
console.log("Contrat bootstrap admin (AN-05) : secrets et CORS par origine préparés ; repli historique conservé ; non déployé.");
