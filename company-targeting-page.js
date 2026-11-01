(() => {
  "use strict";
  const form = document.getElementById("company-targeting-form");
  if (!form || !window.MajestiosCompanyTargeting) return;
  const status = document.getElementById("company-targeting-status");
  const results = document.getElementById("company-targeting-results");
  const summary = document.getElementById("company-targeting-summary");
  const cards = document.getElementById("company-targeting-cards");
  const parseList = (value) => [...new Set(String(value || "").split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean))];
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const formatScore = (value) => Number.isFinite(value) ? value + "/100" : "Non calculé";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nafCodes = parseList(form.elements.nafCodes.value);
    const departments = parseList(form.elements.departments.value).map((value) => value.toUpperCase());
    const limit = Number(form.elements.limit.value) || 10;
    if (!nafCodes.length || !departments.length) {
      status.textContent = "Saisissez au moins un code APE/NAF et un département.";
      return;
    }
    if (nafCodes.some((code) => !/^\d{2}\.\d{2}[A-Z]$/.test(code.toUpperCase()))) {
      status.textContent = "Un code APE/NAF semble invalide. Utilisez le format officiel, par exemple 43.21A, et vérifiez chaque code.";
      return;
    }
    if (departments.some((dept) => !/^(\d{2}|2A|2B|97[1-6]|978|977|986|987|988)$/.test(dept))) {
      status.textContent = "Vérifiez les codes départementaux saisis.";
      return;
    }
    const marketTitle = form.elements.marketTitle.value.trim();
    status.textContent = "Recherche en cours auprès de l’API publique. Les résultats ne sont pas enregistrés dans un CRM.";
    form.querySelector("button[type=submit]").disabled = true;
    results.hidden = true;
    cards.replaceChildren();
    try {
      const response = await window.MajestiosCompanyTargeting.searchCompanies({ nafCodes, departments, perPage: 25, maxPages: 1 });
      let candidates = window.MajestiosCompanyTargeting.rankCompanies(response.candidates, { nafCodes, departments });
      if (form.elements.activeOnly.checked) candidates = candidates.filter((company) => company.active !== false);
      const selected = window.MajestiosCompanyTargeting.selectCandidates(candidates, { nafCodes, departments, limit, minimumScore: 25 });
      const list = selected.candidates;
      summary.textContent = (marketTitle ? "Repère : " + marketTitle + " · " : "") +
        response.rawCount + " fiche(s) reçue(s), " + response.uniqueCount + " entreprise(s) unique(s) après dédoublonnage ; " +
        list.length + " candidat(s) affiché(s). Source : API Recherche d’Entreprises — DINUM. Collecte : " +
        new Date(response.fetchedAt).toLocaleString("fr-FR") + ".";
      if (!list.length) {
        cards.innerHTML = '<p class="company-targeting-empty">Aucun candidat ne correspond aux critères reçus. Cela ne prouve pas qu’il n’existe aucune entreprise pertinente : vérifiez les codes, les départements et la couverture de la source.</p>';
      } else {
        cards.innerHTML = list.map((company) => {
          const officialUrl = company.siren ? "https://annuaire-entreprises.data.gouv.fr/entreprise/" + encodeURIComponent(company.siren) : "https://recherche-entreprises.api.gouv.fr/";
          const activity = company.naf ? "APE/NAF : " + escapeHtml(company.naf) : "Code APE/NAF non renseigné";
          const department = company.department ? "Département : " + escapeHtml(company.department) : "Département non déterminé";
          const reasons = company.reasons.map((reason) => "<li>" + escapeHtml(reason) + "</li>").join("");
          const state = company.active === true ? "Statut administratif : actif selon la source" : company.active === false ? "Statut administratif : non actif selon la source" : "Statut administratif : à vérifier";
          return '<article class="company-targeting-card"><div class="company-targeting-card-top"><span class="company-targeting-score">' + formatScore(company.score) + '</span><span class="company-targeting-qualification">' + escapeHtml(company.qualification) + '</span></div><h3>' + escapeHtml(company.name || "Dénomination non fournie") + '</h3><p>' + activity + ' · ' + department + '</p><p>' + escapeHtml(state) + '</p><p class="small-note">SIREN : ' + escapeHtml(company.siren || "non fourni") + ' · SIRET : ' + escapeHtml(company.siret || "non fourni") + '</p><details><summary>Pourquoi cette correspondance ?</summary><ul>' + reasons + '</ul></details><p><a href="' + officialUrl + '" target="_blank" rel="noopener noreferrer">Consulter la fiche officielle ↗</a></p><p class="small-note">' + escapeHtml(company.warning) + '</p></article>';
        }).join("");
      }
      results.hidden = false;
      status.textContent = "Recherche terminée. Contrôlez les fiches avant toute décision ou prise de contact.";
    } catch (error) {
      status.textContent = error && error.message ? error.message : "La recherche a échoué. Réessayez plus tard.";
    } finally {
      form.querySelector("button[type=submit]").disabled = false;
    }
  });
})();