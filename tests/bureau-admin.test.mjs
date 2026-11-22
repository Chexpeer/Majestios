import test from "node:test";
import assert from "node:assert/strict";
import { buildAttente, compterRelances, formatActivites, ACCES_RAPIDES } from "../bureau-admin.mjs";

test("relances : en retard et à venir séparées selon l'échéance", () => {
  const now = new Date("2026-11-22T10:00:00Z");
  const r = compterRelances([{ due_at: "2026-11-20T09:00:00Z" }, { due_at: "2026-11-22T10:00:00Z" }, { due_at: "2026-11-25T09:00:00Z" }, { due_at: "pas une date" }, null], now);
  assert.deepEqual(r, { retard: 2, avenir: 1 });
});

test("« ce qui m'attend » : zéro omis, retard urgent, pluriels, indisponible signalé", () => {
  assert.deepEqual(buildAttente({ relancesEnRetard: 0, relancesAVenir: 0, annoncesARelire: 0 }), []);
  const a = buildAttente({ relancesEnRetard: 2, relancesAVenir: 1, annoncesARelire: 3 });
  assert.equal(a[0].urgent, true); assert.match(a[0].texte, /^2 relances du CRM en retard$/);
  assert.match(a[1].texte, /^1 relance du CRM à venir$/); assert.match(a[2].texte, /^3 annonces à relire$/);
  const b = buildAttente({});
  assert.equal(b.length, 2); assert.ok(b.every((x) => x.disponible === false && /indisponible/.test(x.texte)));
});

test("activités : limitées, tronquées, type en français, sans donnée inventée", () => {
  const rows = Array.from({ length: 12 }, (_, i) => ({ activity_type: i === 0 ? "call" : "inconnu", subject: i === 0 ? "x".repeat(300) : "  Note   rapide ", occurred_at: "2026-11-22T08:00:00Z" }));
  const f = formatActivites(rows);
  assert.equal(f.length, 8); assert.equal(f[0].type, "Appel"); assert.equal(f[0].sujet.length, 140); assert.equal(f[1].type, "Activité"); assert.equal(f[1].sujet, "Note rapide");
  assert.equal(formatActivites(null).length, 0); assert.equal(formatActivites([{ activity_type: "note" }])[0].sujet, "(sans titre)");
});

test("accès rapides : liens internes uniquement, six entrées", () => {
  assert.equal(ACCES_RAPIDES.length, 6);
  for (const x of ACCES_RAPIDES) assert.match(x.href, /^[a-z-]+\.html$/);
});
