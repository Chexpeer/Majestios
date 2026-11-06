import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const supabase = createClient(MAJESTIOS_SUPABASE.url, MAJESTIOS_SUPABASE.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const tables = ["businesses", "contacts", "opportunities", "activities"];

async function requireWorkspace() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error("Connectez-vous depuis l’espace membre pour accéder au CRM.");

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user || user.id !== session.user.id) {
    throw new Error("Votre session n’est plus valide. Reconnectez-vous.");
  }

  const { data: memberships, error } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .limit(100);
  if (error) throw error;
  if (!memberships?.length) {
    throw new Error("Aucun espace entreprise n’est associé à ce compte. Finalisez d’abord votre inscription.");
  }

  const organizationIds = memberships.map((membership) => membership.organization_id);
  const { data: organizations, error: organizationError } = await supabase
    .from("organizations")
    .select("id, name, kind")
    .in("id", organizationIds);
  if (organizationError) throw organizationError;

  const internalOrganizations = (organizations || []).filter((organization) => organization.kind === "internal");
  if (internalOrganizations.length !== 1) {
    throw new Error(internalOrganizations.length
      ? "Plusieurs espaces internes sont associés à ce compte. Une sélection doit être configurée."
      : "Le CRM interne est réservé aux membres autorisés de MajestiOS.");
  }

  const membership = memberships.find((item) => item.organization_id === internalOrganizations[0].id);
  if (!membership) throw new Error("L’appartenance à l’espace interne n’a pas pu être vérifiée.");
  return { session, user, membership, organization: internalOrganizations[0] };
}

async function list(table) {
  if (!tables.includes(table)) throw new Error("Module CRM inconnu.");
  const { membership } = await requireWorkspace();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

async function create(table, values) {
  if (!tables.includes(table)) throw new Error("Module CRM inconnu.");
  const { session, membership } = await requireWorkspace();
  if (membership.role === "viewer") {
    throw new Error("Votre rôle autorise uniquement la consultation du CRM.");
  }
  const payload = { ...values, organization_id: membership.organization_id };
  if (table === "activities") payload.actor_user_id = session.user.id;
  else payload.created_by = session.user.id;
  const { data, error } = await supabase.from(table).insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export const MajestiosCRM = Object.freeze({
  auth: supabase.auth,
  requireWorkspace,
  listBusinesses: () => list("businesses"),
  listContacts: () => list("contacts"),
  listOpportunities: () => list("opportunities"),
  listActivities: () => list("activities"),
  createBusiness: (values) => create("businesses", values),
  createContact: (values) => create("contacts", values),
  createOpportunity: (values) => create("opportunities", values),
  createActivity: (values) => create("activities", values)
});
