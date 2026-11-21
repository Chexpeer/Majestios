import test from "node:test";
import assert from "node:assert/strict";
import { LIMITE_VISITEUR, rpcHeaders, limitReached } from "../visiteur-limite.mjs";

test("La limite des visiteurs est de 20 résultats", () => { assert.equal(LIMITE_VISITEUR, 20); });
test("Un visiteur est bloqué à 20, un titulaire de session jamais", () => {
  assert.equal(limitReached(null, 19), false);
  assert.equal(limitReached(null, 20), true);
  assert.equal(limitReached("jeton", 500), false);
});
test("La session n'est transmise que si elle existe", () => {
  assert.equal(rpcHeaders(null).authorization, undefined);
  assert.equal(rpcHeaders("abc").authorization, "Bearer abc");
});
