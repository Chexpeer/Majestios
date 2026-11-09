(() => {
  "use strict";
  const root = document.querySelector("[data-reputation-workspace]");
  if (!root) return;
  const output = root.querySelector("[data-consultation-content]");
  const status = root.querySelector("[data-consultation-status]");
  const meta = (name) => document.querySelector('meta[name="' + name + '"]')?.content?.trim() || "";
  const cseId = meta("google-cse-id");
  const mapsKey = meta("google-maps-embed-key");
  const showMessage = (title, detail) => {
    output.replaceChildren();
    const box = document.createElement("div");
    box.className = "consultation-placeholder";
    const heading = document.createElement("strong");
    heading.textContent = title;
    const paragraph = document.createElement("p");
    paragraph.textContent = detail;
    box.append(heading, paragraph);
    output.append(box);
  };
  const setStatus = (value) => { status.textContent = value; };
  root.querySelectorAll("[data-reputation-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const type = form.dataset.reputationSearch;
      const query = form.querySelector('input[type="search"]')?.value.trim();
      if (!query) return;
      output.replaceChildren();
      setStatus(type === "web" ? "Recherche Web" : "Recherche cartographique");
      if (type === "web") {
        if (!cseId) {
          showMessage("Google Programmable Search n’est pas configuré", "L’identifiant du moteur Google (cx) manque. La consultation intégrée sera activée dès que le propriétaire aura créé/configuré son moteur et renseigné l’identifiant.");
          setStatus("Configuration Google requise");
          return;
        }
        const host = document.createElement("div");
        host.className = "gcse-search";
        output.append(host);
        window.__gcse = { parsetags: "onload" };
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://cse.google.com/cse.js?cx=" + encodeURIComponent(cseId);
        script.onerror = () => {
          showMessage("Le moteur Google n’a pas pu être chargé", "Vérifiez la configuration Programmable Search et les règles de sécurité du navigateur.");
          setStatus("Service indisponible");
        };
        document.head.append(script);
        window.setTimeout(() => {
          const input = document.querySelector(".gsc-input-box input");
          if (input) {
            input.value = query;
            const button = document.querySelector(".gsc-search-button");
            if (button) button.click();
          }
        }, 900);
        return;
      }
      if (!mapsKey) {
        showMessage("Google Maps Embed n’est pas configuré", "La clé Google Maps Embed API manque. Ajoutez une clé restreinte au domaine MajestiOS pour afficher la carte intégrée.");
        setStatus("Configuration Maps requise");
        return;
      }
      const frame = document.createElement("iframe");
      frame.className = "reputation-map-frame";
      frame.title = "Résultats Google Maps pour " + query;
      frame.loading = "lazy";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      frame.src = "https://www.google.com/maps/embed/v1/search?key=" + encodeURIComponent(mapsKey) + "&q=" + encodeURIComponent(query);
      frame.onerror = () => setStatus("Carte indisponible");
      output.append(frame);
      setStatus("Carte Google Maps");
    });
  });
})();
