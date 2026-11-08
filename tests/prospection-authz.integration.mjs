import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { resolveProspectionAccess } from "../supabase/functions/_shared/prospection-authz.mjs";
import { validateMemberSearch } from "../supabase/functions/_shared/prospection-validation.mjs";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) {
  throw new Error("Variables de la stack Supabase locale manquantes.");
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});
const password = "Local-Only-Integration-Password-2026!";
const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
let createdUsers = 0;
let createdOrganizations = 0;

async function createActor({ label, kind = "client", role = "member", confirmed = true, memberships = 1 }) {
  const email = `prospection-${label}-${suffix}@example.test`;
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: confirmed,
    user_metadata: { display_name: "Prospection integration test" }
  });
  assert.ifError(createError);
  assert.ok(created.user?.id, `Utilisateur Auth créé : ${label}`);
  createdUsers += 1;

  const organizationIds = [];
  for (let index = 0; index < memberships; index += 1) {
    const slug = `ci-${label}-${index}-${suffix}`;
    const { data: organization, error: organizationError } = await admin
      .from("organizations")
      .insert({
        name: `CI ${label} ${index}`,
        slug,
        kind,
        created_by: created.user.id
      })
      .select("id")
      .single();
    assert.ifError(organizationError);
    assert.ok(organization?.id);
    createdOrganizations += 1;
    organizationIds.push(organization.id);

    const { error: membershipError } = await admin.from("organization_members").insert({
      organization_id: organization.id,
      user_id: created.user.id,
      role
    });
    assert.ifError(membershipError);
  }

  const userClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
  const { data: sessionData, error: signInError } = await userClient.auth.signInWithPassword({
    email,
    password
  });
  if (!confirmed) {
    assert.equal(signInError?.code, "email_not_confirmed", "Auth doit bloquer la connexion non confirmée");
    assert.equal(sessionData.session, null);
    return { user: created.user, userClient, token: null, organizationIds, signInError };
  }
  assert.ifError(signInError);
  assert.ok(sessionData.session?.access_token, `Session Auth réelle : ${label}`);
  return { user: created.user, userClient, token: sessionData.session.access_token, organizationIds };
}

async function decision(actor) {
  return resolveProspectionAccess({
    token: actor.token,
    userClient: actor.userClient,
    requireConfirmedEmail: true
  });
}

const authorized = [];
for (const role of ["owner", "admin", "member"]) {
  const actor = await createActor({ label: role, role });
  const result = await decision(actor);
  assert.equal(result.ok, true, `Le rôle ${role} doit être autorisé`);
  assert.equal(result.role, role);
  assert.equal(result.organizationId, actor.organizationIds[0]);
  authorized.push(actor);

  const { data: visibleMemberships, error: membershipReadError } = await actor.userClient
    .from("organization_members")
    .select("organization_id,user_id,role")
    .eq("user_id", actor.user.id);
  assert.ifError(membershipReadError);
  assert.equal(visibleMemberships.length, 1, `RLS membership pour ${role}`);

  const { data: visibleOrganizations, error: organizationReadError } = await actor.userClient
    .from("organizations")
    .select("id,kind");
  assert.ifError(organizationReadError);
  assert.deepEqual(
    visibleOrganizations.map((row) => row.id),
    [actor.organizationIds[0]],
    `RLS doit limiter les organisations visibles pour ${role}`
  );
}

const viewer = await createActor({ label: "viewer", role: "viewer" });
assert.equal((await decision(viewer)).ok, false, "viewer doit être refusé");

for (const kind of ["internal", "partner"]) {
  const actor = await createActor({ label: kind, kind, role: "member" });
  assert.equal((await decision(actor)).ok, false, `${kind} doit être refusé`);
}

const noMembership = await createActor({ label: "no-membership", memberships: 0 });
assert.equal((await decision(noMembership)).ok, false, "Une absence d'appartenance doit être refusée");
const { data: noMembershipRows, error: noMembershipError } = await noMembership.userClient
  .from("organization_members")
  .select("organization_id,user_id,role")
  .eq("user_id", noMembership.user.id);
assert.ifError(noMembershipError);
assert.deepEqual(noMembershipRows, [], "RLS ne doit révéler aucune appartenance inexistante");

const multiple = await createActor({ label: "multiple", memberships: 2 });
assert.equal((await decision(multiple)).ok, false, "Plusieurs appartenances doivent être refusées");

const unconfirmed = await createActor({ label: "unconfirmed", confirmed: false });
assert.equal(unconfirmed.signInError?.code, "email_not_confirmed", "Auth doit refuser l'ouverture de session non confirmée");

const validActor = authorized[0];
const invalidToken = await resolveProspectionAccess({
  token: `${validActor.token}invalid`,
  userClient: validActor.userClient,
  requireConfirmedEmail: true
});
assert.equal(invalidToken.ok, false, "Un JWT altéré doit être refusé");
assert.equal(invalidToken.code, "AUTH_REQUIRED");

assert.equal(
  validateMemberSearch({ query: "électricité", organization_id: "forged-org" }).ok,
  false,
  "organization_id fourni par le navigateur doit être rejeté"
);
assert.equal(
  validateMemberSearch({ query: "électricité", role: "admin" }).ok,
  false,
  "role fourni par le navigateur doit être rejeté"
);

console.log(
  `Intégration Auth/RLS Supabase locale : OK — ${createdUsers} utilisateurs Auth, ${createdOrganizations} organisations, rôles owner/admin/member, viewer, internal/partner, absence et multiplicité d'appartenance, connexion non confirmée bloquée par Auth, JWT altéré, RLS et rejet des identifiants/roles client.`
);
