import { MajestiosCRM } from "./crm-client.js";

const status = document.querySelector("#crm-status");
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

const relationSelectors = [
  ["#crm-contact-form [name=business_id]", "businesses", row => row.trade_name || row.legal_name, "Entreprise", "Aucune entreprise associée", null],
  ["#crm-opportunity-form [name=business_id]", "businesses", row => row.trade_name || row.legal_name, "Entreprise", "Aucune entreprise associée", null],
  ["#crm-opportunity-form [name=primary_contact_id]", "contacts", row => [row.first_name, row.last_name].filter(Boolean).join(" "), "Contact principal", "Aucun contact principal", "#crm-opportunity-form [name=business_id]"],
  ["#crm-activity-form [name=business_id]", "businesses", row => row.trade_name || row.legal_name, "Entreprise", "Aucune entreprise associée", null],
  ["#crm-activity-form [name=contact_id]", "contacts", row => [row.first_name, row.last_name].filter(Boolean).join(" "), "Contact associé", "Aucun contact associé", "#crm-activity-form [name=business_id]"],
  ["#crm-activity-form [name=opportunity_id]", "opportunities", row => row.title, "Opportunité", "Aucune opportunité associée", "#crm-activity-form [name=business_id]"]
];

function setupRemoteRelationSelect(selector, table, label, caption, placeholder, dependencySelector) {
  const select = document.querySelector(selector);
  if (!select || select.dataset.remoteReady === "true") return;
  select.dataset.remoteReady = "true";
  const search = document.createElement("input");
  search.type = "search";
  search.className = "crm-relation-search";
  search.placeholder = "Rechercher " + caption.toLowerCase() + "…";
  search.setAttribute("aria-label", "Rechercher " + caption.toLowerCase());
  const controls = document.createElement("div");
  controls.className = "crm-relation-pagination";
  const previous = document.createElement("button");
  previous.type = "button"; previous.textContent = "Précédent"; previous.disabled = true;
  const next = document.createElement("button");
  next.type = "button"; next.textContent = "Suivant"; next.disabled = true;
  const pageStatus = document.createElement("span");
  pageStatus.setAttribute("aria-live", "polite");
  controls.append(previous, pageStatus, next);
  const field = select.closest(".form-field");
  if (field) field.insertAdjacentElement("afterend", search);
  else select.insertAdjacentElement("afterend", search);
  search.insertAdjacentElement("afterend", controls);
  const dependency = dependencySelector ? document.querySelector(dependencySelector) : null;
  const state = { page: 0, pageCount: 0, search: "", request: 0 };
  const load = async () => {
    const request = ++state.request;
    pageStatus.textContent = "Chargement…";
    previous.disabled = next.disabled = true;
    try {
      const result = table === "businesses"
        ? await MajestiosCRM.listBusinessesPage({ page: state.page, pageSize: 25, search: state.search })
        : await MajestiosCRM.listWorkspaceRecordsPage({ table, page: state.page, pageSize: 25, search: state.search, businessId: dependency?.value || "" });
      if (request !== state.request) return;
      const currentValue = select.value;
      const currentOption = currentValue ? [...select.options].find(option => option.value === currentValue) : null;
      select.replaceChildren(new Option(placeholder, ""));
      if (currentOption && !result.rows.some(row => row.id === currentValue)) {
        select.add(new Option(currentOption.textContent, currentValue));
      }
      result.rows.forEach(row => select.add(new Option(label(row) || "Sans intitulé", row.id)));
      if (currentValue) select.value = currentValue;
      state.page = result.page; state.pageCount = result.pageCount;
      pageStatus.textContent = result.total + " résultat(s) · page " + (result.total ? result.page + 1 : 0) + "/" + result.pageCount;
      previous.disabled = result.page <= 0;
      next.disabled = result.pageCount === 0 || result.page >= result.pageCount - 1;
    } catch (error) {
      if (request !== state.request) return;
      pageStatus.textContent = error.message || "Recherche indisponible.";
    }
  };
  if (dependency) dependency.addEventListener("change", () => {
    select.value = "";
    state.page = 0;
    load();
  });
  let timer;
  search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.search = search.value; state.page = 0; load(); }, 250);
  });
  previous.addEventListener("click", () => { if (state.page > 0) { state.page -= 1; load(); } });
  next.addEventListener("click", () => { if (state.page + 1 < state.pageCount) { state.page += 1; load(); } });
  load();
}
function setupRemoteRelationSelectors() {
  relationSelectors.forEach(([selector, table, label, caption, placeholder, dependency]) =>
    setupRemoteRelationSelect(selector, table, label, caption, placeholder, dependency));
}

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
async function loadBusinessRelatedSection(section, businessId, pageIndex) {
  const table = section.dataset.relatedTable;
  const list = section.querySelector(".crm-business-related-list");
  const resultStatus = section.querySelector(".crm-business-related-status");
  const [previous, next] = section.querySelectorAll("button");
  section.dataset.loading = "true";
  resultStatus.textContent = "Chargement des éléments associés…";
  previous.disabled = true;
  next.disabled = true;
  try {
    const result = await MajestiosCRM.listBusinessRelatedPage({
      businessId, table, page: pageIndex, pageSize: 10
    });
    section.dataset.relatedPage = String(result.page);
    section.dataset.loaded = "true";
    list.replaceChildren();
    const formatRow = row => {
      if (table === "contacts") {
        return [ [row.first_name, row.last_name].filter(Boolean).join(" "), row.job_title, row.email, row.phone ].filter(Boolean).join(" · ");
      }
      if (table === "opportunities") {
        return [row.title, row.status, row.next_action].filter(Boolean).join(" · ");
      }
      return [row.subject, row.activity_type, row.occurred_at
        ? new Intl.DateTimeFormat("fr-FR", {dateStyle:"medium", timeStyle:"short"}).format(new Date(row.occurred_at))
        : ""].filter(Boolean).join(" · ");
    };
    if (!result.rows.length) {
      const empty = document.createElement("li");
      empty.textContent = "Aucun élément associé.";
      list.append(empty);
    } else result.rows.forEach(row => {
      const item = document.createElement("li");
      item.textContent = formatRow(row) || "Élément associé";
      list.append(item);
    });
    resultStatus.textContent = result.total
      ? result.total + " élément(s) · page " + (result.page + 1) + " sur " + result.pageCount
      : "Aucun élément associé à cette entreprise.";
    previous.disabled = result.page <= 0;
    next.disabled = result.pageCount === 0 || result.page >= result.pageCount - 1;
  } catch (error) {
    section.dataset.loaded = "false";
    resultStatus.textContent = error.message || "Impossible de charger les éléments associés.";
  } finally {
    section.dataset.loading = "false";
  }
}

function renderEditableList(selector, rows, label, kind, canEdit, related = {}) {
  const list = document.querySelector(selector);
  list.replaceChildren();
  rows.forEach(row => {
    const item = document.createElement("li");
    item.dataset.recordId = row.id;
    const text = document.createElement("span");
    text.textContent = label(row);
    item.append(text);
    if (kind === "contact") {
      const profile = document.createElement("details");
      profile.className = "crm-contact-profile";
      const profileSummary = document.createElement("summary");
      profileSummary.textContent = "Ouvrir la fiche contact";
      profile.append(profileSummary);

      const fields = document.createElement("dl");
      fields.className = "crm-contact-profile-fields";
      const business = (related.businesses || []).find(company => company.id === row.business_id);
      const profileFields = [
        ["Prénom", row.first_name],
        ["Nom", row.last_name],
        ["Fonction", row.job_title],
        ["Entreprise", business ? (business.trade_name || business.legal_name) : (row.business_id ? "Entreprise associée — nom non chargé dans cette page" : "")],
        ["E-mail", row.email],
        ["Téléphone", row.phone],
        ["Consentement", row.consent_status],
        ["Provenance", row.source_label],
        ["Créé le", row.created_at ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(row.created_at)) : ""]
      ];
      profileFields.forEach(([caption, value]) => {
        if (value === null || value === undefined || value === "") return;
        const term = document.createElement("dt");
        term.textContent = caption;
        const description = document.createElement("dd");
        if (caption === "E-mail") {
          const link = document.createElement("a");
          link.href = "mailto:" + value;
          link.textContent = value;
          description.append(link);
        } else if (caption === "Téléphone") {
          const link = document.createElement("a");
          link.href = "tel:" + String(value).replace(/[^+\d]/g, "");
          link.textContent = value;
          description.append(link);
        } else {
          description.textContent = value;
        }
        fields.append(term, description);
      });
      profile.append(fields);
      item.append(profile);
    }
    if (kind === "business") {
      const searchParts = [row.legal_name, row.trade_name, row.siren, row.siret, row.ape_naf, row.city, row.department_code, row.qualification_notes];
      item.dataset.searchText = searchParts.filter(Boolean).join(" ").toLocaleLowerCase("fr-FR");
      item.dataset.qualificationStatus = row.qualification_status || "";
      item.dataset.departmentCode = row.department_code || "";
      const metadata = document.createElement("p");
      metadata.className = "crm-business-metadata";
      const details = [
        row.siren ? "SIREN " + row.siren : "",
        row.ape_naf ? "APE/NAF " + row.ape_naf : "",
        row.city || "",
        row.department_code ? "Département " + row.department_code : ""
      ].filter(Boolean);
      metadata.textContent = details.length ? details.join(" · ") : "Informations d’identification à compléter.";
      item.append(metadata);
      const dossier = document.createElement("details");
      dossier.className = "crm-business-dossier";
      const dossierSummary = document.createElement("summary");
      dossierSummary.textContent = "Ouvrir le dossier entreprise";
      dossier.append(dossierSummary);

      const identity = document.createElement("dl");
      identity.className = "crm-business-identity";
      const identityFields = [
        ["Raison sociale", row.legal_name], ["Nom commercial", row.trade_name],
        ["SIREN", row.siren], ["SIRET", row.siret], ["TVA intracommunautaire", row.vat_number],
        ["APE / NAF", row.ape_naf], ["Adresse", row.address_line],
        ["Code postal", row.postal_code], ["Ville", row.city],
        ["Département", row.department_code], ["Pays", row.country_code],
        ["Site web", row.website], ["Source", row.source_label],
        ["Lien source", row.source_url], ["Responsable interne", row.assigned_to],
        ["Qualification", row.qualification_status], ["Notes", row.qualification_notes]
      ];
      identityFields.forEach(([caption, value]) => {
        if (value === null || value === undefined || value === "") return;
        const term = document.createElement("dt");
        term.textContent = caption;
        const description = document.createElement("dd");
        if (caption === "Site web" || caption === "Lien source") {
          try {
            const url = new URL(value);
            if (url.protocol === "https:" || url.protocol === "http:") {
              const link = document.createElement("a");
              link.href = url.href;
              link.target = "_blank";
              link.rel = "noopener noreferrer";
              link.textContent = value;
              description.append(link);
            } else description.textContent = value;
          } catch { description.textContent = value; }
        } else description.textContent = value;
        identity.append(term, description);
      });
      dossier.append(identity);

      const relatedTables = [
        ["Contacts associés", "contacts"],
        ["Opportunités associées", "opportunities"],
        ["Activités et historique", "activities"]
      ];
      relatedTables.forEach(([headingText, table]) => {
        const section = document.createElement("section");
        section.className = "crm-business-related";
        section.dataset.relatedTable = table;
        section.dataset.relatedPage = "0";
        const heading = document.createElement("h4");
        heading.textContent = headingText;
        const resultStatus = document.createElement("p");
        resultStatus.className = "crm-business-related-status";
        resultStatus.setAttribute("aria-live", "polite");
        resultStatus.textContent = "Ouvrez le dossier pour charger les éléments associés.";
        const relatedList = document.createElement("ul");
        relatedList.className = "crm-business-related-list";
        const controls = document.createElement("div");
        controls.className = "crm-business-related-pagination";
        const previous = document.createElement("button");
        previous.type = "button";
        previous.className = "button button-secondary";
        previous.textContent = "Précédent";
        previous.disabled = true;
        const next = document.createElement("button");
        next.type = "button";
        next.className = "button button-secondary";
        next.textContent = "Suivant";
        next.disabled = true;
        previous.addEventListener("click", () => loadBusinessRelatedSection(section, row.id, Math.max(0, Number(section.dataset.relatedPage || 0) - 1)));
        next.addEventListener("click", () => loadBusinessRelatedSection(section, row.id, Number(section.dataset.relatedPage || 0) + 1));
        controls.append(previous, next);
        section.append(heading, resultStatus, relatedList, controls);
        dossier.append(section);
      });
      dossier.addEventListener("toggle", () => {
        if (!dossier.open) return;
        dossier.querySelectorAll("[data-related-table]").forEach(section => {
          if (section.dataset.loaded !== "true" && section.dataset.loading !== "true") {
            loadBusinessRelatedSection(section, row.id, 0);
          }
        });
      });
      item.append(dossier);
    }
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

let targetingCandidates = [];
let businessPageIndex = 0;
const businessPageSize = 25;
let businessPageCount = 0;
const workspacePageSize = 25;
const workspacePages = {
  contacts: { page: 0, pageCount: 0, canEdit: false },
  opportunities: { page: 0, pageCount: 0, canEdit: false },
  activities: { page: 0, pageCount: 0, canEdit: false }
};
let businessRelatedData = { contacts: [], opportunities: [], activities: [] };
let businessRecordsCanEdit = false;

async function refresh(canEdit = false) {
  const [businesses, contacts, opportunities, activities] = await Promise.all([
    MajestiosCRM.listBusinesses(), MajestiosCRM.listContacts(),
    MajestiosCRM.listOpportunities(), MajestiosCRM.listActivities()
  ]);
  businessRelatedData = { businesses, contacts, opportunities, activities };
  businessRecordsCanEdit = canEdit;
  const [contactCount, opportunityCount, activityCount] = await Promise.all([
    MajestiosCRM.countWorkspaceRecords("contacts"),
    MajestiosCRM.countWorkspaceRecords("opportunities"),
    MajestiosCRM.countWorkspaceRecords("activities")
  ]);
  document.querySelector("#crm-contact-count").textContent = contactCount;
  document.querySelector("#crm-opportunity-count").textContent = opportunityCount;
  document.querySelector("#crm-activity-count").textContent = activityCount;
  const followupNotice = document.getElementById("crm-followup-data-notice");
  if (followupNotice) {
    followupNotice.textContent = opportunityCount > opportunities.length
      ? "Aperçu des relances calculé sur les " + opportunities.length + " premières opportunités chargées sur " + opportunityCount + ". La liste complète reste accessible dans la rubrique Opportunités."
      : "";
  }
  await Promise.all([
    loadBusinessPage(),
    loadWorkspacePage("contacts", true, canEdit),
    loadWorkspacePage("opportunities", true, canEdit),
    loadWorkspacePage("activities", true, canEdit)
  ]);
  renderFollowups(opportunities);
  const [reminders, pendingReminderCount] = await Promise.all([
    MajestiosCRM.listReminders(), MajestiosCRM.countPendingReminders()
  ]);
  renderPersistentReminders(reminders, canEdit);
  if (followupNotice && pendingReminderCount > reminders.length) {
    const reminderWarning = "Affichage limité aux " + reminders.length + " premières relances persistantes sur " + pendingReminderCount + ".";
    followupNotice.textContent = [followupNotice.textContent, reminderWarning].filter(Boolean).join(" ");
  }
  sendDueReminders(opportunities);
  setupRemoteRelationSelectors();
}
function renderActivityTimeline(activities, businesses, contacts, opportunities) {
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
}

async function loadWorkspacePage(table, resetPage = false, canEdit = workspacePages[table].canEdit) {
  const state = workspacePages[table];
  if (resetPage) state.page = 0;
  state.canEdit = canEdit;
  const prefix = table === "opportunities" ? "opportunity" : table === "activities" ? "activity" : "contact";
  const input = document.getElementById(prefix + "-search");
  const result = await MajestiosCRM.listWorkspaceRecordsPage({
    table, page: state.page, pageSize: workspacePageSize, search: input?.value || ""
  });
  if (result.pageCount && state.page >= result.pageCount) {
    state.page = result.pageCount - 1;
    return loadWorkspacePage(table, false, canEdit);
  }
  state.page = result.page;
  state.pageCount = result.pageCount;
  const count = document.getElementById("crm-" + prefix + "-count");
  const status = document.getElementById("crm-" + prefix + "-page-status");
  const previous = document.getElementById("crm-" + prefix + "-previous");
  const next = document.getElementById("crm-" + prefix + "-next");
  count.textContent = String(result.total);
  status.textContent = result.total
    ? "Page " + (result.page + 1) + " sur " + result.pageCount + " · " + result.total + " enregistrement(s)"
    : "Aucun résultat pour cette recherche.";
  previous.disabled = result.page <= 0;
  next.disabled = result.pageCount === 0 || result.page >= result.pageCount - 1;
  if (table === "contacts") {
    renderEditableList("#crm-contact-list", result.rows,
      row => [row.first_name, row.last_name].filter(Boolean).join(" ") + (row.job_title ? " · " + row.job_title : "") + (row.email ? " · " + row.email : ""),
      "contact", canEdit, businessRelatedData);
  } else if (table === "opportunities") {
    renderEditableList("#crm-opportunity-list", result.rows,
      row => row.title + " · " + row.status, "opportunity", canEdit);
  } else {
    renderActivityTimeline(result.rows, businessRelatedData.businesses,
      businessRelatedData.contacts, businessRelatedData.opportunities);
  }
}

async function loadBusinessPage(resetPage = false) {
  if (resetPage) businessPageIndex = 0;
  const search = document.getElementById("crm-business-search");
  const qualification = document.getElementById("crm-business-qualification");
  const department = document.getElementById("crm-business-department");
  const previous = document.getElementById("crm-business-previous");
  const next = document.getElementById("crm-business-next");
  const pageStatus = document.getElementById("crm-business-page-status");
  const count = document.getElementById("crm-business-count");
  const filters = {
    page: businessPageIndex, pageSize: businessPageSize,
    search: search?.value || "", qualification: qualification?.value || "",
    department: department?.value || ""
  };
  let result = await MajestiosCRM.listBusinessesPage(filters);
  if (result.pageCount && businessPageIndex >= result.pageCount) {
    businessPageIndex = result.pageCount - 1;
    result = await MajestiosCRM.listBusinessesPage({ ...filters, page: businessPageIndex });
  }
  businessPageIndex = result.page;
  businessPageCount = result.pageCount;
  renderEditableList("#crm-business-list", result.rows,
    row => (row.trade_name || row.legal_name) + " · " + row.qualification_status,
    "business", businessRecordsCanEdit, businessRelatedData);
  count.textContent = String(result.total);
  pageStatus.textContent = result.total
    ? "Page " + (result.page + 1) + " sur " + result.pageCount + " · " + result.total + " entreprise(s)"
    : "Aucune entreprise ne correspond à cette recherche.";
  previous.disabled = result.page <= 0;
  next.disabled = result.pageCount === 0 || result.page >= result.pageCount - 1;
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
function initMarketTargeting(canEdit) {
  const form = document.getElementById("crm-targeting-form");
  const suggest = document.getElementById("crm-targeting-suggest");
  const suggestions = document.getElementById("crm-targeting-suggestions");
  const status = document.getElementById("crm-targeting-status");
  const results = document.getElementById("crm-targeting-results");
  const importButton = document.getElementById("crm-targeting-import");
  const api = window.MajestiosCompanyTargeting;
  if (!form || !api) return;
  if (!canEdit) {
    form.querySelectorAll("input, textarea, select, button").forEach(control => control.disabled = true);
    importButton.disabled = true;
    status.textContent = "Consultation seule : ciblage et intégration réservés aux rôles autorisés à modifier le CRM.";
    return;
  }
  const parseList = value => [...new Set(String(value || "").split(/[,;\\n]+/).map(item => item.trim()).filter(Boolean))];
  const selected = () => [...results.querySelectorAll('input[data-candidate-index]:checked')].map(input => targetingCandidates[Number(input.dataset.candidateIndex)]).filter(Boolean);
  suggest.addEventListener("click", () => {
    const engine = window.MajestiosNafSuggestions;
    if (!engine) { status.textContent = "Moteur de suggestions APE/NAF indisponible."; return; }
    const values = engine.suggestNafCodes({ title: form.elements.marketTitle.value, description: form.elements.marketDescription.value }, { limit: 8 });
    suggestions.replaceChildren();
    if (!values.length) { suggestions.hidden = true; status.textContent = "Aucune piste lexicale trouvée. Vérifiez les métiers et les codes manuellement."; return; }
    values.forEach(item => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox"; checkbox.value = item.code;
      label.append(checkbox, document.createTextNode(" " + item.code + " — " + item.label + " (indice : " + item.matches.join(", ") + ")"));
      suggestions.append(label, document.createElement("br"));
    });
    const add = document.createElement("button");
    add.type = "button"; add.className = "button button-secondary"; add.textContent = "Ajouter les codes cochés";
    add.addEventListener("click", () => {
      const codes = [...suggestions.querySelectorAll('input:checked')].map(input => input.value);
      form.elements.nafCodes.value = [...new Set([...parseList(form.elements.nafCodes.value), ...codes])].join(", ");
    });
    suggestions.append(add); suggestions.hidden = false;
    status.textContent = "Suggestions lexicales uniquement : vérification humaine obligatoire.";
  });
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const nafCodes = parseList(form.elements.nafCodes.value).map(value => value.toUpperCase());
    const departments = parseList(form.elements.departments.value).map(value => value.toUpperCase());
    if (!nafCodes.length || nafCodes.some(value => !/^\d{2}\.\d{2}[A-Z]$/.test(value)) || !departments.length ||
        departments.some(value => !/^(\d{2}|2A|2B|97[1-6]|978|977|986|987|988)$/.test(value))) {
      status.textContent = "Vérifiez les codes APE/NAF (ex. 43.21A) et les départements."; return;
    }
    const button = form.querySelector('[type="submit"]');
    button.disabled = true; importButton.disabled = true; results.replaceChildren();
    status.textContent = "Recherche en cours auprès de l’API publique Recherche d’Entreprises.";
    try {
      const response = await api.searchCompanies({ nafCodes, departments, perPage: 25, maxPages: 1 });
      let candidates = api.rankCompanies(response.candidates, { nafCodes, departments });
      if (form.elements.activeOnly.checked) candidates = candidates.filter(company => company.active !== false);
      const selectedCandidates = api.selectCandidates(candidates, { nafCodes, departments, limit: Number(form.elements.limit.value), minimumScore: 25 }).candidates;
      const existingMatches = await MajestiosCRM.findBusinessesByIdentifiers({
        sirens: selectedCandidates.map(company => company.siren).filter(Boolean),
        sirets: selectedCandidates.map(company => company.siret).filter(Boolean)
      });
      const existingSiren = new Set(existingMatches.map(row => row.siren).filter(Boolean));
      const existingSiret = new Set(existingMatches.map(row => row.siret).filter(Boolean));
      const alreadyKnown = selectedCandidates.filter(company =>
        (company.siren && existingSiren.has(company.siren)) || (company.siret && existingSiret.has(company.siret)));
      targetingCandidates = selectedCandidates.filter(company =>
        !(company.siren && existingSiren.has(company.siren)) && !(company.siret && existingSiret.has(company.siret)));
      targetingCandidates.forEach((company, index) => {
        const raw = company.raw || {};
        const workforce = raw.tranche_effectif_salarie || raw.trancheEffectifSalarie || "";
        const workforceYear = raw.annee_tranche_effectif_salarie || raw.anneeTrancheEffectifSalarie || "";
        const establishments = raw.nombre_etablissements ?? raw.nombre_etablissements_ouverts ?? null;
        const created = raw.date_creation || raw.dateCreation || "";
        const adminStatus = raw.etat_administratif || raw.statut || "";
        const card = document.createElement("article"); card.className = "crm-targeting-candidate";
        const label = document.createElement("label"); const checkbox = document.createElement("input");
        checkbox.type = "checkbox"; checkbox.dataset.candidateIndex = String(index);
        label.append(checkbox, document.createTextNode(" " + (company.name || "Dénomination non fournie") + " — " + company.score + "/100"));
        const detail = document.createElement("p");
        const facts = [
          "SIREN : " + (company.siren || "inconnu"),
          "SIRET siège : " + (company.siret || "inconnu"),
          "APE/NAF : " + (company.naf || "inconnu"),
          "Département : " + (company.department || "inconnu"),
          workforce ? "Tranche d’effectif : " + workforce + (workforceYear ? " (" + workforceYear + ")" : "") : "Effectif : non renseigné",
          establishments !== null ? "Établissements : " + establishments : "Établissements : non renseignés",
          adminStatus ? "Statut : " + adminStatus : "",
          created ? "Création : " + created : "",
          "Source collectée le : " + new Date(response.fetchedAt).toLocaleDateString("fr-FR")
        ].filter(Boolean);
        detail.textContent = facts.join(" · ") + ". " + company.warning;
        const reasons = document.createElement("p");
        reasons.textContent = "Motifs du rapprochement : " + (company.reasons || []).join(" ; ");
        card.append(label, detail, reasons); results.append(card);
      });
      status.textContent = response.rawCount + " fiche(s) reçue(s), " + response.uniqueCount + " entreprise(s) unique(s), " +
        targetingCandidates.length + " nouveau(x) candidat(s), " + alreadyKnown.length +
        " déjà présent(s) dans l’ensemble des fiches CRM accessibles à votre organisation. Source : " + response.source + " · " +
        new Date(response.fetchedAt).toLocaleString("fr-FR") +
        ". Le contrôle SIREN/SIRET est effectué sur l’ensemble des fiches du tenant avant intégration ; la contrainte unique SIREN existante protège également l’insertion.";
      importButton.disabled = !targetingCandidates.length;
    } catch (error) { targetingCandidates = []; status.textContent = error.message || "Recherche échouée : aucun candidat intégré."; }
    finally { button.disabled = false; }
  });
  results.addEventListener("change", () => { importButton.disabled = selected().length === 0; });
  importButton.addEventListener("click", async () => {
    const chosen = selected(); if (!chosen.length) return;
    importButton.disabled = true; let saved = 0;
    const failures = [];
    for (const company of chosen) {
      const raw = company.raw || {}; const siege = raw.siege || raw.etablissement || {};
      const postal = String(siege.code_postal || raw.code_postal || "");
      const department = company.department || (postal.startsWith("97") ? postal.slice(0,3) : postal.slice(0,2));
      const workforce = raw.tranche_effectif_salarie || raw.trancheEffectifSalarie || "non renseignée";
      const workforceYear = raw.annee_tranche_effectif_salarie || raw.anneeTrancheEffectifSalarie || "année non précisée";
      const establishments = raw.nombre_etablissements ?? raw.nombre_etablissements_ouverts ?? "non renseigné";
      const notes = [
        "Candidat issu d’un ciblage APE/NAF et départemental.",
        "Score indicatif : " + company.score + "/100.",
        "Motifs : " + (company.reasons || []).join(" ; "),
        "Effectif déclaré : " + workforce + " (" + workforceYear + ").",
        "Nombre d’établissements selon la source : " + establishments + ".",
        "Statut administratif source : " + (raw.etat_administratif || raw.statut || "non renseigné") + ".",
        "Date de création source : " + (raw.date_creation || raw.dateCreation || "non renseignée") + ".",
        "Identifiant source : " + (company.sourceId || "non fourni") + ".",
        "Collecte : " + (company.collectedAt || new Date().toISOString()) + ".",
        "Critères : APE/NAF " + nafCodes.join(", ") + " ; départements " + departments.join(", ") + ".",
        "Vérification humaine requise ; l’effectif et le nombre d’établissements dépendent des données disponibles dans l’annuaire."
      ].join(" ");
      try {
        if (!company.siren && !company.siret) {
          failures.push((company.name || "Entreprise") + " : SIREN et SIRET absents, intégration refusée.");
          continue;
        }
        const duplicates = await MajestiosCRM.findBusinessesByIdentifiers({
          sirens: company.siren ? [company.siren] : [],
          sirets: company.siret ? [company.siret] : []
        });
        if (duplicates.length) {
          failures.push((company.name || company.siren || "Entreprise") + " : déjà présente dans le CRM (SIREN/SIRET).");
          continue;
        }
        await MajestiosCRM.createBusiness({
          legal_name: company.name || "Dénomination à vérifier", siren: company.siren || null,
          siret: company.siret || null, ape_naf: company.naf || null, department_code: department || null,
          city: siege.libelle_commune || raw.libelle_commune || raw.commune || null, postal_code: postal || null,
          address_line: [siege.numero_voie, siege.type_voie, siege.libelle_voie].filter(Boolean).join(" ") || null,
          source_label: "API Recherche d’Entreprises — DINUM", source_url: company.sourceUrl || "https://recherche-entreprises.api.gouv.fr/",
          qualification_status: "to_review", qualification_notes: notes, country_code: "FR"
        });
        saved++;
      } catch (error) {
        failures.push((company.name || company.siren || "Entreprise") + " : " + (error?.message || "échec d’insertion"));
      }
    }
    await refresh(true); targetingCandidates = []; results.replaceChildren();
    const failureSummary = failures.slice(0, 3).join(" | ");
    status.textContent = saved + " entreprise(s) intégrée(s) au CRM comme « à examiner » ; " + failures.length +
      " non intégrée(s)." + (failureSummary ? " Détails : " + failureSummary : "") +
      (failures.length > 3 ? " · " + (failures.length - 3) + " autre(s) échec(s)." : "") +
      " Aucun dossier existant n’a été écrasé ou fusionné automatiquement.";
    importButton.disabled = true;
  });
}
const businessSearchForm = document.getElementById("crm-business-server-search");
if (businessSearchForm) {
  businessSearchForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submit = businessSearchForm.querySelector('[type="submit"]');
    submit.disabled = true;
    try { await loadBusinessPage(true); }
    catch (error) { setStatus(error.message || "Recherche CRM impossible.", true); }
    finally { submit.disabled = false; }
  });
}
document.getElementById("crm-business-previous")?.addEventListener("click", async () => {
  if (businessPageIndex <= 0) return;
  businessPageIndex -= 1;
  try { await loadBusinessPage(); }
  catch (error) { setStatus(error.message || "Chargement de la page impossible.", true); }
});
document.getElementById("crm-business-next")?.addEventListener("click", async () => {
  if (businessPageIndex >= businessPageCount - 1) return;
  businessPageIndex += 1;
  try { await loadBusinessPage(); }
  catch (error) { setStatus(error.message || "Chargement de la page impossible.", true); }
});

for (const table of ["contacts", "opportunities", "activities"]) {
  const prefix = table === "opportunities" ? "opportunity" : table === "activities" ? "activity" : "contact";
  const form = document.getElementById("crm-" + prefix + "-server-search");
  form?.addEventListener("submit", async event => {
    event.preventDefault();
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    try { await loadWorkspacePage(table, true); }
    catch (error) { setStatus(error.message || "Recherche CRM impossible.", true); }
    finally { submit.disabled = false; }
  });
  document.getElementById("crm-" + prefix + "-previous")?.addEventListener("click", async () => {
    const state = workspacePages[table];
    if (state.page <= 0) return;
    state.page -= 1;
    try { await loadWorkspacePage(table); }
    catch (error) { setStatus(error.message || "Chargement de la page impossible.", true); }
  });
  document.getElementById("crm-" + prefix + "-next")?.addEventListener("click", async () => {
    const state = workspacePages[table];
    if (state.page >= state.pageCount - 1) return;
    state.page += 1;
    try { await loadWorkspacePage(table); }
    catch (error) { setStatus(error.message || "Chargement de la page impossible.", true); }
  });
}


try {
  const { membership, organization } = await MajestiosCRM.requireWorkspace();
  const canAdminister = ["owner", "admin"].includes(membership.role);
  document.querySelector("#crm-admin-nav-link").hidden = !canAdminister;
  document.querySelector("#crm-search-nav-link").hidden = !canAdminister;
  const isReadOnly = membership.role === "viewer";
  initMarketTargeting(!isReadOnly);
  if (isReadOnly) {
    document.querySelectorAll("#crm-business-form, #crm-contact-form, #crm-opportunity-form, #crm-activity-form")
      .forEach(form => form.querySelectorAll("input, textarea, select, button").forEach(control => control.disabled = true));
    setStatus("Espace interne connecté · consultation seule.");
  } else {
    setStatus("Espace interne connecté · " + organization.name + " · rôle : " + membership.role);
    bindForm("#crm-business-form", MajestiosCRM.createBusiness, data => ({ legal_name: data.legal_name.trim(), website: data.website || null, city: data.city || null, country_code: "FR", qualification_status: "to_review" }));
    bindForm("#crm-contact-form", MajestiosCRM.createContact, data => ({ business_id: nullableId(data.business_id), last_name: data.last_name.trim(), first_name: data.first_name || null, job_title: data.job_title || null, email: data.email || null, phone: data.phone || null, consent_status: "unknown" }));
    bindForm("#crm-opportunity-form", MajestiosCRM.createOpportunity, data => ({ business_id: nullableId(data.business_id), primary_contact_id: nullableId(data.primary_contact_id), title: data.title.trim(), description: data.description || null, source_type: data.source_type, status: "detected" }));
    bindForm("#crm-activity-form", MajestiosCRM.createActivity, data => ({ business_id: nullableId(data.business_id), contact_id: nullableId(data.contact_id), opportunity_id: nullableId(data.opportunity_id), subject: data.subject.trim(), activity_type: data.activity_type, body: data.body || null }));
  }
  await refresh(!isReadOnly);
} catch (error) {
  setStatus(error.message || "Connexion au CRM impossible.", true);
  document.querySelectorAll("#crm-business-form, #crm-contact-form, #crm-opportunity-form, #crm-activity-form")
    .forEach(form => form.querySelectorAll("input, textarea, select, button").forEach(control => control.disabled = true));
}
