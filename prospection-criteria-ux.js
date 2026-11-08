(() => {
  "use strict";
  const form = document.getElementById("company-targeting-form");
  if (!form) return;

  const toggle = document.getElementById("prospecting-criteria-toggle");
  const core = form.querySelector(".prospecting-core-grid");
  const advanced = form.querySelector(".prospecting-advanced-details");
  const activeOnly = form.querySelector('input[name="activeOnly"]')?.closest("label");
  if (!toggle || !core || !advanced) return;

  const groups = [
    { id: "activity", label: "Activité APE/NAF", fields: ["target-naf-codes"], required: true },
    { id: "territory", label: "Territoire", fields: ["target-departments", "target-region", "target-radius-location", "target-radius-km"], required: true },
    { id: "workforce", label: "Effectif salarié", fields: ["target-workforce"] },
    { id: "age", label: "Ancienneté", fields: ["target-age"] },
    { id: "legal", label: "Catégorie juridique", fields: ["target-legal-category"] },
    { id: "name", label: "Nom d’entreprise", fields: ["target-name-contains"] },
    { id: "revenue", label: "Chiffre d’affaires", fields: ["target-ca-min", "target-ca-max"] },
    { id: "labels", label: "Qualifications et labels", fields: ["estRge", "estQualiopi", "estEpV", "estEss"] }
  ];

  const findLabel = (id) => {
    const control = document.getElementById(id) || form.elements[id];
    return control ? control.closest("label") : null;
  };
  const controlFor = (id) => document.getElementById(id) || form.elements[id];
  const ui = document.createElement("section");
  ui.className = "prospecting-progressive-criteria";
  ui.setAttribute("aria-label", "Critères de prospection");
  const available = document.createElement("div");
  available.className = "prospecting-criteria-available";
  available.setAttribute("aria-label", "Critères disponibles");
  const selected = document.createElement("div");
  selected.className = "prospecting-criteria-selected";
  selected.setAttribute("aria-label", "Critères sélectionnés");
  const editor = document.createElement("div");
  editor.className = "prospecting-criteria-editor";
  editor.hidden = true;
  const editorTitle = document.createElement("h3");
  editor.append(editorTitle);
  const editorFields = document.createElement("div");
  editorFields.className = "prospecting-criteria-editor-fields";
  editor.append(editorFields);
  const editorActions = document.createElement("div");
  editorActions.className = "prospecting-criteria-editor-actions";
  const validate = document.createElement("button");
  validate.type = "button";
  validate.className = "feed-search-submit";
  validate.textContent = "Valider ce critère";
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "button-secondary";
  cancel.textContent = "Fermer";
  editorActions.append(validate, cancel);
  editor.append(editorActions);
  toggle.insertAdjacentElement("afterend", ui);
  ui.append(available, selected, editor);

  const optionDetails = document.createElement("details");
  optionDetails.className = "prospecting-criteria-options";
  const optionSummary = document.createElement("summary");
  optionSummary.textContent = "Options complémentaires";
  optionDetails.append(optionSummary);
  const optionFields = document.createElement("div");
  optionFields.className = "prospecting-criteria-editor-fields";
  optionDetails.append(optionFields);
  ui.append(optionDetails);

  const optionLabels = [
    activeOnly,
    findLabel("target-include-unknown"),
    findLabel("target-limit"),
    findLabel("target-market-description")
  ].filter(Boolean);
  optionLabels.forEach((label) => {
    label.hidden = false;
    optionFields.append(label);
  });
  const nafSuggestionButton = document.getElementById("suggest-naf-button");
  const nafSuggestions = document.getElementById("naf-suggestions");
  if (nafSuggestionButton) optionFields.append(nafSuggestionButton);
  if (nafSuggestions) optionFields.append(nafSuggestions);

  const state = new Map();
  let editing = null;
  const isChecked = (control) => Boolean(control && control.checked);
  const hasValue = (control) => Boolean(control && String(control.value || "").trim());
  const isSelected = (group) => {
    if (group.id === "labels") return group.fields.some((id) => isChecked(controlFor(id)));
    if (group.id === "territory") return ["target-departments", "target-region", "target-radius-location"].some((id) => hasValue(controlFor(id)));
    return group.fields.some((id) => hasValue(controlFor(id)));
  };
  const clearGroup = (group) => {
    group.fields.forEach((id) => {
      const control = controlFor(id);
      if (!control) return;
      if (control.type === "checkbox") control.checked = false;
      else if (id === "target-radius-km") control.value = "10";
      else control.value = "";
      control.dispatchEvent(new Event("change", { bubbles: true }));
    });
    closeEditor();
    render();
  };
  const valueSummary = (group) => {
    const fields = group.id === "territory" && !hasValue(controlFor("target-radius-location"))
      ? group.fields.filter((id) => id !== "target-radius-km")
      : group.fields;
    const values = fields.map((id) => {
      const control = controlFor(id);
      if (!control) return "";
      if (control.type === "checkbox") return control.checked ? (control.closest("label")?.textContent || id).trim() : "";
      if (!String(control.value || "").trim()) return "";
      const label = control.closest("label")?.textContent?.trim().split("(")[0].trim();
      return (label ? label + " : " : "") + (control.tagName === "SELECT" ? control.selectedOptions[0]?.textContent : control.value);
    }).filter(Boolean);
    return values.join(" · ");
  };

  const closeEditor = () => {
    editor.hidden = true;
    editing = null;
  };
  const openEditor = (group) => {
    editing = group;
    editorTitle.textContent = group.label;
    editorFields.replaceChildren();
    group.fields.forEach((id) => {
      const control = controlFor(id);
      const label = control?.closest("label");
      if (label) {
        label.hidden = false;
        editorFields.append(label);
      }
    });
    editor.hidden = false;
    editor.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  groups.forEach((group) => {
    group.fields.forEach((id) => {
      const control = controlFor(id);
      const label = control?.closest("label");
      if (label) label.hidden = true;
    });
    state.set(group.id, null);
  });

  const render = () => {
    available.replaceChildren();
    selected.replaceChildren();
    groups.forEach((group) => {
      if (isSelected(group)) {
        const chip = document.createElement("div");
        chip.className = "prospecting-criteria-chip";
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "prospecting-criteria-chip-edit";
        edit.textContent = group.label + " · " + valueSummary(group);
        edit.setAttribute("aria-label", "Modifier le critère " + group.label);
        edit.addEventListener("click", () => openEditor(group));
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "prospecting-criteria-chip-remove";
        remove.textContent = "×";
        remove.setAttribute("aria-label", "Retirer le critère " + group.label);
        remove.addEventListener("click", () => clearGroup(group));
        chip.append(edit, remove);
        selected.append(chip);
      } else {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "prospecting-criteria-choice";
        button.textContent = (group.required ? "＋ " : "＋ ") + group.label;
        button.addEventListener("click", () => openEditor(group));
        available.append(button);
      }
    });
    available.hidden = available.childElementCount === 0;
    selected.hidden = selected.childElementCount === 0;
    toggle.textContent = "Ajouter ou modifier des critères";
    toggle.setAttribute("aria-expanded", String(!editor.hidden));
  };

  validate.addEventListener("click", () => {
    if (!editing) return;
    const group = editing;
    const selectedNow = isSelected(group);
    closeEditor();
    render();
  });
  cancel.addEventListener("click", closeEditor);
  toggle.addEventListener("click", () => {
    if (editor.hidden) {
      const firstAvailable = groups.find((group) => !isSelected(group));
      if (firstAvailable) openEditor(firstAvailable);
      else optionDetails.open = !optionDetails.open;
    } else closeEditor();
    render();
  });

  groups.forEach((group) => group.fields.forEach((id) => {
    const control = controlFor(id);
    if (!control) return;
    control.addEventListener("change", render);
    if (control.matches("input[type='text'], input[type='search'], input[type='number']")) {
      control.addEventListener("input", render);
    }
  }));

  // The legacy disclosure remains inert; all criteria are now managed by this progressive interface.
  core.hidden = true;
  advanced.hidden = true;
  if (activeOnly) activeOnly.hidden = false;
  toggle.hidden = true;
  render();
})();
