"use strict";
const assert = require("node:assert/strict");
const engine = require("../naf-suggestions.js");

assert.equal(engine.normalizeText("Électricité et RÉNOVATION"), "electricite et renovation");
assert.equal(engine.rulesCount, 21);
assert.deepEqual(engine.suggestNafCodes(""), []);
const electrical = engine.suggestNafCodes("Travaux d’électricité et installation électrique");
assert.ok(electrical.some((item) => item.code === "43.21A"), "La règle électricité doit proposer 43.21A");
assert.ok(electrical.find((item) => item.code === "43.21A").matchCount >= 2, "Les correspondances lexicales doivent être explicables");
const mixed = engine.suggestNafCodes("Rénovation du chauffage et de la climatisation");
assert.ok(mixed.some((item) => item.code === "43.22B"), "Chauffage/climatisation doit proposer 43.22B");
const training = engine.suggestNafCodes("Formation professionnelle continue des adultes");
assert.ok(training.some((item) => item.code === "85.59A"), "Formation continue doit proposer 85.59A");
assert.ok(engine.suggestNafCodes("menuiserie plomberie informatique", { limit: 99 }).length <= 10, "Le nombre de suggestions doit rester plafonné");
console.log("Tests naf-suggestions : OK");
