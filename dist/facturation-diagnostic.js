import { OPTIONS, diagnose } from "./facturation-diagnostic.mjs";

const form = document.querySelector("#diagnostic-form");
const output = document.querySelector("#diagnostic-result");

if (form && output) {
  for (const [group, options] of Object.entries(OPTIONS)) {
    const select = form.elements[group];
    if (!select) continue;
    for (const [value, label] of options) select.append(new Option(label, value));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = Object.fromEntries(new FormData(form).entries());
    const result = diagnose(answers);
    output.replaceChildren();
    output.hidden = false;
    if (!result.ok) {
      const message = document.createElement("p");
      message.textContent = "Répondez aux quatre questions pour obtenir une orientation.";
      output.append(message);
      return;
    }
    const list = document.createElement("ul");
    for (const [label, text] of result.lines) {
      const item = document.createElement("li");
      const strong = document.createElement("strong");
      strong.textContent = label + " : ";
      item.append(strong, document.createTextNode(text));
      list.append(item);
    }
    const stepsTitle = document.createElement("p");
    const stepsStrong = document.createElement("strong");
    stepsStrong.textContent = "Les trois étapes pour avancer";
    stepsTitle.append(stepsStrong);
    const steps = document.createElement("ol");
    for (const text of result.nextSteps) {
      const item = document.createElement("li");
      item.textContent = text;
      steps.append(item);
    }
    const note = document.createElement("p");
    note.className = "small-note";
    note.textContent = result.disclaimer;
    output.append(list, stepsTitle, steps, note);
  });
}
