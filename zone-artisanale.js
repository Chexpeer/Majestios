import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js";

const buildings = [
 {id:"B01",group:"central",name:"Marchés publics",color:"#397ab5",ground:"Détecter les opportunités publiques",first:"Qualification · Analyse des besoins · Préparation",second:"Veille automatisée · Analyse · Suivi",description:"Repérer les consultations publiques pertinentes et organiser leur qualification.",route:"marches-publics.html",x:-7,z:1},
 {id:"B02",group:"central",name:"Marchés privés",color:"#39865a",ground:"Opportunités et donneurs d'ordre",first:"Qualification des projets · Contacts",second:"Suivi des affaires · Relances",description:"Repérer les opportunités issues des marchés privés et les besoins des donneurs d'ordre.",route:"marches-prives.html",x:7,z:1},
 {id:"B03",group:"central",name:"Développement commercial",color:"#c8892e",ground:"Stratégie et croissance",first:"Stratégie commerciale · Transformation",second:"Outils de prospection · Pilotage",description:"Développer une stratégie commerciale et transformer les opportunités en relations d'affaires.",route:"developpement-commercial.html",x:-7,z:-5},
 {id:"B04",group:"central",name:"Prospection inversée",color:"#218d99",ground:"Ciblage : identifier les besoins",first:"Ciblage précis · Qualification fine",second:"Analyse prédictive · Matching",description:"Identifier les entreprises susceptibles d'avoir besoin de vos produits, services ou compétences.",route:"prospection-inversee.html",x:7,z:-5},
 {id:"B05",group:"central",name:"Intelligence économique",color:"#7b58a8",ground:"Collecte et décryptage",first:"Collecte d'informations · Analyse marché",second:"Veille stratégique · Indicateurs",description:"Croiser les informations utiles à la compréhension des marchés et de leur environnement.",route:"intelligence-economique.html",x:-7,z:-11},
 {id:"B06",group:"central",name:"Réseaux et synergies",color:"#c96f68",ground:"Partenariats et coopérations",first:"Partenariats · Collaboration active",second:"Synergies croisées · Réseau",description:"Identifier des complémentarités et faciliter les coopérations commerciales.",route:"reseaux-synergies.html",x:7,z:-11},
 {id:"B07",group:"peripherique",name:"Veille des marchés",color:"#438bc7",ground:"Surveillance des consultations",first:"Surveillance continue",second:"Alertes et filtres intelligents",description:"Surveiller les nouvelles consultations selon les critères de recherche de l'entreprise.",route:"veille-marches.html",x:-13,z:-2},
 {id:"B08",group:"peripherique",name:"Accompagnement aux appels d'offres",color:"#6488ad",ground:"Accompagnement AO",first:"Analyse des dossiers · Conseils",second:"Structuration des réponses",description:"Structurer la préparation des candidatures et la compréhension des dossiers.",route:"accompagnement-appels-offres.html",x:13,z:-2},
 {id:"B09",group:"peripherique",name:"Sous-traitance et débordement de marchés",color:"#b56b40",ground:"Sous-traitance",first:"Identification des besoins",second:"Partage de charges · Réseau",description:"Repérer les besoins complémentaires et les opportunités de sous-traitance.",route:"sous-traitance.html",x:-13,z:-8},
 {id:"B10",group:"peripherique",name:"Salons et séminaires",color:"#b69a50",ground:"Salons et séminaires",first:"Repérage des événements",second:"Planning et opportunités",description:"Identifier les événements professionnels utiles aux rencontres et au développement commercial.",route:"salons-seminaires.html",x:13,z:-8},
 {id:"B11",group:"peripherique",name:"Veille des entreprises — BODACC",color:"#5c8d81",ground:"Veille BODACC",first:"Créations · Cessions · Modifications",second:"Analyse des signaux faibles",description:"Suivre les événements et annonces d'entreprise publiés, notamment, au BODACC.",route:"bodacc-veille-entreprises.html",x:-13,z:-14},
 {id:"B12",group:"peripherique",name:"Suivi commercial et capitalisation",color:"#7b899d",ground:"Suivi et capitalisation",first:"Suivi des échanges · Historique",second:"Amélioration continue · REX",description:"Organiser les échanges et capitaliser sur les enseignements des actions commerciales.",route:"suivi-commercial.html",x:13,z:-14}
];
const root=document.querySelector("#scene");
const loading=document.querySelector("#scene-loading");
const title=document.querySelector("#panel-title");
const description=document.querySelector("#panel-description");
const floorList=document.querySelector("#floor-list");
const openLink=document.querySelector("#open-building");
const directory=document.querySelector("#building-directory");
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scene=new THREE.Scene();
scene.background=new THREE.Color("#b7c8d5");
scene.fog=new THREE.Fog("#b7c8d5",34,72);
const camera=new THREE.PerspectiveCamera(50,1,.1,150);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.1;
renderer.domElement.tabIndex=0;
renderer.domElement.setAttribute("aria-label","Zone 3D. Faites glisser pour tourner et sélectionnez un bâtiment.");
root.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.target.set(0,1.5,-6);
controls.enableDamping=!reducedMotion;
controls.dampingFactor=.07;
controls.minDistance=18;controls.maxDistance=48;
controls.minPolarAngle=.52;controls.maxPolarAngle=1.42;
controls.maxAzimuthAngle=.85;controls.minAzimuthAngle=-.85;
controls.enablePan=true;
const hemi=new THREE.HemisphereLight(0xeaf5ff,0x66715d,2.1);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d8,3.1);sun.position.set(-12,22,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;scene.add(sun);
const fill=new THREE.DirectionalLight(0x91baff,1.2);fill.position.set(14,10,-18);scene.add(fill);

function material(color,roughness=.8){return new THREE.MeshStandardMaterial({color,roughness,metalness:.04});}
function box(w,h,d,mat,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function labelTexture(text,color,opts={}){const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=opts.height||192;const ctx=canvas.getContext("2d");ctx.fillStyle=opts.bg||"#10243a";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=color;ctx.fillRect(0,0,9,canvas.height);ctx.fillStyle="#ffffff";ctx.textAlign="center";ctx.textBaseline="middle";let size=opts.size||48;ctx.font=`800 ${size}px Arial, sans-serif`;const max=canvas.width-70;while(ctx.measureText(text.toUpperCase()).width>max&&size>20){size-=2;ctx.font=`800 ${size}px Arial, sans-serif`;}ctx.fillText(text.toUpperCase(),canvas.width/2,canvas.height/2,max);const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
function sign(parent,text,color,y,w=5.1){const tex=labelTexture(text,color,{height:150,size:44});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,.75),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));mesh.position.set(0,y,1.97);parent.add(mesh);return mesh;}
function band(parent,text,color,y,w=5.1){const tex=labelTexture(text,color,{height:100,size:28,bg:"#17283a"});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,.5),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));mesh.position.set(0,y,1.975);parent.add(mesh);}
const ground=box(46,.5,42,material("#7b9878"),0,-.32,-6);ground.receiveShadow=true;
const asphalt=box(5,.06,43,material("#626b73"),0,-.03,-6);
const sidewalkMat=material("#d0d1c9");
box(7,.1,40,sidewalkMat,-6,-.05,-7);box(7,.1,40,sidewalkMat,6,-.05,-7);
for(let z=-26;z<15;z+=3.5){box(.12,.012,1.6,material("#f1e6c4"),0,.01,z);}
const curb=material("#e5e2d8");box(7,.13,43,curb,-6,-.01,-6);box(7,.13,43,curb,6,-.01,-6);box(5,.08,43,material("#60666a"),0,.02,-6);
const grass=material("#64835f");for(const [x,z] of [[-18,7],[18,7],[-18,-20],[18,-20]]){box(8,.08,7,grass,x,-.03,z);}
// Entrance marker: establishes the panoramic viewpoint and the identity of the zone.
const entrance=new THREE.Group();
entrance.position.set(0,0,13);
scene.add(entrance);
box(0.28,3.4,0.28,material("#263b50"),-5.9,1.7,0,entrance);
box(0.28,3.4,0.28,material("#263b50"),5.9,1.7,0,entrance);
box(12.1,0.28,0.42,material("#263b50"),0,3.35,0,entrance);
const entranceTexture=labelTexture("ZONE D'INTELLIGENCE COMMERCIALE MAJESTIOS","#d9b86c",{height:180,size:40,bg:"#10243a"});
const entranceSign=new THREE.Mesh(new THREE.PlaneGeometry(11.5,1.35),new THREE.MeshBasicMaterial({map:entranceTexture,side:THREE.DoubleSide}));
entranceSign.position.set(0,3.32,.24);
entrance.add(entranceSign);

const buildingMeshes=[];
const signMaterials=[];
for(const data of buildings){
 const color=new THREE.Color(data.color),group=new THREE.Group();group.position.set(data.x,0,data.z);group.userData.building=data;scene.add(group);
 const baseW=5.25,depth=3.8;
 const baseMat=material(color, .63),upperMat=material(color.clone().multiplyScalar(.84),.72),glass=material("#b8d3d8",.3);
 box(baseW,.25,depth,material("#d5d3cb"),0,.14,0,group);
 box(baseW,1.8,depth,baseMat,0,1.15,0,group);
 box(baseW*.94,1.55,depth*.92,upperMat,0,2.9,-.02,group);
 box(baseW*.88,1.45,depth*.86,baseMat,0,4.4,-.04,group);
 // Horizontal floor ledges make the three levels readable from the entrance.
 for(const [y,w,d] of [[2.05,5.5,4.05],[3.72,5.25,3.95],[5.18,4.95,3.75]])box(w,.12,d,material("#e0dfd7"),0,y,0,group);
 // Front windows and door on all three levels.
 for(const y of [0.92,2.7,4.18]){
  for(const x of [-1.72,-.58,.58,1.72]){const win=box(.62,.66,.055,glass,x,y,depth/2+.035,group);win.material=glass;}
 }
 box(.8,1.35,.09,material("#28394a"),0,.85,depth/2+.07,group);
 sign(group,data.name,data.color,1.62,4.9);
 band(group,data.first,data.color,3.05,4.9);
 band(group,data.second,data.color,4.52,4.75);
 // A subtle roofline marker gives the building a distinct silhouette.
 box(baseW*.91,.18,depth*.89,material(color.clone().multiplyScalar(1.18)),0,5.28,-.04,group);
 group.traverse(o=>{if(o.isMesh){o.userData.building=data;if(o.material?.color)o.userData.baseColor=o.material.color.clone();}});
 buildingMeshes.push(group);
 // Directory works as an accessible alternative to selecting small 3D objects.
 const card=document.createElement("button");card.type="button";card.className="directory-card";card.style.setProperty("--card-color",data.color);card.dataset.building=data.id;card.setAttribute("aria-pressed","false");
 card.innerHTML=`<span class="card-id">${data.id} · ${data.group==="central"?"CENTRAL":"PÉRIPHÉRIQUE"}</span><strong>${data.name}</strong><small>${data.ground}</small>`;
 card.addEventListener("click",()=>selectBuilding(data));directory.appendChild(card);
}
function tree(position,scale=1){const trunk=box(.22,1.1,.22,material("#70563e"),position.x,.48,position.z);const crown=new THREE.Mesh(new THREE.SphereGeometry(.8*scale,10,8),material("#47775c"));crown.position.set(position.x,1.5*scale,position.z);crown.castShadow=true;scene.add(crown);scene.add(trunk);}
for(const p of [{x:-19,z:2},{x:19,z:2},{x:-19,z:-11},{x:19,z:-11},{x:-19,z:-22},{x:19,z:-22}])tree(p,.8);
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let selected=null,hovered=null;
function selectBuilding(data){selected=data;title.textContent=data.name;description.textContent=data.description;floorList.innerHTML="";const floors=[["RDC",data.ground],["1er étage",data.first],["2e étage",data.second]];floors.forEach(([label,text])=>{const row=document.createElement("div");row.style.setProperty("--floor-color",data.color);const tag=document.createElement("span");tag.textContent=label;const p=document.createElement("p");p.textContent=text;row.append(tag,p);floorList.appendChild(row);});openLink.href=data.route;openLink.textContent="Découvrir "+data.name;openLink.classList.remove("is-disabled");openLink.removeAttribute("aria-disabled");document.querySelectorAll(".directory-card").forEach(c=>c.setAttribute("aria-pressed",String(c.dataset.building===data.id)));buildingMeshes.forEach(g=>{g.scale.setScalar(g.userData.building.id===data.id?1.06:1);});}
function getBuildingAt(event){const rect=renderer.domElement.getBoundingClientRect();pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(buildingMeshes,true);return hits.find(h=>h.object.userData.building)?.object.userData.building||null;}
renderer.domElement.addEventListener("pointermove",e=>{if(e.pointerType==="touch")return;const data=getBuildingAt(e);hovered=data?.id||null;renderer.domElement.style.cursor=data?"pointer":"grab";});
renderer.domElement.addEventListener("click",e=>{const data=getBuildingAt(e);if(data)selectBuilding(data);});
renderer.domElement.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();if(selected){openLink.click();}else selectBuilding(buildings[0]);}});
document.querySelector("#view-home").addEventListener("click",resetView);
document.querySelector("#zoom-in").addEventListener("click",()=>{camera.position.multiplyScalar(.88);controls.update();});
document.querySelector("#zoom-out").addEventListener("click",()=>{camera.position.multiplyScalar(1.12);controls.update();});
function resetView(){camera.position.set(0,17,35);controls.target.set(0,1.5,-6);controls.update();}
function resize(){const w=root.clientWidth,h=root.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
new ResizeObserver(resize).observe(root);resize();resetView();
function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}
animate();loading.classList.add("hidden");
