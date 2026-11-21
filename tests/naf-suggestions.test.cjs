"use strict";
const assert = require("node:assert/strict");
const engine = require("../naf-suggestions.js");

assert.equal(engine.normalizeText("Électricité et RÉNOVATION"), "electricite et renovation");
assert.equal(engine.rulesCount, 22);
assert.deepEqual(engine.suggestNafCodes(""), []);
const electrical = engine.suggestNafCodes("Travaux d’électricité et installation électrique");
assert.ok(electrical.some((item) => item.code === "43.21A"), "La règle électricité doit proposer 43.21A");
assert.ok(electrical.find((item) => item.code === "43.21A").matchCount >= 2, "Les correspondances lexicales doivent être explicables");
const mixed = engine.suggestNafCodes("Rénovation du chauffage et de la climatisation");
assert.ok(mixed.some((item) => item.code === "43.22B"), "Chauffage/climatisation doit proposer 43.22B");
const renovation = engine.suggestNafCodes("Rénovation énergétique d’un bâtiment public");
assert.ok(renovation.some((item) => item.code === "43.29A"), "Rénovation énergétique doit ouvrir une piste isolation à vérifier");
assert.ok(renovation.some((item) => item.code === "43.22B"), "Rénovation énergétique doit ouvrir une piste chauffage à vérifier");
const training = engine.suggestNafCodes("Formation professionnelle continue des adultes");
assert.ok(training.some((item) => item.code === "85.59A"), "Formation continue doit proposer 85.59A");
const tenderBrief = engine.suggestNafCodes({
  title: "Réhabilitation d’un bâtiment public",
  description: "Le lot technique comprend la rénovation des installations électriques, le remplacement des luminaires et la mise en conformité des réseaux électriques."
});
assert.ok(tenderBrief.some((item) => item.code === "43.21A"), "L’analyse doit exploiter le descriptif du lot, pas seulement son intitulé.");
assert.ok(tenderBrief.find((item) => item.code === "43.21A").matches.includes("installations electriques"), "Les installations électriques au pluriel doivent être reconnues.");
assert.ok(tenderBrief.find((item) => item.code === "43.21A").matches.includes("reseaux electriques"), "Les réseaux électriques au pluriel doivent être reconnus.");
assert.ok(tenderBrief.find((item) => item.code === "43.21A").matchCount >= 3, "Les indices électriques du descriptif doivent être cumulés et explicables.");
assert.ok(tenderBrief.find((item) => item.code === "43.21A").matchCount >= 2, "Les indices du descriptif doivent rester explicables.");
assert.equal(tenderBrief.find((item) => item.code === "43.21A").evidenceType, "lexical_only", "La suggestion doit être explicitement qualifiée d’indice lexical.");
assert.deepEqual(engine.suggestNafCodes({ title: "", description: "", lot: "", requirements: "" }), []);
assert.ok(engine.suggestNafCodes("menuiserie plomberie informatique", { limit: 99 }).length <= 10, "Le nombre de suggestions doit rester plafonné");
console.log("Tests naf-suggestions : OK");
