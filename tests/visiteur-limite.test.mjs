import test from "node:test";
import assert from "node:assert/strict";
import { LIMITE_VISITEUR, LIMITE_MEMBRE, rpcHeaders, limitReached } from "../visiteur-limite.mjs";

test("La limite des visiteurs est de 20 résultats", () => { assert.equal(LIMITE_VISITEUR, 20); });
test("Visiteur : 20 ; titulaire d'espace : 40 ; jamais bloqué si le serveur a encore des résultats (équipe interne)", () => {
  assert.equal(LIMITE_MEMBRE, 40);
  assert.equal(limitReached(null, 19, false), false);
  assert.equal(limitReached(null, 20, false), true);
  assert.equal(limitReached("jeton", 20, false), false);
  assert.equal(limitReached("jeton", 40, false), true);
  assert.equal(limitReached("jeton", 60, true), false);
});
test("La session n'est transmise que si elle existe", () => {
  assert.equal(rpcHeaders(null).authorization, undefined);
  assert.equal(rpcHeaders("abc").authorization, "Bearer abc");
});
