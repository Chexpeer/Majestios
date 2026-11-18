import test from "node:test";
import assert from "node:assert/strict";
import { elementsDuBandeau, pageAvecBandeau, MAX_ITEMS } from "../bandeau-annonces.mjs";

const ligne = (n, extra = {}) => ({ reference: "AN-" + String(n).padStart(8, "0"), kind: "job_offer", title: "Titre " + n, description: "d".repeat(40), trade: "Plâtrerie", department: "35", area_note: "", valid_until: null, published_at: "2026-11-18T10:00:00Z", ...extra });

test("les annonces publiées deviennent des éléments de bandeau sans coordonnées", () => {
  const e = elementsDuBandeau([ligne(1)]);
  assert.equal(e.length, 1);
  assert.deepEqual(Object.keys(e[0]).sort(), ["lieu", "reference", "titre", "type"]);
  assert.equal(e[0].type, "Offre d’emploi");
  assert.equal(e[0].lieu, "Dép. 35");
});

test("nombre limité, titres longs coupés, lignes invalides ignorées", () => {
  const rows = Array.from({ length: 15 }, (_, i) => ligne(i + 1));
  assert.equal(elementsDuBandeau(rows).length, MAX_ITEMS);
  assert.ok(elementsDuBandeau([ligne(1, { title: "x".repeat(120) })])[0].titre.length <= 80);
  assert.deepEqual(elementsDuBandeau([{ reference: "pirate", title: "x" }, null, "texte"]), []);
  assert.deepEqual(elementsDuBandeau(null), []);
});

test("le bandeau ne s'affiche pas dans les outils de l'équipe", () => {
  for (const p of ["/administration.html", "/crm.html", "/espace-interne.html", "/admin-annonces.html", "/accepter-invitation.html"]) assert.equal(pageAvecBandeau(p), false, p);
  for (const p of ["/index.html", "/marches-prives.html", "/espace-membre.html", "/"]) assert.equal(pageAvecBandeau(p), true, p);
});
