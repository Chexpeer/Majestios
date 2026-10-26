import { Sparkles } from "lucide-react";
import { ModulePage } from "@/components/ui/ModulePage";
export default function CoachPage(){return <ModulePage title="Coach IA" eyebrow="Assistant professionnel" description="Préparez une recherche, structurez une hypothèse ou rédigez un plan d’action à partir du contexte commercial." icon={<span className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"><Sparkles size={17}/>IA non connectée</span>} items={[
{title:"Préparer une recherche",description:"Définir les critères, le secteur, la zone et les sources à explorer.",status:"Parcours à construire"},
{title:"Structurer une analyse",description:"Séparer faits sourcés, hypothèses et recommandations à valider.",status:"Parcours à construire"},
{title:"Préparer une action commerciale",description:"Organiser un argumentaire et les questions de qualification.",status:"Parcours à construire"},
]}/>}