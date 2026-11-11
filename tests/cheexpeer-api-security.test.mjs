import test from "node:test";
import assert from "node:assert/strict";
import {
  authorizeOrganizationAdmin, isAllowedOrigin, readJsonLimited,
  validateApprovalPayload, validateReadPayload, validateSubmissionPayload
} from "../supabase/functions/_shared/cheexpeer-api.mjs";

const orgA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const orgB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const userA = "11111111-1111-4111-8111-111111111111";
const forgedUser = "22222222-2222-4222-8222-222222222222";

function mockAdmin({ authenticatedUser = userA, membership = null } = {}) {
  return {
    auth: { getUser: async () => ({ data:{ user:{ id:authenticatedUser, email_confirmed_at:"2026-01-01" } }, error:null }) },
    from: (table) => {
      assert.equal(table, "organization_members");
      const filters = {};
      const query = {
        select() { return this; },
        eq(key, value) { filters[key] = value; return this; },
        maybeSingle: async () => ({
          data: membership && membership.organization_id === filters.organization_id &&
            membership.user_id === filters.user_id ? membership : null,
          error:null
        })
      };
      return query;
    }
  };
}

test("owner/admin access derives actor from verified JWT, not request payload", async () => {
  for (const role of ["owner", "admin"]) {
    const admin = mockAdmin({ membership:{ organization_id:orgA, user_id:userA, role } });
    const result = await authorizeOrganizationAdmin({ admin, token:"valid-jwt", organizationId:orgA });
    assert.equal(result.ok, true);
    assert.equal(result.userId, userA);
    assert.notEqual(result.userId, forgedUser);
  }
});

test("member, non-member and cross-organization access are denied", async () => {
  const member = mockAdmin({ membership:{ organization_id:orgA, user_id:userA, role:"member" } });
  assert.equal((await authorizeOrganizationAdmin({ admin:member, token:"jwt", organizationId:orgA })).ok, false);

  const otherTenant = mockAdmin({ membership:{ organization_id:orgB, user_id:userA, role:"owner" } });
  const denied = await authorizeOrganizationAdmin({ admin:otherTenant, token:"jwt", organizationId:orgA });
  assert.equal(denied.ok, false);
  assert.equal(denied.status, 404);
});

test("invalid JWT and unconfirmed identity are denied", async () => {
  const invalid = {
    auth:{ getUser:async()=>({ data:{user:null}, error:{message:"invalid"} }) },
    from:()=>{ throw new Error("must not query memberships"); }
  };
  assert.equal((await authorizeOrganizationAdmin({admin:invalid,token:"forged",organizationId:orgA})).ok, false);
  const unconfirmed = {
    auth:{ getUser:async()=>({ data:{user:{id:userA}}, error:null }) },
    from:()=>{ throw new Error("must not query memberships"); }
  };
  assert.equal((await authorizeOrganizationAdmin({admin:unconfirmed,token:"jwt",organizationId:orgA})).status, 401);
});

test("submission payload rejects caller-supplied actor and tenant/role spoofing", () => {
  const valid = { organization_id:orgA, mission_type:"readiness_probe", title:"Diagnostic" };
  assert.equal(validateSubmissionPayload(valid).ok, true);
  for (const extra of [{ created_by:forgedUser }, { user_id:forgedUser }, { role:"owner" }]) {
    assert.equal(validateSubmissionPayload({ ...valid, ...extra }).ok, false);
  }
});

test("approval and consultation payloads reject unexpected identity fields", () => {
  assert.equal(validateApprovalPayload({organization_id:orgA,approval_id:orgB,decision:"approved"}).ok, true);
  assert.equal(validateApprovalPayload({organization_id:orgA,approval_id:orgB,decision:"approved",decision_by:forgedUser}).ok, false);
  assert.equal(validateReadPayload({organization_id:orgA,mission_id:orgB}).ok, true);
  assert.equal(validateReadPayload({organization_id:orgA,mission_id:orgB,user_id:forgedUser}).ok, false);
});

test("body limit and CORS allowlist are enforced", async () => {
  const tooLarge = await readJsonLimited(new Request("https://example.test", {
    method:"POST", body:JSON.stringify({ value:"x".repeat(100) })
  }), 20);
  assert.equal(tooLarge.ok, false);
  assert.equal(tooLarge.status, 413);
  assert.equal(isAllowedOrigin("https://majestios.com"), true);
  assert.equal(isAllowedOrigin("https://attacker.example"), false);
  assert.equal(isAllowedOrigin("https://preview.example", "https://preview.example"), true);
});
