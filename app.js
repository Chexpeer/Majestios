const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const leadForm = document.querySelector("#lead-form");
const formFeedback = document.querySelector("#form-feedback");

function setIntent(intent) {
  const radio = leadForm.querySelector(`input[name="intent"][value="${intent}"]`);
  if (!radio) return;
  radio.checked = true;
  leadForm.querySelectorAll(".intent-fields").forEach((section) => {
    const visible = section.dataset.for === intent;
    section.hidden = !visible;
    section.querySelectorAll("input, textarea").forEach((field) => {
      field.required = visible && ["tender", "sector", "area"].includes(field.name);
    });
  });
  formFeedback.hidden = true;
}

leadForm.querySelectorAll('input[name="intent"]').forEach((radio) => {
  radio.addEventListener("change", () => setIntent(radio.value));
});
setIntent(leadForm.querySelector('input[name="intent"]:checked').value);

document.querySelectorAll("[data-intent-link]").forEach((link) => {
  link.addEventListener("click", () => setIntent(link.dataset.intentLink));
});

document.querySelector("#preview-request").addEventListener("click", () => {
  if (!leadForm.reportValidity()) return;

  const intent = leadForm.querySelector('input[name="intent"]:checked').value;
  const intentLabel = intent === "respond"
    ? "demande d’accompagnement pour répondre à un AO"
    : "demande de réception d’AO liés à votre activité";
  formFeedback.textContent = `Parcours prévisualisé : ${intentLabel}. Rien n’a été envoyé ou enregistré. Un service de traitement devra être raccordé avant toute collecte réelle.`;
  formFeedback.hidden = false;
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
  navigation.classList.toggle("open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
  });
});

function openModal(id, trigger) {
  const modalBackdrop = document.querySelector(id);
  const closeButton = modalBackdrop.querySelector(".modal-close");
  const dismissButton = modalBackdrop.querySelector(".modal-dismiss");
  const close = () => {
    modalBackdrop.hidden = true;
    document.body.classList.remove("modal-open");
    trigger?.focus();
  };

  modalBackdrop.hidden = false;
  document.body.classList.add("modal-open");
  closeButton.focus();
  closeButton.onclick = close;
  dismissButton.onclick = close;
  modalBackdrop.onclick = (event) => {
    if (event.target === modalBackdrop) close();
  };
  modalBackdrop.onkeydown = (event) => {
    if (event.key === "Escape") close();
  };
}

document.querySelector(".client-trigger").addEventListener("click", (event) => {
  openModal("#client-modal", event.currentTarget);
});
