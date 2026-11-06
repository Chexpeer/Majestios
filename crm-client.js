import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const supabase = createClient(MAJESTIOS_SUPABASE.url, MAJESTIOS_SUPABASE.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const tables = ["businesses", "contacts", "opportunities", "activities"];

async function requireWorkspace() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error("Connectez-vous depuis l’espace membre pour accéder au CRM.");
  const { data: membership, error } = await supabase
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", session.user.id)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!membership) throw new Error("Aucun espace entreprise n’est associé à ce compte. Finalisez d’abord votre inscription.");
  return { session, membership };
}

async function list(table) {
  if (!tables.includes(table)) throw new Error("Module CRM inconnu.");
  await requireWorkspace();
  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return data || [];
}

async function create(table, values) {
  if (!tables.includes(table)) throw new Error("Module CRM inconnu.");
  const { session, membership } = await requireWorkspace();
  const payload = { ...values, organization_id: membership.organization_id, created_by: session.user.id };
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
