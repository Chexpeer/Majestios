// Onglets du cockpit : un seul volet affiché à la fois (gain de place). Les ancres existantes (#cockpit, #sources, #team, #clients) restent valides.
(function(){
 const tabs=[...document.querySelectorAll("#admin-section-nav a")],
  volets={cockpit:["#cockpit","#bureau"],sources:["#sources"],tableau:["#tableau"],team:["#team"],clients:["#clients"]},
  grid=document.querySelector(".cockpit-grid"),modules=document.querySelector("#admin-modules");
 if(!tabs.length||!grid)return;
 document.querySelector("#admin-section-nav").setAttribute("role","tablist");
 function show(id){
  if(!volets[id])id="cockpit";
  for(const [k,sels] of Object.entries(volets))for(const sel of sels){const el=document.querySelector(sel);if(el){if(k===id)el.removeAttribute("data-tab-hidden");else el.setAttribute("data-tab-hidden","");}}
  grid.toggleAttribute("data-tab-hidden",id==="cockpit");
  grid.classList.toggle("is-single",id!=="cockpit");
  for(const a of tabs){const on=a.getAttribute("href")==="#"+id;a.setAttribute("role","tab");a.setAttribute("aria-selected",String(on));a.classList.toggle("is-active",on);if(on)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current");}
 }
 for(const a of tabs)a.addEventListener("click",e=>{e.preventDefault();const id=a.getAttribute("href").slice(1);history.replaceState(null,"","#"+id);show(id);});
 addEventListener("hashchange",()=>show(location.hash.slice(1)));
 document.addEventListener("click",e=>{if(modules&&modules.open&&!modules.contains(e.target))modules.open=false;});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modules&&modules.open){modules.open=false;modules.querySelector("summary").focus();}});
 show(location.hash.slice(1));
})();
