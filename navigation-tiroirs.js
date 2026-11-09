(() => {
  "use strict";
  const init = () => {
    const nav = document.querySelector("#site-nav");
    const header = document.querySelector(".site-header");
    const menuButton = document.querySelector(".menu-toggle");
    if (!nav || !header || !menuButton || nav.dataset.drawerReady === "true") return;
    nav.dataset.drawerReady = "true";
    nav.classList.add("site-nav-drawer");
    // Styles inline prioritaires : le bouton reste utilisable même si une ancienne
    // feuille CSS du thème écrase les règles du hamburger.
    const applyHamburgerStyle = () => {
      if (!matchMedia("(max-width: 900px)").matches) return;
      menuButton.style.setProperty("display","flex","important");
      menuButton.style.setProperty("visibility","visible","important");
      menuButton.style.setProperty("opacity","1","important");
      menuButton.style.setProperty("pointer-events","auto","important");
      menuButton.style.setProperty("position","relative","important");
      menuButton.style.setProperty("z-index","99999","important");
      menuButton.style.setProperty("width","48px","important");
      menuButton.style.setProperty("min-width","48px","important");
      menuButton.style.setProperty("height","48px","important");
      menuButton.style.setProperty("min-height","48px","important");
      menuButton.style.setProperty("padding","10px","important");
      menuButton.style.setProperty("flex-direction","column","important");
      menuButton.style.setProperty("align-items","center","important");
      menuButton.style.setProperty("justify-content","center","important");
      menuButton.style.setProperty("gap","5px","important");
      menuButton.style.setProperty("background","#ffffff","important");
      menuButton.style.setProperty("border","2px solid #17324f","important");
      menuButton.style.setProperty("border-radius","10px","important");
      menuButton.style.setProperty("box-shadow","0 2px 8px #10243b30","important");
      menuButton.querySelectorAll("span").forEach(span => {
        span.style.setProperty("display","block","important");
        span.style.setProperty("width","22px","important");
        span.style.setProperty("height","2px","important");
        span.style.setProperty("min-height","2px","important");
        span.style.setProperty("margin","0","important");
        span.style.setProperty("background","#17324f","important");
        span.style.setProperty("border-radius","2px","important");
        span.style.setProperty("transform","none","important");
        span.style.setProperty("opacity","1","important");
      });
    };
    applyHamburgerStyle();
    window.addEventListener("resize",applyHamburgerStyle);
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = new URL("navigation-tiroirs.css", document.baseURI).href;
    css.dataset.majestiosNavigation = "true";
    document.head.append(css);

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

    const closeDrawer = () => {
      nav.classList.remove("open");
      overlay.classList.remove("is-visible");
      overlay.hidden = true;
      document.body.classList.remove("nav-drawer-active");
      menuButton.setAttribute("aria-expanded","false");
      menuButton.setAttribute("aria-label","Ouvrir le menu");
    };
    const openDrawer = () => {
      nav.classList.add("open");
      overlay.hidden = false;
      overlay.classList.add("is-visible");
      document.body.classList.add("nav-drawer-active");
      menuButton.setAttribute("aria-expanded","true");
      menuButton.setAttribute("aria-label","Fermer le menu");
    };
    menuButton.addEventListener("click",() => nav.classList.contains("open") ? closeDrawer() : openDrawer());
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
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "nav-group-toggle";
      toggle.textContent = "⌄";
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Dérouler "+group.label);
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
      const setOpen = value => {
        submenu.hidden = !value;
        section.classList.toggle("is-open",value);
        toggle.setAttribute("aria-expanded",String(value));
        toggle.setAttribute("aria-label",(value?"Replier ":"Dérouler ")+group.label);
      };
      toggle.addEventListener("click",() => setOpen(submenu.hidden));
      section.addEventListener("mouseenter",() => { if(matchMedia("(min-width: 901px)").matches) setOpen(true); });
      section.addEventListener("mouseleave",() => { if(matchMedia("(min-width: 901px)").matches) setOpen(false); });
      section.addEventListener("focusout",e => { if(matchMedia("(min-width: 901px)").matches && !section.contains(e.relatedTarget)) setOpen(false); });
      section.append(title,toggle,submenu);
      nav.append(section);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click",() => {
      if(matchMedia("(max-width: 900px)").matches) closeDrawer();
    }));
  };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();