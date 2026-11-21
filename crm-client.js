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
  if (!["owner", "admin"].includes(membership.role)) {
    throw new Error("Le CRM interne est réservé aux comptes disposant d’un accès VIP (owner ou admin). L’espace Membres ne donne aucun accès au CRM.");
  }
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
    .replace(/[^a-zA-Z0-9À-ÖØ-öø-ÿ\s.'’-]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 120);
  if (safeSearch) {
    const columns = ["legal_name", "trade_name", "siren", "siret", "ape_naf", "city"];
    query = query.or(columns.map((column) => column + '.ilike."%' + safeSearch + '%"').join(","));
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

async function listWorkspaceRecordsPage({ table, page = 0, pageSize = 25, search = "", businessId = "" } = {}) {
  const searchableColumns = {
    contacts: ["first_name", "last_name", "job_title", "email", "phone"],
    opportunities: ["title", "description", "source_external_id", "source_type"],
    activities: ["subject", "body", "activity_type"]
  };
  if (!Object.prototype.hasOwnProperty.call(searchableColumns, table)) {
    throw new Error("Rubrique CRM non autorisée pour la pagination.");
  }
  const { membership } = await requireWorkspace();
  const safePage = Math.max(0, Math.floor(Number(page) || 0));
  const safePageSize = Math.min(100, Math.max(1, Math.floor(Number(pageSize) || 25)));
  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;
  let query = supabase.from(table).select("*", { count: "exact" })
    .eq("organization_id", membership.organization_id);
  if (table === "activities") {
    query = query.order("occurred_at", { ascending: false }).order("id", { ascending: true });
  } else if (table === "opportunities") {
    query = query.order("updated_at", { ascending: false }).order("id", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false }).order("id", { ascending: true });
  }
  const safeSearch = String(search || "").trim()
    .replace(/[^a-zA-Z0-9À-ÖØ-öø-ÿ\s.'’-]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 120);
  const safeBusinessId = String(businessId || "").trim();
  if (safeBusinessId && ["contacts", "opportunities", "activities"].includes(table)) {
    query = query.eq("business_id", safeBusinessId);
  }
  if (safeSearch) {
    query = query.or(searchableColumns[table]
      .map(column => column + '.ilike."%' + safeSearch + '%"').join(","));
  }
  const { data, count, error } = await query.range(from, to);
  if (error) throw error;
  const total = Number(count || 0);
  return { rows: data || [], total, page: safePage, pageSize: safePageSize, pageCount: Math.ceil(total / safePageSize) };
}


async function listBusinessRelatedPage({ businessId, table, page = 0, pageSize = 10 } = {}) {
  const sortableTables = {
    contacts: "created_at",
    opportunities: "updated_at",
    activities: "occurred_at"
  };
  if (!Object.prototype.hasOwnProperty.call(sortableTables, table)) {
    throw new Error("Rubrique relationnelle non autorisée.");
  }
  if (typeof businessId !== "string" || !businessId.trim()) {
    throw new Error("Entreprise associée introuvable.");
  }
  const { membership } = await requireWorkspace();
  const safePage = Math.max(0, Math.floor(Number(page) || 0));
  const safePageSize = Math.min(50, Math.max(1, Math.floor(Number(pageSize) || 10)));
  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;
  const { data, count, error } = await supabase.from(table)
    .select("*", { count: "exact" })
    .eq("organization_id", membership.organization_id)
    .eq("business_id", businessId)
    .order(sortableTables[table], { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);
  if (error) throw error;
  const total = Number(count || 0);
  return {
    rows: data || [], total, page: safePage, pageSize: safePageSize,
    pageCount: Math.ceil(total / safePageSize)
  };
}

async function findBusinessesByIdentifiers({ sirens = [], sirets = [] } = {}) {
  const { membership } = await requireWorkspace();
  const cleanSirens = [...new Set(sirens.map(value => String(value || "").replace(/\D/g, "")).filter(value => /^\d{9}$/.test(value)))];
  const cleanSirets = [...new Set(sirets.map(value => String(value || "").replace(/\D/g, "")).filter(value => /^\d{14}$/.test(value)))];
  const requests = [];
  if (cleanSirens.length) {
    requests.push(supabase.from("businesses").select("id, legal_name, siren, siret")
      .eq("organization_id", membership.organization_id).in("siren", cleanSirens));
  }
  if (cleanSirets.length) {
    requests.push(supabase.from("businesses").select("id, legal_name, siren, siret")
      .eq("organization_id", membership.organization_id).in("siret", cleanSirets));
  }
  if (!requests.length) return [];
  const results = await Promise.all(requests);
  const byId = new Map();
  results.forEach(({ data, error }) => {
    if (error) throw error;
    (data || []).forEach(row => byId.set(row.id, row));
  });
  return [...byId.values()];
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

const creatableColumns = Object.freeze({
  businesses: new Set(["legal_name", "trade_name", "siren", "siret", "vat_number", "ape_naf", "website", "address_line", "postal_code", "city", "department_code", "country_code", "qualification_status", "qualification_notes", "source_label", "source_url", "assigned_to"]),
  contacts: new Set(["business_id", "first_name", "last_name", "job_title", "email", "phone", "is_primary", "source_label", "consent_status"]),
  opportunities: new Set(["business_id", "primary_contact_id", "title", "description", "source_type", "source_external_id", "source_url", "source_published_at", "department_code", "status", "qualification_score", "qualification_summary", "assigned_to", "next_action", "next_action_at"]),
  activities: new Set(["business_id", "contact_id", "opportunity_id", "activity_type", "subject", "body"])
});

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
  const changedFields = Object.entries(payload)
    .filter(([key, value]) => before[key] !== value)
    .map(([key]) => key)
    .sort();
  const { data, error } = await supabase.from(table).update(payload)
    .eq("id", id).eq("organization_id", membership.organization_id).select("*").single();
  if (error) throw error;
  if (!data || data.organization_id !== membership.organization_id) throw new Error("Modification non confirmée dans votre espace.");
  if (!changedFields.length) return { record: data, historyRecorded: true };

  // Le trigger SQL écrit l'activité dans la même transaction que la fiche.
  // Cette lecture confirme sa présence sans créer une seconde activité côté navigateur.
  const { data: historyRows, error: historyReadError } = await supabase.from("activities")
    .select("id")
    .eq("organization_id", membership.organization_id)
    .contains("metadata", { event: "updated", entity_type: table, entity_id: id, changed_fields: changedFields })
    .gte("occurred_at", data.updated_at)
    .order("occurred_at", { ascending: false })
    .limit(1);
  return { record: data, historyRecorded: !historyReadError && Boolean(historyRows?.length) };
}

async function create(table, values) {
  if (!tables.includes(table)) throw new Error("Module CRM inconnu.");
  if (!creatableColumns[table]) throw new Error("Création non autorisée pour ce module CRM.");
  if (!values || typeof values !== "object" || Array.isArray(values)) {
    throw new Error("Les données de création CRM sont invalides.");
  }
  const entries = Object.entries(values);
  if (!entries.length || entries.some(([key]) => !creatableColumns[table].has(key))) {
    throw new Error("Champ de création non autorisé.");
  }
  const { session, membership } = await requireWorkspace();
  if (membership.role === "viewer") {
    throw new Error("Votre rôle autorise uniquement la consultation du CRM.");
  }
  const payload = { ...Object.fromEntries(entries), organization_id: membership.organization_id };
  if (table === "activities") payload.actor_user_id = session.user.id;
  else payload.created_by = session.user.id;
  const { data, error } = await supabase.from(table).insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

async function countWorkspaceRecords(table) {
  if (!tables.includes(table)) throw new Error("Module CRM inconnu.");
  const { membership } = await requireWorkspace();
  const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true })
    .eq("organization_id", membership.organization_id);
  if (error) throw error;
  return Number(count || 0);
}

async function listReminders() {
  const { membership } = await requireWorkspace();
  const { data, error } = await supabase.from("crm_reminders").select("*")
    .eq("organization_id", membership.organization_id).eq("state", "pending")
    .order("due_at", { ascending: true }).limit(100);
  if (error) throw error;
  return data || [];
}

async function countPendingReminders() {
  const { membership } = await requireWorkspace();
  const { count, error } = await supabase.from("crm_reminders")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", membership.organization_id)
    .eq("state", "pending");
  if (error) throw error;
  return Number(count || 0);
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
  listWorkspaceRecordsPage,
  listBusinessRelatedPage,
  findBusinessesByIdentifiers,
  listContacts: () => list("contacts"),
  listOpportunities: () => list("opportunities"),
  listActivities: () => list("activities"),
  listReminders,
  countPendingReminders,
  countWorkspaceRecords,
  markReminderRead,
  createBusiness: (values) => create("businesses", values),
  createContact: (values) => create("contacts", values),
  createOpportunity: (values) => create("opportunities", values),
  createActivity: (values) => create("activities", values),
  updateBusiness: (id, values) => update("businesses", id, values),
  updateContact: (id, values) => update("contacts", id, values),
  updateOpportunity: (id, values) => update("opportunities", id, values)
});
