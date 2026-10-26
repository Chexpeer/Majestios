import Link from "next/link";
import { ModulePage } from "@/components/ui/ModulePage";
export default function CompaniesPage(){return <ModulePage title="Entreprises" description="Construisez une connaissance structurée des organisations pour mieux identifier les opportunités et les interlocuteurs." items={[
{title:"Fiches entreprises",description:"Identité, secteur, taille, localisation et informations de qualification.",status:"À construire"},
{title:"Mémoire d’entreprise",description:"Informations validées, sources, notes et historique des mises à jour.",status:"À construire"},
{title:"Relations commerciales",description:"Opportunités, contacts, activités et prochaines actions associés à l’entreprise.",status:"À construire"},
]}/>}