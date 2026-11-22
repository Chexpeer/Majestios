import test from "node:test";
import assert from "node:assert/strict";
import { analyseAvis, buildProspectSearches, departmentsInText, resolveLocation, findMetiers, MISSION_TYPE_ANALYSE_MARCHE } from "../supabase/functions/_shared/mission-analyse-marche-core.mjs";

// Structure reprise de l'avis réel BOAMP 26-111564 (plomberie, base de défense de Cherbourg), texte raccourci.
const eforms = (project, lots) => JSON.stringify({ EFORMS: { ContractNotice: { "cac:ProcurementProject": project, ...(lots ? { "cac:ProcurementProjectLot": lots } : {}) } } });
const cherbourg = {
  idweb: "26-111564", type_marche: ["TRAVAUX"], nomacheteur: "SID Nord-Ouest",
  objet: "BASE DE DEFENSE DE CHERBOURG (départements 50 et 14) - Accord cadre à bons de commande pour des travaux de plomberie-sanitaire",
  donnees: eforms({
    "cbc:Name": { "#text": "BASE DE DEFENSE DE CHERBOURG - Départements de la Manche (50) et du calvados (14) - travaux de plomberie-sanitaire" },
    "cbc:Description": { "#text": "Réparation de canalisations ; Pose d'appareillages sanitaires ; production d'eau chaude sanitaire (ECS) ; SOS dépannage." },
    "cac:MainCommodityClassification": { "cbc:ItemClassificationCode": { "#text": "45330000" } },
    "cac:RealizedLocation": { "cbc:Description": { "#text": "Les départements de la Manche et du Calvados sont concernés" }, "cac:Address": { "cbc:CityName": "Cherbourg-en-Cotentin", "cbc:PostalZone": "50100", "cbc:CountrySubentityCode": { "#text": "FRD12" } } }
  }, { "cbc:ID": { "#text": "LOT-0001" } })
};

test("type de mission déclaré", () => assert.equal(MISSION_TYPE_ANALYSE_MARCHE, "analyse_marche"));

test("avis réel Cherbourg : lieu = Manche (adresse d'exécution), NAF plomberie proposé avec extrait", () => {
  const a = analyseAvis(cherbourg);
  assert.equal(a.cpv, "45330000");
  assert.deepEqual(a.departements, ["50", "14"]);
  assert.deepEqual(a.regions, ["Normandie"]);
  const p = a.propositions.find((x) => x.naf === "43.22A");
  assert.ok(p); assert.equal(p.niveau, "forte"); assert.match(p.extrait, /plomberie/i);
  assert.ok(a.propositions.every((x) => x.extrait && x.mot_trouve));
  assert.equal(a.statut, "à valider par l'administrateur");
});

test("l'adresse de l'acheteur n'est jamais le lieu d'exécution", () => {
  const a = analyseAvis({ idweb: "x", objet: "Travaux de peinture", donnees: JSON.stringify({ EFORMS: { ContractNotice: { "cac:ProcurementProject": { "cbc:Name": "Travaux de peinture" }, "ext:UBLExtensions": { acheteur: "RENNES 35000 FRH03" } } } }) });
  assert.equal(a.territoire, "non déterminé");
  assert.deepEqual(a.departements, []);
  assert.equal(buildProspectSearches(a, { nafValides: ["43.34Z"] }).ok, false);
});

test("lot prioritaire sur le marché ; plusieurs lots, plusieurs lieux", () => {
  const a = analyseAvis({ idweb: "y", objet: "Rénovation collège", donnees: eforms(
    { "cbc:Name": "Rénovation collège", "cac:RealizedLocation": { "cac:Address": { "cbc:PostalZone": "14000", "cbc:CityName": "Caen" } } },
    [
      { "cbc:ID": "LOT-1", "cac:ProcurementProject": { "cbc:Name": "Lot 1 désamiantage", "cac:RealizedLocation": { "cac:Address": { "cbc:PostalZone": "61000" } } } },
      { "cbc:ID": "LOT-2", "cac:ProcurementProject": { "cbc:Name": "Lot 2 menuiserie" } }
    ]) });
  assert.equal(a.lots[0].lieu.origine, "lot"); assert.deepEqual(a.lots[0].lieu.departements, ["61"]);
  assert.equal(a.lots[1].lieu.origine, "exécution du marché"); assert.deepEqual(a.lots[1].lieu.departements, ["14"]);
  assert.ok(a.propositions.some((p) => p.lot === "LOT-1" && p.naf === "43.11Z"));
  assert.ok(a.propositions.some((p) => p.lot === "LOT-2" && p.naf === "43.32A"));
});

test("sans eForms : objet + descripteurs, département cité dans l'objet, pas de département bruité", () => {
  const a = analyseAvis({ idweb: "z", objet: "Raccordement assainissement – département 14", descripteur_libelle: ["Assainissement"], code_departement: ["14", "50", "75", "13"], donnees: "pas du json" });
  assert.deepEqual(a.departements, ["14"]);
  assert.ok(a.propositions.some((p) => p.naf === "42.21Z"));
});

test("département de prestation en dernier recours", () => {
  assert.deepEqual(resolveLocation({ objet: "Travaux", departementPrestation: ["76", "zz"] }).departements, ["76"]);
});

test("aucun métier reconnu : aucune proposition inventée", () => {
  const a = analyseAvis({ idweb: "n", objet: "Fourniture de papier", donnees: null });
  assert.equal(a.propositions.length, 0);
  assert.match(a.statut, /saisie manuelle/);
  assert.deepEqual(findMetiers("rien à voir"), []);
});

test("départements dans un texte", () => {
  assert.deepEqual(departmentsInText("départements 50 et 14"), ["50", "14"]);
  assert.deepEqual(departmentsInText("Marché de 120 000 euros"), []);
});

test("recherches d'entreprises : seulement les NAF validés, valides, par département", () => {
  const a = analyseAvis(cherbourg);
  const r = buildProspectSearches(a, { nafValides: ["4322a", "zz", "43.22A"] });
  assert.equal(r.ok, true);
  assert.deepEqual(r.searches.map((s) => `${s.naf}/${s.departement}`), ["43.22A/50", "43.22A/14"]);
  assert.equal(buildProspectSearches(a, { nafValides: [] }).ok, false);
  assert.deepEqual(buildProspectSearches(a, { nafValides: ["43.22A"], departements: ["14"] }).searches.length, 1);
});
