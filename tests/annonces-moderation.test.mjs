import test from "node:test";
import assert from "node:assert/strict";
import { allowedDecisions, buildDecision, moderationError, TABS } from "../annonces-moderation.mjs";

const original = { title: "Recherche plaquiste Rennes", description: "Nous cherchons un plaquiste disponible dès mars pour un chantier de logements." };

test("les décisions autorisées dépendent de l’état", () => {
  assert.deepEqual(allowedDecisions("pending"), ["publish", "reject"]);
  assert.deepEqual(allowedDecisions("published"), ["withdraw"]);
  assert.deepEqual(allowedDecisions("rejected"), []);
  assert.deepEqual(allowedDecisions("expired"), []);
});
test("un refus exige un motif", () => {
  const r = buildDecision({ id: "1", status: "pending", decision: "reject", note: "  " });
  assert.equal(r.ok, false);
  assert.match(r.errors.join(" "), /motif/i);
  assert.equal(buildDecision({ id: "1", status: "pending", decision: "reject", note: "Hors sujet" }).ok, true);
});
test("publier sans correction n’envoie pas de texte", () => {
  const r = buildDecision({ id: "1", status: "pending", decision: "publish", title: original.title, description: original.description, original });
  assert.equal(r.ok, true);
  assert.equal(r.params.p_title, null);
  assert.equal(r.params.p_description, null);
});
test("publier avec correction envoie le texte corrigé", () => {
  const r = buildDecision({ id: "1", status: "pending", decision: "publish", title: "Recherche plaquiste à Rennes", description: original.description, original });
  assert.equal(r.params.p_title, "Recherche plaquiste à Rennes");
  assert.equal(r.params.p_description, null);
});
test("publier refuse un texte trop court", () => {
  assert.equal(buildDecision({ id: "1", status: "pending", decision: "publish", title: "Court", description: "Trop court", original }).ok, false);
});
test("une décision impossible est refusée", () => {
  assert.equal(buildDecision({ id: "1", status: "rejected", decision: "publish", original }).ok, false);
  assert.equal(buildDecision({ id: "1", status: "published", decision: "reject", note: "x" }).ok, false);
});
test("messages d’erreur serveur lisibles", () => {
  assert.match(moderationError({ message: "forbidden" }), /autorisé/);
  assert.match(moderationError({ code: "42501" }), /autorisé/);
  assert.match(moderationError({ message: "not_pending" }), /déjà été traitée/);
  assert.match(moderationError({ message: "zzz" }), /Réessayez/);
});
test("cinq onglets, « À relire » en premier", () => {
  assert.equal(TABS.length, 5);
  assert.equal(TABS[0][0], "pending");
});
test("la page n’expose aucune clé secrète et n’écrit jamais directement dans les tables", async () => {
  const { readFileSync } = await import("node:fs");
  const js = readFileSync(new URL("../admin-annonces.js", import.meta.url), "utf8");
  assert.doesNotMatch(js, /service_role|\.from\(["']announcements/);
  assert.match(js, /moderation_queue/);
  assert.match(js, /moderate_announcement/);
});
