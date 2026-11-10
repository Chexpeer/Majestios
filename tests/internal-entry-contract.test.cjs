const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "espace-interne.html"), "utf8");
const script = fs.readFileSync(path.join(root, "espace-interne.js"), "utf8");
const crm = fs.readFileSync(path.join(root, "crm.html"), "utf8");
const admin = fs.readFileSync(path.join(root, "administration.html"), "utf8");
const searches = fs.readFileSync(path.join(root, "admin-recherches.html"), "utf8");

assert.ok(html.includes('meta name="robots" content="noindex,nofollow"'), "L’accueil interne doit être exclu de l’indexation.");
assert.ok(html.includes('id="internal-login-form"') && html.includes('type="password"'), "La page doit proposer une authentification par identifiants existants.");
assert.ok(html.includes('id="internal-workspace"') && html.includes('id="internal-admin-card"') && html.includes('id="internal-search-card"'), "Le sas doit afficher les modules selon les habilitations.");
assert.ok(script.includes("signInWithPassword("), "L’authentification interne doit utiliser la connexion Supabase existante.");
assert.ok(!script.includes("signUp(") && !script.includes("provision-client-workspace"), "L’authentification interne ne doit pas créer de compte ni provisionner un espace client.");
assert.ok(script.includes('["owner", "admin", "member", "viewer"]'), "Les quatre rôles internes connus doivent être reconnus.");
assert.ok(script.includes('["owner", "admin"].includes(membership.role)'), "Administration et recherches doivent être réservées à owner/admin.");
assert.ok(script.includes('membership.role === "viewer"') && /consultation seule/i.test(script), "Le rôle viewer doit être présenté en consultation seule.");
assert.ok(script.includes("getUser()") && script.includes('item.kind === "internal"'), "L’identité et l’organisation interne doivent être vérifiées après connexion.");
assert.ok(script.includes("await supabase.auth.signOut()"), "Un compte sans appartenance interne ne doit pas conserver l’accès à la session interne.");
assert.ok(script.includes("allowedDestinations") && script.includes("destinationAllowed"), "Le retour après authentification doit être limité à des routes autorisées.");
assert.ok(crm.includes('href="espace-interne.html"'), "Le CRM doit revenir vers l’accueil interne.");
assert.ok(admin.includes('href="espace-interne.html?returnTo=administration.html"'), "L’administration doit utiliser le parcours de connexion interne.");
assert.ok(searches.includes('href="espace-interne.html?returnTo=admin-recherches.html"'), "Les recherches doivent utiliser le parcours de connexion interne.");

console.log("CONTRAT ACCÈS INTERNE RÉUSSI : authentification dédiée, contrôle organisation/rôle et destinations conditionnelles.");
