(() => {
  "use strict";

  const root = document.querySelector("[data-reputation-workspace]");
  if (!root) return;

  const output = root.querySelector("[data-consultation-content]");
  const status = root.querySelector("[data-consultation-status]");

  const setStatus = (message) => { status.textContent = message; };

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

  const makeFallbackLink = (url, label) => {
    const wrapper = document.createElement("div");
    wrapper.className = "consultation-fallback";
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    wrapper.append(link);
    output.append(wrapper);
  };

  const renderGoogleFrame = ({ url, title, fallbackUrl, fallbackLabel, className }) => {
    output.replaceChildren();

    const frame = document.createElement("iframe");
    frame.className = className;
    frame.title = title;
    frame.loading = "eager";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allowFullscreen = true;
    frame.src = url;
    output.append(frame);

    makeFallbackLink(fallbackUrl, fallbackLabel);
    setStatus("Tentative d’affichage intégré");

    // Les navigateurs ne permettent pas à MajestiOS de lire le contenu
    // cross-origin de Google ni de détecter fiablement un refus d’iframe.
    // Le lien de secours reste donc toujours visible.
    window.setTimeout(() => {
      if (frame.isConnected) setStatus("Affichage Google soumis aux restrictions du navigateur");
    }, 5000);
  };

  root.querySelectorAll("[data-reputation-search]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const type = form.dataset.reputationSearch;
      const query = form.querySelector('input[type="search"]')?.value.trim();
      if (!query) return;

      if (type === "web") {
        const encoded = encodeURIComponent(query);
        renderGoogleFrame({
          url: "https://www.google.com/search?igu=1&q=" + encoded,
          title: "Recherche Google Web pour " + query,
          fallbackUrl: "https://www.google.com/search?q=" + encoded,
          fallbackLabel: "Si Google bloque l’affichage intégré, ouvrir cette recherche Google dans un nouvel onglet",
          className: "reputation-google-frame"
        });
        return;
      }

      const encoded = encodeURIComponent(query);
      renderGoogleFrame({
        url: "https://www.google.com/maps?q=" + encoded + "&output=embed",
        title: "Recherche Google Maps pour " + query,
        fallbackUrl: "https://www.google.com/maps/search/?api=1&query=" + encoded,
        fallbackLabel: "Ouvrir cette recherche dans Google Maps",
        className: "reputation-map-frame"
      });
    });
  });

  // État initial explicite : aucune API ni connexion Cheexpeer n'est requise
  // pour lancer une tentative de consultation Google depuis cette interface.
  showMessage(
    "Commencez par une recherche",
    "Saisissez une entreprise, une marque ou une activité dans Google Web ou Google Maps. Les résultats accessibles seront affichés ici ; un lien de secours restera disponible si Google interdit l’intégration."
  );
})();