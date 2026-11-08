(() => {
  "use strict";
  const form = document.getElementById("company-targeting-form");
  if (!form || !window.MajestiosCompanyTargeting) return;
  const status = document.getElementById("company-targeting-status");
  const results = document.getElementById("company-targeting-results");
  const summary = document.getElementById("company-targeting-summary");
  const cards = document.getElementById("company-targeting-cards");
  const suggestionButton = document.getElementById("suggest-naf-button");
  const suggestionPanel = document.getElementById("naf-suggestions");
  const suggestionList = document.getElementById("naf-suggestions-list");
  const addSuggestionsButton = document.getElementById("add-naf-suggestions");
  const suggestionEngine = window.MajestiosNafSuggestions;
  const parseList = (value) => [...new Set(String(value || "").split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean))];
  const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const formatScore = (value) => Number.isFinite(value) ? value + "/100" : "Non calculé";

  if (suggestionButton && suggestionPanel && suggestionList && addSuggestionsButton && suggestionEngine) {
    suggestionButton.addEventListener("click", () => {
      const title = form.elements.marketTitle.value.trim();
      const description = form.elements.marketDescription.value.trim();
      const suggestions = suggestionEngine.suggestNafCodes({ title, description }, { limit: 8 });
      suggestionList.replaceChildren();
      if (!suggestions.length) {
        status.textContent = title || description ? "Aucune suggestion lexicale trouvée. Vérifiez les métiers et recherchez les codes adaptés avec un opérateur." : "Saisissez l’intitulé et/ou le contenu du marché pour proposer des pistes APE/NAF.";
        suggestionPanel.hidden = true;
        return;
      }
      suggestionList.innerHTML = suggestions.map((item) => '<label class="naf-suggestion-option"><input type="checkbox" value="' + escapeHtml(item.code) + '"> <strong>' + escapeHtml(item.code) + '</strong> — ' + escapeHtml(item.label) + '<span class="small-note">Indice : ' + escapeHtml(item.matches.join(", ")) + '</span></label>').join("");
      suggestionPanel.hidden = false;
      status.textContent = "Pistes lexicales extraites de l’intitulé et du texte fourni. Elles ne constituent ni une lecture juridique du dossier ni une preuve de compétence : vérifiez chaque code et chaque lot.";
    });
    addSuggestionsButton.addEventListener("click", () => {
      const chosen = [...suggestionList.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
      if (!chosen.length) {
        status.textContent = "Cochez au moins une suggestion à ajouter, puis vérifiez la liste des codes.";
        return;
      }
      const current = parseList(form.elements.nafCodes.value);
      form.elements.nafCodes.value = [...new Set([...current, ...chosen])].join(", ");
      status.textContent = "Codes ajoutés au champ. Contrôlez leur pertinence et leur format avant de rechercher les entreprises.";
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nafCodes = parseList(form.elements.nafCodes.value).map((value) => value.toUpperCase());
    const departments = parseList(form.elements.departments.value).map((value) => value.toUpperCase());
    const limit = Number(form.elements.limit.value) || 10;
    const marketTitle = form.elements.marketTitle.value.trim();

    if (!nafCodes.length || !departments.length) {
      status.textContent = "Saisissez au moins un code APE/NAF et un département.";
      return;
    }
    if (nafCodes.some((code) => !/^\\d{2}\\.\\d{2}[A-Z]$/.test(code))) {
      status.textContent = "Un code APE/NAF semble invalide. Utilisez le format officiel, par exemple 43.21A.";
      return;
    }
    if (departments.some((dept) => !/^(\\d{2}|2A|2B|97[1-6]|978|977|986|987|988)$/.test(dept))) {
      status.textContent = "Vérifiez les codes départementaux saisis.";
      return;
    }

    status.textContent = "Recherche en cours…";
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    results.hidden = true;
    cards.replaceChildren();
    try {
      // Parcours historique conservé provisoirement : le nouvel endpoint membre
      // n'est pas encore déployé. Les critères envoyés correspondent strictement
      // aux champs réellement présents dans le formulaire.
      const response = await window.MajestiosCompanyTargeting.searchCompanies({
        nafCodes, departments, perPage: 25, maxPages: 1
      });
      let candidates = window.MajestiosCompanyTargeting.rankCompanies(response.candidates, { nafCodes, departments });
      if (form.elements.activeOnly.checked) candidates = candidates.filter((company) => company.active !== false);
      const selected = window.MajestiosCompanyTargeting.selectCandidates(candidates, {
        nafCodes, departments, limit, minimumScore: 25
      });
      const list = selected.candidates;
      summary.textContent = (marketTitle ? "Repère : " + marketTitle + " · " : "") +
        response.rawCount + " fiche(s) reçue(s), " + response.uniqueCount +
        " entreprise(s) unique(s) après dédoublonnage ; " + list.length +
        " entreprise(s) affichée(s). Recherche effectuée le " +
        new Date(response.fetchedAt).toLocaleString("fr-FR") + ".";
      if (!list.length) {
        cards.innerHTML = '<p class="company-targeting-empty">Aucune entreprise ne correspond aux critères reçus. Cela ne prouve pas qu’il n’existe aucune entreprise pertinente : élargissez les critères de recherche.</p>';
      } else {
        cards.innerHTML = list.map((company) => {
          const activity = company.naf ? "APE/NAF : " + escapeHtml(company.naf) : "Code APE/NAF non renseigné";
          const department = company.department ? "Département : " + escapeHtml(company.department) : "Département non déterminé";
          const state = company.active === true ? "Statut administratif : actif" :
            company.active === false ? "Statut administratif : non actif" : "Statut administratif : à vérifier";
          const reasons = company.reasons.map((reason) => "<li>" + escapeHtml(reason) + "</li>").join("");
          const adminDetails = [
            company.creationDate ? "Création : " + company.creationDate : "",
            company.legalCategory ? "Catégorie juridique : " + company.legalCategory : "",
            company.workforceBand ? "Tranche d’effectif : " + company.workforceBand : "",
            company.address ? "Adresse : " + company.address : ""
          ].filter(Boolean).map(escapeHtml).join(" · ");
          return '<article class="company-targeting-card"><div class="company-targeting-card-top"><span class="company-targeting-score">' +
            formatScore(company.score) + '</span><span class="company-targeting-qualification">' +
            escapeHtml(company.qualification) + '</span></div><h3>' +
            escapeHtml(company.name || "Dénomination non fournie") + '</h3><p>' +
            activity + ' · ' + department + '</p><p>' + escapeHtml(state) + '</p>' +
            (adminDetails ? '<p class="small-note">' + adminDetails + '</p>' : '') +
            '<p class="small-note">SIREN : ' + escapeHtml(company.siren || "non fourni") +
            ' · SIRET : ' + escapeHtml(company.siret || "non fourni") +
            '</p><details><summary>Pourquoi cette correspondance ?</summary><ul>' +
            reasons + '</ul></details><p class="small-note">' +
            escapeHtml(company.warning) + '</p></article>';
        }).join("");
      }
      results.hidden = false;
      status.textContent = "Recherche terminée. Contrôlez les fiches avant toute décision ou prise de contact.";
    } catch (error) {
      status.textContent = "La recherche n’a pas pu aboutir. Réessayez ou modifiez vos critères.";
    } finally {
      submitButton.disabled = false;
    }
  });
})();