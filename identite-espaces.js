/* Identité des espaces : pastille « ESPACE ADMIN » (pages d'administration) ou « MON ESPACE » (espace client connecté),
   avec un ligne de couleur en haut de page. Aucun changement de mise en page : éléments fixes et discrets.
   Retour : retirer la balise <script src="identite-espaces.js"> des pages. */
(function () {
  try {
    var page = (location.pathname.split("/").pop() || "index.html");
    var admin = /^(administration|admin-[a-z-]+|espace-interne)\.html$/.test(page);
    var client = /^espace-membre\.html$/.test(page);
    if (!admin && !client) return;
    if (client) {
      var connecte = false;
      try { connecte = Object.keys(localStorage).some(function (k) { return /^sb-.+-auth-token$/.test(k) && /access_token/.test(localStorage.getItem(k) || ""); }); } catch (e) {}
      if (!connecte) return;
    }
    var couleur = admin ? "#d7b66e" : "#5eead4";
    var texte = admin ? "ESPACE ADMIN" : "MON ESPACE";
    var go = function () {
      if (document.getElementById("mj-space-badge")) return;
      var ligne = document.createElement("div");
      ligne.id = "mj-space-line";
      ligne.setAttribute("aria-hidden", "true");
      ligne.style.cssText = "position:fixed;top:0;left:0;right:0;height:3px;z-index:99998;background:" + couleur + ";pointer-events:none";
      var badge = document.createElement("div");
      badge.id = "mj-space-badge";
      badge.setAttribute("role", "status");
      badge.setAttribute("aria-label", admin ? "Vous êtes dans l’espace administration" : "Vous êtes dans votre espace personnel");
      badge.style.cssText = "position:fixed;left:max(14px,env(safe-area-inset-left,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:99998;display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;border:1px solid " + couleur + ";background:rgba(7,18,37,.92);color:" + couleur + ";font:800 11.5px/1 Inter,system-ui,sans-serif;letter-spacing:.14em;pointer-events:none";
      badge.innerHTML = '<span aria-hidden="true" style="width:8px;height:8px;border-radius:50%;background:' + couleur + '"></span>' + texte;
      document.body.append(ligne, badge);
    };
    if (document.body) go(); else document.addEventListener("DOMContentLoaded", go, { once: true });
  } catch (e) {}
})();
