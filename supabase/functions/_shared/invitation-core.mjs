// Logique pure de l'invitation (testable sans Supabase). Les droits sont décidés par la base (create_invitation) ;
// ce module ne fait que valider le format, envoyer le lien et répondre sans divulguer l'existence d'un compte.
export const ACCEPT_PAGE = "/accepter-invitation.html";

const ERROR_MAP = {
  AUTH_REQUIRED: [401, "Session invalide ou expirée."],
  ACCESS_DENIED: [403, "Vous n'avez pas le droit d'inviter ce type d'utilisateur."],
  INVALID_EMAIL: [400, "Adresse e-mail invalide."],
  INVALID_KIND: [400, "Type d'invitation invalide."],
  INVALID_ROLE: [400, "Rôle invalide pour cette invitation."],
  INVALID_ORGANIZATION: [400, "Organisation invalide."],
  SELF_INVITATION: [400, "Vous ne pouvez pas vous inviter vous-même."],
  ALREADY_MEMBER: [409, "Cette personne fait déjà partie de cette organisation."],
  ALREADY_PENDING: [409, "Une invitation est déjà en attente pour cette adresse."],
  QUOTA_EXCEEDED: [429, "Limite de 10 invitations par 24 h atteinte."],
};

export function mapInvitationError(message) {
  const text = String(message ?? "");
  for (const [code, [status, error]] of Object.entries(ERROR_MAP)) {
    if (text.includes(code)) return { status, error, code };
  }
  return { status: 500, error: "L'invitation n'a pas pu être créée.", code: "UNKNOWN" };
}

export function parseInvitationBody(body) {
  const b = body && typeof body === "object" ? body : {};
  const text = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const email = text(b.email, 254).toLowerCase();
  const kind = text(b.kind, 16);
  const role = text(b.role, 16);
  const organizationId = text(b.organization_id, 64) || null;
  const newName = text(b.new_organization_name, 120) || null;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Adresse e-mail invalide." };
  if (!["internal", "client"].includes(kind)) return { error: "Type d'invitation invalide." };
  if (!["owner", "admin", "member", "viewer"].includes(role)) return { error: "Rôle invalide." };
  if (organizationId && !/^[0-9a-f-]{36}$/i.test(organizationId)) return { error: "Organisation invalide." };
  return { value: { email, kind, role, organizationId, newName } };
}

export function alreadyRegistered(error) {
  const text = `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();
  return error?.status === 422 || text.includes("already") || text.includes("exists") || text.includes("registered");
}

// userClient : client authentifié avec le jeton de l'invitant ; adminClient : service_role ; anonClient : clé publique.
export async function inviteUser({ body, userClient, adminClient, anonClient, origin }) {
  const parsed = parseInvitationBody(body);
  if (parsed.error) return { status: 400, body: { error: parsed.error } };
  const { email, kind, role, organizationId, newName } = parsed.value;

  const created = await userClient.rpc("create_invitation", {
    p_email: email, p_kind: kind, p_role: role,
    p_organization_id: organizationId, p_new_organization_name: newName,
  });
  if (created.error) {
    const mapped = mapInvitationError(created.error.message);
    return { status: mapped.status, body: { error: mapped.error, code: mapped.code } };
  }
  const invitationId = created.data?.invitation_id;
  const redirectTo = `${origin}${ACCEPT_PAGE}`;

  let sent = await adminClient.auth.admin.inviteUserByEmail(email, { redirectTo });
  if (sent.error && alreadyRegistered(sent.error)) {
    sent = await anonClient.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: redirectTo } });
  }
  if (sent.error) {
    await userClient.rpc("fail_invitation_delivery", { p_id: invitationId });
    return { status: 502, body: { error: "L'e-mail d'invitation n'a pas pu être envoyé. Réessayez dans quelques minutes.", code: "DELIVERY_FAILED" } };
  }
  return { status: 201, body: { ok: true, invitation_id: invitationId } };
}
