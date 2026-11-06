import { MajestiosCRM } from "./crm-client.js";

const status = document.querySelector("#crm-status");
const sessionIndicator = document.querySelector("#crm-session-indicator");
const sessionLabel = document.querySelector("#crm-session-label");
const signoutButton = document.querySelector("#crm-signout");
const accountEmail = document.querySelector("#crm-account-email");
const organizationName = document.querySelector("#crm-organization-name");
const accountRole = document.querySelector("#crm-account-role");
const adminPanel = document.querySelector("#crm-admin-panel");
function updateSessionIndicator(session) {
  if (!sessionIndicator || !sessionLabel) return;
  sessionIndicator.classList.remove("is-checking", "is-connected", "is-disconnected");
  if (session) {
    sessionIndicator.classList.add("is-connected");
    sessionLabel.textContent = "Connecté au CRM";
    if (accountEmail) accountEmail.textContent = session.user?.email || "Compte authentifié";
    if (signoutButton) signoutButton.disabled = false;
  } else {
    sessionIndicator.classList.add("is-disconnected");
    sessionLabel.textContent = "Déconnecté";
    if (accountEmail) accountEmail.textContent = "Aucun compte connecté";
    if (signoutButton) signoutButton.disabled = true;
    if (organizationName) organizationName.textContent = "Organisation : aucune session";
    if (accountRole) accountRole.textContent = "Rôle : indisponible";
    if (adminPanel) adminPanel.hidden = true;
  }
}

const setStatus = (message, error = false) => {
  status.textContent = message;
  status.dataset.state = error ? "error" : "success";
};
const renderSelect = (selector, rows, label, placeholder) => {
  const select = document.querySelector(selector);
  if (!select) return;
  const currentValue = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  rows.forEach(row => select.add(new Option(label(row), row.id)));
  if (rows.some(row => row.id === currentValue)) select.value = currentValue;
};
const makeField = (name, caption, value, type = "text", options = null) => {
  const wrapper = document.createElement("label");
  wrapper.className = "form-field";
  wrapper.append(document.createTextNode(caption));
  let control;
  if (options) {
    control = document.createElement("select");
    options.forEach(([label, optionValue]) => control.add(new Option(label, optionValue)));
  } else if (type === "textarea") control = document.createElement("textarea");
  else { control = document.createElement("input"); control.type = type; }
  control.name = name;
  control.value = type === "datetime-local" && value ? String(value).slice(0, 16) : (value ?? "");
  wrapper.append(control);
  return wrapper;
};
const editConfigs = {
  business: {
    title: "Modifier / qualifier l’entreprise",
    fields: [
      ["legal_name", "Raison sociale"], ["trade_name", "Nom commercial"], ["siren", "SIREN"],
      ["siret", "SIRET"], ["ape_naf", "Code APE / NAF"], ["website", "Site web", "url"],
      ["city", "Ville"], ["department_code", "Département"],
      ["qualification_status", "Qualification", null, [["À examiner", "to_review"], ["En cours", "in_progress"], ["Qualifiée", "qualified"], ["Non qualifiée", "not_qualified"], ["Ne pas contacter", "do_not_contact"]]],
      ["qualification_notes", "Notes de qualification", "textarea"]
    ],
    update: MajestiosCRM.updateBusiness
  },
  contact: {
    title: "Modifier le contact",
    fields: [
      ["last_name", "Nom"], ["first_name", "Prénom"], ["job_title", "Fonction"],
      ["email", "E-mail", "email"], ["phone", "Téléphone", "tel"],
      ["consent_status", "Statut du consentement", null, [["Inconnu", "unknown"], ["Fourni", "provided"], ["Retiré", "withdrawn"], ["Non applicable", "not_applicable"]]]
    ],
    update: MajestiosCRM.updateContact
  },
  opportunity: {
    title: "Qualifier l’opportunité",
    fields: [
      ["title", "Intitulé"], ["description", "Description", "textarea"],
      ["status", "Étape commerciale", null, [["Détectée", "detected"], ["À qualifier", "to_qualify"], ["Qualifiée", "qualified"], ["À contacter", "to_contact"], ["Contactée", "contacted"], ["Rendez-vous", "meeting"], ["Proposition", "proposal"], ["Gagnée", "won"], ["Perdue", "lost"], ["Archivée", "archived"]]],
      ["qualification_score", "Score (0 à 100)", "number"], ["qualification_summary", "Synthèse de qualification", "textarea"],
      ["next_action", "Prochaine action"], ["next_action_at", "Échéance", "datetime-local"]
    ],
    update: MajestiosCRM.updateOpportunity
  }
};
function renderEditableList(selector, rows, label, kind, canEdit) {
  const list = document.querySelector(selector);
  list.replaceChildren();
  rows.forEach(row => {
    const item = document.createElement("li");
    item.dataset.recordId = row.id;
    const text = document.createElement("span");
    text.textContent = label(row);
    item.append(text);
    if (canEdit) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = kind === "opportunity" ? "Qualifier" : "Modifier";
      details.append(summary);
      const config = editConfigs[kind];
      const form = document.createElement("form");
      form.className = "crm-inline-edit";
      const heading = document.createElement("strong");
      heading.textContent = config.title;
      form.append(heading);
      config.fields.forEach(([name, caption, type, options]) => form.append(makeField(name, caption, row[name], type || "text", options || null)));
      const button = document.createElement("button");
      button.type = "submit";
      button.className = "button button-primary";
      button.textContent = "Enregistrer les modifications";
      form.append(button);
      form.addEventListener("submit", async event => {
        event.preventDefault();
        button.disabled = true;
        try {
          const values = Object.fromEntries(new FormData(form).entries());
          if (kind === "business" && !values.legal_name.trim()) throw new Error("La raison sociale est obligatoire.");
          if (kind === "contact" && !values.last_name.trim()) throw new Error("Le nom est obligatoire.");
          if (kind === "opportunity" && !values.title.trim()) throw new Error("L’intitulé est obligatoire.");
          if (kind === "opportunity" && values.qualification_score === "") values.qualification_score = null;
          if (kind === "opportunity" && Object.hasOwn(values, "next_action_at")) {
            values.next_action_at = values.next_action_at ? new Date(values.next_action_at).toISOString() : null;
          }
          const result = await config.update(row.id, values);
          await refresh(true);
          setStatus(result.historyRecorded ? "Modification enregistrée et ajoutée à l’historique." : "Fiche modifiée, mais l’historique n’a pas pu être enregistré. Vérifiez les droits CRM.", !result.historyRecorded);
        } catch (error) { setStatus(error.message || "Modification impossible.", true); }
        finally { button.disabled = false; }
      });
      details.append(form);
      item.append(details);
    }
    list.append(item);
  });
}

function renderPersistentReminders(reminders, canEdit) {
  const list = document.getElementById("crm-persistent-reminders");
  const count = document.getElementById("crm-persistent-reminders-count");
  if (!list || !count) return;
  list.replaceChildren();
  count.textContent = String(reminders.length);
  if (!reminders.length) {
    const empty = document.createElement("li");
    empty.textContent = "Aucune relance persistante en attente.";
    list.append(empty);
    return;
  }
  reminders.forEach(reminder => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = reminder.title;
    const action = document.createElement("p");
    action.textContent = reminder.action;
    const date = document.createElement("time");
    date.dateTime = reminder.due_at;
    date.textContent = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(reminder.due_at));
    item.append(title, action, date);
    if (canEdit) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button-secondary";
      button.textContent = "Marquer comme traitée";
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          await MajestiosCRM.markReminderRead(reminder.id);
          await refresh(canEdit);
          setStatus("Relance traitée et ajoutée à l’historique commercial.");
        } catch (error) {
          button.disabled = false;
          setStatus(error.message || "Impossible de mettre à jour la relance.", true);
        }
      });
      item.append(button);
    }
    list.append(item);
  });
}

function renderFollowups(opportunities) {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const groups = { overdue: [], today: [], upcoming: [], unplanned: [] };
  const closedStatuses = new Set(["won", "lost", "archived"]);
  opportunities.filter(row => !closedStatuses.has(row.status)).forEach(row => {
    const hasAction = Boolean(row.next_action && row.next_action.trim());
    const due = row.next_action_at ? new Date(row.next_action_at) : null;
    if (!hasAction || !due || Number.isNaN(due.getTime())) groups.unplanned.push(row);
    else if (due < now && due < dayStart) groups.overdue.push(row);
    else if (due >= dayStart && due < dayEnd) groups.today.push(row);
    else if (due >= dayEnd) groups.upcoming.push(row);
    else groups.today.push(row);
  });
  const labels = {
    overdue: "crm-followup-overdue", today: "crm-followup-today",
    upcoming: "crm-followup-upcoming", unplanned: "crm-followup-unplanned"
  };
  Object.entries(groups).forEach(([key, rows]) => {
    const list = document.getElementById(labels[key]);
    const count = document.getElementById(labels[key] + "-count");
    list.replaceChildren();
    count.textContent = String(rows.length);
    if (!rows.length) {
      const empty = document.createElement("li");
      empty.textContent = key === "unplanned" ? "Aucune opportunité à planifier." : "Aucune relance.";
      list.append(empty);
      return;
    }
    rows.sort((a, b) => {
      const aTime = a.next_action_at ? new Date(a.next_action_at).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.next_action_at ? new Date(b.next_action_at).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
    rows.forEach(row => {
      const item = document.createElement("li");
      const heading = document.createElement("strong");
      heading.textContent = row.title;
      const detail = document.createElement("p");
      detail.textContent = row.next_action || "Aucune prochaine action définie.";
      const date = document.createElement("time");
      if (row.next_action_at) {
        date.dateTime = row.next_action_at;
        date.textContent = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.next_action_at));
      } else date.textContent = "Échéance non définie";
      const open = document.createElement("button");
      open.type = "button";
      open.className = "button button-secondary";
      open.textContent = "Ouvrir la fiche";
      open.addEventListener("click", () => {
        const record = document.querySelector("#crm-opportunity-list li[data-record-id='" + row.id + "']");
        const details = record?.querySelector("details");
        if (details) {
          details.open = true;
          record.scrollIntoView({ behavior: "smooth", block: "center" });
        } else setStatus("Cette fiche est disponible en consultation seule.", false);
      });
      item.append(heading, detail, date, open);
      list.append(item);
    });
  });
}


const reminderButton = document.getElementById("crm-enable-reminders");
const reminderStatus = document.getElementById("crm-reminder-status");
const notifiedReminders = new Set();
function sendDueReminders(opportunities) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  opportunities.forEach(row => {
    if (["won", "lost", "archived"].includes(row.status) || !row.next_action || !row.next_action_at) return;
    const due = new Date(row.next_action_at);
    if (Number.isNaN(due.getTime()) || due >= tomorrowStart) return;
    const key = row.id + ":" + todayStart.toISOString().slice(0, 10);
    if (notifiedReminders.has(key)) return;
    notifiedReminders.add(key);
    const overdue = due < now && due < todayStart;
    const notification = new Notification(overdue ? "Relance commerciale en retard" : "Relance commerciale à traiter", {
      body: row.title + " — " + row.next_action,
      tag: "majestios-crm-" + key,
      renotify: false
    });
    notification.addEventListener("click", () => {
      window.focus();
      const record = document.querySelector("#crm-opportunity-list li[data-record-id='" + row.id + "']");
      const details = record?.querySelector("details");
      if (details) details.open = true;
      record?.scrollIntoView({ behavior: "smooth", block: "center" });
      notification.close();
    });
  });
}
if (reminderButton && reminderStatus) {
  if (!("Notification" in window)) {
    reminderButton.disabled = true;
    reminderStatus.textContent = "Les notifications de navigateur ne sont pas prises en charge sur cet appareil.";
  } else if (Notification.permission === "granted") {
    reminderButton.textContent = "Alertes activées sur cet appareil";
    reminderStatus.textContent = "Les relances en retard et prévues aujourd’hui déclenchent une alerte lorsque le CRM est ouvert.";
    reminderButton.disabled = true;
  } else if (Notification.permission === "denied") {
    reminderStatus.textContent = "Notifications bloquées par le navigateur. Modifiez l’autorisation dans les réglages du site.";
  }
  reminderButton.addEventListener("click", async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      reminderButton.textContent = "Alertes activées sur cet appareil";
      reminderButton.disabled = true;
      reminderStatus.textContent = "Alertes activées : les relances urgentes seront signalées lorsque le CRM est ouvert.";
      sendDueReminders(await MajestiosCRM.listOpportunities());
    } else {
      reminderStatus.textContent = permission === "denied"
        ? "Notifications refusées. Autorisez-les dans les réglages du navigateur."
        : "Autorisation non accordée. Vous pourrez réessayer plus tard.";
    }
  });
}

async function refreshAdminMembers() {
  const list = document.getElementById("crm-admin-member-list");
  const status = document.getElementById("crm-admin-member-status");
  if (!list || !adminPanel || adminPanel.hidden) return;
  list.replaceChildren();
  try {
    const members = await MajestiosCRM.listInternalMembers();
    if (!members.length) {
      const empty = document.createElement("li");
      empty.textContent = "Aucun membre trouvé.";
      list.append(empty);
      return;
    }
    members.forEach(member => {
      const item = document.createElement("li");
      item.className = "crm-admin-member";
      const identity = document.createElement("div");
      const id = document.createElement("code");
      id.textContent = member.user_id;
      const meta = document.createElement("span");
      meta.textContent = "Ajouté le " + new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(member.created_at));
      identity.append(id, meta);
      const controls = document.createElement("div");
      controls.className = "crm-admin-member-controls";
      const role = document.createElement("select");
      role.setAttribute("aria-label", "Rôle du membre " + member.user_id);
      [["owner","Propriétaire"],["admin","Administrateur"],["member","Membre"],["viewer","Consultation seule"]].forEach(([value,label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        role.append(option);
      });
      role.value = member.role;
      role.disabled = member.role === "owner" || member.user_id === (await MajestiosCRM.requireWorkspace()).session.user.id;
      const save = document.createElement("button");
      save.type = "button";
      save.className = "button button-secondary";
      save.textContent = "Enregistrer";
      save.disabled = role.disabled;
      save.addEventListener("click", async () => {
        save.disabled = true;
        try {
          await MajestiosCRM.setInternalMemberRole(member.id, role.value);
          if (status) status.textContent = "Rôle mis à jour. Le changement est consigné.";
          await refreshAdminMembers();
        } catch (error) {
          if (status) status.textContent = error.message || "Modification du rôle impossible.";
          save.disabled = false;
        }
      });
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "button button-secondary";
      remove.textContent = "Retirer";
      remove.disabled = role.disabled;
      remove.addEventListener("click", async () => {
        if (!window.confirm("Retirer ce membre de l’organisation interne ? Son compte d’authentification ne sera pas supprimé.")) return;
        remove.disabled = true;
        try {
          await MajestiosCRM.removeInternalMember(member.id);
          if (status) status.textContent = "Accès interne retiré. Le compte Auth est conservé.";
          await refreshAdminMembers();
        } catch (error) {
          if (status) status.textContent = error.message || "Retrait impossible.";
          remove.disabled = false;
        }
      });
      controls.append(role, save, remove);
      item.append(identity, controls);
      list.append(item);
    });
  } catch (error) {
    if (status) status.textContent = error.message || "Chargement des habilitations impossible.";
    const item = document.createElement("li");
    item.textContent = "Les habilitations ne sont pas disponibles.";
    list.append(item);
  }
}

async function refresh(canEdit = false) {
  const [businesses, contacts, opportunities, activities] = await Promise.all([
    MajestiosCRM.listBusinesses(), MajestiosCRM.listContacts(),
    MajestiosCRM.listOpportunities(), MajestiosCRM.listActivities()
  ]);
  document.querySelector("#crm-business-count").textContent = businesses.length;
  document.querySelector("#crm-contact-count").textContent = contacts.length;
  document.querySelector("#crm-opportunity-count").textContent = opportunities.length;
  document.querySelector("#crm-activity-count").textContent = activities.length;
  const adminMetrics = {
    "#crm-admin-business-count": businesses.length,
    "#crm-admin-contact-count": contacts.length,
    "#crm-admin-opportunity-count": opportunities.filter(row => !["won", "lost", "archived"].includes(row.status)).length,
    "#crm-admin-activity-count": activities.length
  };
  Object.entries(adminMetrics).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = String(value);
  });
  renderEditableList("#crm-business-list", businesses, row => (row.trade_name || row.legal_name) + " · " + row.qualification_status, "business", canEdit);
  renderEditableList("#crm-contact-list", contacts, row => [row.first_name, row.last_name].filter(Boolean).join(" ") + (row.email ? " · " + row.email : ""), "contact", canEdit);
  renderEditableList("#crm-opportunity-list", opportunities, row => row.title + " · " + row.status, "opportunity", canEdit);
  renderFollowups(opportunities);
  const reminders = await MajestiosCRM.listReminders();
  const adminReminderCount = document.querySelector("#crm-admin-reminder-count");
  if (adminReminderCount) adminReminderCount.textContent = String(reminders.filter(row => row.state === "pending").length);
  renderPersistentReminders(reminders, canEdit);
  sendDueReminders(opportunities);
  const activityList = document.querySelector("#crm-activity-list");
  activityList.replaceChildren();
  const businessById = new Map(businesses.map(row => [row.id, row.trade_name || row.legal_name]));
  const contactById = new Map(contacts.map(row => [row.id, [row.first_name, row.last_name].filter(Boolean).join(" ")]));
  const opportunityById = new Map(opportunities.map(row => [row.id, row.title]));
  const activityTypes = {
    note: "Note", call: "Appel", email: "E-mail", meeting: "Rendez-vous",
    task: "Tâche", status_change: "Changement d’étape",
    qualification: "Qualification", system: "Système"
  };
  activities.forEach(row => {
    const item = document.createElement("li");
    item.className = "crm-timeline-entry";
    const heading = document.createElement("strong");
    heading.textContent = row.subject;
    const type = document.createElement("span");
    type.className = "crm-timeline-type";
    type.textContent = activityTypes[row.activity_type] || row.activity_type;
    const detail = document.createElement("p");
    detail.textContent = row.body || "Aucun détail complémentaire.";
    const related = [];
    if (row.business_id) related.push("Entreprise : " + (businessById.get(row.business_id) || "fiche associée"));
    if (row.contact_id) related.push("Contact : " + (contactById.get(row.contact_id) || "fiche associée"));
    if (row.opportunity_id) related.push("Opportunité : " + (opportunityById.get(row.opportunity_id) || "fiche associée"));
    const context = document.createElement("p");
    context.className = "crm-timeline-context";
    context.textContent = related.join(" · ");
    const date = document.createElement("time");
    date.dateTime = row.occurred_at;
    date.textContent = row.occurred_at ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.occurred_at)) : "";
    item.append(type, heading, detail);
    if (related.length) item.append(context);
    item.append(date);
    activityList.append(item);
  });
  renderSelect("#crm-contact-form [name=business_id]", businesses, row => row.trade_name || row.legal_name, "Aucune entreprise associée");
  renderSelect("#crm-opportunity-form [name=business_id]", businesses, row => row.trade_name || row.legal_name, "Aucune entreprise associée");
  renderSelect("#crm-opportunity-form [name=primary_contact_id]", contacts, row => [row.first_name, row.last_name].filter(Boolean).join(" "), "Aucun contact principal");
  renderSelect("#crm-activity-form [name=business_id]", businesses, row => row.trade_name || row.legal_name, "Aucune entreprise associée");
  renderSelect("#crm-activity-form [name=contact_id]", contacts, row => [row.first_name, row.last_name].filter(Boolean).join(" "), "Aucun contact associé");
  renderSelect("#crm-activity-form [name=opportunity_id]", opportunities, row => row.title, "Aucune opportunité associée");
}
function bindForm(id, create, values) {
  const form = document.querySelector(id);
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      await create(values(data));
      form.reset();
      await refresh(true);
      setStatus("Enregistrement effectué dans votre CRM.");
    } catch (error) { setStatus(error.message || "Enregistrement impossible.", true); }
    finally { button.disabled = false; }
  });
}
const nullableId = value => value || null;
try {
  const { session, membership, organization } = await MajestiosCRM.requireWorkspace();
  updateSessionIndicator(session);
  if (organizationName) organizationName.textContent = "Organisation : " + organization.name;
  if (accountRole) accountRole.textContent = "Rôle : " + membership.role;
  if (adminPanel) adminPanel.hidden = !["owner", "admin"].includes(membership.role);
  const isReadOnly = membership.role === "viewer";
  if (isReadOnly) {
    document.querySelectorAll("#crm-business-form, #crm-contact-form, #crm-opportunity-form, #crm-activity-form")
      .forEach(form => form.querySelectorAll("input, textarea, select, button").forEach(control => control.disabled = true));
    setStatus("Espace interne connecté · consultation seule.");
  } else {
    setStatus("Espace interne connecté · " + organization.name + " · rôle : " + membership.role);
    bindForm("#crm-business-form", MajestiosCRM.createBusiness, data => ({ legal_name: data.legal_name.trim(), website: data.website || null, city: data.city || null, country_code: "FR", qualification_status: "to_review" }));
    bindForm("#crm-contact-form", MajestiosCRM.createContact, data => ({ business_id: nullableId(data.business_id), last_name: data.last_name.trim(), first_name: data.first_name || null, email: data.email || null, phone: data.phone || null, consent_status: "unknown" }));
    bindForm("#crm-opportunity-form", MajestiosCRM.createOpportunity, data => ({ business_id: nullableId(data.business_id), primary_contact_id: nullableId(data.primary_contact_id), title: data.title.trim(), description: data.description || null, source_type: data.source_type, status: "detected" }));
    bindForm("#crm-activity-form", MajestiosCRM.createActivity, data => ({ business_id: nullableId(data.business_id), contact_id: nullableId(data.contact_id), opportunity_id: nullableId(data.opportunity_id), subject: data.subject.trim(), activity_type: data.activity_type, body: data.body || null }));
  }
  await refresh(!isReadOnly);\n  if (["owner", "admin"].includes(membership.role)) await refreshAdminMembers();
} catch (error) {
  setStatus(error.message || "Connexion au CRM impossible.", true);
  document.querySelectorAll("#crm-business-form, #crm-contact-form, #crm-opportunity-form, #crm-activity-form")
    .forEach(form => form.querySelectorAll("input, textarea, select, button").forEach(control => control.disabled = true));
}

document.getElementById("crm-admin-refresh-members")?.addEventListener("click", refreshAdminMembers);\n\nsignoutButton?.addEventListener("click", async () => {
  signoutButton.disabled = true;
  const { error } = await MajestiosCRM.auth.signOut();
  if (error) {
    signoutButton.disabled = false;
    setStatus("La déconnexion n’a pas abouti. Réessayez.", true);
  } else {
    updateSessionIndicator(null);
    setStatus("Vous êtes déconnecté du CRM. Reconnectez-vous depuis l’espace membre.", true);
    document.querySelectorAll("#crm-business-form, #crm-contact-form, #crm-opportunity-form, #crm-activity-form")
      .forEach(form => form.querySelectorAll("input, textarea, select, button").forEach(control => control.disabled = true));
  }
});

MajestiosCRM.auth.onAuthStateChange((event, session) => {
  window.setTimeout(() => {
    updateSessionIndicator(session);
    if (event === "SIGNED_OUT") {
      setStatus("Session terminée. Le CRM est verrouillé jusqu’à votre prochaine connexion.", true);
      document.querySelectorAll("#crm-business-form, #crm-contact-form, #crm-opportunity-form, #crm-activity-form")
        .forEach(form => form.querySelectorAll("input, textarea, select, button").forEach(control => control.disabled = true));
      document.querySelectorAll("#crm-business-list, #crm-contact-list, #crm-opportunity-list, #crm-activity-list, #crm-persistent-reminders, #crm-followup-overdue, #crm-followup-today, #crm-followup-upcoming, #crm-followup-unplanned")
        .forEach(list => list.replaceChildren());
    } else if (event === "TOKEN_REFRESHED" && session) {
      setStatus("Session CRM active · connexion sécurisée renouvelée.");
    }
  }, 0);
});

