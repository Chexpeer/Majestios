import { createClient } from "https://esm.sh/@supabase/supabase-js@2.119.0";
import { MAJESTIOS_SUPABASE } from "./supabase-config.js";
import { buildAttente, compterRelances, formatActivites, ACCES_RAPIDES, dateCourte } from "./bureau-admin.mjs";
const supabase=createClient(MAJESTIOS_SUPABASE.url,MAJESTIOS_SUPABASE.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const frame=document.querySelector(".admin-frame"),gate=document.querySelector("#admin-gate"),gateMessage=document.querySelector("#admin-gate-message"),workspace=document.querySelector("#admin-workspace"),sessionLabel=document.querySelector("#admin-session-label"),signOutButton=document.querySelector("#admin-signout");
function showGate(message,signedIn=false){frame.classList.add("is-locked");workspace.hidden=true;gate.hidden=false;gateMessage.textContent=message;sessionLabel.textContent=signedIn?"Compte connecté · accès refusé":"Session non authentifiée";signOutButton.hidden=!signedIn;}
function sourceStatus(status){return ({active:["Référencé actif","is-active"],ready:["Prêt à raccorder",""],assessment:["En évaluation",""],planned:["Planifié","is-planned"],paused:["En pause","is-planned"],retired:["Retiré","is-planned"]})[status]||["Statut à vérifier","is-planned"];}
function safeUrl(value){try{const u=new URL(value);return ["https:","http:"].includes(u.protocol)?u.href:null;}catch{return null;}}
function renderSources(rows){const list=document.querySelector("#source-list");list.replaceChildren();for(const row of rows){const item=document.createElement("div");item.className="source-item";const info=document.createElement("div");info.style.minWidth="0";const name=document.createElement("span");name.className="source-name";name.textContent=row.display_name;const meta=document.createElement("span");meta.className="source-meta";meta.textContent=row.last_successful_sync_at?"Dernier succès : "+new Date(row.last_successful_sync_at).toLocaleDateString("fr-FR"):"Aucune synchronisation réussie enregistrée";info.append(name,meta);const state=sourceStatus(row.connector_status),badge=document.createElement("span");badge.className="source-state "+state[1];badge.textContent=state[0];const href=safeUrl(row.official_homepage);if(href){const a=document.createElement("a");a.href=href;a.target="_blank";a.rel="noopener noreferrer";a.append(info);item.append(a,badge);}else item.append(info,badge);list.append(item);}}
async function loadInstruments(orgId){
 const results=await Promise.all([
  supabase.from("official_data_sources").select("source_key,display_name,official_homepage,connector_status,last_successful_sync_at").order("display_name"),
  supabase.from("organization_members").select("id",{count:"exact",head:true}).eq("organization_id",orgId),
  supabase.from("businesses").select("id",{count:"exact",head:true}).eq("organization_id",orgId),
  supabase.from("contacts").select("id",{count:"exact",head:true}).eq("organization_id",orgId),
  supabase.from("opportunities").select("id",{count:"exact",head:true}).eq("organization_id",orgId)
 ]);
 const [sr,mr,br,cr,or]=results;
 if(sr.error)throw sr.error;
 if(mr.error)throw mr.error;
 const sources=sr.data||[];
 renderSources(sources);
 document.querySelector("#metric-sources").textContent=String(sources.length);
 document.querySelector("#metric-active").textContent=String(sources.filter(x=>x.connector_status==="active").length);
 document.querySelector("#metric-sync").textContent=String(sources.filter(x=>x.last_successful_sync_at).length);
 const memberCount=mr.count??0;
 document.querySelector("#metric-members").textContent=String(memberCount);
 document.querySelector("#member-count").textContent=String(memberCount);
 for(const [selector,result] of [
  ["#metric-crm-businesses",br],
  ["#metric-crm-contacts",cr],
  ["#metric-crm-opportunities",or]
 ]){
  const metric=document.querySelector(selector);
  if(result.error){
   metric.textContent="—";
   metric.title="Indicateur CRM indisponible pour cette session";
   console.warn("CRM overview metric unavailable",selector,result.error);
  }else{
   metric.textContent=String(result.count??0);
   metric.removeAttribute("title");
  }
 }
}

function bureauEl(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
async function loadBureau(orgId){
 const acces=document.querySelector("#bureau-acces");acces.replaceChildren();
 for(const x of ACCES_RAPIDES){const a=bureauEl("a");a.href=x.href;a.append(bureauEl("strong","",x.titre),bureauEl("span","",x.detail));acces.append(a);}
 const [rel,ann,biz,con,opp,mem,act]=await Promise.all([
  supabase.from("crm_reminders").select("due_at").eq("organization_id",orgId).eq("state","pending").limit(500),
  supabase.rpc("moderation_queue",{p_status:"pending",p_limit:50}),
  supabase.from("businesses").select("id",{count:"exact",head:true}).eq("organization_id",orgId),
  supabase.from("contacts").select("id",{count:"exact",head:true}).eq("organization_id",orgId),
  supabase.from("opportunities").select("id",{count:"exact",head:true}).eq("organization_id",orgId),
  supabase.from("organization_members").select("id",{count:"exact",head:true}).eq("organization_id",orgId),
  supabase.from("activities").select("activity_type,subject,occurred_at,created_at").eq("organization_id",orgId).order("occurred_at",{ascending:false}).limit(8)
 ].map(p=>Promise.resolve(p).catch(error=>({error}))));
 for(const [id,r] of [["businesses",biz],["contacts",con],["opportunities",opp],["members",mem]])document.querySelector("#bureau-kpi-"+id).textContent=r.error?"—":String(r.count??0);
 const counts=rel.error?null:compterRelances(rel.data);
 const items=buildAttente({relancesEnRetard:counts?counts.retard:null,relancesAVenir:counts?counts.avenir:null,annoncesARelire:ann.error||!Array.isArray(ann.data)?null:ann.data.length});
 const list=document.querySelector("#bureau-attente");list.replaceChildren();
 if(!items.length){list.append(bureauEl("li","is-ok","Rien en attente : tout est à jour."));}
 for(const it of items){const li=bureauEl("li",it.urgent?"is-urgent":"");const a=bureauEl("a");a.href=it.href;a.append(bureauEl("span","",it.texte),bureauEl("small","",it.disponible?"Ouvrir →":"—"));li.append(a);list.append(li);}
 const alist=document.querySelector("#bureau-activites");alist.replaceChildren();
 if(act.error){alist.append(bureauEl("li","","Activités indisponibles pour cette session."));}
 else{const rows=formatActivites(act.data);if(!rows.length)alist.append(bureauEl("li","","Aucune activité enregistrée pour le moment."));for(const r of rows){const li=bureauEl("li");li.append(bureauEl("span","",`${r.type} · ${r.sujet}`),bureauEl("small","",dateCourte(r.quand)));alist.append(li);}}
}
async function verifyInternalAdmin(){gateMessage.textContent="Vérification de votre identité et de vos habilitations…";const {data:{session},error:se}=await supabase.auth.getSession();if(se)throw se;if(!session){showGate("Identifiez-vous par l’accès VIP. Le cockpit reste fermé tant que votre identité n’est pas confirmée.");return;}const {data:{user},error:ue}=await supabase.auth.getUser();if(ue)throw ue;if(!user||user.id!==session.user.id){showGate("Votre session n’a pas pu être confirmée. Reconnectez-vous.",true);return;}const {data:memberships,error:me}=await supabase.from("organization_members").select("organization_id,role").eq("user_id",user.id).limit(100);if(me)throw me;if(!memberships?.length){showGate("Aucune appartenance interne n’est attribuée à ce compte. Aucun accès de pilotage n’est accordé.",true);return;}const ids=memberships.map(x=>x.organization_id),{data:orgs,error:oe}=await supabase.from("organizations").select("id,name,kind").in("id",ids);if(oe)throw oe;const internal=(orgs||[]).filter(x=>x.kind==="internal");if(internal.length!==1){showGate(internal.length?"Plusieurs organisations internes sont associées à ce compte. Accès suspendu.":"Ce compte ne possède pas d’appartenance à l’organisation interne MajestiOS.",true);return;}const org=internal[0],membership=memberships.find(x=>x.organization_id===org.id);if(!membership||!["owner","admin"].includes(membership.role)){showGate("Votre rôle ne vous autorise pas à ouvrir le poste de commandement.",true);return;}document.querySelector("#admin-organization-name").textContent=org.name||"Organisation interne";document.querySelector("#admin-role-label").textContent=membership.role==="owner"?"Propriétaire interne":"Administrateur interne";sessionLabel.textContent="Accès VIP · habilitation vérifiée";signOutButton.hidden=false;frame.classList.remove("is-locked");gate.hidden=true;workspace.hidden=false;loadBureau(org.id).catch(error=>console.warn("Bureau data unavailable",error));try{await loadInstruments(org.id);}catch(error){console.error("Cockpit data loading failed",error);document.querySelector("#source-list").textContent="Le catalogue des sources n’a pas pu être chargé. Vérifiez les autorisations de lecture.";}}
signOutButton.addEventListener("click",async()=>{signOutButton.disabled=true;const {error}=await supabase.auth.signOut();signOutButton.disabled=false;if(error){showGate("La déconnexion n’a pas abouti. Réessayez.",true);return;}showGate("Vous êtes déconnecté. Identifiez-vous par l’accès VIP.");});
supabase.auth.onAuthStateChange(event=>{if(event==="SIGNED_OUT")showGate("Vous êtes déconnecté. Identifiez-vous par l’accès VIP.");});
try{await verifyInternalAdmin();}catch(error){console.error("Admin access verification failed",error);showGate(error?.message||"La vérification des habilitations a échoué. Le cockpit reste fermé.",true);}
