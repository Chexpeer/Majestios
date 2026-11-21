const list = document.getElementById("crm-business-list");
const search = document.getElementById("crm-business-search");
const qualification = document.getElementById("crm-business-qualification");
const department = document.getElementById("crm-business-department");
const count = document.getElementById("crm-business-filter-count");

if (list && search && qualification && department && count) {
  const normalize = value => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr-FR")
    .trim();

  function applyFilters() {
    const term = normalize(search.value);
    const selectedQualification = qualification.value;
    const selectedDepartment = normalize(department.value);
    const items = [...list.querySelectorAll("li[data-record-id]")];
    let visible = 0;

    items.forEach(item => {
      const matchesTerm = !term || normalize(item.dataset.searchText).includes(term);
      const matchesQualification = !selectedQualification || item.dataset.qualificationStatus === selectedQualification;
      const matchesDepartment = !selectedDepartment || normalize(item.dataset.departmentCode) === selectedDepartment;
      const show = matchesTerm && matchesQualification && matchesDepartment;
      item.hidden = !show;
      if (show) visible += 1;
    });

    count.textContent = visible === items.length
      ? (items.length ? `${items.length} entreprise(s) visible(s) sur cette page.` : "Aucune entreprise sur cette page.")
      : `${visible} entreprise(s) visible(s) sur ${items.length} sur cette page.`;
  }

  search.addEventListener("input", applyFilters);
  qualification.addEventListener("change", applyFilters);
  department.addEventListener("input", applyFilters);
  new MutationObserver(applyFilters).observe(list, { childList: true });
  applyFilters();
}
