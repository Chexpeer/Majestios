(() => {
  "use strict";
  const ensureSharedAssets = () => {
    if (!document.querySelector('link[data-majestios-shared-nav="css"], link[href*="navigation-tiroirs.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "navigation-tiroirs.css";
      link.dataset.majestiosSharedNav = "css";
      document.head.append(link);
    }
  };

  const ensureNavigationShell = () => {
    let header = document.querySelector(".site-header");
    if (header && header.querySelector("#site-nav")) {
      if (!header.querySelector("#menu-toggle, .menu-toggle")) {
        const button = document.createElement("button");
        button.id = "menu-toggle";
        button.className = "menu-toggle";
        button.type = "button";
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "site-nav");
        button.setAttribute("aria-label", "Ouvrir le menu");
        button.innerHTML = "<span></span><span></span><span></span>";
        header.insertBefore(button, header.querySelector("#site-nav"));
      }
      return header;
    }
    if (!header) {
      header = document.createElement("header");
      header.className = "site-header";
      header.innerHTML = '<a class="brand" href="index.html" aria-label="MajestiOS, accueil"><span class="brand-mark" aria-hidden="true">M</span><span>majesti<span class="brand-os">OS</span></span></a><button id="menu-toggle" class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button><nav class="site-nav" id="site-nav" aria-label="Navigation principale"></nav>';
      document.body.insertBefore(header, document.body.firstChild);
    } else if (!header.querySelector("#site-nav")) {
      const nav = document.createElement("nav");
      nav.className = "site-nav";
      nav.id = "site-nav";
      nav.setAttribute("aria-label", "Navigation principale");
      header.append(nav);
      if (!header.querySelector("#menu-toggle, .menu-toggle")) {
        const button = document.createElement("button");
        button.id = "menu-toggle";
        button.className = "menu-toggle";
        button.type = "button";
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "site-nav");
        button.setAttribute("aria-label", "Ouvrir le menu");
        button.innerHTML = "<span></span><span></span><span></span>";
        header.insertBefore(button, nav);
      }
    }
    return header;
  };

  const init = () => {
    ensureSharedAssets();
    const header = ensureNavigationShell();
    const nav = document.querySelector("#site-nav");
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
        display:"flex",position:"relative","z-index":"2601",width:"34px","min-width":"34px",
        height:"34px","min-height":"34px",padding:"6px",flex:"0 0 34px",
        "flex-direction":"column","align-items":"center","justify-content":"center",gap:"4px",
        background:"linear-gradient(145deg,#142b49,#071225)",border:"1px solid rgba(213,181,108,.72)","border-radius":"7px",
        "box-shadow":"0 3px 12px rgba(0,0,0,.3)",visibility:"visible",opacity:"1",
        "pointer-events":"auto",cursor:"pointer"
      }).forEach(([p,v]) => setImportant(menuButton,p,v));
      menuButton.querySelectorAll("span").forEach(span => {
        Object.entries({display:"block",width:"18px",height:"2px","min-height":"2px",
          flex:"0 0 2px",margin:"0",background:"#f0d38b","border-radius":"2px"}).
          forEach(([p,v]) => setImportant(span,p,v));
      });
    };
    styleMenuButton();
    window.addEventListener("resize", styleMenuButton, {passive:true});

    const groups = [
      {label:"Appels d’offres",href:"marches-publics.html",items:[["Appels d’offres publics","marches-publics.html"],["Marchés privés","marches-prives.html"],["Accompagnement appels d’offres","accompagnement-appels-offres.html"],["Veille des marchés","veille-marches.html"],["Sous-traitance","sous-traitance.html"]]},
      {label:"Développement commercial",href:"developpement-commercial.html",items:[["Vue d’ensemble","developpement-commercial.html"],["Prospection","prospection-active.html"],["Qualification des entreprises","qualification-entreprises.html"],["Veille BODACC","bodacc-veille-entreprises.html"],["Intelligence économique","intelligence-economique.html"],["Suivi commercial","suivi-commercial.html"]]},
      {label:"Réseau",href:"reseaux-synergies.html",items:[["Réseau et synergies","reseaux-synergies.html"],["Salons & séminaires","salons-seminaires.html"],["Nous rejoindre","nous-rejoindre.html"]]},
      {label:"Services",href:"reputation-virtuelle.html",items:[["Réputation virtuelle","reputation-virtuelle.html"],["Facturation électronique","facturation-electronique.html"]]},
      {label:"Assistant",href:"assistant-majestios.html",items:[["Assistant MajestiOS","assistant-majestios.html"]]},
      {label:"Accéder à mon espace personnel",href:"espace-membre.html",cls:"nav-account",items:[["Mon espace personnel","espace-membre.html"],["Créer mon espace personnel","espace-membre.html#creation"],["Accès VIP · Administration","espace-interne.html"]]}
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

    const closeDrawer = () => { nav.classList.remove("open"); document.body.classList.remove("nav-drawer-active"); menuButton.setAttribute("aria-expanded","false"); menuButton.setAttribute("aria-label","Ouvrir le menu"); overlay.classList.remove("is-visible"); overlay.hidden = true; nav.querySelectorAll(".nav-drawer-section").forEach(section => { const submenu = section.querySelector(".nav-group-items"); const title = section.querySelector(".nav-group-link"); if (submenu) submenu.hidden = true; if (title) title.setAttribute("aria-expanded","false"); section.classList.remove("is-open"); }); };
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
      if (group.cls) section.classList.add(group.cls);
      // Un onglet principal est un contrôle d'ouverture, jamais un lien.
      // Seuls les liens du sous-menu déclenchent une navigation.
      const title = document.createElement("button");
      title.type = "button";
      title.className = "nav-group-link";
      title.textContent = group.label;
      const submenu = document.createElement("div");
      submenu.className = "nav-group-items";
      submenu.id = `nav-submenu-${index + 1}`;
      submenu.hidden = true;
      title.setAttribute("aria-controls", submenu.id);
      title.setAttribute("aria-expanded", "false");
      group.items.forEach(([label,href]) => {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        if (href === "espace-interne.html") a.classList.add("nav-vip-link");
        if (current === href.split("#")[0] && href.includes("#") === false) a.setAttribute("aria-current","page");
        if (current === href) a.setAttribute("aria-current","page");
        submenu.append(a);
      });

      // Les sous-menus restent fermés à l'ouverture du hamburger.
      // Sur ordinateur, ils apparaissent au survol ou au focus clavier.
      // Sur mobile/tactile, le bouton principal ne navigue jamais : il ouvre/ferme le sous-menu.
      const desktop = () => window.matchMedia("(min-width: 901px)").matches;
      const setOpen = value => {
        submenu.hidden = !value;
        section.classList.toggle("is-open", value);
        title.setAttribute("aria-expanded", String(value));
      };
      submenu.hidden = true;

      // Sur téléphone, chaque toucher ouvre ou referme le tiroir.
      // Aucun clic sur un onglet principal ne peut rediriger vers une page.
      title.addEventListener("click", () => {
        if (submenu.children.length === 0) return;
        // Sur ordinateur, le survol révèle le sous-menu et le clic ouvre la rubrique.
        // Sur mobile, le premier niveau reste un contrôle d'ouverture du tiroir.
        if (desktop()) {
          location.href = group.href;
          return;
        }
        const shouldOpen = submenu.hidden;
        nav.querySelectorAll(".nav-drawer-section").forEach(other => {
          const otherSubmenu = other.querySelector(".nav-group-items");
          const otherTitle = other.querySelector(".nav-group-link");
          if (otherSubmenu && otherSubmenu !== submenu) {
            otherSubmenu.hidden = true;
            other.classList.remove("is-open");
            otherTitle?.setAttribute("aria-expanded", "false");
          }
        });
        setOpen(shouldOpen);
      });

      // Délai de fermeture : laisse le temps d'atteindre et de cliquer un lien du sous-menu.
      let closeTimer = 0;
      section.addEventListener("mouseenter", () => {
        if (!desktop()) return;
        clearTimeout(closeTimer);
        nav.querySelectorAll(".nav-drawer-section").forEach(other => {
          if (other !== section) other.dispatchEvent(new CustomEvent("nav-close-now"));
        });
        setOpen(true);
      });
      section.addEventListener("mouseleave", () => {
        if (!desktop()) return;
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => setOpen(false), 600);
      });
      section.addEventListener("nav-close-now", () => { clearTimeout(closeTimer); if (desktop()) setOpen(false); });
      section.addEventListener("focusin", () => { if (desktop()) setOpen(true); });
      section.addEventListener("focusout", e => {
        if (desktop() && !section.contains(e.relatedTarget)) setOpen(false);
      });
      section.append(title,submenu);
      nav.append(section);
    });
    // Bandeau de fin de page : renvoi quasi systématique vers l'espace personnel.
    const main = document.querySelector("main.interior-page");
    const skip = /^(espace-|crm|admin|contact|nous-rejoindre|assistant|mentions|confidentialite|cgu|faq)/;
    if (main && !skip.test(current) && !main.querySelector(".page-cta")) {
      const band = document.createElement("aside");
      band.className = "page-cta";
      band.innerHTML = '<p>Retrouvez vos recherches et votre suivi au même endroit.</p><div class="page-cta-actions"><a href="espace-membre.html">Accéder à mon espace personnel</a><small>Pas encore d’espace ? <a href="espace-membre.html#creation">Créer mon espace personnel</a></small></div>';
      main.append(band);
    }
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click",() => {
      if(matchMedia("(max-width: 900px)").matches) closeDrawer();
    }));
  };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();