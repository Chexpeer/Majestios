import test from "node:test";
import assert from "node:assert/strict";
import { validateAdminPublication, adminPublicationError } from "../annonces-admin-publication.mjs";

const base = { kind: "job_offer", title: "Recherche maçon qualifié", description: "Entreprise du bâtiment recherche un maçon qualifié en CDI.", trade: "Maçonnerie", department: "72" };
const today = new Date("2026-11-18T10:00:00Z");

test("annonce valide : champs facultatifs absents", () => {
  const r = validateAdminPublication(base, { today });
  assert.equal(r.ok, true);
  assert.equal(r.payload.p_company, null);
  assert.equal(r.payload.p_source_url, null);
});
test("entreprise et lien d'origine transmis", () => {
  const r = validateAdminPublication({ ...base, company: "Dupont SA", source_url: "https://exemple.fr/offre/1" }, { today });
  assert.equal(r.payload.p_company, "Dupont SA");
  assert.equal(r.payload.p_source_url, "https://exemple.fr/offre/1");
});
test("refus : type, titre court, département inconnu, date passée", () => {
  const r = validateAdminPublication({ ...base, kind: "x", title: "court", department: "99", valid_until: "2026-01-01" }, { today });
  assert.deepEqual(Object.keys(r.errors).sort(), ["department", "kind", "title", "valid_until"]);
});
test("messages d'erreur serveur", () => {
  assert.match(adminPublicationError({ message: "forbidden" }), /propriétaire/);
  assert.match(adminPublicationError({ message: "invalid_text" }), /champ/);
});
