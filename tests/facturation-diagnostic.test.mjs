import test from "node:test";
import assert from "node:assert/strict";
import { OPTIONS, diagnose, DISCLAIMER } from "../facturation-diagnostic.mjs";

const base = { tva: "assujetti", taille: "pme", clients: "entreprises", outil: "bureautique" };
const text = (result) => result.lines.map(([label, body]) => label + " " + body).join("\n");

test("des réponses manquantes ou inconnues ne produisent aucune orientation", () => {
  assert.equal(diagnose({}).ok, false);
  assert.equal(diagnose({ ...base, taille: "" }).ok, false);
  assert.equal(diagnose({ ...base, outil: "inconnu-xyz" }).ok, false);
});

test("réception depuis septembre 2026 pour tous, émission 2027 pour micro et PME", () => {
  for (const taille of ["micro", "pme"]) {
    const out = text(diagnose({ ...base, taille }));
    assert.match(out, /Réception Applicable depuis le 1er septembre 2026/);
    assert.match(out, /Émission À partir du 1er septembre 2027/);
  }
});

test("les ETI et grandes entreprises émettent déjà depuis septembre 2026", () => {
  for (const taille of ["eti", "ge"]) {
    assert.match(text(diagnose({ ...base, taille })), /Émission Déjà applicable depuis le 1er septembre 2026/);
  }
});

test("hors champ ou TVA inconnue : pas de dates affirmées, renvoi à la vérification", () => {
  for (const tva of ["non", "inconnu"]) {
    const out = text(diagnose({ ...base, tva }));
    assert.doesNotMatch(out, /Applicable depuis|À partir du 1er septembre 2027/);
    assert.match(out, /À déterminer/);
  }
});

test("clients particuliers et étranger relèvent de l'e-reporting, formulé avec prudence", () => {
  assert.match(text(diagnose({ ...base, clients: "particuliers" })), /e-reporting.*à vérifier/);
  assert.match(text(diagnose({ ...base, clients: "etranger" })), /e-reporting.*à vérifier/);
  const mixte = text(diagnose({ ...base, clients: "mixte" }));
  assert.match(mixte, /Clients entreprises/);
  assert.match(mixte, /Clients particuliers/);
});

test("un PDF ou un tableur ne suffit pas ; un logiciel seul ne garantit pas la conformité", () => {
  assert.match(text(diagnose({ ...base, outil: "aucun" })), /ne suffit pas/);
  assert.match(text(diagnose({ ...base, outil: "logiciel" })), /ne garantit pas la conformité/);
});

test("MajestiOS n'est jamais présenté comme une plateforme agréée ni comme un service disponible", () => {
  const result = diagnose(base);
  assert.equal(result.disclaimer, DISCLAIMER);
  assert.match(DISCLAIMER, /n'est pas une plateforme agréée/);
  assert.match(DISCLAIMER, /pas encore disponible/);
  assert.equal(result.nextSteps.length, 3);
});

test("toutes les combinaisons de réponses produisent une orientation sans erreur", () => {
  let count = 0;
  for (const [tva] of OPTIONS.tva) for (const [taille] of OPTIONS.taille) for (const [clients] of OPTIONS.clients) for (const [outil] of OPTIONS.outil) {
    const result = diagnose({ tva, taille, clients, outil });
    assert.equal(result.ok, true);
    assert.ok(result.lines.length >= 2);
    count += 1;
  }
  assert.equal(count, 4 * 4 * 4 * 4);
});
