/* Navigation commune MajestiOS : un seul gestionnaire, indépendant des modules métier. */
(() => {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#site-nav");
  if (!toggle || !navigation || toggle.dataset.navigationReady === "true") return;
  toggle.dataset.navigationReady = "true";

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    navigation.classList.toggle("open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  setOpen(false);
})();
