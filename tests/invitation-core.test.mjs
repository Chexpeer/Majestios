import assert from "node:assert/strict";
import test from "node:test";
import { inviteUser, parseInvitationBody, mapInvitationError } from "../supabase/functions/_shared/invitation-core.mjs";

const base = { email: " Marie@Exemple.FR ", kind: "internal", role: "member", organization_id: "11111111-1111-1111-1111-111111111111" };
function clients({ rpc = {}, invite = {}, otp = {} } = {}) {
  const calls = [];
  return {
    calls,
    userClient: { rpc: async (n, a) => { calls.push(["rpc", n, a]); return rpc[n] ?? { data: { invitation_id: "inv-1" }, error: null }; } },
    adminClient: { auth: { admin: { inviteUserByEmail: async (e, o) => { calls.push(["invite", e, o]); return invite.result ?? { error: null }; } } } },
    anonClient: { auth: { signInWithOtp: async (a) => { calls.push(["otp", a]); return otp.result ?? { error: null }; } } },
  };
}
const run = (c, body = base) => inviteUser({ body, userClient: c.userClient, adminClient: c.adminClient, anonClient: c.anonClient, origin: "https://site.test" });

test("normalise l'e-mail et refuse les formats invalides", () => {
  assert.equal(parseInvitationBody(base).value.email, "marie@exemple.fr");
  assert.ok(parseInvitationBody({ ...base, email: "x" }).error);
  assert.ok(parseInvitationBody({ ...base, kind: "x" }).error);
  assert.ok(parseInvitationBody({ ...base, role: "root" }).error);
  assert.ok(parseInvitationBody({ ...base, organization_id: "zz" }).error);
  assert.ok(parseInvitationBody(null).error);
});
test("invitation réussie : droits via RPC puis envoi du lien", async () => {
  const c = clients(); const r = await run(c);
  assert.equal(r.status, 201); assert.equal(r.body.ok, true);
  assert.equal(c.calls[0][1], "create_invitation");
  assert.equal(c.calls[1][0], "invite");
  assert.equal(c.calls[1][2].redirectTo, "https://site.test/accepter-invitation.html");
});
test("refus de droits : aucun e-mail envoyé", async () => {
  const c = clients({ rpc: { create_invitation: { data: null, error: { message: "ACCESS_DENIED" } } } });
  const r = await run(c);
  assert.equal(r.status, 403);
  assert.equal(c.calls.filter((x) => x[0] !== "rpc").length, 0);
});
test("quota, doublon, déjà membre : codes dédiés", async () => {
  assert.equal(mapInvitationError("QUOTA_EXCEEDED").status, 429);
  assert.equal(mapInvitationError("ALREADY_PENDING").status, 409);
  assert.equal(mapInvitationError("ALREADY_MEMBER").status, 409);
  assert.equal(mapInvitationError("boom").status, 500);
});
test("compte déjà existant : repli sur lien de connexion, réponse identique", async () => {
  const c = clients({ invite: { result: { error: { status: 422, message: "User already registered" } } } });
  const r = await run(c);
  assert.equal(r.status, 201);
  assert.equal(c.calls[2][0], "otp");
  assert.equal(c.calls[2][1].options.shouldCreateUser, false);
});
test("échec d'envoi : invitation révoquée et erreur 502", async () => {
  const c = clients({ invite: { result: { error: { status: 500, message: "smtp down" } } } });
  const r = await run(c);
  assert.equal(r.status, 502);
  assert.deepEqual(c.calls.at(-1).slice(0, 2), ["rpc", "fail_invitation_delivery"]);
});
test("échec du repli OTP : invitation révoquée", async () => {
  const c = clients({ invite: { result: { error: { status: 422, message: "already registered" } } }, otp: { result: { error: { message: "rate limit" } } } });
  const r = await run(c);
  assert.equal(r.status, 502);
  assert.equal(c.calls.at(-1)[1], "fail_invitation_delivery");
});
