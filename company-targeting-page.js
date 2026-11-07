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
    const nafCodes = parseList(form.elements.nafCodes.value);
    const departments = parseList(form.elements.departments.value).map((value) => value.toUpperCase());
    const limit = Number(form.elements.limit.value) || 10;
    const region = form.elements.region.value;
    if (!nafCodes.length || (!form.elements.radiusLocation.value.trim() && !departments.length && !region)) {
      status.textContent = "Saisissez un code APE/NAF et choisissez un rayon, un département ou une région.";
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
    const advanced = {
      workforce: form.elements.workforce.value,
      companyAge: form.elements.companyAge.value,
      legalCategory: form.elements.legalCategory.value.trim().toLocaleLowerCase("fr"),
      nameContains: form.elements.nameContains.value.trim().toLocaleLowerCase("fr"),
      includeUnknown: form.elements.includeUnknown.checked,
      caMin: form.elements.caMin.value,
      caMax: form.elements.caMax.value,
      estRge: form.elements.estRge.checked,
      estQualiopi: form.elements.estQualiopi.checked,
      estEpV: form.elements.estEpV.checked,
      estEss: form.elements.estEss.checked
    };
    const workforceRanges = {
      "0-2": [[0, 2], ["00", "01"]],
      "3-5": [[3, 5], ["02"]],
      "6-9": [[6, 9], ["03"]],
      "10-19": [[10, 19], ["11"]],
      "20-49": [[20, 49], ["12"]],
      "50+": [[50, Infinity], ["21", "22", "31", "32", "41", "42", "51", "52", "53"]]
    };
    const workforceMatch = (company, filter) => {
      if (!filter) return true;
      const raw = company.workforce;
      const numeric = raw == null || raw === "" ? NaN : Number(String(raw).replace(",", "."));
      const band = String(company.workforceBand || "").trim().toUpperCase();
      if (filter === "unknown") return !Number.isFinite(numeric) && !band;
      const rule = workforceRanges[filter];
      if (!rule) return true;
      if (Number.isFinite(numeric)) return numeric >= rule[0][0] && numeric <= rule[0][1];
      if (band) return rule[1].includes(band);
      return advanced.includeUnknown;
    };
    const ageMatch = (company, filter) => {
      if (!filter) return true;
      const date = company.creationDate ? new Date(company.creationDate) : null;
      if (!date || Number.isNaN(date.getTime())) return filter === "unknown" || advanced.includeUnknown;
      if (filter === "unknown") return false;
      const age = (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      if (filter === "0-2") return age < 3;
      if (filter === "3-5") return age >= 3 && age < 6;
      if (filter === "6-10") return age >= 6 && age < 10;
      if (filter === "10+") return age >= 10;
      return true;
    };
    const marketTitle = form.elements.marketTitle.value.trim();
    status.textContent = "Recherche en cours auprès de l’API publique. Les résultats ne sont pas enregistrés dans un CRM.";
    form.querySelector("button[type=submit]").disabled = true;
    results.hidden = true;
    cards.replaceChildren();
    try {
      const radiusLocation = form.elements.radiusLocation.value.trim();
      const response = radiusLocation
        ? await window.MajestiosCompanyTargeting.searchCompaniesNearPoint({ nafCodes, location: radiusLocation, radiusKm: Number(form.elements.radiusKm.value), perPage: 25, maxPages: 1 })
        : await window.MajestiosCompanyTargeting.searchCompanies({ nafCodes, departments, region, caMin: advanced.caMin, caMax: advanced.caMax, estRge: advanced.estRge, estQualiopi: advanced.estQualiopi, estEpV: advanced.estEpV, estEss: advanced.estEss, perPage: 25, maxPages: 1 });
      let candidates = window.MajestiosCompanyTargeting.rankCompanies(response.candidates, { nafCodes, departments });
      if (form.elements.activeOnly.checked) candidates = candidates.filter((company) => company.active !== false);
      candidates = candidates.filter(company => {
        const workforceOk = workforceMatch(company, advanced.workforce);
        const ageOk = ageMatch(company, advanced.companyAge);
        const legal = String(company.legalCategory || "").toLocaleLowerCase("fr");
        const legalOk = !advanced.legalCategory
          ? true
          : (legal ? legal.includes(advanced.legalCategory) : advanced.includeUnknown);
        const name = String(company.name || "").toLocaleLowerCase("fr");
        const nameOk = !advanced.nameContains || name.includes(advanced.nameContains);
        return workforceOk && ageOk && legalOk && nameOk;
      });
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
          const adminDetails = [
            company.creationDate ? "Création : " + company.creationDate : "",
            company.legalCategory ? "Catégorie juridique : " + company.legalCategory : "",
            company.workforceBand ? "Tranche d’effectif : " + company.workforceBand : "",
            company.workforce != null ? "Effectif déclaré : " + company.workforce : "",
            company.address ? "Adresse : " + company.address : ""
          ].filter(Boolean).map(escapeHtml).join(" · ");
          const fit = window.MajestiosCompanyFit ? window.MajestiosCompanyFit.qualify(company, { nafCodes, departements: departments }) : null;
          const fitWarnings = fit ? fit.warnings.map((warning) => "<li>" + escapeHtml(warning) + "</li>").join("") : "<li>Qualification complémentaire indisponible : contrôle manuel requis.</li>";
          const manualChecks = fit ? Object.entries(fit.manualChecks).map(([key, value]) => "<li>" + escapeHtml(key) + " : " + escapeHtml(value === "to_verify" ? "à vérifier" : value) + "</li>").join("") : "";
          return '<article class="company-targeting-card"><div class="company-targeting-card-top"><span class="company-targeting-score">' + formatScore(company.score) + '</span><span class="company-targeting-qualification">' + escapeHtml(company.qualification) + '</span></div><h3>' + escapeHtml(company.name || "Dénomination non fournie") + '</h3><p>' + activity + ' · ' + department + '</p><p>' + escapeHtml(state) + '</p>' + (adminDetails ? '<p class="small-note">' + adminDetails + '</p>' : '') + '<p class="small-note">SIREN : ' + escapeHtml(company.siren || "non fourni") + ' · SIRET : ' + escapeHtml(company.siret || "non fourni") + '</p><details><summary>Pourquoi cette correspondance ?</summary><ul>' + reasons + '</ul></details><p><a href="' + officialUrl + '" target="_blank" rel="noopener noreferrer">Consulter la fiche officielle ↗</a></p><p class="small-note">' + escapeHtml(company.warning) + '</p></article>';
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