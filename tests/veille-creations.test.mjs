import test from "node:test";
import assert from "node:assert/strict";
import { ZONES, SECTORS, sectorClause, familyClause, parseCreation, quoteValue } from "../veille-creations.mjs";

test("les quatre régions couvrent les départements attendus", () => {
  assert.equal(ZONES.idf.length, 8);
  assert.deepEqual(ZONES.normandie, ["14", "27", "50", "61", "76"]);
  assert.deepEqual(ZONES.pdl, ["44", "49", "53", "72", "85"]);
  assert.deepEqual(ZONES.bretagne, ["22", "29", "35", "56"]);
  const all = Object.values(ZONES).flat();
  assert.equal(new Set(all).size, all.length, "aucun département en double");
});

test("les deux secteurs prioritaires sont définis avec des mots-clés", () => {
  assert.ok(SECTORS.batiment.keywords.includes("plomberie"));
  assert.ok(SECTORS.hotellerie.keywords.includes("restaurant"));
});

test("la clause de secteur cible le texte de l'activité et échappe les apostrophes", () => {
  const clause = sectorClause("hotellerie");
  assert.match(clause, /^\(search\(listeetablissements, 'restaurant'\)/);
  assert.ok(clause.includes("chambre d\\'hôtes"));
  assert.equal(sectorClause("inconnu"), "");
  assert.equal(quoteValue("l'a"), "'l\\'a'");
});

test("la famille de veille regroupe créations et immatriculations", () => {
  assert.equal(familyClause("__creations"), "familleavis_lib IN ('Créations','Immatriculations')");
  assert.equal(familyClause("Radiations"), "familleavis_lib = 'Radiations'");
  assert.equal(familyClause(""), "");
});

test("une personne physique est signalée et son adresse n'est pas reprise", () => {
  const parsed = parseCreation({
    ville: "Varennes-sur-Allier",
    listepersonnes: JSON.stringify({ personne: { typePersonne: "pp", nom: "X" } }),
    listeetablissements: JSON.stringify({ etablissement: { activite: "vente de parfums par internet.", adresse: { nomVoie: "du 4 Septembre" } } }),
    acte: JSON.stringify({ dateImmatriculation: "2026-11-02", dateCommencementActivite: "2026-09-01" })
  });
  assert.equal(parsed.isIndividual, true);
  assert.equal(parsed.kindLabel, "Entrepreneur individuel");
  assert.equal(parsed.activity, "vente de parfums par internet.");
  assert.equal(parsed.registrationDate, "2026-11-02");
  assert.equal(parsed.startDate, "2026-09-01");
  assert.equal(JSON.stringify(parsed).includes("Septembre"), false, "aucune adresse");
  assert.equal(JSON.stringify(parsed).includes("\"X\""), false, "aucun nom de personne");
});

test("une annonce incomplète ou invalide ne provoque pas d'erreur", () => {
  assert.equal(parseCreation({}).activity, "");
  assert.equal(parseCreation({ listeetablissements: "{pas du json" }).activity, "");
  assert.equal(parseCreation({ listepersonnes: JSON.stringify({ personne: { typePersonne: "pm" } }) }).kindLabel, "Société");
});
