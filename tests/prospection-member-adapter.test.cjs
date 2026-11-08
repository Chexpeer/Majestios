"use strict";
const assert = require("node:assert/strict");

async function main() {
  const adapter = await import("../prospection-member-adapter.mjs");
  const payload = adapter.buildProspectionSearchPayload({
    nafCodes: ["43.21A", " 43.22B ", "43.21A"],
    departments: ["72", "2A"],
    pageNumber: 2
  });
  assert.deepEqual(payload, {
    filters: { activity_codes: ["43.21A", "43.22B"], departments: ["72", "2A"] },
    page: { number: 2, size: 10 }
  });
  assert.throws(() => adapter.buildProspectionSearchPayload({ nafCodes: ["bad"], departments: ["72"] }));
  assert.throws(() => adapter.buildProspectionSearchPayload({ nafCodes: ["43.21A"], departments: ["999"] }));
  assert.throws(() => adapter.buildProspectionSearchPayload({ nafCodes: ["43.21A"], departments: ["72"], pageNumber: 51 }));

  const mapped = adapter.toProspectionCandidate({
    id: "123456789",
    name: "Entreprise Alpha",
    siren: "123456789",
    siret: "12345678900016",
    activity_code: "43.21A",
    activity_label: "Installation électrique",
    legal_status: "unknown",
    legal_form: "5499",
    creation_date: "2020-01-02",
    workforce_band: "3 à 5 salariés",
    address: { postal_code: "72000", city: "Le Mans", department: "72" },
    qualification: { score: 120, label: "prioritaire", reasons: ["Correspondance métier"] },
    last_verified_at: "2026-11-08T11:00:00.000Z",
    source: "MUST_NOT_BE_PROJECTED",
    source_url: "https://private.invalid",
    raw: { secret: true }
  });
  assert.equal(mapped.name, "Entreprise Alpha");
  assert.equal(mapped.active, null, "Un statut inconnu ne doit pas être assimilé à inactif.");
  assert.equal(mapped.score, 100);
  assert.equal(mapped.department, "72");
  assert.equal(mapped.address, "72000 Le Mans");
  for (const forbidden of ["source", "source_url", "raw", "provider", "request_id"]) {
    assert.equal(Object.hasOwn(mapped, forbidden), false);
  }
  assert.equal(adapter.toProspectionCandidate({ id: "x" }), null);

  let invoked = 0;
  let captured = null;
  const mock = {
    auth: {
      getSession: async () => ({ data: { session: { access_token: "jwt", user: { id: "user-1" } } }, error: null }),
      getUser: async token => ({ data: { user: { id: token === "jwt" ? "user-1" : "other" } }, error: null })
    },
    functions: {
      invoke: async (name, options) => {
        invoked++;
        captured = { name, options };
        return {
          data: {
            ok: true,
            request_id: "internal-request-id",
            items: [{
              id: "123456789", name: "Entreprise Alpha", legal_status: "active",
              activity_code: "43.21A", address: { department: "72" },
              qualification: { score: 82, label: "à examiner", reasons: [] }
            }],
            page: { number: 1, size: 10, has_more: true },
            partial: false
          },
          error: null
        };
      }
    }
  };
  const search = adapter.createProspectionMemberAdapter({ supabase: mock });
  const result = await search.search({ nafCodes: ["43.21A"], departments: ["72"] });
  assert.equal(invoked, 1);
  assert.equal(captured.name, "prospection-search-member");
  assert.deepEqual(captured.options.body, {
    filters: { activity_codes: ["43.21A"], departments: ["72"] },
    page: { number: 1, size: 10 }
  });
  assert.equal(result.candidates[0].active, true);
  assert.equal(result.page.hasMore, true);
  assert.equal(result.partial, false);
  assert.equal(Object.hasOwn(result, "request_id"), false);

  const noSession = adapter.createProspectionMemberAdapter({
    supabase: {
      auth: { getSession: async () => ({ data: { session: null }, error: null }), getUser: async () => ({}) },
      functions: { invoke: async () => { throw new Error("must not invoke"); } }
    }
  });
  await assert.rejects(() => noSession.search({ nafCodes: ["43.21A"], departments: ["72"] }), /Connectez-vous/);

  const wrongUser = adapter.createProspectionMemberAdapter({
    supabase: {
      auth: {
        getSession: async () => ({ data: { session: { access_token: "jwt", user: { id: "user-1" } } }, error: null }),
        getUser: async () => ({ data: { user: { id: "user-2" } }, error: null })
      },
      functions: { invoke: async () => { throw new Error("must not invoke"); } }
    }
  });
  await assert.rejects(() => wrongUser.search({ nafCodes: ["43.21A"], departments: ["72"] }), /Connectez-vous/);

  const denied = adapter.createProspectionMemberAdapter({
    supabase: {
      auth: mock.auth,
      functions: { invoke: async () => ({
        data: null,
        error: { context: { json: async () => ({ error: { code: "ACCESS_DENIED" } }) } }
      }) }
    }
  });
  await assert.rejects(() => denied.search({ nafCodes: ["43.21A"], departments: ["72"] }), /habilitations/);

  console.log("Tests adaptateur membre Prospection : OK");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
