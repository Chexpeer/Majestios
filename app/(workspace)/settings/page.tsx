import { ModulePage } from "@/components/ui/ModulePage";
export default function SettingsPage(){return <ModulePage title="Paramètres" description="Les réglages de l’espace professionnel, des membres, des intégrations et des préférences seront regroupés ici." items={[
{title:"Organisation & membres",description:"Configuration de l’organisation et gestion des rôles et autorisations.",status:"À construire"},
{title:"Sources & intégrations",description:"Configurer les sources de veille et les services externes autorisés.",status:"À construire"},
{title:"Intelligence artificielle",description:"Configurer le fournisseur, les limites de consommation et les contrôles d’usage.",status:"À construire"},
]}/>}