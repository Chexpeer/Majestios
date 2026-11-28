import test from "node:test";
import assert from "node:assert/strict";
import { noteAppelOffres, classerAppels, piecesAPreparer, resoudreMetier, joursRestants, departementAvis } from "../chances-ao-core.mjs";

const NOW = new Date("2026-11-28T10:00:00Z");
const ent = { naf: "43.22A", departement: "81", mots: undefined };
const jour = (n) => new Date(NOW.getTime() + n * 86400000).toISOString();

test("avis dans le département, métier cité, 30 jours : note maximale", () => {
  const s = noteAppelOffres({ objet: "Travaux de plomberie école", code_departement_prestation: "81", datelimitereponse: jour(30) }, ent, NOW);
  assert.equal(s.note, 20);
  assert.deepEqual(s.criteres.map((c) => c.cle), ["metier", "proximite", "delai"]);
});

test("avis hors région, métier non cité, délai très court : note basse", () => {
  const s = noteAppelOffres({ objet: "Fourniture de papier", code_departement: "59", datelimitereponse: jour(2) }, ent, NOW);
  assert.ok(s.note < 8, String(s.note));
});

test("date limite absente : critère non évalué, exclu du calcul", () => {
  const s = noteAppelOffres({ objet: "Plomberie", code_departement_prestation: "81" }, ent, NOW);
  assert.equal(s.criteres.find((c) => c.cle === "delai").etat, "non évalué");
  assert.equal(s.note, 20);
});

test("région : un département voisin vaut 3/5", () => {
  const s = noteAppelOffres({ objet: "Plomberie", code_departement_prestation: "31", datelimitereponse: jour(30) }, ent, NOW);
  assert.equal(s.criteres.find((c) => c.cle === "proximite").points, 3);
});

test("classement : expirés écartés, doublons retirés, meilleure note d'abord", () => {
  const r = classerAppels([
    { idweb: "a", objet: "Plomberie", code_departement: "81", datelimitereponse: jour(30) },
    { idweb: "a", objet: "Plomberie", code_departement: "81", datelimitereponse: jour(30) },
    { idweb: "b", objet: "Papier", code_departement: "59", datelimitereponse: jour(30) },
    { idweb: "c", objet: "Plomberie", code_departement: "81", datelimitereponse: jour(-3) }
  ], ent, NOW);
  assert.deepEqual(r.map((x) => x.avis.idweb), ["a", "b"]);
});

test("pièces : travaux ajoute assurances et qualifications, services non", () => {
  const travaux = piecesAPreparer({ type_marche: "TRAVAUX" }).map((p) => p.id);
  const services = piecesAPreparer({ type_marche: "SERVICES" }).map((p) => p.id);
  assert.ok(travaux.includes("assurances") && travaux.includes("qualifications"));
  assert.ok(!services.includes("assurances"));
  assert.ok(services.includes("memoire") && services.includes("candidature"));
});

test("métier saisi : mot connu, code NAF, code inconnu, mots libres", () => {
  assert.equal(resoudreMetier("plomberie").naf, "43.22A");
  assert.equal(resoudreMetier("4322a").naf, "43.22A");
  assert.match(resoudreMetier("99.99Z").erreur, /pas encore reconnu/);
  const libre = resoudreMetier("charpente et désamiantage");
  assert.equal(libre.naf, null);
  assert.deepEqual(libre.mots, ["charpente", "désamiantage"]);
  assert.match(resoudreMetier("ab").erreur, /3 lettres/);
});

test("jours restants et département de l'avis", () => {
  assert.equal(joursRestants({ datelimitereponse: jour(5) }, NOW), 5);
  assert.equal(joursRestants({}, NOW), null);
  assert.equal(departementAvis({ code_departement_prestation: '["69","01"]' }), "69");
});
