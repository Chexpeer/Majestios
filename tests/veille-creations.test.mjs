import test from "node:test";
import assert from "node:assert/strict";
import { ZONES, SECTORS, sectorClause, familyClause, parseCreation, describeCreation, quoteValue, detectSector, scoreCreation } from "../veille-creations.mjs";

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

test("une personne physique : nom, prénom, adresse, activité et dates sont repris", () => {
  const parsed = parseCreation({
    ville: "Varennes-sur-Allier",
    registre: ["132317595", "132 317 595"],
    tribunal: "Greffe du Tribunal de Commerce de Cusset",
    listepersonnes: JSON.stringify({ personne: { typePersonne: "pp", nom: "DUPONT", prenom: "Jean, Paul" } }),
    listeetablissements: JSON.stringify({ etablissement: { enseigne: "Chez Jean", activite: "vente de parfums par internet.", adresse: { numeroVoie: "16", typeVoie: "Rue", nomVoie: "du 4 Septembre", codePostal: "03150", ville: "Varennes-sur-Allier" } } }),
    acte: JSON.stringify({ dateImmatriculation: "2026-11-02", dateCommencementActivite: "2026-09-01" })
  });
  assert.equal(parsed.isIndividual, true);
  assert.equal(parsed.kindLabel, "Entrepreneur individuel");
  assert.equal(parsed.lastName, "DUPONT");
  assert.equal(parsed.firstName, "Jean, Paul");
  assert.equal(parsed.siren, "132317595");
  assert.equal(parsed.address, "16 Rue du 4 Septembre, 03150 Varennes-sur-Allier");
  assert.equal(parsed.tradeName, "Chez Jean");
  assert.equal(parsed.activity, "vente de parfums par internet.");
  assert.equal(parsed.registrationDate, "2026-11-02");
  const text = describeCreation(parsed);
  for (const piece of ["Prénom : Jean, Paul", "Nom : DUPONT", "SIREN : 132317595", "Adresse : 16 Rue du 4 Septembre", "Activité : vente de parfums", "Cusset"]) {
    assert.ok(text.includes(piece), piece);
  }
});

test("une société : raison sociale, forme juridique et adresse du siège sont repris", () => {
  const parsed = parseCreation({
    commercant: "BATI OUEST",
    registre: ["912345678"],
    listepersonnes: JSON.stringify({ personne: { typePersonne: "pm", denomination: "BATI OUEST", formeJuridique: "Société par actions simplifiée", adresseSiegeSocial: { numeroVoie: "2", typeVoie: "Avenue", nomVoie: "de la Gare", codePostal: "35000", ville: "Rennes" } } }),
    listeetablissements: JSON.stringify({ etablissement: { activite: "travaux de maçonnerie" } })
  });
  assert.equal(parsed.kindLabel, "Société");
  assert.equal(parsed.companyName, "BATI OUEST");
  assert.equal(parsed.legalForm, "Société par actions simplifiée");
  assert.equal(parsed.address, "2 Avenue de la Gare, 35000 Rennes");
  assert.ok(describeCreation(parsed).includes("Raison sociale : BATI OUEST"));
});

test("une annonce incomplète ou invalide ne provoque pas d'erreur", () => {
  assert.equal(parseCreation({}).activity, "");
  assert.equal(parseCreation({ listeetablissements: "{pas du json" }).activity, "");
  assert.equal(parseCreation({ listepersonnes: JSON.stringify({ personne: { typePersonne: "pm" } }) }).kindLabel, "Société");
});

test("le secteur est détecté sur mots entiers, accents ignorés", () => {
  assert.equal(detectSector("travaux de maçonnerie générale"), "batiment");
  assert.equal(detectSector("Restaurant traditionnel"), "hotellerie");
  assert.equal(detectSector("exploitation d'un bar et d'une brasserie"), "hotellerie");
  assert.equal(detectSector("barbier coiffeur"), "", "« bar » ne doit pas correspondre à « barbier »");
  assert.equal(detectSector("vente de parfums"), "");
  assert.equal(detectSector(""), "");
});

test("la note de priorité est expliquée et classe bien les cas", () => {
  const now = new Date("2026-11-14T12:00:00Z");
  const forte = scoreCreation({
    isIndividual: false, activity: "travaux de plomberie et chauffage chez les particuliers",
    registrationDate: "2026-11-05", address: "2 Avenue de la Gare, 35000 Rennes"
  }, { now });
  assert.equal(forte.label, "Prioritaire");
  assert.ok(forte.score >= 70 && forte.score <= 100);
  assert.ok(forte.reasons.some((r) => r.startsWith("Secteur bâtiment")));
  assert.ok(forte.reasons.some((r) => r.startsWith("Société")));

  const faible = scoreCreation({ isIndividual: true, activity: "", registrationDate: "2026-05-01", address: "" }, { now });
  assert.equal(faible.label, "Faible");
  assert.ok(faible.score < 45);
  assert.ok(forte.score > faible.score);
  assert.ok(scoreCreation({ isIndividual: false, activity: "x".repeat(30), registrationDate: "date invalide", address: "" }, { now }).score <= 100);
});
