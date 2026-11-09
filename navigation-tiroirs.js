(() => {
  "use strict";
  const init = () => {
    const nav = document.querySelector("#site-nav");
    const header = document.querySelector(".site-header");
    const menuButton = document.querySelector("#menu-toggle, .menu-toggle");
    if (!nav || !header || !menuButton || nav.dataset.drawerReady === "true") return;
    nav.dataset.drawerReady = "true";
    nav.classList.add("site-nav-drawer");

    // Le bouton est stylé directement pour éviter les anciennes règles CSS
    // qui transformaient les trois barres en points alignés.
    const setImportant = (element, property, value) => element.style.setProperty(property, value, "important");
    const styleMenuButton = () => {
      const mobile = window.matchMedia("(max-width: 900px)").matches;
      if (!mobile) {
        ["display","position","z-index","width","min-width","height","min-height","padding",
         "flex","flex-direction","align-items","justify-content","gap","background","border",
         "border-radius","box-shadow","visibility","opacity","pointer-events"].forEach(p => menuButton.style.removeProperty(p));
        menuButton.querySelectorAll("span").forEach(span => {
          ["display","width","height","min-height","flex","margin","background","border-radius"].forEach(p => span.style.removeProperty(p));
        });
        return;
      }
      Object.entries({
        display:"flex",position:"relative","z-index":"2601",width:"48px","min-width":"48px",
        height:"48px","min-height":"48px",padding:"10px",flex:"0 0 48px",
        "flex-direction":"column","align-items":"center","justify-content":"center",gap:"5px",
        background:"#ffffff",border:"2px solid #d5b45b","border-radius":"10px",
        "box-shadow":"0 2px 8px #07122535",visibility:"visible",opacity:"1",
        "pointer-events":"auto",cursor:"pointer"
      }).forEach(([p,v]) => setImportant(menuButton,p,v));
      menuButton.querySelectorAll("span").forEach(span => {
        Object.entries({display:"block",width:"23px",height:"2px","min-height":"2px",
          flex:"0 0 2px",margin:"0",background:"#17324f","border-radius":"2px"}).
          forEach(([p,v]) => setImportant(span,p,v));
      });
    };
    styleMenuButton();
    window.addEventListener("resize", styleMenuButton, {passive:true});

    const groups = [
      {label:"Appels d’offres",href:"marches-publics.html",items:[["Appels d’offres publics","marches-publics.html"],["Appels d’offres privés","marches-prives.html"],["Accompagnement appels d’offres","accompagnement-appels-offres.html"]]},
      {label:"Développement commercial",href:"developpement-commercial.html",items:[["Prospection","prospection-active.html"],["Accompagnement appels d’offres","accompagnement-appels-offres.html"],["Suivi commercial","suivi-commercial.html"],["Qualification des entreprises","qualification-entreprises.html"]]},
      {label:"Réseau",href:"reseaux-synergies.html",items:[["Réseau et synergies","reseaux-synergies.html"],["Salons & séminaires","salons-seminaires.html"]]},
      {label:"Réputation virtuelle",href:"reputation-virtuelle.html",items:[["Présence et visibilité","reputation-virtuelle.html"],["Intelligence économique","intelligence-economique.html"]]},
      {label:"Espace client",href:"espace-membre.html",items:[["Espace client","espace-membre.html"]]},
      {label:"Explorer davantage",href:"veille-marches.html",items:[["Veille des marchés","veille-marches.html"],["Veille des entreprises · BODACC","bodacc-veille-entreprises.html"],["Sous-traitance","sous-traitance.html"],["Secteurs d’activité","categorie-services-numeriques.html"],["Nous rejoindre","nous-rejoindre.html"],["Espace VIP","espace-interne.html"],["Contact","contact.html"],["FAQ","faq.html"],["Vision MajestiOS","vision-majestios.html"],["Mentions légales","mentions-legales.html"],["Confidentialité","politique-confidentialite.html"]]}
    ];
    const current = location.pathname.split("/").pop() || "index.html";
    nav.replaceChildren();
    const home = document.createElement("a");
    home.className = "nav-drawer-home";
    home.href = "index.html";
    home.textContent = "Accueil";
    if (current === "index.html") home.setAttribute("aria-current","page");
    nav.append(home);

    const overlay = document.createElement("button");
    overlay.type = "button";
    overlay.className = "nav-drawer-overlay";
    overlay.setAttribute("aria-label","Fermer la navigation");
    overlay.hidden = true;
    document.body.append(overlay);

    const closeDrawer = () => { nav.classList.remove("open"); document.body.classList.remove("nav-drawer-active"); menuButton.setAttribute("aria-expanded","false"); menuButton.setAttribute("aria-label","Ouvrir le menu"); overlay.classList.remove("is-visible"); overlay.hidden = true; };
    const openDrawer = () => { nav.classList.add("open"); document.body.classList.add("nav-drawer-active"); menuButton.setAttribute("aria-expanded","true"); menuButton.setAttribute("aria-label","Fermer le menu"); overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add("is-visible")); };
    menuButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      nav.classList.contains("open") ? closeDrawer() : openDrawer();
    });
    overlay.addEventListener("click",closeDrawer);
    document.addEventListener("keydown",e => { if(e.key === "Escape") closeDrawer(); });

    groups.forEach((group,index) => {
      const section = document.createElement("section");
      section.className = "nav-drawer-section";
      section.dataset.navIndex = String(index+1);
      const title = document.createElement("a");
      title.className = "nav-group-link";
      title.href = group.href;
      title.textContent = group.label;
      if (current === group.href) title.setAttribute("aria-current","page");
      const submenu = document.createElement("div");
      submenu.className = "nav-group-items";
      submenu.hidden = true;
      group.items.forEach(([label,href]) => {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        if (current === href) a.setAttribute("aria-current","page");
        submenu.append(a);
      });

      // Les sous-menus restent fermés à l'ouverture du hamburger.
      // Sur ordinateur, ils apparaissent uniquement au survol ou au focus clavier.
      // Sur mobile/tactile, le lien principal mène directement à la rubrique.
      const desktop = () => window.matchMedia("(min-width: 901px)").matches;
      const setOpen = value => {
        submenu.hidden = !value;
        section.classList.toggle("is-open", value);
      };
      submenu.hidden = true;
      section.addEventListener("mouseenter", () => { if (desktop()) setOpen(true); });
      section.addEventListener("mouseleave", () => { if (desktop()) setOpen(false); });
      section.addEventListener("focusin", () => { if (desktop()) setOpen(true); });
      section.addEventListener("focusout", e => {
        if (desktop() && !section.contains(e.relatedTarget)) setOpen(false);
      });
      section.append(title,submenu);
      nav.append(section);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click",() => {
      if(matchMedia("(max-width: 900px)").matches) closeDrawer();
    }));
  };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();