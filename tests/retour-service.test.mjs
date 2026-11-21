import test from "node:test";
import assert from "node:assert/strict";
import { RETOURS, retourDepuisRecherche, destinationRetour } from "../retour-service.mjs";

test("une clé connue donne sa destination", () => {
  assert.equal(retourDepuisRecherche("?retour=annonces"), "annonces");
  assert.equal(destinationRetour("annonces"), "sous-traitance.html#deposer");
  assert.equal(destinationRetour("audit"), "reputation-virtuelle.html");
  assert.equal(destinationRetour("accompagnement"), "accompagnement-appels-offres.html");
});

test("aucune adresse libre n'est acceptée (pas de redirection ouverte)", () => {
  for (const mauvais of ["?retour=https://exemple.fr", "?retour=//exemple.fr", "?retour=../admin", "?retour=administration.html", "?retour=__proto__", "?retour=", "", "?autre=annonces"]) {
    assert.equal(retourDepuisRecherche(mauvais), null, mauvais);
  }
  assert.equal(destinationRetour("https://exemple.fr"), null);
  assert.equal(destinationRetour(null), null);
});

test("toutes les destinations sont des pages locales publiques", () => {
  for (const cible of Object.values(RETOURS)) assert.match(cible, /^[a-z-]+\.html(#[a-z-]+)?$/);
});
