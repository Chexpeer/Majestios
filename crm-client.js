import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";

const supabase = createClient(MAJESTIOS_SUPABASE.url, MAJESTIOS_SUPABASE.publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const tables = ["businesses", "contacts", "opportunities", "activities"];

async function requireWorkspace() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error("Connectez-vous depuis l’accueil interne MajestiOS pour accéder au CRM.");

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
    throw new Error("Aucune appartenance interne n’est associée à ce compte. Contactez l’administration MajestiOS pour faire vérifier vos habilitations.");
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

async function listBusinessesPage({ page = 0, pageSize = 25, search = "", qualification = "", department = "" } = {}) {
  const { membership } = await requireWorkspace();
  const safePage = Math.max(0, Math.floor(Number(page) || 0));
  const safePageSize = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 25)));
  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;
  let query = supabase.from("businesses").select("*", { count: "exact" })
    .eq("organization_id", membership.organization_id)
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  const safeSearch = String(search || "").trim()
    .replace(/[,%()_*\\\\]/g, " ")
    .replace(/\\s+/g, " ")
    .slice(0, 120);
  if (safeSearch) {
    const columns = ["legal_name", "trade_name", "siren", "siret", "ape_naf", "city"];
    query = query.or(columns.map((column) => column + ".ilike.%" + safeSearch + "%").join(","));
  }
  if (qualification) query = query.eq("qualification_status", qualification);
  const safeDepartment = String(department || "").trim().toUpperCase();
  if (safeDepartment) query = query.eq("department_code", safeDepartment);

  const { data, count, error } = await query;
  if (error) throw error;
  const total = Number(count || 0);
  return {
    rows: data || [], total, page: safePage, pageSize: safePageSize,
    pageCount: Math.ceil(total / safePageSize)
  };
}

async function list(table) {
  if (!tables.includes(table)) throw new Error("Module CRM inconnu.");
  const { membership } = await requireWorkspace();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("organization_id", membership.organization_id)
    .order(table === "activities" ? "occurred_at" : "created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

const editableColumns = Object.freeze({
  businesses: new Set(["legal_name", "trade_name", "siren", "siret", "vat_number", "ape_naf", "website", "address_line", "postal_code", "city", "department_code", "country_code", "qualification_status", "qualification_notes", "source_label", "source_url", "assigned_to"]),
  contacts: new Set(["business_id", "first_name", "last_name", "job_title", "email", "phone", "is_primary", "source_label", "consent_status"]),
  opportunities: new Set(["business_id", "primary_contact_id", "title", "description", "source_type", "source_external_id", "source_url", "source_published_at", "department_code", "status", "qualification_score", "qualification_summary", "assigned_to", "next_action", "next_action_at"])
});

async function update(table, id, values) {
  if (!editableColumns[table]) throw new Error("Ce module CRM ne permet pas la modification.");
  if (!id) throw new Error("Enregistrement CRM introuvable.");
  const { membership } = await requireWorkspace();
  if (membership.role === "viewer") throw new Error("Votre rôle autorise uniquement la consultation du CRM.");
  const entries = Object.entries(values);
  if (!entries.length || entries.some(([key]) => !editableColumns[table].has(key))) {
    throw new Error("Champ de modification non autorisé.");
  }
  const payload = Object.fromEntries(entries);
  if (table === "opportunities" && payload.qualification_score !== undefined) {
    const score = payload.qualification_score === "" || payload.qualification_score === null ? null : Number(payload.qualification_score);
    if (score !== null && (!Number.isFinite(score) || score < 0 || score > 100)) {
      throw new Error("Le score de qualification doit être compris entre 0 et 100.");
    }
    payload.qualification_score = score;
  }
  const { data: before, error: readError } = await supabase.from(table).select("*")
    .eq("id", id).eq("organization_id", membership.organization_id).single();
  if (readError) throw readError;
  const { data, error } = await supabase.from(table).update(payload)
    .eq("id", id).eq("organization_id", membership.organization_id).select("*").single();
  if (error) throw error;
  if (!data || data.organization_id !== membership.organization_id) throw new Error("Modification non confirmée dans votre espace.");
  const changedFields = entries.filter(([key, value]) => before[key] !== value).map(([key]) => key);
  if (!changedFields.length) return { record: data, historyRecorded: true };
  const isQualification = table === "businesses" || table === "opportunities";
  const statusChanged = table === "opportunities" && before.status !== data.status;
  const activityType = statusChanged ? "status_change" : isQualification ? "qualification" : "note";
  const subject = statusChanged ? "Étape commerciale modifiée : " + data.title : isQualification ? "Qualification mise à jour : " + (data.legal_name || data.title) : "Fiche contact modifiée : " + [data.first_name, data.last_name].filter(Boolean).join(" ");
  const body = statusChanged ? "Étape précédente : " + before.status + " · Nouvelle étape : " + data.status : "Champs modifiés : " + changedFields.join(", ");
  const { data: authData } = await supabase.auth.getUser();
  const { error: historyError } = await supabase.from("activities").insert({
    organization_id: membership.organization_id, actor_user_id: authData.user?.id || null,
    activity_type: activityType, subject, body,
    business_id: table === "businesses" ? data.id : (data.business_id || before.business_id || null),
    contact_id: table === "contacts" ? data.id : null,
    opportunity_id: table === "opportunities" ? data.id : null,
    metadata: { entity_type: table, entity_id: id, changed_fields: changedFields,
      previous_status: before.status ?? before.qualification_status ?? null,
      new_status: data.status ?? data.qualification_status ?? null }
  });
  return { record: data, historyRecorded: !historyError };
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

async function listReminders() {
  const { membership } = await requireWorkspace();
  const { data, error } = await supabase.from("crm_reminders").select("*")
    .eq("organization_id", membership.organization_id).eq("state", "pending")
    .order("due_at", { ascending: true }).limit(100);
  if (error) throw error;
  return data || [];
}

async function markReminderRead(id) {
  const { membership } = await requireWorkspace();
  if (membership.role === "viewer") throw new Error("Votre rôle autorise uniquement la consultation du CRM.");
  const { data, error } = await supabase.rpc("complete_crm_reminder", {
    p_reminder_id: id
  });
  if (error) throw error;
  return { activityId: data, organizationId: membership.organization_id };
}

export const MajestiosCRM = Object.freeze({
  auth: supabase.auth,
  requireWorkspace,
  listBusinesses: () => list("businesses"),
  listBusinessesPage,
  listContacts: () => list("contacts"),
  listOpportunities: () => list("opportunities"),
  listActivities: () => list("activities"),
  listReminders,
  markReminderRead,
  createBusiness: (values) => create("businesses", values),
  createContact: (values) => create("contacts", values),
  createOpportunity: (values) => create("opportunities", values),
  createActivity: (values) => create("activities", values),
  updateBusiness: (id, values) => update("businesses", id, values),
  updateContact: (id, values) => update("contacts", id, values),
  updateOpportunity: (id, values) => update("opportunities", id, values)
});
