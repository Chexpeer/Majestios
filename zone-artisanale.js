import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/controls/OrbitControls.js";

// Toute erreur d’initialisation synchrone doit déclencher le mode de secours de l’accueil.
try {

const rubricRoute = (key) => {
  const rubric = window.MAJESTIOS_CATALOG?.rubrics.find((item) => item.key === key);
  if (!rubric) throw new Error(`Destination de rubrique absente du catalogue partagé : ${key}`);
  return rubric.href;
};

const buildings = [
 {id:"B01",group:"central",name:"Marchés publics",color:"#397ab5",ground:"Détecter les opportunités publiques",first:"Qualification · Analyse des besoins · Préparation",second:"Veille automatisée · Analyse · Suivi",firstRoute:"accompagnement-appels-offres.html",secondRoute:"veille-marches.html",description:"Repérer les consultations publiques pertinentes et organiser leur qualification.",route:rubricRoute("marches-publics"),x:-7,z:1},
 {id:"B02",group:"central",name:"Marchés privés",color:"#39865a",ground:"Opportunités et donneurs d'ordre",first:"Qualification des projets · Contacts",second:"Suivi des affaires · Relances",firstRoute:"sous-traitance.html",secondRoute:"suivi-commercial.html",description:"Repérer les opportunités issues des marchés privés et les besoins des donneurs d'ordre.",route:rubricRoute("marches-prives"),x:7,z:1},
 {id:"B03",group:"central",name:"Développement commercial",color:"#c8892e",ground:"Stratégie et croissance",first:"Stratégie commerciale · Transformation",second:"Outils de prospection · Pilotage",firstRoute:"prospection-inversee.html",secondRoute:"suivi-commercial.html",description:"Développer une stratégie commerciale et transformer les opportunités en relations d'affaires.",route:rubricRoute("developpement-commercial"),x:-7,z:-5},
 {id:"B04",group:"central",name:"Prospection inversée",color:"#218d99",ground:"Ciblage : identifier les besoins",first:"Ciblage précis · Qualification fine",second:"Analyse prédictive · Matching",firstRoute:"intelligence-economique.html",secondRoute:"developpement-commercial.html",description:"Identifier les entreprises susceptibles d'avoir besoin de vos produits, services ou compétences.",route:rubricRoute("prospection-inversee"),x:7,z:-5},
 {id:"B05",group:"central",name:"Intelligence économique",color:"#7b58a8",ground:"Collecte et décryptage",first:"Collecte d'informations · Analyse marché",second:"Veille stratégique · Indicateurs",firstRoute:"veille-marches.html",secondRoute:"bodacc-veille-entreprises.html",description:"Croiser les informations utiles à la compréhension des marchés et de leur environnement.",route:rubricRoute("intelligence-economique"),x:-7,z:-11},
 {id:"B06",group:"peripherique",name:"Réseaux et synergies",color:"#c96f68",ground:"Partenariats et coopérations",first:"Partenariats · Collaboration active",second:"Synergies croisées · Réseau",firstRoute:"salons-seminaires.html",secondRoute:"sous-traitance.html",description:"Identifier des complémentarités et faciliter les coopérations commerciales.",route:rubricRoute("reseaux-synergies"),x:-13,z:-2},
 {id:"B07",group:"central",name:"Veille des marchés",color:"#438bc7",ground:"Surveillance des consultations",first:"Surveillance continue",second:"Alertes et filtres intelligents",firstRoute:"marches-publics.html",secondRoute:"accompagnement-appels-offres.html",description:"Surveiller les nouvelles consultations selon les critères de recherche de l'entreprise.",route:rubricRoute("veille-marches"),x:7,z:-11},
 {id:"B08",group:"peripherique",name:"Accompagnement aux appels d'offres",color:"#6488ad",ground:"Accompagnement AO",first:"Analyse des dossiers · Conseils",second:"Structuration des réponses",firstRoute:"marches-publics.html",secondRoute:"marches-prives.html",description:"Structurer la préparation des candidatures et la compréhension des dossiers.",route:rubricRoute("accompagnement-appels-offres"),x:13,z:-2},
 {id:"B09",group:"peripherique",name:"Sous-traitance et débordement de marchés",color:"#b56b40",ground:"Sous-traitance",first:"Identification des besoins",second:"Partage de charges · Réseau",firstRoute:"marches-prives.html",secondRoute:"reseaux-synergies.html",description:"Repérer les besoins complémentaires et les opportunités de sous-traitance.",route:rubricRoute("sous-traitance"),x:-13,z:-8},
 {id:"B10",group:"peripherique",name:"Salons et séminaires",color:"#b69a50",ground:"Salons et séminaires",first:"Repérage des événements",second:"Planning et opportunités",firstRoute:"reseaux-synergies.html",secondRoute:"developpement-commercial.html",description:"Identifier les événements professionnels utiles aux rencontres et au développement commercial.",route:rubricRoute("salons-seminaires"),x:13,z:-8},
 {id:"B11",group:"peripherique",name:"Veille des entreprises — BODACC",color:"#5c8d81",ground:"Veille BODACC",first:"Créations · Cessions · Modifications",second:"Analyse des signaux faibles",firstRoute:"prospection-inversee.html",secondRoute:"intelligence-economique.html",description:"Suivre les événements et annonces d'entreprise publiés, notamment, au BODACC.",route:rubricRoute("bodacc-veille-entreprises"),x:-13,z:-14},
 {id:"B12",group:"peripherique",name:"Suivi commercial et capitalisation",color:"#7b899d",ground:"Suivi et capitalisation",first:"Suivi des échanges · Historique",second:"Amélioration continue · REX",firstRoute:"developpement-commercial.html",secondRoute:"intelligence-economique.html",description:"Organiser les échanges et capitaliser sur les enseignements des actions commerciales.",route:rubricRoute("suivi-commercial"),x:13,z:-14}
];
const root=document.querySelector("#scene");
const loading=document.querySelector("#scene-loading");
const title=document.querySelector("#panel-title");
const description=document.querySelector("#panel-description");
const floorList=document.querySelector("#floor-list");if(floorList)floorList.hidden=true;
const openLink=document.querySelector("#open-building");
openLink.addEventListener("click",event=>{if(openLink.getAttribute("aria-disabled")==="true")event.preventDefault();});
const directory=document.querySelector("#building-directory");
const mapRoot=document.querySelector("#zone-map");
const mapBuildings=document.querySelector("#map-buildings");
const hoverCard=document.querySelector("#hover-card");
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scene=new THREE.Scene();
scene.background=new THREE.Color("#0b1119");
scene.fog=new THREE.Fog("#0b1119",42,88);
const camera=new THREE.PerspectiveCamera(50,1,.1,150);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
// Limiter le nombre de pixels réellement calculés, surtout sur les écrans mobiles haute densité.
const pixelRatioCap=window.matchMedia("(max-width: 760px)").matches?1.15:1.5;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,pixelRatioCap));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.1;
renderer.domElement.tabIndex=0;
renderer.domElement.setAttribute("aria-label","Zone 3D. Faites glisser pour tourner et sélectionnez un bâtiment.");
renderer.domElement.addEventListener("webglcontextlost", (event) => {
 event.preventDefault();
 if (typeof window.majestiosSceneFallback === "function") {
  window.majestiosSceneFallback();
 } else if (loading) {
  loading.classList.remove("hidden");
  loading.classList.add("scene-error");
  loading.setAttribute("role", "alert");
  loading.innerHTML = '<p>La vue 3D a été interrompue par le navigateur.</p><p><a href="index.html">Retour à l’accueil MajestiOS</a> · Rechargez la page pour réessayer.</p>';
 }
});
root.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.target.set(0,1.5,-6);
controls.enableDamping=!reducedMotion;
controls.dampingFactor=.07;
controls.minDistance=18;controls.maxDistance=48;
controls.minPolarAngle=.52;controls.maxPolarAngle=1.42;
controls.maxAzimuthAngle=1.25;controls.minAzimuthAngle=-1.25;
controls.enablePan=true;
controls.panSpeed=.65;
controls.rotateSpeed=.7;
controls.zoomSpeed=.8;
// Une manipulation manuelle doit reprendre la main sur le déplacement automatique.
controls.addEventListener("start",()=>{cameraDestination=null;targetDestination=null;});
// Sur mobile, un doigt fait pivoter la vue ; deux doigts zooment et déplacent la caméra.
controls.touches.ONE=THREE.TOUCH.ROTATE;
controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
controls.touches.THREE=THREE.TOUCH.DOLLY_PAN;
const hemi=new THREE.HemisphereLight(0xeaf5ff,0x66715d,2.1);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff0d8,3.1);sun.position.set(-12,22,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;scene.add(sun);
const fill=new THREE.DirectionalLight(0x91baff,1.2);fill.position.set(14,10,-18);scene.add(fill);

function material(color,roughness=.8){return new THREE.MeshStandardMaterial({color,roughness,metalness:.04});}
function box(w,h,d,mat,x,y,z,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function labelTexture(text,color,opts={}){const canvas=document.createElement("canvas");canvas.width=1024;canvas.height=opts.height||192;const ctx=canvas.getContext("2d");ctx.fillStyle=opts.bg||"#10243a";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=color;ctx.fillRect(0,0,10,canvas.height);ctx.fillStyle="#ffffff";ctx.textAlign="center";ctx.textBaseline="middle";let size=opts.size||48;ctx.font=`800 ${size}px Arial, sans-serif`;const max=canvas.width-76;const words=text.toUpperCase().split(/\s+/);let lines=[];let line="";for(const word of words){const candidate=line?`${line} ${word}`:word;if(opts.wrap&&ctx.measureText(candidate).width>max&&line){lines.push(line);line=word;}else{line=candidate;}}if(line)lines.push(line);if(!opts.wrap){while(ctx.measureText(text.toUpperCase()).width>max&&size>20){size-=2;ctx.font=`800 ${size}px Arial, sans-serif`;}lines=[text.toUpperCase()];}else{while(lines.some(part=>ctx.measureText(part).width>max)&&size>28){size-=2;ctx.font=`800 ${size}px Arial, sans-serif`;lines=[];line="";for(const word of words){const candidate=line?`${line} ${word}`:word;if(ctx.measureText(candidate).width>max&&line){lines.push(line);line=word;}else{line=candidate;}}if(line)lines.push(line);}}const lineHeight=size*1.18;const startY=canvas.height/2-((lines.length-1)*lineHeight)/2;lines.forEach((part,index)=>ctx.fillText(part,canvas.width/2,startY+index*lineHeight,max));const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;}
function sign(parent,text,color,y,w=5.1){const tex=labelTexture(text,color,{height:210,size:48,bg:"#0b1a2b",wrap:true});const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,1.05),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));mesh.position.set(0,y,1.98);mesh.renderOrder=3;parent.add(mesh);return mesh;}
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
const entranceTexture=labelTexture("ZONE DE DÉVELOPPEMENT COMMERCIAL MAJESTIOS","#d9b86c",{height:180,size:40,bg:"#10243a"});
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
 // A flat rooftop sign makes the rubric readable from the aerial/top-down modes.
 const roofLabelTexture=labelTexture(data.name,data.color,{height:240,size:46,bg:"#071321",wrap:true});
 const roofLabel=new THREE.Mesh(new THREE.PlaneGeometry(5.05,1.35),new THREE.MeshBasicMaterial({map:roofLabelTexture,side:THREE.DoubleSide,transparent:false}));
 roofLabel.rotation.x=-Math.PI/2; roofLabel.position.set(0,5.92,-.04); roofLabel.renderOrder=2; roofLabel.userData.building=data; group.add(roofLabel);
 // Each activity building receives its own architectural signature.
 const index=buildings.indexOf(data);
 const accent=material(data.color,.52);
 if(index%3===0){
  for(const x of [-2.25,2.25])box(.16,3.55,.12,accent,x,2.95,depth/2+.085,group);
  box(1.35,.14,.58,accent,0,1.62,depth/2+.28,group);
 }else if(index%3===1){
  for(const x of [-1.8,-.9,0,.9,1.8])box(.055,1.22,.08,accent,x,4.25,depth/2+.09,group);
  box(1.65,.16,.72,material("#d7d9d1"),0,5.42,0,group);
  box(1.25,.3,.52,material("#aeb8bd"),0,5.64,0,group);
 }else{
  for(const x of [-2.12,2.12])box(.12,1.5,.12,accent,x,4.45,depth/2+.08,group);
  const roofUnit=box(.72,.42,.7,material("#9aa9b2"),1.55,5.55,-.72,group);
  box(.5,.06,.48,material("#526473"),1.55,5.79,-.72,group);
 }
 group.traverse(o=>{if(o.isMesh){o.userData.building=data;if(o.material?.color)o.userData.baseColor=o.material.color.clone();}});
 buildingMeshes.push(group);
 // Directory works as an accessible alternative to selecting small 3D objects.
 const card=document.createElement("button");card.type="button";card.className="directory-card";card.style.setProperty("--card-color",data.color);card.dataset.building=data.id;card.setAttribute("aria-pressed","false");
 card.innerHTML=`<span class="card-id">${data.id} · ${data.group==="central"?"CENTRAL":"PÉRIPHÉRIQUE"}</span><strong>${data.name}</strong><small>${data.ground}</small>`;
 card.addEventListener("click",()=>{window.location.assign(data.route);});if (directory) directory.appendChild(card);
}
function tree(position,scale=1){const trunk=box(.22,1.1,.22,material("#70563e"),position.x,.48,position.z);const crown=new THREE.Mesh(new THREE.SphereGeometry(.8*scale,10,8),material("#47775c"));crown.position.set(position.x,1.5*scale,position.z);crown.castShadow=true;scene.add(crown);scene.add(trunk);}
for(const p of [{x:-19,z:2},{x:19,z:2},{x:-19,z:-11},{x:19,z:-11},{x:-19,z:-22},{x:19,z:-22}])tree(p,.8);
// Parking bays and pedestrian lighting make the site read as a working business park.
const parkingPaint=material("#e9e4d3",.9);
for(const side of [-1,1]){
 const parking=box(3.5,.035,30,material("#596c60"),side*18.8,-.025,-8);
 for(let z=-21;z<=4;z+=3.4){
  box(.055,.018,2.45,parkingPaint,side*17.15,.012,z);
  box(.055,.018,2.45,parkingPaint,side*20.45,.012,z);
 }
 for(const z of [-20,-10,0]){
  const pole=box(.12,3.7,.12,material("#435363"),side*4.2,1.82,z);
  box(.9,.12,.42,material("#e8d6a1"),side*4.2,3.72,z);
  const glow=new THREE.PointLight(0xffdca0,.65,7,2);
  glow.position.set(side*4.2,3.55,z);scene.add(glow);
 }
}
// Helicopter landing pad: clearly marked, but kept outside the vehicle circulation lanes.
const helipad=new THREE.Group(); helipad.position.set(16.8,.08,11.2); scene.add(helipad);
box(5.8,.16,5.8,material("#394957"),0,0,0,helipad);
const padSurface=box(5.35,.035,5.35,material("#263744"),0,.1,0,helipad);
const padRing=new THREE.Mesh(new THREE.RingGeometry(1.85,2.05,48),new THREE.MeshBasicMaterial({color:"#e8d6a1",side:THREE.DoubleSide})); padRing.rotation.x=-Math.PI/2; padRing.position.y=.13; helipad.add(padRing);
const padH=new THREE.Mesh(new THREE.PlaneGeometry(1.55,2.3),new THREE.MeshBasicMaterial({color:"#f4f0e6",side:THREE.DoubleSide})); padH.rotation.x=-Math.PI/2; padH.position.set(0,.135,0); helipad.add(padH);
const padLabelTexture=labelTexture("HELIPORT MAJESTIOS","#f4f0e6",{height:100,size:34,bg:"#10243a"});
const padLabel=new THREE.Mesh(new THREE.PlaneGeometry(4.6,.45),new THREE.MeshBasicMaterial({map:padLabelTexture,side:THREE.DoubleSide})); padLabel.rotation.x=-Math.PI/2; padLabel.position.set(0,.14,2.35); helipad.add(padLabel);
// Petit véhicule stylisé : il accompagne la caméra en mode promenade.
const visitorCar=new THREE.Group();
const carBody=box(1.75,.48,3.05,material("#d9b86c",.42),0,.62,0,visitorCar);
box(1.35,.48,1.35,material("#263b50",.35),0,1.08,-.25,visitorCar);
box(1.25,.055,1.05,material("#a8cbd7",.25),0,1.12,-.25,visitorCar);
for(const x of [-.88,.88]){
 for(const z of [-.95,.95]){
  const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.18,16),material("#20262b",.92));
  wheel.rotation.z=Math.PI/2;wheel.position.set(x,.34,z);wheel.castShadow=true;visitorCar.add(wheel);
 }
 const lamp=box(.3,.13,.06,material("#f4e9b7",.3),x*.7,.68,-1.55,visitorCar);
}
scene.add(visitorCar);visitorCar.visible=false;

// Hélicoptère stylisé : accompagne le mode survol sans simuler une mécanique de vol réelle.
const visitorHelicopter=new THREE.Group();
const helicopterBody=material("#c8a44a",.48),helicopterDark=material("#343a40",.38),helicopterGlass=new THREE.MeshStandardMaterial({color:"#8dc8d8",roughness:.2,metalness:.18});
const fuselage=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),helicopterBody);
fuselage.scale.set(.92,.52,1.32);fuselage.position.y=.62;fuselage.castShadow=true;visitorHelicopter.add(fuselage);
const cockpit=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),helicopterGlass);
cockpit.scale.set(.66,.39,.48);cockpit.position.set(0,.76,-.78);visitorHelicopter.add(cockpit);
const tailBoom=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,2.55,10),helicopterBody);
tailBoom.rotation.x=Math.PI/2;tailBoom.position.set(0,.72,2.03);visitorHelicopter.add(tailBoom);
const tailFin=box(.12,.72,.22,helicopterBody,0,1.03,3.18,visitorHelicopter);
const rotorHub=new THREE.Group();rotorHub.position.set(0,1.2,.05);visitorHelicopter.add(rotorHub);
for(let i=0;i<4;i++){const blade=box(.16,.045,3.7,helicopterDark,0,0,0,rotorHub);blade.rotation.y=i*Math.PI/2;}
const tailRotor=new THREE.Group();tailRotor.position.set(0,.83,3.28);visitorHelicopter.add(tailRotor);
for(let i=0;i<3;i++){const blade=box(.12,.72,.035,helicopterDark,0,0,0,tailRotor);blade.rotation.z=i*2*Math.PI/3;}
for(const x of [-.62,.62]){
 const skid=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,1.8,8),helicopterDark);
 skid.rotation.z=Math.PI/2;skid.position.set(x,.08,.18);visitorHelicopter.add(skid);
 const strut=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.58,8),helicopterDark);
 strut.position.set(x*.75,.32,.18);strut.rotation.z=x>0?-.2:.2;visitorHelicopter.add(strut);
}
scene.add(visitorHelicopter);visitorHelicopter.visible=false;
function syncVisitorCar(){
 const driving=root.dataset.viewMode==="drive";
 visitorCar.visible=false; // Street View : aucun véhicule ne masque la vue ni les rubriques.
 if(!driving)return;
 const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();
 visitorCar.position.set(
  THREE.MathUtils.clamp(camera.position.x+forward.x*4,-20,20),
  0,
  THREE.MathUtils.clamp(camera.position.z+forward.z*4,-23,15)
 );
 visitorCar.rotation.y=Math.atan2(forward.x,forward.z)+Math.PI;
}
// A marked pedestrian crossing highlights the main entrance.
for(let x=-2.1;x<=2.1;x+=.7)box(.42,.025,1.25,parkingPaint,x,.025,9.2);

const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let selected=null,hovered=null;
let cameraDestination=null,targetDestination=null;
function focusBuilding(data){
 const nextTarget=new THREE.Vector3(data.x,2.7,data.z);
 targetDestination=nextTarget;
 cameraDestination=new THREE.Vector3(data.x+1.5,9.2,data.z+16.5);
}
function selectBuilding(data,{keepMap=false}={}){selected=data;if(!keepMap){setSceneMode("fly");focusBuilding(data);}title.textContent=data.name;description.textContent=data.description;floorList.replaceChildren();floorList.hidden=false;
 const levels=[
  {label:"RDC · RUBRIQUE",text:data.ground,href:data.route},
  {label:"1er NIVEAU · PARCOURS",text:data.first,href:data.firstRoute},
  {label:"2e NIVEAU · APPROFONDIR",text:data.second,href:data.secondRoute}
 ];
 levels.forEach(level=>{
  const item=document.createElement("div");item.style.setProperty("--floor-color",data.color);
  const label=document.createElement("span");label.textContent=level.label;
  const link=document.createElement("a");link.href=level.href;link.className="floor-link";link.textContent=level.text;
  link.setAttribute("aria-label",level.label+": "+level.text);
  item.append(label,link);floorList.append(item);
 });
 openLink.href=data.route;openLink.textContent="Découvrir "+data.name;openLink.classList.remove("is-disabled");openLink.removeAttribute("aria-disabled");openLink.removeAttribute("tabindex");document.querySelectorAll(".directory-card").forEach(c=>c.setAttribute("aria-pressed",String(c.dataset.building===data.id)));buildingMeshes.forEach(g=>{g.scale.setScalar(g.userData.building.id===data.id?1.06:1);});}
function renderZoneMap(){
 if(!mapBuildings)return;
 mapBuildings.innerHTML="";
 // Disposition régulière pour éviter que les 12 cartes se chevauchent.
 // Sur écran large : 4 colonnes × 3 rangées, en gardant la chaussée centrale libre.
 const columns=[12,37,63,88],rows=[18,58,85];
 buildings.forEach((data,index)=>{
  const button=document.createElement("button");
  button.type="button";button.className="map-building";button.dataset.id=data.id;button.dataset.group=data.group;
  button.style.setProperty("--building-color",data.color);
  button.style.left=columns[index%4]+"%";
  button.style.top=rows[Math.floor(index/4)]+"%";
  const name=document.createElement("span");name.textContent=data.name;
  const detail=document.createElement("small");detail.textContent=data.ground;
  button.append(name,detail);button.setAttribute("aria-label",data.name+" — "+data.ground);
  button.addEventListener("click",()=>{window.location.assign(data.route);});
  mapBuildings.appendChild(button);
 });
}
renderZoneMap();
function getBuildingAt(event){const rect=renderer.domElement.getBoundingClientRect();if(!rect.width||!rect.height)return null;pointer.x=((event.clientX-rect.left)/rect.width)*2-1;pointer.y=-((event.clientY-rect.top)/rect.height)*2+1;raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(buildingMeshes,true);for(const hit of hits){let object=hit.object;while(object){if(object.userData?.building)return object.userData.building;object=object.parent;}}return null;}
// Interface de test temporaire, disponible uniquement avec ?e2e=1 ; elle ne change pas le parcours utilisateur normal.
if(new URLSearchParams(window.location.search).has("e2e")){
 window.__MAJESTIOS_SCENE_E2E__={
  buildingPoint(id){
   const data=buildings.find(item=>item.id===id);
   if(!data)throw new Error(`Bâtiment inconnu : ${id}`);
   // Cadrer le bâtiment comme le fait l'interaction de sélection avant de calculer le clic.
   // Cette aide n'existe que sur l'URL ?e2e=1 et n'affecte pas les visiteurs.
   cameraDestination=null;targetDestination=null;
   camera.position.set(data.x+1.5,9.2,data.z+16.5);
   controls.target.set(data.x,2.7,data.z);
   controls.update();
   renderer.render(scene,camera);
   // Cibler la façade avant, face à la caméra de cadrage, plutôt que le toit horizontal.
   const point=new THREE.Vector3(data.x,2.7,data.z+1.9).project(camera);
   const rect=renderer.domElement.getBoundingClientRect();
   return {x:rect.left+(point.x+1)*rect.width/2,y:rect.top+(1-point.y)*rect.height/2};
  }
 };
}
function updateHoverCard(data,event){
 if(!hoverCard)return;
 if(!data){hoverCard.classList.remove("is-visible");hoverCard.setAttribute("aria-hidden","true");return;}
 hoverCard.setAttribute("aria-hidden","false");
 const bounds=root.getBoundingClientRect();
 hoverCard.querySelector("[data-hover-name]").textContent=data.name;
 hoverCard.querySelector("[data-hover-detail]").textContent=data.ground;
 hoverCard.style.setProperty("--hover-color",data.color);
 if(event&&event.pointerType!=="touch"){
  const left=Math.max(12,Math.min(bounds.width-260,event.clientX-bounds.left+18));
  const top=Math.max(58,Math.min(bounds.height-104,event.clientY-bounds.top+18));
  hoverCard.style.left=left+"px";hoverCard.style.top=top+"px";
 }else{hoverCard.style.left="50%";hoverCard.style.top="auto";hoverCard.style.bottom="68px";hoverCard.style.transform="translateX(-50%)";}
 hoverCard.classList.add("is-visible");
}
renderer.domElement.addEventListener("pointermove",e=>{
 if(e.pointerType==="touch")return;
 const data=getBuildingAt(e);hovered=data?.id||null;
 renderer.domElement.style.cursor=data?"pointer":"grab";
 updateHoverCard(data,e);
});
renderer.domElement.addEventListener("pointerleave",()=>{hovered=null;updateHoverCard(null);});
let suppressSyntheticClickUntil=0;
renderer.domElement.addEventListener("click",e=>{
 if(performance.now()<suppressSyntheticClickUntil){e.preventDefault();return;}
 // Sur un écran tactile, la sélection est gérée par touchend pour distinguer toucher et glissement.
 if(e.pointerType==="touch")return;
 const data=getBuildingAt(e);
 if(data){window.location.assign(data.route);}
});
let touchCandidate=null;
renderer.domElement.addEventListener("touchstart",e=>{
 if(e.touches.length!==1){touchCandidate=null;return;}
 const t=e.touches[0];touchCandidate={x:t.clientX,y:t.clientY,id:t.identifier};
},{passive:true});
renderer.domElement.addEventListener("touchend",e=>{
 if(!touchCandidate)return;
 const start=touchCandidate;touchCandidate=null;
 const t=Array.from(e.changedTouches).find(item=>item.identifier===start.id);
 if(!t||Math.hypot(t.clientX-start.x,t.clientY-start.y)>12)return;
 // Évite qu’un clic synthétique du navigateur répète la sélection tactile.
 suppressSyntheticClickUntil=performance.now()+500;
 const data=getBuildingAt(t);
 if(data){window.location.assign(data.route);}
},{passive:true});
renderer.domElement.addEventListener("touchcancel",()=>{touchCandidate=null;},{passive:true});
renderer.domElement.addEventListener("pointercancel",()=>{touchCandidate=null;});
const movementKeys=new Set(["w","a","s","d","z","q","arrowup","arrowdown","arrowleft","arrowright","shift"]);
const pressedKeys=new Set();
renderer.domElement.addEventListener("keydown",e=>{
 const key=e.key.toLowerCase();
 if(movementKeys.has(key)){e.preventDefault();pressedKeys.add(key);return;}
 if(e.key==="Enter"||e.key===" "){e.preventDefault();window.location.assign((selected||buildings[0]).route);}
});
renderer.domElement.addEventListener("keyup",e=>pressedKeys.delete(e.key.toLowerCase()));
renderer.domElement.addEventListener("blur",()=>pressedKeys.clear());
window.addEventListener("blur",()=>pressedKeys.clear());
document.addEventListener("visibilitychange",()=>{if(document.hidden){pressedKeys.clear();touchCandidate=null;}});
function walkThroughZone(delta){
 if(!pressedKeys.size)return;
 const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();
 const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0)).normalize();
 const direction=new THREE.Vector3();
 if(pressedKeys.has("w")||pressedKeys.has("z")||pressedKeys.has("arrowup"))direction.add(forward);
 if(pressedKeys.has("s")||pressedKeys.has("arrowdown"))direction.sub(forward);
 if(pressedKeys.has("d")||pressedKeys.has("arrowright"))direction.add(right);
 if(pressedKeys.has("a")||pressedKeys.has("q")||pressedKeys.has("arrowleft"))direction.sub(right);
 if(direction.lengthSq()===0)return;
 direction.normalize().multiplyScalar(delta*(pressedKeys.has("shift")?13:7));
 const nextCamera=camera.position.clone().add(direction);
 const nextTarget=controls.target.clone().add(direction);
 nextCamera.x=THREE.MathUtils.clamp(nextCamera.x,-22,22);
 nextCamera.z=THREE.MathUtils.clamp(nextCamera.z,-25,17);
 nextTarget.x=THREE.MathUtils.clamp(nextTarget.x,-22,22);
 nextTarget.z=THREE.MathUtils.clamp(nextTarget.z,-25,17);
 camera.position.copy(nextCamera);controls.target.copy(nextTarget);
 cameraDestination=null;targetDestination=null;
}
document.querySelectorAll("[data-walk]").forEach(button=>{
 const key=button.dataset.walk;
 const start=e=>{e.preventDefault();pressedKeys.add(key);button.setPointerCapture?.(e.pointerId);};
 const stop=e=>{e.preventDefault();pressedKeys.delete(key);};
 button.addEventListener("pointerdown",start);
 button.addEventListener("pointerup",stop);
 button.addEventListener("pointercancel",stop);
 button.addEventListener("lostpointercapture",stop);
 // Filet de sécurité si le pointeur est relâché hors de la fenêtre ou si la capture échoue.
 window.addEventListener("pointerup",()=>pressedKeys.delete(key));
 window.addEventListener("pointercancel",()=>pressedKeys.delete(key));
 button.addEventListener("contextmenu",e=>e.preventDefault());
});
document.querySelector("#view-home").addEventListener("click",resetView);
document.querySelector("#zoom-in").addEventListener("click",()=>{cameraDestination=null;targetDestination=null;const offset=camera.position.clone().sub(controls.target);offset.multiplyScalar(.88);const distance=THREE.MathUtils.clamp(offset.length(),controls.minDistance,controls.maxDistance);offset.setLength(distance);camera.position.copy(controls.target).add(offset);controls.update();});
document.querySelector("#zoom-out").addEventListener("click",()=>{cameraDestination=null;targetDestination=null;const offset=camera.position.clone().sub(controls.target);const distance=THREE.MathUtils.clamp(offset.length()*1.12,controls.minDistance,controls.maxDistance);offset.setLength(distance);camera.position.copy(controls.target).add(offset);controls.update();});

const fullscreenButton=document.querySelector("#scene-fullscreen");
const sceneShell=document.querySelector(".scene-shell");
function syncFullscreenButton(){
 const active=Boolean(document.fullscreenElement&&document.fullscreenElement===sceneShell);
 if(fullscreenButton){fullscreenButton.setAttribute("aria-pressed",String(active));fullscreenButton.textContent=active?"⤢ Quitter le plein écran":"⛶ Plein écran";fullscreenButton.setAttribute("aria-label",active?"Quitter le plein écran de la zone industrielle":"Afficher la zone industrielle en plein écran");}
 requestAnimationFrame(resize);
}
fullscreenButton?.addEventListener("click",async()=>{
 try{
  if(!sceneShell||!document.fullscreenEnabled){if(fullscreenButton)fullscreenButton.title="Le plein écran n’est pas disponible dans ce navigateur";return;}
  if(document.fullscreenElement)await document.exitFullscreen();else await sceneShell.requestFullscreen();
 }catch(error){console.warn("[MajestiOS] Le plein écran n’a pas pu être activé.",error);}
});
document.addEventListener("fullscreenchange",syncFullscreenButton);

function setSceneMode(mode){
 const buttons=document.querySelectorAll("[data-scene-mode]");
 buttons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.sceneMode===mode)));
 cameraDestination=null; targetDestination=null;
 const mapMode=mode==="map";
 if(mapRoot)mapRoot.hidden=!mapMode;
 renderer.domElement.style.display=mapMode?"none":"block";
 if(mapMode){if(hoverCard){hoverCard.classList.remove("is-visible");hoverCard.setAttribute("aria-hidden","true");}if(root)root.dataset.viewMode="map";pauseScene();return;}
 if(mode==="top"){
  controls.minPolarAngle=0.02; controls.maxPolarAngle=0.08;
  controls.minDistance=18; controls.maxDistance=55;
  targetDestination=new THREE.Vector3(0,0,-6);
  cameraDestination=new THREE.Vector3(0,44,-6);
  if(root)root.dataset.viewMode="top";
 }else if(mode==="drive"){
  controls.minPolarAngle=0.45; controls.maxPolarAngle=1.48;
  controls.minDistance=7; controls.maxDistance=30;
  targetDestination=new THREE.Vector3(0,1.6,-1);
  cameraDestination=new THREE.Vector3(0,3.2,15);
  if(root)root.dataset.viewMode="drive";
 }else{
  controls.minPolarAngle=0.12; controls.maxPolarAngle=1.42;
  controls.minDistance=18; controls.maxDistance=55;
  targetDestination=new THREE.Vector3(0,1.5,-6);
  cameraDestination=new THREE.Vector3(0,23,30);
  if(root)root.dataset.viewMode="fly";
 }
 wakeScene();
}
document.querySelectorAll("[data-scene-mode]").forEach(button=>button.addEventListener("click",()=>setSceneMode(button.dataset.sceneMode)));
function resetView(){setSceneMode("fly");}
function resize(){const w=root.clientWidth,h=root.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
if("ResizeObserver" in window)new ResizeObserver(resize).observe(root);else window.addEventListener("resize",resize);resize();resetView();
// Ne pas animer la scène quand elle est hors écran ou que l'onglet est masqué.
let previousFrame=performance.now();
let sceneVisible=!("IntersectionObserver" in window);
let animationFrame=0;
function animate(now=performance.now()){
 animationFrame=0;
 if(!sceneVisible||document.hidden||root.dataset.viewMode==="map")return;
 animationFrame=requestAnimationFrame(animate);
 const delta=Math.min((now-previousFrame)/1000,.05);previousFrame=now;
 if(cameraDestination&&targetDestination){const speed=reducedMotion?1:1-Math.exp(-5.3*delta);camera.position.lerp(cameraDestination,speed);controls.target.lerp(targetDestination,speed);if(camera.position.distanceTo(cameraDestination)<.04&&controls.target.distanceTo(targetDestination)<.04){camera.position.copy(cameraDestination);controls.target.copy(targetDestination);cameraDestination=null;targetDestination=null;}}
 walkThroughZone(delta);controls.update();syncVisitorCar();
 const flying=root.dataset.viewMode==="fly";visitorHelicopter.visible=false; // Le mode aérien reste fonctionnel, mais l’hélicoptère ne masque jamais la scène.
 if(flying){const forward=new THREE.Vector3();camera.getWorldDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0)).normalize();visitorHelicopter.position.copy(camera.position).addScaledVector(forward,6).addScaledVector(right,2.4);visitorHelicopter.position.y=Math.max(3,camera.position.y-2.2);visitorHelicopter.rotation.y=Math.atan2(forward.x,forward.z)+Math.PI;rotorHub.rotation.y+=delta*18;tailRotor.rotation.z+=delta*15;}
 // En mode carte, le canvas 3D est masqué : éviter un rendu GPU invisible.
 if(root.dataset.viewMode!=="map")renderer.render(scene,camera);
}
function wakeScene(){if(sceneVisible&&!document.hidden&&!animationFrame){previousFrame=performance.now();animationFrame=requestAnimationFrame(animate);}}
function pauseScene(){if(animationFrame){cancelAnimationFrame(animationFrame);animationFrame=0;}}
if("IntersectionObserver" in window){
 const sceneObserver=new IntersectionObserver(entries=>{sceneVisible=entries.some(entry=>entry.isIntersecting);if(sceneVisible)wakeScene();else pauseScene();},{rootMargin:"120px 0px",threshold:0.01});
 sceneObserver.observe(root);
}
document.addEventListener("visibilitychange",()=>{if(document.hidden)pauseScene();else wakeScene();});
wakeScene();if(loading.dataset.fallbackShown!=="true")loading.classList.add("hidden");else renderer.domElement.style.display="none";

} catch (error) {
  console.error("[MajestiOS] Impossible d’initialiser la zone artisanale 3D :", error);
  if (typeof window.majestiosSceneFallback === "function") {
    window.majestiosSceneFallback();
  } else {
    const fallback = document.querySelector("#scene-loading");
    if (fallback) {
      fallback.classList.remove("hidden");
      fallback.classList.add("scene-error");
      fallback.setAttribute("role", "alert");
      fallback.textContent = "La vue 3D est momentanément indisponible. Rechargez la page ou utilisez les rubriques accessibles depuis la navigation.";
    }
  }
}
