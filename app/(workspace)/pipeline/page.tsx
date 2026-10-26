import { ModulePage } from "@/components/ui/ModulePage";
export default function PipelinePage(){return <ModulePage title="Pipeline commercial" description="Suivez le passage des opportunités de la qualification à la conversion, avec des étapes adaptées à votre processus." items={[
{title:"À qualifier",description:"Signal reçu, provenance à vérifier et premier tri commercial.",status:"Étape"},
{title:"Qualifiée",description:"Besoin, potentiel et interlocuteurs suffisamment documentés.",status:"Étape"},
{title:"Contactée",description:"Première action effectuée et résultat enregistré.",status:"Étape"},
{title:"En discussion",description:"Échange commercial en cours, prochaine action planifiée.",status:"Étape"},
{title:"Gagnée / perdue",description:"Résultat final et raison documentés pour améliorer les décisions.",status:"Étape"},
]}/>}