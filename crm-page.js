import { MajestiosCRM } from "./crm-client.js";

const status = document.querySelector("#crm-status");
const setStatus = (message, error = false) => {
  status.textContent = message;
  status.dataset.state = error ? "error" : "success";
};

const renderList = (selector, rows, label) => {
  const list = document.querySelector(selector);
  list.replaceChildren();
  rows.forEach((row) => {
    const item = document.createElement("li");
    item.textContent = label(row);
    list.append(item);
  });
};

const renderSelect = (selector, rows, label, placeholder) => {
  const select = document.querySelector(selector);
  if (!select) return;
  const currentValue = select.value;
  select.replaceChildren(new Option(placeholder, ""));
  rows.forEach((row) => select.add(new Option(label(row), row.id)));
  if (rows.some((row) => row.id === currentValue)) select.value = currentValue;
};

async function refresh() {
  const [businesses, contacts, opportunities, activities] = await Promise.all([
    MajestiosCRM.listBusinesses(), MajestiosCRM.listContacts(),
    MajestiosCRM.listOpportunities(), MajestiosCRM.listActivities()
  ]);
  document.querySelector("#crm-business-count").textContent = businesses.length;
  document.querySelector("#crm-contact-count").textContent = contacts.length;
  document.querySelector("#crm-opportunity-count").textContent = opportunities.length;
  document.querySelector("#crm-activity-count").textContent = activities.length;
  renderList("#crm-business-list", businesses, row => row.trade_name || row.legal_name);
  renderList("#crm-contact-list", contacts, row => [row.first_name, row.last_name].filter(Boolean).join(" ") + (row.email ? " · " + row.email : ""));
  renderList("#crm-opportunity-list", opportunities, row => row.title + " · " + row.status);
  renderList("#crm-activity-list", activities, row => row.subject + " · " + row.activity_type);

  renderSelect("#crm-contact-form [name=business_id]", businesses,
    row => row.trade_name || row.legal_name, "Aucune entreprise associée");
  renderSelect("#crm-opportunity-form [name=business_id]", businesses,
    row => row.trade_name || row.legal_name, "Aucune entreprise associée");
  renderSelect("#crm-opportunity-form [name=primary_contact_id]", contacts,
    row => [row.first_name, row.last_name].filter(Boolean).join(" "), "Aucun contact principal");
  renderSelect("#crm-activity-form [name=business_id]", businesses,
    row => row.trade_name || row.legal_name, "Aucune entreprise associée");
  renderSelect("#crm-activity-form [name=contact_id]", contacts,
    row => [row.first_name, row.last_name].filter(Boolean).join(" "), "Aucun contact associé");
  renderSelect("#crm-activity-form [name=opportunity_id]", opportunities,
    row => row.title, "Aucune opportunité associée");
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
      await refresh();
      setStatus("Enregistrement effectué dans votre CRM.");
    } catch (error) {
      setStatus(error.message || "Enregistrement impossible.", true);
    } finally {
      button.disabled = false;
    }
  });
}

const nullableId = value => value || null;

try {
  const { membership, organization } = await MajestiosCRM.requireWorkspace();
  const isReadOnly = membership.role === "viewer";
  if (isReadOnly) {
    document.querySelectorAll("#crm-business-form, #crm-contact-form, #crm-opportunity-form, #crm-activity-form")
      .forEach(form => form.querySelectorAll("input, textarea, select, button").forEach(field => field.disabled = true));
    setStatus("Espace interne connecté · consultation seule.");
  } else {
    setStatus("Espace interne connecté · " + organization.name + " · rôle : " + membership.role);
    bindForm("#crm-business-form", MajestiosCRM.createBusiness, data => ({
      legal_name: data.legal_name.trim(),
      website: data.website || null,
      city: data.city || null,
      country_code: "FR",
      qualification_status: "to_review"
    }));
    bindForm("#crm-contact-form", MajestiosCRM.createContact, data => ({
      business_id: nullableId(data.business_id),
      last_name: data.last_name.trim(),
      first_name: data.first_name || null,
      email: data.email || null,
      phone: data.phone || null,
      consent_status: "unknown"
    }));
    bindForm("#crm-opportunity-form", MajestiosCRM.createOpportunity, data => ({
      business_id: nullableId(data.business_id),
      primary_contact_id: nullableId(data.primary_contact_id),
      title: data.title.trim(),
      description: data.description || null,
      source_type: data.source_type,
      status: "detected"
    }));
    bindForm("#crm-activity-form", MajestiosCRM.createActivity, data => ({
      business_id: nullableId(data.business_id),
      contact_id: nullableId(data.contact_id),
      opportunity_id: nullableId(data.opportunity_id),
      subject: data.subject.trim(),
      activity_type: data.activity_type,
      body: data.body || null
    }));
  }
  await refresh();
} catch (error) {
  setStatus(error.message || "Connexion au CRM impossible.", true);
  document.querySelectorAll("#crm-business-form, #crm-contact-form, #crm-opportunity-form, #crm-activity-form")
    .forEach(form => form.querySelectorAll("input, textarea, select, button").forEach(field => field.disabled = true));
}
