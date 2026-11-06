import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";
const supabase=createClient(MAJESTIOS_SUPABASE.url,MAJESTIOS_SUPABASE.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const frame=document.querySelector(".admin-frame"),gate=document.querySelector("#gate"),workspace=document.querySelector("#workspace"),gateMessage=document.querySelector("#gate-message"),sessionLabel=document.querySelector("#session-label"),signout=document.querySelector("#signout");
function lock(message,signed=false){frame.classList.add("is-locked");workspace.hidden=true;gate.hidden=false;gateMessage.textContent=message;sessionLabel.textContent=signed?"Compte connecté · accès refusé":"Session non authentifiée";signout.hidden=!signed;}
async function authorize(){
 const {data:{session},error:se}=await supabase.auth.getSession();if(se)throw se;if(!session){lock("Connectez-vous avec le compte interne qui vous a été attribué. Un compte client ne permet pas d’ouvrir les recherches.");return;}
 const {data:{user},error:ue}=await supabase.auth.getUser();if(ue)throw ue;if(!user||user.id!==session.user.id){lock("Session non confirmée. Reconnectez-vous.",true);return;}
 const {data:members,error:me}=await supabase.from("organization_members").select("organization_id,role").eq("user_id",user.id).limit(100);if(me)throw me;
 const ids=(members||[]).map(x=>x.organization_id);if(!ids.length){lock("Aucune appartenance MajestiOS n’est attribuée à ce compte.",true);return;}
 const {data:orgs,error:oe}=await supabase.from("organizations").select("id,kind").in("id",ids);if(oe)throw oe;
 const internal=(orgs||[]).filter(x=>x.kind==="internal");if(internal.length!==1){lock("L’organisation interne n’a pas pu être identifiée de manière unique.",true);return;}
 const membership=members.find(x=>x.organization_id===internal[0].id);if(!membership||!["owner","admin"].includes(membership.role)){lock("Le rôle attribué ne permet pas de lancer une recherche d’administration.",true);return;}
 sessionLabel.textContent="Accès interne vérifié";signout.hidden=false;gate.hidden=true;workspace.hidden=false;frame.classList.remove("is-locked");
}
signout.addEventListener("click",async()=>{await supabase.auth.signOut();lock("Vous êtes déconnecté.");});
supabase.auth.onAuthStateChange(event=>{if(event==="SIGNED_OUT")lock("Vous êtes déconnecté.");});
try{await authorize();}catch(e){lock(e?.message||"La vérification des habilitations a échoué.",true);}
const form=document.querySelector("#search-form"),source=document.querySelector("#source"),family=document.querySelector("#family"),territoryInputs=[...document.querySelectorAll('input[name="territory"]')],department=document.querySelector("#department"),keyword=document.querySelector("#keyword"),limit=document.querySelector("#limit"),submit=document.querySelector("#submit"),status=document.querySelector("#status"),results=document.querySelector("#results"),count=document.querySelector("#count");
const zones={pdl:["44","49","53","72","85"],idf:["75","77","78","91","92","93","94","95"]};
function setStatus(message,error=false){status.textContent=message;status.classList.toggle("error",error);}
source.addEventListener("change",()=>{const isBodacc=source.value==="bodacc";family.disabled=!isBodacc;family.closest(".search-field").style.opacity=isBodacc?"1":".55";});
territoryInputs.forEach(input=>input.addEventListener("change",()=>{if(input.value==="all"&&input.checked)territoryInputs.filter(x=>x!==input).forEach(x=>x.checked=false);else if(input.checked){const all=territoryInputs.find(x=>x.value==="all");if(all)all.checked=false;}}));
function quote(value){return "'"+String(value).replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";}
function departments(){
 const precise=department.value.trim().toUpperCase();if(precise)return [precise];
 const chosen=territoryInputs.filter(x=>x.checked).map(x=>x.value);if(chosen.includes("all"))return [];
 return [...new Set(chosen.flatMap(x=>zones[x]||[]))];
}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function dateLabel(value){if(!value)return "Date non renseignée";const d=new Date(value);return Number.isNaN(d.getTime())?String(value):d.toLocaleDateString("fr-FR");}
function render(items,kind){
 results.innerHTML="";if(!items.length){results.innerHTML='<div class="search-status">Aucun résultat ne correspond à ces critères. Élargissez le territoire ou modifiez le mot-clé.</div>';return;}
 for(const item of items){
  const bodacc=kind==="bodacc",title=bodacc?(item.commercant||item.id||"Annonce BODACC"):(item.objet||item.idweb||"Avis BOAMP");
  const date=bodacc?(item.dateparution||item.dateparution_lib):(item.dateparution||item.datefindiffusion);
  const dept=bodacc?(item.numerodepartement||""):(item.code_departement||item.code_departement_prestation||"");
  const place=bodacc?[item.ville,item.departement_nom_officiel].filter(Boolean).join(" · "):[item.nomacheteur,dept?("Département "+dept):""].filter(Boolean).join(" · ");
  const category=bodacc?(item.familleavis_lib||"Annonce commerciale"):(item.nature_libelle||item.type_marche||"Avis de marché");
  const description=bodacc?(item.acte||item.jugement||item.modificationsgenerales||""):(item.descripteur_libelle||item.DONNEES?.INDEXATION?.RESUME_OBJET||"");
  const href=bodacc?item.url_complete:(item.url_avis||"https://www.boamp.fr/");
  const card=document.createElement("article");card.className="result-card";
  card.innerHTML='<div class="result-top"><div><div class="result-source">'+(bodacc?"BODACC · DILA":"BOAMP · DILA")+'</div><h3>'+escapeHtml(title)+'</h3><div class="result-meta"><span>'+escapeHtml(dateLabel(date))+'</span><span>'+escapeHtml(place||"Territoire non précisé")+'</span><span>'+escapeHtml(category)+'</span></div></div><span class="result-badge">À qualifier</span></div><p class="result-detail">'+escapeHtml(typeof description==="string"?description:JSON.stringify(description)).slice(0,650)+'</p><a class="result-link" target="_blank" rel="noopener noreferrer" href="'+escapeHtml(href)+'">Consulter l’annonce officielle ↗</a>';
  results.append(card);
 }
}
form.addEventListener("submit",async event=>{
 event.preventDefault();if(workspace.hidden)return;
 const kind=source.value,terms=departments(),kw=keyword.value.trim();if(!terms.length&&!kw&& !territoryInputs.some(x=>x.value==="all"&&x.checked)){setStatus("Sélectionnez au moins un territoire ou saisissez un mot-clé.",true);return;}
 if(terms.length>0&&!terms.every(x=>/^\d{2,3}$|^[0-9][A-Z]$/.test(x))){setStatus("Code département invalide. Utilisez un code à 2 ou 3 caractères, par exemple 72 ou 2A.",true);return;}
 submit.disabled=true;submit.textContent="Recherche en cours…";results.innerHTML="";count.textContent="INTERROGATION DE LA SOURCE";setStatus("Connexion à la source officielle "+(kind==="bodacc"?"BODACC":"BOAMP")+"…");
 try{
  const base=kind==="bodacc"?"https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales/records":"https://boamp-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/boamp/records";
  const clauses=[];if(terms.length){const field=kind==="bodacc"?"numerodepartement":"code_departement";clauses.push(field+" IN ("+terms.map(quote).join(",")+")");}
  if(kind==="bodacc"&&family.value)clauses.push("familleavis_lib = "+quote(family.value));
  if(kw){const fields=kind==="bodacc"?["commercant","ville","acte","listeetablissements"]:["objet","nomacheteur","descripteur_libelle"];clauses.push("("+fields.map(f=>"search("+f+", "+quote(kw)+")").join(" OR ")+")");}
  const params=new URLSearchParams({limit:limit.value,order_by:"dateparution DESC"});if(clauses.length)params.set("where",clauses.join(" AND "));
  const response=await fetch(base+"?"+params.toString(),{headers:{Accept:"application/json"}});
  if(!response.ok)throw new Error("La source a répondu avec le statut HTTP "+response.status+".");
  const payload=await response.json();const items=payload.results||[];render(items,kind);count.textContent=(payload.total_count??items.length)+" ANNONCE(S) CORRESPONDANTE(S) · "+items.length+" AFFICHÉE(S)";
  setStatus("Recherche terminée. "+items.length+" résultat(s) affiché(s) sur "+(payload.total_count??items.length)+". Les résultats ne sont pas enregistrés dans le CRM : ils sont uniquement consultables et à qualifier.");
 }catch(error){setStatus("La recherche n’a pas abouti : "+(error?.message||"erreur inconnue")+". Vérifiez la disponibilité de la source ou réessayez plus tard.",true);count.textContent="RECHERCHE NON ABOUTIE";}
 finally{submit.disabled=false;submit.textContent="Lancer la recherche";}
});
