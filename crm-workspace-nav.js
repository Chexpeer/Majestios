const status = document.querySelector("#crm-status");
const dataGrid = document.querySelector(".interior-grid[aria-label='Données CRM']");
const followups = document.querySelector(".crm-followups");

const panels = [
  { id: "overview", label: "Vue générale", element: followups },
  { id: "businesses", label: "Entreprises", element: document.querySelector("#crm-business-list")?.closest("article") },
  { id: "contacts", label: "Contacts", element: document.querySelector("#crm-contact-list")?.closest("article") },
  { id: "opportunities", label: "Opportunités", element: document.querySelector("#crm-opportunity-list")?.closest("article") },
  { id: "activities", label: "Activités & historique", element: document.querySelector("#crm-activity-list")?.closest("article") }
].filter(panel => panel.element);

if (status && dataGrid && followups && panels.length === 5) {
  const nav = document.createElement("nav");
  nav.className = "crm-workspace-nav";
  nav.setAttribute("aria-label", "Navigation des modules CRM");
  nav.setAttribute("aria-orientation", "horizontal");

  const heading = document.createElement("p");
  heading.className = "crm-workspace-nav-label";
  heading.textContent = "VOTRE ESPACE DE TRAVAIL";
  nav.append(heading);

  const controls = document.createElement("div");
  controls.className = "crm-workspace-nav-controls";
  const buttons = new Map();

  function activate(id, moveFocus = false) {
    panels.forEach(panel => {
      const active = panel.id === id;
      panel.element.hidden = !active;
      const button = buttons.get(panel.id);
      button.setAttribute("aria-current", active ? "page" : "false");
      button.classList.toggle("is-active", active);
      if (active && moveFocus) button.focus();
    });
    dataGrid.hidden = id === "overview";
    nav.dataset.activeView = id;
  }

  panels.forEach(panel => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "crm-workspace-nav-button";
    button.textContent = panel.label;
    button.addEventListener("click", () => activate(panel.id));
    buttons.set(panel.id, button);
    controls.append(button);
  });

  nav.append(controls);
  status.insertAdjacentElement("afterend", nav);
  activate("overview");

  controls.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = [...buttons.keys()].indexOf(nav.dataset.activeView);
    const keys = [...buttons.keys()];
    const next = event.key === "Home" ? 0 : event.key === "End" ? keys.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : -1) + keys.length) % keys.length;
    activate(keys[next], true);
  });
}
