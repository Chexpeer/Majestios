import test from "node:test";
import assert from "node:assert/strict";
import { COMPLEMENTAIRES, METIERS, normalizeNaf, complementaryTrades, buildPitch } from "../pitch-sous-traitance.mjs";

test("code NAF : normalisation et rejet des valeurs invalides", () => {
  assert.equal(normalizeNaf("4322b"), "43.22B");
  assert.equal(normalizeNaf(" 43.22B "), "43.22B");
  assert.equal(normalizeNaf("abc"), null);
  assert.equal(normalizeNaf(null), null);
});
test("métiers complémentaires d'un installateur de climatisation", () => {
  assert.deepEqual(complementaryTrades("43.22B").map((t) => t.naf), ["43.21A", "43.22A", "43.29A"]);
  assert.equal(complementaryTrades("43.22B")[0].label, "installation électrique");
  assert.deepEqual(complementaryTrades("62.01Z"), [], "métier non décrit : aucune invention");
});
test("chaque métier cité dans la table existe et ne se cite pas lui-même", () => {
  for (const [naf, list] of Object.entries(COMPLEMENTAIRES)) {
    assert.ok(METIERS[naf], naf + " doit avoir un libellé");
    assert.ok(!list.includes(naf));
    for (const c of list) assert.ok(METIERS[c], c + " doit avoir un libellé");
  }
});
test("pitch : texte complet, sans envoi ni coordonnée, vide si une donnée essentielle manque", () => {
  const p = buildPitch({ winner: "Clim Normandie", object: "Remplacement de la climatisation du collège", buyer: "Département du Calvados", commune: "Caen", dept: "14", amount: 182500, trade: "installation électrique" });
  assert.match(p, /Clim Normandie vient de remporter le marché « Remplacement de la climatisation du collège » auprès de Département du Calvados \(Caen, dép\. 14\)/);
  assert.match(p, /182[\s ]500 €/);
  assert.match(p, /en installation électrique/);
  assert.doesNotMatch(p, /@|https?:/);
  assert.equal(buildPitch({ winner: "X", object: "", trade: "plomberie" }), null);
});
